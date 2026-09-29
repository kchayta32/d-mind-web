import React, { useEffect, useState, useMemo } from 'react';
import { Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { 
  BangkokUserFloodReport, 
  bangkokFloodUserReportService, 
  WATER_LEVEL_PRESETS 
} from '@/services/bangkokFloodUserReportService';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow, format } from 'date-fns';
import { th } from 'date-fns/locale';
import { 
  Waves, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  MessageSquare, 
  UserCheck 
} from 'lucide-react';

export interface BangkokFloodUserReportsLayerProps {
  reports?: BangkokUserFloodReport[];
  onSelectReport?: (report: BangkokUserFloodReport) => void;
}

/**
 * Custom HTML DivIcon for Citizen Reports
 */
const createUserReportIcon = (isFlooded: boolean, depthCategory?: string) => {
  if (isFlooded) {
    // Water drop with warning exclamation & ripple effect
    const html = `
      <div class="relative flex items-center justify-center cursor-pointer group">
        <!-- Ripple Pulse Animation -->
        <span class="absolute inline-flex h-11 w-11 rounded-full bg-blue-500 opacity-40 animate-ping"></span>
        <span class="absolute inline-flex h-9 w-9 rounded-full bg-sky-400 opacity-30"></span>

        <!-- Main Pin Body -->
        <div class="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-500 text-white shadow-xl ring-2 ring-white dark:ring-slate-900 border-2 border-blue-300 transition-transform group-hover:scale-115">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
          </svg>
        </div>

        <!-- Exclamation / Flood Alert Badge -->
        <div class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-black text-white shadow">
          !
        </div>
      </div>
    `;

    return L.divIcon({
      html,
      className: 'bangkok-user-report-flooded-marker',
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -20]
    });
  } else {
    // Dry road / safe road green shield marker
    const html = `
      <div class="relative flex items-center justify-center cursor-pointer group">
        <!-- Subtle Glow -->
        <span class="absolute inline-flex h-8 w-8 rounded-full bg-emerald-400 opacity-30"></span>

        <!-- Main Pin Body -->
        <div class="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-xl ring-2 ring-white dark:ring-slate-900 border-2 border-emerald-200 transition-transform group-hover:scale-115">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>

        <!-- Small safe check badge -->
        <div class="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900 shadow"></div>
      </div>
    `;

    return L.divIcon({
      html,
      className: 'bangkok-user-report-normal-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -18]
    });
  }
};

/**
 * Format relative time in Thai friendly language
 */
const formatThaiReportTime = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return 'ไม่ระบุเวลา';
    
    // Relative format e.g. "เมื่อ 5 นาทีที่แล้ว"
    const relative = formatDistanceToNow(date, { addSuffix: true, locale: th });
    const fullTime = format(date, 'd MMM yyyy, HH:mm น.', { locale: th });
    return `${relative} (${fullTime})`;
  } catch (e) {
    return 'ไม่ระบุเวลา';
  }
};

export const BangkokFloodUserReportsLayer: React.FC<BangkokFloodUserReportsLayerProps> = ({
  reports: propReports,
  onSelectReport
}) => {
  const [internalReports, setInternalReports] = useState<BangkokUserFloodReport[]>([]);

  // Keep internal list in sync with localStorage and real-time events
  useEffect(() => {
    // If propReports provided, use them; otherwise load from service
    if (propReports) {
      setInternalReports(propReports);
    } else {
      bangkokFloodUserReportService.loadReports().then(loaded => {
        setInternalReports(loaded);
      });
    }

    // Subscribe to changes
    const unsubscribe = bangkokFloodUserReportService.subscribeToReports((updated) => {
      setInternalReports(updated);
    });

    return () => {
      unsubscribe();
    };
  }, [propReports]);

  const activeReports = propReports ?? internalReports;

  // Memoized marker elements
  return (
    <>
      {activeReports.map((report) => {
        const icon = createUserReportIcon(report.isFlooded, report.waterLevelCategory);
        const presetInfo = WATER_LEVEL_PRESETS.find(p => p.id === report.waterLevelCategory);

        return (
          <Marker
            key={report.id}
            position={report.coordinates}
            icon={icon}
            eventHandlers={{
              click: () => {
                if (onSelectReport) onSelectReport(report);
              }
            }}
          >
            {/* Tooltip on hover */}
            <Tooltip direction="top" offset={[0, -14]} className="leaflet-dark-tooltip">
              <div className="font-sans text-xs p-1 space-y-1 min-w-[180px]">
                <div className="flex items-center justify-between gap-1.5 border-b border-slate-700/60 pb-1">
                  <span className="font-bold text-white truncate">{report.locationName}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                    report.isFlooded ? 'bg-red-500/30 text-red-300' : 'bg-emerald-500/30 text-emerald-300'
                  }`}>
                    {report.isFlooded ? '🌊 มีน้ำท่วม' : '✅ ถนนแห้ง'}
                  </span>
                </div>
                {report.isFlooded && report.waterLevelDescription && (
                  <div className="text-[11px] text-sky-200">
                    ระดับน้ำ: <b>{report.waterLevelDescription}</b>
                  </div>
                )}
                <div className="text-[10px] text-slate-400">
                  คลิกเพื่อดูรายละเอียดรายงาน
                </div>
              </div>
            </Tooltip>

            {/* Rich Detailed Popup */}
            <Popup className="bangkok-user-report-popup" maxWidth={320}>
              <div className="font-sans text-slate-900 dark:text-slate-100 p-1 space-y-2.5 min-w-[240px]">
                
                {/* Header Status Badge */}
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black shadow-sm ${
                    report.isFlooded
                      ? 'bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800'
                      : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                  }`}>
                    {report.isFlooded ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                        🌊 มีน้ำท่วมขัง
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        ✅ ไม่มีน้ำท่วม (ถนนแห้ง)
                      </>
                    )}
                  </span>

                  <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                    <UserCheck className="w-3 h-3 text-blue-500" />
                    Crowdsource
                  </span>
                </div>

                {/* Location Name & District */}
                <div>
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                        {report.locationName}
                      </h4>
                      {report.district && (
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          เขต{report.district} กรุงเทพมหานคร
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Water Level Section (if flooded) */}
                {report.isFlooded && (
                  <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 space-y-1">
                    <div className="text-[11px] font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1">
                      <Waves className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      ระดับน้ำที่ตรวจพบ:
                    </div>
                    <div className="text-xs font-extrabold text-blue-700 dark:text-blue-200 pl-4">
                      {presetInfo ? `${presetInfo.icon} ` : ''}
                      {report.waterLevelDescription || 'มีน้ำท่วมขัง'}
                    </div>
                  </div>
                )}

                {/* Notes / Remarks */}
                {report.notes && (
                  <div className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950/60 p-2 rounded-xl border border-slate-200 dark:border-slate-800 space-y-0.5">
                    <div className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      หมายเหตุจากผู้รายงาน:
                    </div>
                    <p className="italic pl-4 text-[11px]">
                      &ldquo;{report.notes}&rdquo;
                    </p>
                  </div>
                )}

                {/* Footer Timestamp & Coordinates */}
                <div className="pt-1 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-0.5 text-[10px] text-slate-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>รายงานเมื่อ: {formatThaiReportTime(report.timestamp)}</span>
                  </div>
                  <div className="font-mono text-[9px] text-slate-400">
                    พิกัด: [{report.coordinates[0].toFixed(5)}, {report.coordinates[1].toFixed(5)}]
                  </div>
                </div>

              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};

export default BangkokFloodUserReportsLayer;
