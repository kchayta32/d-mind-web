import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, X, Loader2, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { SelectedLocation } from './types';

interface LocationSearchProps {
  onLocationSelect: (lat: number, lon: number, name: string, locationData?: SelectedLocation) => void;
  className?: string;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({ 
  onLocationSelect, 
  className = "" 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SelectedLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchLocation = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      // Using OpenStreetMap Nominatim API with polygon_geojson=1
      const params = new URLSearchParams({
        format: 'json',
        polygon_geojson: '1',
        limit: '5',
        countrycodes: 'th',
        addressdetails: '1',
        'accept-language': 'th,en',
        email: 'contact@dmind.th',
        q: searchQuery.trim()
      });

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?${params.toString()}`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'DMind-DisasterMap/1.0 (https://d-mind.local; contact@dmind.th)'
          }
        }
      );
      
      if (!response.ok) throw new Error('Search failed');
      
      const data = await response.json();
      const searchResults: SelectedLocation[] = data.map((item: any) => {
        let boundingBox: [number, number, number, number] | undefined;
        if (Array.isArray(item.boundingbox) && item.boundingbox.length >= 4) {
          const south = parseFloat(item.boundingbox[0]);
          const north = parseFloat(item.boundingbox[1]);
          const west = parseFloat(item.boundingbox[2]);
          const east = parseFloat(item.boundingbox[3]);
          if (!isNaN(south) && !isNaN(north) && !isNaN(west) && !isNaN(east)) {
            boundingBox = [south, north, west, east];
          }
        }

        const rawName = item.display_name || '';
        const primaryName = item.name || rawName.split(',')[0] || 'ตำแหน่งที่ค้นหา';

        return {
          name: primaryName,
          displayName: rawName,
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon),
          country: item.address?.country || 'Thailand',
          state: item.address?.state || item.address?.province,
          boundingBox,
          geojson: item.geojson || null
        };
      });
      
      setResults(searchResults);
    } catch (error) {
      console.error('Location search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setQuery(value);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      searchLocation(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  const handleResultSelect = (result: SelectedLocation) => {
    onLocationSelect(result.lat, result.lon, result.name, result);
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  const toggleSearch = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {!isOpen ? (
        <Button
          onClick={toggleSearch}
          variant="outline"
          size="sm"
          className="bg-white/95 dark:bg-slate-900/95 backdrop-blur border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold shadow-xs"
        >
          <Search className="w-4 h-4 mr-2 text-slate-600 dark:text-slate-300" />
          ค้นหาตำแหน่ง
        </Button>
      ) : (
        <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur shadow-lg border-slate-200 dark:border-slate-800">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2 mb-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400" />
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="ค้นหาจังหวัด อำเภอ หรือตำแหน่ง..."
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 text-sm bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                />
                {isLoading && (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 animate-spin" />
                )}
              </div>
              <Button
                onClick={toggleSearch}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {results.length > 0 && (
              <div className="space-y-1 max-h-60 overflow-y-auto">
                {results.map((result, index) => {
                  const hasBoundary = Boolean(
                    result.geojson &&
                    (result.geojson.type === 'Polygon' ||
                     result.geojson.type === 'MultiPolygon' ||
                     result.boundingBox)
                  );

                  return (
                    <button
                      key={index}
                      onClick={() => handleResultSelect(result)}
                      className="w-full text-left p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors group"
                    >
                      <div className="flex items-start space-x-2">
                        <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1.5">
                            <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                              {result.name}
                            </span>
                            {hasBoundary && (
                              <span className="text-[10px] bg-blue-50 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 border border-blue-200 dark:border-blue-700 px-1.5 py-0.5 rounded font-bold flex-shrink-0">
                                ขอบเขตพื้นที่
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400 truncate mt-0.5 font-medium">
                            {result.displayName}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {query && !isLoading && results.length === 0 && (
              <div className="text-sm text-slate-600 dark:text-slate-400 text-center py-2 font-medium">
                ไม่พบผลการค้นหา
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
