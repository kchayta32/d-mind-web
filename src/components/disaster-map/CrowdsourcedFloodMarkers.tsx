import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { CrowdsourcedFloodReport } from './types';
import { Badge } from '@/components/ui/badge';
import { Waves, Clock, MapPin, CheckCircle2, AlertTriangle, User, ExternalLink, ShieldCheck } from 'lucide-react';

interface CrowdsourcedFloodMarkersProps {
  reports: CrowdsourcedFloodReport[];
}

const getWaterLevelBadge = (level: CrowdsourcedFloodReport['waterLevel'], cm?: number) => {
  switch (level) {
    case 'critical':
      return {
        label: `วิกฤติ (>100 ซม.)`,
        color: 'bg-red-600 text-white border-red-700',
        markerBg: '#dc2626',
        ripple: '#ef4444'
      };
    case 'chest':
      return {
        label: `ระดับอก (~80-100 ซม.)`,
        color: 'bg-rose-600 text-white border-rose-700',
        markerBg: '#e11d48',
        ripple: '#f43f5e'
      };
    case 'waist':
      return {
        label: `ระดับเอว (~50-80 ซม.)`,
        color: 'bg-amber-600 text-white border-amber-700',
        markerBg: '#d97706',
        ripple: '#f59e0b'
      };
    case 'knee':
      return {
        label: `ระดับหัวเข่า (~30-50 ซม.)`,
        color: 'bg-yellow-500 text-slate-900 border-yellow-600',
        markerBg: '#eab308',
        ripple: '#facc15'
      };
    case 'ankle':
    default:
      return {
        label: `ระดับข้อเท้า (10-30 ซม.)`,
        color: 'bg-blue-600 text-white border-blue-700',
        markerBg: '#2563eb',
        ripple: '#60a5fa'
      };
  }
};

const createCrowdsourceIcon = (report: CrowdsourcedFloodReport) => {
  const badge = getWaterLevelBadge(report.waterLevel, report.waterLevelCm);
  const isVerified = report.verifiedBySatellite;

  return L.divIcon({
    className: 'custom-crowdsource-flood-pin',
    html: `
      <div style="position: relative; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center;">
        <div style="
          position: absolute;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: ${badge.ripple};
          opacity: 0.35;
          animation: pulse-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></div>
        <div style="
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: ${badge.markerBg};
          border: 2.5px solid #ffffff;
          box-shadow: 0 4px 10px rgba(0,0,0,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 13px;
          position: relative;
          z-index: 10;
        ">
          🌊
          ${isVerified ? `
            <div style="
              position: absolute;
              bottom: -3px;
              right: -3px;
              background: #10b981;
              color: white;
              border-radius: 50%;
              width: 13px;
              height: 13px;
              font-size: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 1.5px solid white;
            ">✓</div>
          ` : ''}
        </div>
      </div>
      <style>
        @keyframes pulse-ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      </style>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -19]
  });
};

export const CrowdsourcedFloodMarkers: React.FC<CrowdsourcedFloodMarkersProps> = ({ reports }) => {
  if (!reports || reports.length === 0) return null;

  return (
    <>
      {reports.map((report) => {
        const badge = getWaterLevelBadge(report.waterLevel, report.waterLevelCm);
        const dateStr = new Date(report.createdAt).toLocaleString('th-TH', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit'
        });

        return (
          <Marker
            key={report.id}
            position={[report.lat, report.lng]}
            icon={createCrowdsourceIcon(report)}
          >
            <Popup className="crowdsource-flood-popup min-w-[280px] max-w-[320px]">
              <div className="p-1 space-y-2.5">
                {/* Header */}
                <div className="flex items-start justify-between gap-2 border-b pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">📢</span>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 leading-tight">
                        รายงานน้ำท่วม (ภาคประชาชน)
                      </h4>
                      <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{dateStr}</span>
                      </p>
                    </div>
                  </div>
                  <Badge className={`text-[10px] px-2 py-0.5 font-semibold ${badge.color}`}>
                    {badge.label}
                  </Badge>
                </div>

                {/* Photo Preview if available */}
                {report.imageUrl && (
                  <div className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-100 max-h-36">
                    <img
                      src={report.imageUrl}
                      alt="ภาพถ่ายน้ำท่วมจากสถานที่จริง"
                      className="w-full h-32 object-cover hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-xs text-white text-[9px] px-1.5 py-0.5 rounded flex items-center gap-1">
                      📸 ภาพจากพื้นที่จริง
                    </div>
                  </div>
                )}

                {/* Location & Details */}
                <div className="space-y-1.5 text-xs text-slate-700">
                  <div className="flex items-start gap-1.5 bg-slate-50 p-2 rounded border border-slate-100">
                    <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-800">{report.locationName}</span>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        พิกัด: {report.lat.toFixed(4)}, {report.lng.toFixed(4)}
                      </p>
                    </div>
                  </div>

                  {report.situation && (
                    <div className="text-[11px] bg-blue-50/60 p-2 rounded border border-blue-100 text-blue-950">
                      <strong>สถานการณ์:</strong> {report.situation}
                    </div>
                  )}

                  {report.waterFlow && (
                    <div className="flex items-center gap-2 text-[10px] text-slate-600">
                      <Waves className="w-3 h-3 text-blue-500" />
                      <span>กระแสน้ำ:</span>
                      <span className="font-medium text-slate-800">
                        {report.waterFlow === 'torrential' ? '🌊 ไหลเชี่ยวกราก (อันตรายมาก)' : report.waterFlow === 'flowing' ? '💧 น้ำไหลต่อเนื่อง' : '⚪ น้ำท่วมขังนิ่ง'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Ground Truth Satellite Cross-Verification Section */}
                <div className="pt-1.5 border-t">
                  {report.verifiedBySatellite ? (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-2 rounded text-[10px] flex items-start gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block font-bold">✅ ยืนยันตรงกับดาวเทียม Sentinel-1/2</strong>
                        <span>ข้อมูลรายงานภาคพื้นดิน (Ground Truth) ตรงกับขอบเขตพื้นที่น้ำท่วมที่ตรวจวัดได้จากดาวเทียม Sentinel</span>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-amber-50 border border-amber-200 text-amber-900 p-2 rounded text-[10px] flex items-start gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block font-bold">⚡ รายงานสดจากพื้นที่ (Ground Truth)</strong>
                        <span>รายงานตรงจากประชาชน เรียลไทม์ 24 ชม. ช่วยระบุพื้นที่น้ำท่วมใหม่ก่อนรอบถ่ายภาพดาวเทียมถัดไป</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer attribution */}
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {report.reporterName || 'ประชาชนในพื้นที่'}
                  </span>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${report.lat},${report.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-0.5 font-medium"
                  >
                    <span>นำทาง</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};

export default CrowdsourcedFloodMarkers;
