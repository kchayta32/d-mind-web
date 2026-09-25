import React, { useMemo } from 'react';
import { GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import { FloodFeature } from './hooks/useGISTDAFloodData';

interface SentinelFloodVectorLayerProps {
  features: FloodFeature[];
}

export const SentinelFloodVectorLayer: React.FC<SentinelFloodVectorLayerProps> = ({ features }) => {
  // Construct clean GeoJSON FeatureCollection
  const featureCollection = useMemo<GeoJSON.FeatureCollection>(() => {
    if (!features || !Array.isArray(features) || features.length === 0) {
      return {
        type: 'FeatureCollection',
        features: []
      };
    }

    const validFeatures = features.filter((f) => {
      const geom = f?.geometry;
      return (
        geom &&
        (geom.type === 'Polygon' || geom.type === 'MultiPolygon') &&
        Array.isArray(geom.coordinates) &&
        geom.coordinates.length > 0
      );
    });

    return {
      type: 'FeatureCollection',
      features: validFeatures as any
    };
  }, [features]);

  if (!featureCollection.features || featureCollection.features.length === 0) {
    return null;
  }

  // Key to force refresh when data updates
  const layerKey = `sentinel-flood-geojson-${featureCollection.features.length}-${features[0]?.id || 'init'}`;

  const style = () => ({
    color: '#0284c7',
    weight: 2,
    opacity: 0.9,
    fillColor: '#38bdf8',
    fillOpacity: 0.65,
    dashArray: undefined
  });

  const onEachFeature = (feature: any, layer: L.Layer) => {
    const props = feature.properties || {};
    const areaSqM = props.f_area || props._area || 0;
    const areaSqKm = (areaSqM / 1000000).toFixed(2);
    const areaRai = Math.round(areaSqM / 1600).toLocaleString();
    const isSentinel = Boolean(
      props.file_name &&
        (props.file_name.includes('S1') ||
          props.file_name.includes('Sentinel') ||
          props.file_name.includes('rd2'))
    );

    const pv = props.pv_tn || 'ไม่ระบุ';
    const ap = props.ap_tn || 'ไม่ระบุ';
    const tb = props.tb_tn || 'ไม่ระบุ';
    const pop = props.population || props.population_2 || 0;
    const buildings = props.building || 0;
    const roadLengthKm = props.length_road ? (props.length_road / 1000).toFixed(2) : '0';
    const satelliteFile = props.file_name || 'GISTDA Sentinel Composite';
    const updateTime = props._updatedAt || props._createdAt || new Date().toISOString();

    const popupContent = `
      <div style="font-family: system-ui, -apple-system, sans-serif; font-size: 12px; line-height: 1.45; min-width: 220px; max-width: 280px; padding: 4px;">
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 8px;">
          <div style="font-weight: 800; font-size: 13px; color: #0369a1; display: flex; align-items: center; gap: 4px;">
            <span>🌊</span>
            <span>พื้นที่น้ำท่วมขัง</span>
          </div>
          <span style="background: #e0f2fe; color: #0284c7; padding: 2px 7px; border-radius: 9999px; font-size: 10px; font-weight: 700; border: 1px solid #bae6fd;">
            ${isSentinel ? '🛰️ Sentinel-1 SAR' : 'GISTDA 2.0'}
          </span>
        </div>

        <div style="background: #f8fafc; border-radius: 6px; padding: 6px 8px; margin-bottom: 8px; border: 1px solid #f1f5f9;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
            <span style="color: #64748b;">จังหวัด:</span>
            <strong style="color: #0f172a;">${pv}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
            <span style="color: #64748b;">อำเภอ:</span>
            <span style="color: #334155; font-weight: 600;">${ap}</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #64748b;">ตำบล:</span>
            <span style="color: #334155;">${tb}</span>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px; padding: 4px 0; border-top: 1px dashed #cbd5e1; border-bottom: 1px dashed #cbd5e1;">
          <span style="color: #64748b;">ขนาดพื้นที่น้ำท่วม:</span>
          <div>
            <strong style="color: #0284c7; font-size: 14px;">${areaSqKm}</strong>
            <span style="color: #0284c7; font-size: 11px;"> ตร.กม.</span>
            <span style="color: #94a3b8; font-size: 10px;"> (~${areaRai} ไร่)</span>
          </div>
        </div>

        ${
          pop > 0
            ? `<div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                <span style="color: #64748b;">ประชากรในพื้นที่:</span>
                <span style="color: #d97706; font-weight: bold;">~${Math.round(pop).toLocaleString()} คน</span>
              </div>`
            : ''
        }

        ${
          buildings > 0
            ? `<div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                <span style="color: #64748b;">สิ่งปลูกสร้าง:</span>
                <span style="color: #475569; font-weight: 600;">${buildings} หลัง</span>
              </div>`
            : ''
        }

        ${
          Number(roadLengthKm) > 0
            ? `<div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span style="color: #64748b;">ถนนในแนวท่วม:</span>
                <span style="color: #475569;">${roadLengthKm} กม.</span>
              </div>`
            : ''
        }

        <div style="font-size: 10px; color: #94a3b8; margin-top: 6px; padding-top: 4px; border-top: 1px solid #f1f5f9;">
          <div><strong>ดาวเทียม:</strong> ${satelliteFile}</div>
          <div><strong>ตรวจวัดเมื่อ:</strong> ${new Date(updateTime).toLocaleString('th-TH')}</div>
        </div>
      </div>
    `;

    layer.bindPopup(popupContent, { maxWidth: 300 });

    // Interactive Hover effect
    layer.on({
      mouseover: (e) => {
        const l = e.target;
        l.setStyle({
          weight: 3.5,
          color: '#0369a1',
          fillOpacity: 0.85
        });
        if (l.bringToFront) {
          l.bringToFront();
        }
      },
      mouseout: (e) => {
        const l = e.target;
        l.setStyle({
          weight: 2,
          color: '#0284c7',
          fillOpacity: 0.65
        });
      }
    });
  };

  return (
    <GeoJSON
      key={layerKey}
      data={featureCollection}
      style={style}
      onEachFeature={onEachFeature}
    />
  );
};

export default SentinelFloodVectorLayer;
