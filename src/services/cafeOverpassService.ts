/**
 * OpenStreetMap Overpass Turbo API Service for Bangkok Cafes & Bars
 * Flood-aware live POI scraper with LocalStorage caching and curated fallback
 */

import {
  CafeCategory,
  CafeVenue,
  DayOfWeek,
  FloodRiskLevel,
  OverpassElement,
  OverpassResponse,
  TimeSlot,
  VenueZone,
  WeeklySchedule,
} from '@/types/cafeFlood';
import { BANGKOK_CAFES_DATA } from '@/data/bangkokCafesData';

const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
];

const CACHE_KEY_PREFIX = 'dmind_bkk_overpass_cafes_v1';
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes TTL
const REQUEST_TIMEOUT_MS = 8000; // 8 seconds timeout

interface CacheEntry {
  timestamp: number;
  data: CafeVenue[];
}

/**
 * Determine Bangkok metropolitan zone from geographic coordinates
 */
export function determineBangkokZone(lat: number, lng: number): VenueZone {
  // Thonburi (West of Chao Phraya River)
  if (lat >= 13.68 && lat <= 13.82 && lng >= 100.42 && lng <= 100.51) {
    return 'thonburi';
  }

  // Inner Bangkok (Siam, Sukhumvit, Sathorn, Ari, Phra Nakhon)
  if (lat >= 13.70 && lat <= 13.80 && lng >= 100.48 && lng <= 100.59) {
    return 'inner';
  }

  // Outer Bangkok (Bang Na, Lat Krabang, Bang Kapi, Chatuchak, Ramintra)
  if (lat >= 13.62 && lat <= 13.90 && lng >= 100.38 && lng <= 100.75) {
    return 'outer';
  }

  // Surrounding Metropolitan Perimeter (Nonthaburi, Pathum Thani, Samut Prakan, Nakhon Pathom)
  return 'perimeter';
}

/**
 * Infer cafe category from OSM tags and venue name
 */
function inferCategory(tags: Record<string, string | undefined>, name: string): CafeCategory {
  const text = `${name} ${tags.cuisine || ''} ${tags.amenity || ''}`.toLowerCase();

  if (text.includes('matcha') || text.includes('green tea') || text.includes('ชาเขียว')) {
    return 'matcha';
  }
  if (tags.amenity === 'bar' || text.includes('cocktail') || text.includes('craft beer') || text.includes('speakeasy')) {
    return 'bar';
  }
  if (text.includes('bakery') || text.includes('pastry') || text.includes('croissant') || text.includes('cake') || text.includes('doughnut')) {
    return 'bakery';
  }
  if (text.includes('coworking') || text.includes('co-working') || text.includes('work space')) {
    return 'coworking';
  }
  if (text.includes('pet') || text.includes('cat cafe') || text.includes('dog cafe') || text.includes('หมา') || text.includes('แมว')) {
    return 'pet';
  }

  return 'coffee';
}

/**
 * Infer flood risk level based on geographic zone and terrain context
 */
function inferFloodRisk(zone: VenueZone, lat: number, lng: number): { risk: FloodRiskLevel; note: string } {
  // Low-lying flood vulnerable corridors in Bangkok
  // e.g. Ramkhamhaeng / Lat Phrao / Samrong
  if ((lat >= 13.75 && lat <= 13.81 && lng >= 100.60 && lng <= 100.66) || (lat >= 13.63 && lat <= 13.67 && lng >= 100.58 && lng <= 100.64)) {
    return {
      risk: 'risk',
      note: 'อยู่ในแนวพื้นที่ลุ่มต่ำ เฝ้าระวังน้ำท่วมขังผิวถนนช่วงฝนตกหนักสะสม',
    };
  }

  // River canal adjacent
  if (zone === 'thonburi' || zone === 'perimeter') {
    return {
      risk: 'moderate',
      note: 'อยู่ใกล้แม่น้ำหรือคลองสาขา ระวังน้ำทะเลหนุนหรือน้ำระบายช้าในช่วงฝนตกต่อเนื่อง',
    };
  }

  return {
    risk: 'safe',
    note: 'อยู่ในเขตผังเมืองชั้นใน/พื้นที่ดอน ระบบสูบน้ำหลักทำงานได้ปกติ ปลอดภัย',
  };
}

/**
 * Parse standard OSM opening_hours string or provide sensible default schedule
 */
function parseOsmOpeningHours(rawHours?: string): { text: string; schedule: WeeklySchedule } {
  const days: DayOfWeek[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  const defaultSchedule: WeeklySchedule = {
    mon: [{ open: '08:00', close: '18:00', isClosed: false }],
    tue: [{ open: '08:00', close: '18:00', isClosed: false }],
    wed: [{ open: '08:00', close: '18:00', isClosed: false }],
    thu: [{ open: '08:00', close: '18:00', isClosed: false }],
    fri: [{ open: '08:00', close: '18:00', isClosed: false }],
    sat: [{ open: '08:00', close: '19:00', isClosed: false }],
    sun: [{ open: '08:00', close: '19:00', isClosed: false }],
  };

  if (!rawHours || typeof rawHours !== 'string') {
    return {
      text: '08:00 - 18:00 (โดยประมาณ)',
      schedule: defaultSchedule,
    };
  }

  // Simple parser for common patterns like "08:00-18:00" or "Mo-Su 08:30-17:30"
  const timeMatch = rawHours.match(/(\d{1,2}:\d{2})\s*[-–]\s*(\d{1,2}:\d{2})/);
  if (timeMatch) {
    const open = timeMatch[1].padStart(5, '0');
    const close = timeMatch[2].padStart(5, '0');
    const schedule = {} as WeeklySchedule;

    for (const d of days) {
      schedule[d] = [{ open, close, isClosed: false }];
    }

    return {
      text: `${open} - ${close} (${rawHours})`,
      schedule,
    };
  }

  return {
    text: rawHours,
    schedule: defaultSchedule,
  };
}

/**
 * Convert an OpenStreetMap element to our CafeVenue data structure
 */
function convertOverpassElementToVenue(element: OverpassElement): CafeVenue | null {
  const tags = element.tags;
  if (!tags) return null;

  const name = tags.name || tags['name:en'] || tags['name:th'];
  if (!name) return null;

  const lat = element.lat ?? element.center?.lat;
  const lng = element.lon ?? element.center?.lon;
  if (typeof lat !== 'number' || typeof lng !== 'number') return null;

  const zone = determineBangkokZone(lat, lng);
  const category = inferCategory(tags, name);
  const { risk, note } = inferFloodRisk(zone, lat, lng);
  const { text: openingHoursText, schedule } = parseOsmOpeningHours(tags.opening_hours);

  // Parse district from addr tags or zone fallback
  const district = tags['addr:district'] || tags['addr:suburb'] || tags['addr:street'] || `${zone.toUpperCase()} Bangkok`;

  // Parse amenities
  const hasWifi = tags.internet_access === 'yes' || tags.internet_access === 'wlan' || tags.internet_access === 'free';
  const indoorSeating = tags.indoor_seating !== 'no';
  const outdoorSeating = tags.outdoor_seating === 'yes';

  // Fallback images depending on category
  const categoryImages: Record<CafeCategory, string> = {
    coffee: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    matcha: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    bar: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
    bakery: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
    coworking: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=800&q=80',
    pet: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80',
  };

  const tagsList: string[] = ['OSM Live', category.toUpperCase()];
  if (outdoorSeating) tagsList.push('Outdoor Seating');
  if (hasWifi) tagsList.push('Free Wi-Fi');
  if (tags.cuisine) tagsList.push(tags.cuisine);

  return {
    id: `osm-${element.type}-${element.id}`,
    name,
    nameEn: tags['name:en'] || name,
    category,
    zone,
    district,
    address: tags['addr:street'] ? `${tags['addr:street']}, ${district}` : `${district}, Bangkok`,
    lat,
    lng,
    phone: tags.phone || tags['contact:phone'],
    website: tags.website || tags['contact:website'],
    instagram: tags['contact:instagram'],
    rating: 4.5,
    priceLevel: '฿฿',
    openingHoursText,
    schedule,
    tags: tagsList,
    floodRisk: risk,
    floodNote: note,
    indoorSeating,
    hasParking: true,
    hasPlugs: hasWifi,
    hasWifi,
    coverImage: categoryImages[category],
    source: 'osm_scraped',
  };
}

/**
 * Build Overpass QL query targeting Bangkok metro area bounding box
 * Bounding box: [13.50, 100.30, 14.10, 100.90] (south, west, north, east)
 */
function buildOverpassQuery(category?: string, query?: string): string {
  const south = 13.50;
  const west = 100.30;
  const north = 14.10;
  const east = 100.90;
  const bbox = `${south},${west},${north},${east}`;

  let amenityFilter = '["amenity"~"^(cafe|bar)$"]';
  if (category === 'bar') {
    amenityFilter = '["amenity"="bar"]';
  } else if (category === 'coffee' || category === 'matcha' || category === 'bakery') {
    amenityFilter = '["amenity"="cafe"]';
  }

  let nameFilter = '';
  if (query && query.trim().length > 0) {
    const sanitizedQuery = query.trim().replace(/"/g, '');
    nameFilter = `["name"~"${sanitizedQuery}",i]`;
  }

  return `
    [out:json][timeout:15];
    (
      node${amenityFilter}${nameFilter}(${bbox});
      way${amenityFilter}${nameFilter}(${bbox});
    );
    out center 60;
  `.trim();
}

/**
 * Retrieve cached Overpass results from LocalStorage if not expired
 */
function getCachedCafes(cacheKey: string): CafeVenue[] | null {
  if (typeof window === 'undefined' || !window.localStorage) return null;

  try {
    const raw = localStorage.getItem(cacheKey);
    if (!raw) return null;

    const parsed: CacheEntry = JSON.parse(raw);
    const now = Date.now();

    if (now - parsed.timestamp < CACHE_TTL_MS && Array.isArray(parsed.data) && parsed.data.length > 0) {
      return parsed.data;
    }
  } catch (err) {
    console.warn('[OverpassCache] Failed to read cache:', err);
  }

  return null;
}

/**
 * Save Overpass results to LocalStorage
 */
function setCachedCafes(cacheKey: string, venues: CafeVenue[]): void {
  if (typeof window === 'undefined' || !window.localStorage) return;

  try {
    const entry: CacheEntry = {
      timestamp: Date.now(),
      data: venues,
    };
    localStorage.setItem(cacheKey, JSON.stringify(entry));
  } catch (err) {
    console.warn('[OverpassCache] Failed to save cache:', err);
  }
}

/**
 * Fetch cafes & bars using OpenStreetMap Overpass Turbo API with LocalStorage caching
 * and automatic fallback to verified curated BANGKOK_CAFES_DATA upon failure.
 */
export async function fetchOverpassCafes(category?: string, query?: string): Promise<CafeVenue[]> {
  const cacheKey = `${CACHE_KEY_PREFIX}_${category || 'all'}_${query || ''}`;

  // 1. Check LocalStorage cache for instant response
  const cached = getCachedCafes(cacheKey);
  if (cached) {
    return cached;
  }

  // 2. Fetch live data from Overpass API
  const overpassQuery = buildOverpassQuery(category, query);

  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `data=${encodeURIComponent(overpassQuery)}`,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        continue;
      }

      const json: OverpassResponse = await response.json();
      if (!json || !Array.isArray(json.elements)) {
        continue;
      }

      const parsedVenues: CafeVenue[] = [];
      const seenNames = new Set<string>();

      for (const element of json.elements) {
        const venue = convertOverpassElementToVenue(element);
        if (venue && !seenNames.has(venue.name.toLowerCase())) {
          seenNames.add(venue.name.toLowerCase());
          parsedVenues.push(venue);
        }
      }

      // Merge with curated venues matching the query to provide the best user experience
      let mergedVenues: CafeVenue[] = [...parsedVenues];

      const curatedMatches = BANGKOK_CAFES_DATA.filter((c) => {
        if (category && category !== 'all' && c.category !== category) return false;
        if (query && query.trim().length > 0) {
          const q = query.toLowerCase();
          return c.name.toLowerCase().includes(q) || c.nameEn.toLowerCase().includes(q) || c.district.toLowerCase().includes(q);
        }
        return true;
      });

      for (const c of curatedMatches) {
        if (!seenNames.has(c.name.toLowerCase())) {
          mergedVenues.unshift(c); // Prioritize curated high-quality venues at the top
        }
      }

      if (mergedVenues.length > 0) {
        setCachedCafes(cacheKey, mergedVenues);
        return mergedVenues;
      }
    } catch (err) {
      console.warn(`[OverpassService] Request to ${endpoint} failed or timed out:`, err);
      // Try next endpoint or fall back
    }
  }

  // 3. Fallback to curated dataset on network / rate limit error
  console.info('[OverpassService] Falling back cleanly to curated BANGKOK_CAFES_DATA');
  return BANGKOK_CAFES_DATA.filter((venue) => {
    if (category && category !== 'all' && venue.category !== category) return false;
    if (query && query.trim().length > 0) {
      const q = query.toLowerCase();
      return (
        venue.name.toLowerCase().includes(q) ||
        venue.nameEn.toLowerCase().includes(q) ||
        venue.district.toLowerCase().includes(q) ||
        venue.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });
}
