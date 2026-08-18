import React from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarGroup, 
  SidebarGroupLabel, 
  SidebarGroupContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from '@/components/ui/sidebar';
import { 
  Activity, 
  CloudRain, 
  Flame, 
  Wind, 
  Sun, 
  Waves, 
  Navigation,
  Mountain,
  FlameKindling,
  Map, 
  PhoneCall,
  ExternalLink,
  ShieldCheck,
  CloudDrizzle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const menuItems = [
  {
    title: 'แผ่นดินไหว',
    icon: Activity,
    source: 'USGS / EMSC',
    description: 'แผ่นดินไหวทั่วโลกแบบเรียลไทม์'
  },
  {
    title: 'พายุหมุนเขตร้อน',
    icon: Navigation,
    source: 'NASA / GDACS',
    description: 'พายุโซนร้อน ไต้ฝุ่น เฮอริเคน'
  },
  {
    title: 'เรดาร์ฝน',
    icon: CloudRain,
    source: 'RainViewer',
    description: 'ภาพเรดาร์ตรวจฝน & ดาวเทียม IR'
  },
  {
    title: 'พยากรณ์สภาพอากาศ',
    icon: CloudDrizzle,
    source: 'Open-Meteo',
    description: 'พยากรณ์ฝน อุณหภูมิ ลม 35+ จุด'
  },
  {
    title: 'ไฟป่า & จุดความร้อน',
    icon: Flame,
    source: 'NASA / VIIRS',
    description: 'จุดความร้อนจากดาวเทียม & ความเสี่ยง'
  },
  {
    title: 'มลพิษอากาศ PM2.5',
    icon: Wind,
    source: 'Open-Meteo Air',
    description: 'PM2.5, PM10, AQI รายจังหวัด'
  },
  {
    title: 'น้ำท่วม & ลุ่มน้ำ',
    icon: Waves,
    source: 'GloFAS / GDACS',
    description: 'อัตราการไหลของน้ำ & พื้นที่เสี่ยง'
  },
  {
    title: 'ภัยแล้ง & ดินแห้ง',
    icon: Sun,
    source: 'Soil Moisture API',
    description: 'ความชื้นในดินและดัชนีภัยแล้ง'
  },
  {
    title: 'ภูเขาไฟ & สึนามิ',
    icon: FlameKindling,
    source: 'NASA EONET',
    description: 'การปะทุของภูเขาไฟทั่วโลก'
  },
  {
    title: 'แผ่นดินยุบ / ดินทรุด',
    icon: Mountain,
    source: 'Geo Incidents',
    description: 'รายงานเหตุการณ์แผ่นดินยุบ'
  }
];

const hotlines = [
  { name: 'สายด่วน ปภ. (เตือนภัยพิบัติ)', tel: '1784' },
  { name: 'ศูนย์เตือนภัยพิบัติแห่งชาติ', tel: '192' },
  { name: 'หน่วยแพทย์กู้ชีพฉุกเฉิน', tel: '1669' },
  { name: 'ดับเพลิงและกู้ภัย', tel: '199' },
  { name: 'กรมอุตุนิยมวิทยา', tel: '1182' },
  { name: 'ตำรวจทางหลวง', tel: '1193' }
];

export function DisasterMapSidebar() {
  return (
    <Sidebar className="border-r border-gray-200 bg-white">
      <SidebarHeader className="border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2.5 px-4 pt-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md">
            <Map className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900 text-sm leading-tight">แผนที่ภัยพิบัติสากล</h2>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <p className="text-[10px] text-emerald-700 font-semibold">Multi-Source Free APIs</p>
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 space-y-4">
        {/* Disaster Categories */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-bold text-gray-500 uppercase tracking-wider px-2">
            ประเภทข้อมูลภัยพิบัติ
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton className="flex items-center justify-between py-2 px-2.5 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition">
                    <div className="flex items-center gap-2.5 truncate">
                      <item.icon className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span className="text-xs font-medium truncate">{item.title}</span>
                    </div>
                    <Badge variant="outline" className="text-[9px] py-0 px-1 text-gray-400 border-gray-200">
                      {item.source}
                    </Badge>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Emergency Hotlines */}
        <SidebarGroup className="pt-2 border-t border-gray-100">
          <SidebarGroupLabel className="text-xs font-bold text-gray-500 uppercase tracking-wider px-2 flex items-center gap-1">
            <PhoneCall className="w-3.5 h-3.5 text-red-500" />
            เบอร์โทรฉุกเฉิน 24 ชม.
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="grid grid-cols-1 gap-1 px-1">
              {hotlines.map((hl) => (
                <a
                  key={hl.tel}
                  href={`tel:${hl.tel}`}
                  className="flex items-center justify-between p-1.5 rounded-md hover:bg-red-50 text-gray-700 hover:text-red-700 text-xs transition border border-transparent hover:border-red-100"
                >
                  <span className="text-[11px] truncate pr-1">{hl.name}</span>
                  <span className="font-bold text-red-600 font-mono text-xs bg-red-50 px-1.5 py-0.5 rounded">
                    {hl.tel}
                  </span>
                </a>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Open API Assurance badge */}
        <div className="p-2.5 mx-2 bg-emerald-50 rounded-lg border border-emerald-200 text-[11px] text-emerald-800 space-y-1">
          <div className="flex items-center gap-1 font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Open Data Standard</span>
          </div>
          <p className="text-[10px] text-emerald-700 leading-relaxed">
            เชื่อมต่อข้อมูลตรงจาก USGS, NASA EONET, Open-Meteo, RainViewer, และ GDACS แบบไม่เสียค่าบริการ
          </p>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}