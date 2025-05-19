
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Earthquake {
  id: string;
  magnitude: number;
  location: string;
  time: number; // timestamp
  coordinates: [number, number]; // [latitude, longitude]
}

// Mock earthquake data for demonstration
const mockEarthquakes: Earthquake[] = [
  {
    id: '1',
    magnitude: 6.2,
    location: 'Bangkok, Thailand',
    time: Date.now() - 24 * 60 * 60 * 1000, // 1 day ago
    coordinates: [13.7563, 100.5018],
  },
  {
    id: '2',
    magnitude: 4.8,
    location: 'Chiang Mai, Thailand',
    time: Date.now() - 12 * 60 * 60 * 1000, // 12 hours ago
    coordinates: [18.7883, 98.9853],
  },
  {
    id: '3',
    magnitude: 5.5,
    location: 'Phuket, Thailand',
    time: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
    coordinates: [7.9519, 98.3381],
  },
  {
    id: '4',
    magnitude: 3.2,
    location: 'Pattaya, Thailand',
    time: Date.now() - 6 * 60 * 60 * 1000, // 6 hours ago
    coordinates: [12.9236, 100.8824],
  },
];

const DisasterMap: React.FC = () => {
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>(mockEarthquakes);
  const [filteredEarthquakes, setFilteredEarthquakes] = useState<Earthquake[]>(mockEarthquakes);
  const [magnitudeFilter, setMagnitudeFilter] = useState<number[]>([0]);
  const [timeFilter, setTimeFilter] = useState<string>("all");
  const [refreshing, setRefreshing] = useState(false);

  // Custom icon for earthquake markers
  const earthquakeIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  // Filter earthquakes based on magnitude and time
  useEffect(() => {
    let filtered = earthquakes;
    
    // Filter by magnitude
    if (magnitudeFilter[0] > 0) {
      filtered = filtered.filter(eq => eq.magnitude >= magnitudeFilter[0]);
    }
    
    // Filter by time
    const now = Date.now();
    switch (timeFilter) {
      case "1h":
        filtered = filtered.filter(eq => now - eq.time < 60 * 60 * 1000);
        break;
      case "6h":
        filtered = filtered.filter(eq => now - eq.time < 6 * 60 * 60 * 1000);
        break;
      case "24h":
        filtered = filtered.filter(eq => now - eq.time < 24 * 60 * 60 * 1000);
        break;
      case "7d":
        filtered = filtered.filter(eq => now - eq.time < 7 * 24 * 60 * 60 * 1000);
        break;
      // "all" case doesn't need filtering
    }
    
    setFilteredEarthquakes(filtered);
  }, [earthquakes, magnitudeFilter, timeFilter]);

  // Simulate refreshing earthquake data
  const handleRefresh = () => {
    setRefreshing(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // In a real app, you would fetch new data here
      setRefreshing(false);
    }, 1000);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getMagnitudeColor = (magnitude: number) => {
    if (magnitude >= 6) return "destructive";
    if (magnitude >= 5) return "default"; // red
    if (magnitude >= 4) return "secondary"; // yellow
    return "outline"; // green or lower intensity
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between py-3">
        <CardTitle className="text-lg">Disaster Map</CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent className="p-0 pb-4">
        <div className="relative h-64 sm:h-72 md:h-80 w-full border-b">
          <MapContainer 
            center={[15.8700, 100.9925]} // Center of Thailand
            zoom={5} 
            style={{ height: '100%', width: '100%' }} 
            scrollWheelZoom={false}
            attributionControl={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {filteredEarthquakes.map((earthquake) => (
              <Marker 
                key={earthquake.id} 
                position={[earthquake.coordinates[0], earthquake.coordinates[1]]}
                icon={earthquakeIcon}
              >
                <Popup>
                  <div className="text-sm">
                    <div className="font-bold">{earthquake.location}</div>
                    <div>
                      Magnitude: <Badge variant={getMagnitudeColor(earthquake.magnitude)}>
                        {earthquake.magnitude}
                      </Badge>
                    </div>
                    <div>Time: {formatTime(earthquake.time)}</div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Filter controls */}
        <div className="px-4 pt-4 space-y-3">
          <div>
            <div className="flex justify-between">
              <label className="text-sm font-medium">Magnitude: {magnitudeFilter[0]}+</label>
            </div>
            <Slider 
              value={magnitudeFilter} 
              min={0}
              max={9}
              step={0.5}
              onValueChange={setMagnitudeFilter}
              className="mt-2"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium block mb-2">Time Period:</label>
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All time</SelectItem>
                <SelectItem value="1h">Last hour</SelectItem>
                <SelectItem value="6h">Last 6 hours</SelectItem>
                <SelectItem value="24h">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Showing {filteredEarthquakes.length} earthquake{filteredEarthquakes.length !== 1 ? 's' : ''}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DisasterMap;
