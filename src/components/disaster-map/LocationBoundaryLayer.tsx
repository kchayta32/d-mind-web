import React, { useEffect, useMemo, useRef } from 'react';
import { GeoJSON, Circle, Marker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { SelectedLocation } from './types';

interface LocationBoundaryLayerProps {
  selectedLocation: SelectedLocation | null;
}

const pointMarkerIcon = L.divIcon({
  html: `
    <div class="relative flex items-center justify-center">
      <span class="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-blue-400 opacity-60"></span>
      <div class="relative flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white shadow-xl ring-2 ring-white">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      </div>
    </div>
  `,
  className: 'selected-location-pin',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

export const LocationBoundaryLayer: React.FC<LocationBoundaryLayerProps> = ({ selectedLocation }) => {
  const map = useMap();
  const lastLocationKeyRef = useRef<string | null>(null);

  // Check if geojson contains a valid polygon geometry
  const isPolygon = useMemo(() => {
    if (!selectedLocation?.geojson) return false;
    const gType = selectedLocation.geojson.type;
    if (gType === 'Polygon' || gType === 'MultiPolygon') return true;
    if (gType === 'Feature') {
      const geomType = selectedLocation.geojson.geometry?.type;
      return geomType === 'Polygon' || geomType === 'MultiPolygon';
    }
    if (gType === 'FeatureCollection' && Array.isArray(selectedLocation.geojson.features)) {
      return selectedLocation.geojson.features.some((f: any) => 
        f.geometry?.type === 'Polygon' || f.geometry?.type === 'MultiPolygon'
      );
    }
    return false;
  }, [selectedLocation]);

  // Construct valid GeoJSON structure for react-leaflet
  const geojsonData = useMemo(() => {
    if (!selectedLocation?.geojson || !isPolygon) return null;
    const raw = selectedLocation.geojson;
    if (raw.type === 'Feature' || raw.type === 'FeatureCollection') {
      return raw;
    }
    return {
      type: 'Feature' as const,
      properties: {
        name: selectedLocation.name,
        displayName: selectedLocation.displayName
      },
      geometry: raw
    };
  }, [selectedLocation, isPolygon]);

  // Fly to boundary or point when selected location changes
  useEffect(() => {
    if (!selectedLocation) {
      lastLocationKeyRef.current = null;
      return;
    }

    const currentKey = `${selectedLocation.lat}_${selectedLocation.lon}_${selectedLocation.name}`;
    if (lastLocationKeyRef.current === currentKey) return;
    lastLocationKeyRef.current = currentKey;

    if (isPolygon) {
      if (selectedLocation.boundingBox) {
        const [south, north, west, east] = selectedLocation.boundingBox;
        map.flyToBounds(
          [[south, west], [north, east]],
          { padding: [40, 40], maxZoom: 13, duration: 1.5 }
        );
      } else if (geojsonData) {
        try {
          const bounds = L.geoJSON(geojsonData as any).getBounds();
          if (bounds.isValid()) {
            map.flyToBounds(bounds, { padding: [40, 40], maxZoom: 13, duration: 1.5 });
          } else {
            map.flyTo([selectedLocation.lat, selectedLocation.lon], 13, { duration: 1.5 });
          }
        } catch {
          map.flyTo([selectedLocation.lat, selectedLocation.lon], 13, { duration: 1.5 });
        }
      } else {
        map.flyTo([selectedLocation.lat, selectedLocation.lon], 13, { duration: 1.5 });
      }
    } else {
      // Point with no polygon: fly to it with zoom 13
      map.flyTo([selectedLocation.lat, selectedLocation.lon], 13, { duration: 1.5 });
    }
  }, [selectedLocation, isPolygon, geojsonData, map]);

  if (!selectedLocation) return null;

  // Google Maps style boundary:
  // - Dashed outline: stroke #1A73E8 (or #2563EB), dashArray: '6, 6', weight: 2.5, opacity: 0.9
  // - Fill: subtle translucent fill #3B82F6 with fillOpacity: 0.08
  const boundaryStyle = () => ({
    color: '#1A73E8',
    weight: 2.5,
    opacity: 0.9,
    dashArray: '6, 6',
    fillColor: '#3B82F6',
    fillOpacity: 0.08,
    lineCap: 'round' as const,
    lineJoin: 'round' as const
  });

  const onEachFeature = (feature: any, layer: L.Layer) => {
    layer.bindTooltip(
      `<strong>📍 ขอบเขต: ${selectedLocation.name}</strong><br/><span style="font-size:11px;color:#475569;">${selectedLocation.displayName || ''}</span>`,
      { sticky: true, direction: 'top' }
    );
  };

  const boundaryKey = `boundary-${selectedLocation.lat}-${selectedLocation.lon}-${selectedLocation.name}`;

  return (
    <>
      {/* If polygon is present: render dashed GeoJSON polygon */}
      {isPolygon && geojsonData && (
        <GeoJSON
          key={boundaryKey}
          data={geojsonData as any}
          style={boundaryStyle}
          onEachFeature={onEachFeature}
        />
      )}

      {/* Styled marker and radius circle */}
      {isPolygon ? (
        // When polygon boundary is present, show center marker with tooltip
        <Marker
          position={[selectedLocation.lat, selectedLocation.lon]}
          icon={pointMarkerIcon}
        >
          <Tooltip direction="top" offset={[0, -28]} permanent={false}>
            <div className="font-semibold text-xs">📍 {selectedLocation.name}</div>
          </Tooltip>
        </Marker>
      ) : (
        // When search result is a point with no polygon: show styled marker and radius circle
        <>
          <Circle
            center={[selectedLocation.lat, selectedLocation.lon]}
            radius={800}
            pathOptions={{
              color: '#1A73E8',
              weight: 2.5,
              opacity: 0.9,
              dashArray: '6, 6',
              fillColor: '#3B82F6',
              fillOpacity: 0.08
            }}
          />
          <Marker
            position={[selectedLocation.lat, selectedLocation.lon]}
            icon={pointMarkerIcon}
          >
            <Tooltip direction="top" offset={[0, -28]} permanent={true}>
              <div className="font-semibold text-xs">📍 {selectedLocation.name}</div>
            </Tooltip>
          </Marker>
        </>
      )}
    </>
  );
};
