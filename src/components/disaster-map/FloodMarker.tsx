import React from 'react';
import { Marker, Popup, Polygon } from 'react-leaflet';
import L from 'leaflet';
import { FloodFeature } from './hooks/useGISTDAFloodData';

const floodIcon = new L.DivIcon({
  html: `
    <div style="
      background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
      border: 2px solid white;
      border-radius: 50%;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
    ">
      <span style="font-size: 14px;">🌊</span>
    </div>
  `,
  className: 'flood-marker',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14]
});

interface FloodMarkerProps {
  feature: FloodFeature;
  center: [number, number];
  renderPolygon?: boolean;
}

export const FloodMarker: React.FC<FloodMarkerProps> = ({ feature, center, renderPolygon = false }) => {
  const properties = feature?.properties || {};
  const area = properties.f_area || 0;
  const areaInKm = (area / 1000000).toFixed(2);
  const isSentinelDetected = Boolean(properties.file_name && (properties.file_name.includes('S1') || properties.file_name.includes('Sentinel') || properties.file_name.includes('rd2')));
  
  // Extract all polygon rings safely for rendering (handles MultiPolygon & Polygon)
  const allPolygons: [number, number][][] = [];
  try {
    const coords = feature?.geometry?.coordinates;
    const geomType = feature?.geometry?.type;
    if (coords && Array.isArray(coords)) {
      if (geomType === 'Polygon' || (Array.isArray(coords[0]) && Array.isArray(coords[0][0]) && typeof coords[0][0][0] === 'number')) {
        const ring = coords[0].map((coord: any) => [Number(coord[1]), Number(coord[0])] as [number, number]);
        if (ring.length > 2) allPolygons.push(ring);
      } else if (geomType === 'MultiPolygon' || (Array.isArray(coords[0]) && Array.isArray(coords[0][0]) && Array.isArray(coords[0][0][0]))) {
        // MultiPolygon contains an array of Polygons, each having array of rings
        coords.forEach((poly: any) => {
          if (Array.isArray(poly) && Array.isArray(poly[0])) {
            const ring = poly[0].map((coord: any) => [Number(coord[1]), Number(coord[0])] as [number, number]);
            if (ring.length > 2) allPolygons.push(ring);
          }
        });
      }
    }
  } catch (err) {
    console.warn('Error extracting flood polygon positions:', err);
  }

  // Validate center
  const validCenter: [number, number] = 
    Array.isArray(center) && typeof center[0] === 'number' && typeof center[1] === 'number' && !isNaN(center[0]) && !isNaN(center[1])
      ? center
      : [13.7563, 100.5018];

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'ไม่ระบุ';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleString('th-TH');
    } catch {
      return dateStr;
    }
  };

  return (
    <>
      {/* Render all detected water polygons with vivid styling if requested */}
      {renderPolygon && allPolygons.map((ring, idx) => (
        <Polygon
          key={`poly-${feature.id || properties._id || idx}-${idx}`}
          positions={ring}
          pathOptions={{
            color: '#0284c7',
            weight: 2.5,
            fillColor: '#38bdf8',
            fillOpacity: 0.55,
            dashArray: undefined
          }}
        />
      ))}
      
      {/* Render marker at center */}
      <Marker position={validCenter} icon={floodIcon}>
        <Popup maxWidth={320} className="flood-popup">
          <div className="p-2 space-y-2">
            <div className="flex items-center justify-between gap-2 border-b pb-1.5">
              <h3 className="font-bold text-sm text-sky-800 dark:text-sky-300 flex items-center gap-1.5">
                <span>🌊</span>
                <span>พื้นที่น้ำท่วมขัง</span>
              </h3>
              <span className="text-[10px] bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300 px-2 py-0.5 rounded-full font-semibold border border-sky-300/60">
                {isSentinelDetected ? '🛰️ Sentinel-1/2' : 'GISTDA 2.0'}
              </span>
            </div>
            
            <div className="space-y-1.5 text-xs">
              <div className="grid grid-cols-2 gap-1 bg-slate-50 dark:bg-slate-900/50 p-1.5 rounded">
                <span className="text-muted-foreground">จังหวัด:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-100">{properties.pv_tn || 'ไม่ระบุ'}</span>
                
                <span className="text-muted-foreground">อำเภอ:</span>
                <span className="font-medium text-slate-700 dark:text-slate-200">{properties.ap_tn || 'ไม่ระบุ'}</span>
                
                <span className="text-muted-foreground">ตำบล:</span>
                <span className="font-medium text-slate-700 dark:text-slate-200">{properties.tb_tn || 'ไม่ระบุ'}</span>
              </div>
              
              <div className="border-t pt-1.5">
                <div className="grid grid-cols-2 gap-1">
                  <span className="text-muted-foreground">พื้นที่น้ำท่วม:</span>
                  <span className="font-bold text-sky-600 dark:text-sky-400">{areaInKm} ตร.กม.</span>
                </div>
              </div>

              {(properties.population || properties.population_2) ? (
                <div className="grid grid-cols-2 gap-1">
                  <span className="text-muted-foreground">ประชากรในพื้นที่:</span>
                  <span className="font-medium text-amber-600 dark:text-amber-400">
                    ~{Math.round(properties.population || properties.population_2 || 0).toLocaleString()} คน
                  </span>
                </div>
              ) : null}

              {properties.building > 0 && (
                <div className="grid grid-cols-2 gap-1">
                  <span className="text-muted-foreground">สิ่งปลูกสร้าง:</span>
                  <span className="font-medium">{properties.building} หลัง</span>
                </div>
              )}

              {properties.length_road > 0 && (
                <div className="grid grid-cols-2 gap-1">
                  <span className="text-muted-foreground">ถนนในแนวท่วม:</span>
                  <span className="font-medium">{(properties.length_road / 1000).toFixed(2)} กม.</span>
                </div>
              )}

              {properties.file_name && (
                <div className="text-[10px] text-muted-foreground pt-1.5 border-t">
                  <span className="font-medium text-sky-700 dark:text-sky-400">ภาพถ่ายดาวเทียม:</span> {properties.file_name}
                </div>
              )}

              <div className="text-[10px] text-muted-foreground">
                อัพเดทตรวจวัด: {formatDate(properties._updatedAt || properties._createdAt)}
              </div>
            </div>
          </div>
        </Popup>
      </Marker>
    </>
  );
};
