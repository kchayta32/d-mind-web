/**
 * Bangkok Cafe & Bar Flood Radar Type Definitions
 * DMind Disaster Management & Lifestyle Platform
 */

export type CafeCategory = 'coffee' | 'matcha' | 'bar' | 'bakery' | 'coworking' | 'pet';
export type Category = CafeCategory | 'all';

/**
 * Bangkok Metropolitan Zones:
 * - 'inner': กทม. ชั้นใน (สยาม, สุขุมวิท, สาทร, อารีย์, พระนคร)
 * - 'outer': กทม. ชั้นนอก (บางนา, ลาดกระบัง, บางกะปิ, จตุจักร, รามอินทรา)
 * - 'thonburi': ฝั่งธนบุรี (คลองสาน, เจริญนคร, ตลาดพลู, ราชพฤกษ์, ปิ่นเกล้า)
 * - 'perimeter': ปริมณฑล (นนทบุรี, ปทุมธานี, สมุทรปราการ, นครปฐม)
 * - 'all': ทุกพื้นที่
 */
export type VenueZone = 'inner' | 'outer' | 'thonburi' | 'perimeter';
export type BangkokZone = VenueZone | 'all';

/**
 * Flood Risk Level classification:
 * - 'safe': ปลอดภัย น้ำไม่ท่วม ระบายน้ำได้ดี
 * - 'moderate': เฝ้าระวัง มีประวัติน้ำขังรอระบายหรือมีถนนน้ำท่วมใกล้เคียง
 * - 'risk': จุดเสี่ยงน้ำท่วมสูง ซอยต่ำ หรืออยู่ติดแนวคลองระบายน้ำล้น
 */
export type FloodRiskLevel = 'safe' | 'moderate' | 'risk';

export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface TimeSlot {
  open: string;
  close: string;
  isClosed: boolean;
}

export type WeeklySchedule = Record<DayOfWeek, TimeSlot[]>;

export interface CafeVenue {
  id: string;
  name: string;
  nameEn: string;
  category: CafeCategory;
  zone: VenueZone;
  district: string;
  address: string;
  lat: number;
  lng: number;
  phone?: string;
  website?: string;
  instagram?: string;
  rating: number;
  priceLevel: '฿' | '฿฿' | '฿฿฿';
  openingHoursText: string;
  schedule: WeeklySchedule;
  tags: string[];
  floodRisk: FloodRiskLevel;
  floodNote: string;
  indoorSeating: boolean;
  hasParking: boolean;
  hasPlugs: boolean;
  hasWifi: boolean;
  coverImage: string;
  source: 'curated' | 'osm_scraped';
}

export type SelectedDayFilter = 'today' | 'tomorrow' | DayOfWeek;
export type TimeFilterPeriod = 'live' | 'morning' | 'afternoon' | 'evening' | 'night';
export type SelectedTimeFilter = TimeFilterPeriod | string;

export interface FilterState {
  category: string;
  zone: string;
  selectedDay: SelectedDayFilter;
  selectedTime: SelectedTimeFilter;
  floodSafeOnly: boolean;
  searchQuery: string;
  workFriendlyOnly: boolean;
}

export interface FloodSafetyEvaluation {
  score: number;
  status: FloodRiskLevel;
  reason: string;
}

export interface OverpassElementTags {
  name?: string;
  'name:en'?: string;
  'name:th'?: string;
  amenity?: string;
  cuisine?: string;
  opening_hours?: string;
  internet_access?: string;
  'internet_access:fee'?: string;
  smoking?: string;
  outdoor_seating?: string;
  indoor_seating?: string;
  phone?: string;
  'contact:phone'?: string;
  website?: string;
  'contact:website'?: string;
  'contact:instagram'?: string;
  'addr:street'?: string;
  'addr:suburb'?: string;
  'addr:district'?: string;
  'addr:city'?: string;
  [key: string]: string | undefined;
}

export interface OverpassElement {
  type: 'node' | 'way' | 'relation';
  id: number;
  lat?: number;
  lon?: number;
  center?: {
    lat: number;
    lon: number;
  };
  tags?: OverpassElementTags;
}

export interface OverpassResponse {
  version: number;
  generator: string;
  osm3s: {
    timestamp_osm_base: string;
    copyright: string;
  };
  elements: OverpassElement[];
}
