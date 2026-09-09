import React from 'react';
import { Award, ShieldCheck, Database, Cpu, HeartHandshake, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#070a10] border-t border-slate-800 text-slate-400 py-8 px-4 sm:px-6 mb-16 md:mb-0">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs">
          
          {/* Col 1: About the Innovation */}
          <div className="md:col-span-2 space-y-2">
            <div className="flex items-center gap-2 text-slate-200 font-semibold font-mono text-sm">
              <Award className="w-4 h-4 text-amber-400" />
              <span>SeismoGuard AI — ผลงานวิจัยและนวัตกรรมเพื่อการประกวด วช.</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              ระบบวิเคราะห์คลื่นไหวสะเทือนและเตือนภัยล่วงหน้าด้วยปัญญาประดิษฐ์บนขอบข่ายแบบเรียลไทม์ 
              พัฒนาขึ้นเพื่อยกระดับความมั่นคงปลอดภัยของเมืองและชุมชน (Urban Disaster Resiliency) 
              ตามแนวทางการแข่งขันนวัตกรรมแห่งชาติ สำนักงานการวิจัยแห่งชาติ (วช.)
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono text-[10px]">
                SDG 11: เมืองยั่งยืน
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[10px]">
                SDG 9: นวัตกรรมและโครงสร้างพื้นฐาน
              </span>
              <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono text-[10px]">
                SDG 3: สุขภาวะและความปลอดภัย
              </span>
            </div>
          </div>

          {/* Col 2: Data Sources */}
          <div className="space-y-2">
            <h4 className="text-slate-200 font-semibold font-mono uppercase tracking-wider flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              แหล่งข้อมูลอ้างอิง
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li className="flex items-center gap-1">
                <span>USGS Real-time Seismic API</span>
              </li>
              <li className="flex items-center gap-1">
                <span>กรมอุตุนิยมวิทยา (TMD Earthquake)</span>
              </li>
              <li className="flex items-center gap-1">
                <span>กรมทรัพยากรธรณี (DMR Fault Maps)</span>
              </li>
              <li className="flex items-center gap-1">
                <span>GCMT & ISC Seismological Catalogs</span>
              </li>
            </ul>
          </div>

          {/* Col 3: AI Engine Metrics */}
          <div className="space-y-2">
            <h4 className="text-slate-200 font-semibold font-mono uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              สเปกโมเดลปัญญาประดิษฐ์
            </h4>
            <ul className="space-y-1 font-mono text-[11px] text-slate-400">
              <li className="flex justify-between">
                <span>Inference Latency:</span>
                <span className="text-emerald-400 font-semibold">320 ms</span>
              </li>
              <li className="flex justify-between">
                <span>F1-Score:</span>
                <span className="text-emerald-400 font-semibold">98.4%</span>
              </li>
              <li className="flex justify-between">
                <span>P-Wave Detection Window:</span>
                <span className="text-cyan-400 font-semibold">3.0 sec</span>
              </li>
              <li className="flex justify-between">
                <span>False Alarm Rate:</span>
                <span className="text-emerald-400 font-semibold">&lt; 0.8%</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <div>
            © {new Date().getFullYear()} SeismoGuard AI. สงวนลิขสิทธิ์สำหรับการแข่งขันและเผยแพร่นวัตกรรมด้านเทคโนโลยี วช.
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>National Research Council of Thailand (NRCT) Edition</span>
            <span>v1.0.0-PROD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
