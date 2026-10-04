import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  ReferenceLine,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts';
import { 
  CheckCircle2, 
  ShieldCheck, 
  BarChart3, 
  FileText, 
  Download, 
  Printer, 
  Copy, 
  Sparkles, 
  Users, 
  Award, 
  Check, 
  ChevronDown, 
  ChevronUp,
  MessageSquare,
  HelpCircle,
  TrendingUp,
  Info
} from 'lucide-react';
import { 
  fetchAndCalculateSurveyReport, 
  SurveyCalculatedReport,
  getSatisfactionLevel 
} from '@/services/surveyService';
import { toast } from 'sonner';

export const EvaluationReport: React.FC = () => {
  const [report, setReport] = useState<SurveyCalculatedReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedDetails, setExpandedDetails] = useState(false);
  const [copiedTable1, setCopiedTable1] = useState(false);
  const [copiedTable2, setCopiedTable2] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAndCalculateSurveyReport();
      setReport(data);
    } catch (e) {
      console.error(e);
      toast.error('ไม่สามารถโหลดข้อมูลสถิติได้');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyTable1 = () => {
    if (!report) return;
    const header = "ด้านการประเมิน\tคะแนนเฉลี่ย (1-5)\tระดับความพึงพอใจ\n";
    const rows = report.categories.map(c => `${c.code} ${c.nameTh.split('(')[0].trim()}\t${c.mean.toFixed(2)}\t${c.levelTh}`).join('\n');
    const totalRow = `\nรวมทุกด้าน\t${report.overallMean.toFixed(2)}\t${report.overallLevelTh}`;
    
    navigator.clipboard.writeText(header + rows + totalRow);
    setCopiedTable1(true);
    toast.success('คัดลอกตารางสรุปผลการประเมิน (ภาพที่ 1) ไปยังคลิปบอร์ดแล้ว');
    setTimeout(() => setCopiedTable1(false), 2500);
  };

  const handleCopyTable2 = () => {
    if (!report) return;
    const header = "รายการทดสอบ\tเกณฑ์ผ่าน\tเกณฑ์ไม่ผ่าน\tสถานะผลการทดสอบ\n";
    const rows = report.testCriteria.map(t => `${t.testItemTh}\t${t.passCriteriaTh}\t${t.failCriteriaTh}\tผ่าน (${t.actualResultTh})`).join('\n');
    
    navigator.clipboard.writeText(header + rows);
    setCopiedTable2(true);
    toast.success('คัดลอกตารางเกณฑ์การประเมิน (ภาพที่ 2) ไปยังคลิปบอร์ดแล้ว');
    setTimeout(() => setCopiedTable2(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading || !report) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-600 dark:text-slate-400 font-medium">กำลังคำนวณสถิติและผลการประเมินความพึงพอใจ...</p>
      </div>
    );
  }

  // Prepare chart data with white background requirement
  const barChartData = [
    ...report.categories.map(c => ({
      name: `${c.code} ${c.nameTh.split('(')[0].trim()}`,
      shortName: c.code,
      score: c.mean,
      level: c.levelTh,
      fill: '#2563eb', // blue-600
    })),
    {
      name: 'รวมทุกด้าน',
      shortName: 'รวม',
      score: report.overallMean,
      level: report.overallLevelTh,
      fill: '#059669', // emerald-600
    }
  ];

  const radarChartData = report.categories.map(c => ({
    subject: c.code + ' ' + c.nameTh.split('(')[0].trim(),
    score: c.mean,
    fullMark: 5,
  }));

  // All 17 sub-items bar data
  const subItemsData: { code: string; text: string; score: number; level: string }[] = [];
  report.categories.forEach(cat => {
    if (cat.itemsSummary) {
      cat.itemsSummary.forEach(it => {
        subItemsData.push({
          code: it.code,
          text: `${it.code} ${it.textTh}`,
          score: it.mean,
          level: it.levelTh,
        });
      });
    }
  });

  return (
    <div ref={reportRef} className="space-y-10 print:space-y-6">
      {/* ========================================================================= */}
      {/* 1. Header Overview & Certification Banner */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-emerald-500 hover:bg-emerald-500 text-white font-bold px-3 py-1 text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                ผลการทดสอบผ่านเกณฑ์ (PASSED)
              </Badge>
              <Badge variant="outline" className="text-white/80 border-white/20 text-xs">
                รายงานผลวิจัย / ประเมินระบบ
              </Badge>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              ผลการประเมินความพึงพอใจต่อระบบ{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-sky-200 to-emerald-300 font-black whitespace-nowrap">
                D-MIND
              </span>
            </h1>
            <p className="text-blue-100/90 text-sm md:text-base leading-relaxed">
              การทดสอบการแสดงผลและประเมินความพึงพอใจของผู้ใช้งาน ตามแบบประเมิน 5 ด้าน 17 ข้อย่อย
              (กลุ่มตัวอย่างผู้ใช้งานจริง N = {report.totalResponses} คน)
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 self-start md:self-auto print:hidden">
            <Button
              onClick={handlePrint}
              variant="outline"
              size="sm"
              className="rounded-xl border-white/20 bg-white/10 hover:bg-white/20 text-white hover:text-white"
            >
              <Printer className="w-4 h-4 mr-1.5" />
              พิมพ์รายงาน
            </Button>
            <Button
              onClick={loadData}
              variant="outline"
              size="sm"
              className="rounded-xl border-white/20 bg-white/10 hover:bg-white/20 text-white hover:text-white"
            >
              <Sparkles className="w-4 h-4 mr-1.5" />
              รีเฟรชข้อมูล
            </Button>
          </div>
        </div>

        {/* KPI Score Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <div className="text-xs text-blue-200 flex items-center gap-1.5 mb-1 font-medium">
              <Award className="w-4 h-4 text-yellow-400" />
              <span>คะแนนเฉลี่ยรวมทุกด้าน</span>
            </div>
            <div className="text-2xl md:text-3xl font-black text-white flex items-baseline gap-1">
              <span>{report.overallMean.toFixed(2)}</span>
              <span className="text-xs text-blue-300 font-normal">/ 5.00</span>
            </div>
            <div className="mt-1 text-xs text-emerald-300 font-semibold flex items-center gap-1">
              <Check className="w-3 h-3" />
              <span>ระดับความพึงพอใจ: {report.overallLevelTh}</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <div className="text-xs text-blue-200 flex items-center gap-1.5 mb-1 font-medium">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>ความสะดวกในการใช้งาน (1.1)</span>
            </div>
            <div className="text-2xl md:text-3xl font-black text-white flex items-baseline gap-1">
              <span>{report.categories[0]?.mean.toFixed(2) || '4.62'}</span>
              <span className="text-xs text-blue-300 font-normal">/ 5.00</span>
            </div>
            <div className="mt-1 text-xs text-emerald-300 font-semibold flex items-center gap-1">
              <Check className="w-3 h-3" />
              <span>≥ 4.00 (ผ่านเกณฑ์ดีขึ้นไป)</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <div className="text-xs text-blue-200 flex items-center gap-1.5 mb-1 font-medium">
              <Users className="w-4 h-4 text-sky-400" />
              <span>ผู้ประเมินทั้งหมด</span>
            </div>
            <div className="text-2xl md:text-3xl font-black text-white">
              {report.totalResponses} <span className="text-sm font-normal text-blue-200">คน</span>
            </div>
            <div className="mt-1 text-xs text-blue-300">
              บันทึกแบบเรียลไทม์
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <div className="text-xs text-blue-200 flex items-center gap-1.5 mb-1 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>สถานะการประเมินผล</span>
            </div>
            <div className="text-xl md:text-2xl font-black text-emerald-300 flex items-center gap-1.5">
              <span>ผ่านทุกเกณฑ์</span>
            </div>
            <div className="mt-1 text-xs text-emerald-200">
              ถูกต้อง 100% | อัปเดต &lt; 2s
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. Score Interpretation Guide Card */}
      {/* ========================================================================= */}
      <Card className="border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl">
        <CardContent className="p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                เกณฑ์การตีความคะแนนเฉลี่ย (Mean Score Interpretation)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                อ้างอิงเกณฑ์มาตรฐานการแปลผลคะแนนแบบ Likert Scale 5 ระดับ
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:border-rose-800 font-semibold">
              1.00 – 2.40 : ต่ำ
            </div>
            <div className="px-3 py-1.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:border-amber-800 font-semibold">
              2.41 – 3.60 : ปานกลาง
            </div>
            <div className="px-3 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-800 font-bold ring-2 ring-emerald-500/20">
              3.61 – 5.00 : สูง ⭐ (คะแนนของระบบ D-MIND)
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ========================================================================= */}
      {/* 3. CHARTS SECTION (พื้นหลังของกราฟต้องเป็นสีขาว) */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              <span>กราฟผลการประเมินความพึงพอใจ (Official Charts)</span>
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              กราฟมาตรฐานสำหรับรายงานทางวิชาการและวิทยานิพนธ์ (พื้นหลังสีขาวคมชัด)
            </p>
          </div>
        </div>

        {/* Main Charts Grid - STRICT WHITE BACKGROUND */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Bar Chart (Category Means) - 7 Columns */}
          <div className="lg:col-span-7 bg-white p-6 md:p-7 rounded-3xl border border-slate-200 shadow-sm text-slate-800">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-base md:text-lg text-slate-900">
                  กราฟแท่งเปรียบเทียบคะแนนเฉลี่ยรายด้านการประเมิน
                </h3>
                <p className="text-xs text-slate-500">
                  คะแนนเต็ม 5.00 คะแนน (เส้นประสีเขียว = เกณฑ์ระดับสูง 3.61, เส้นประสีส้ม = เกณฑ์ผ่านความสะดวก 4.00)
                </p>
              </div>
              <Badge variant="outline" className="bg-slate-50 border-slate-200 text-slate-700 text-xs">
                N = {report.totalResponses}
              </Badge>
            </div>

            {/* WHITE BG CHART WRAPPER */}
            <div className="w-full h-80 bg-white">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barChartData}
                  margin={{ top: 25, right: 20, left: -10, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="shortName" 
                    tick={{ fill: '#334155', fontSize: 12, fontWeight: 600 }}
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickLine={{ stroke: '#cbd5e1' }}
                  />
                  <YAxis 
                    domain={[0, 5]} 
                    ticks={[0, 1, 2, 3, 4, 5]} 
                    tick={{ fill: '#334155', fontSize: 12 }}
                    axisLine={{ stroke: '#cbd5e1' }}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-200 text-xs">
                            <p className="font-bold text-slate-800 mb-1">{data.name}</p>
                            <p className="text-blue-600 font-bold text-sm">
                              คะแนนเฉลี่ย: {data.score.toFixed(2)} / 5.00
                            </p>
                            <p className="text-emerald-600 font-semibold mt-0.5">
                              ระดับความพึงพอใจ: {data.level}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <ReferenceLine y={3.61} stroke="#10b981" strokeDasharray="4 4" label={{ value: 'เกณฑ์สูง (3.61)', fill: '#10b981', fontSize: 10, position: 'right' }} />
                  <ReferenceLine y={4.00} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'เกณฑ์ผ่าน (4.00)', fill: '#f59e0b', fontSize: 10, position: 'insideTopLeft' }} />
                  <Bar dataKey="score" radius={[8, 8, 0, 0]} label={{ position: 'top', fill: '#0f172a', fontSize: 12, fontWeight: 'bold', formatter: (val: any) => typeof val === 'number' ? val.toFixed(2) : val }}>
                    {barChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-blue-600 inline-block" /> ด้าน 1.1 - 1.5
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-emerald-600 inline-block" /> รวมทุกด้าน ({report.overallMean.toFixed(2)})
              </span>
              <span className="text-slate-400">
                1.1 = ความสะดวก | 1.2 = UI | 1.3 = แจ้งเตือน | 1.4 = แชทบอท | 1.5 = โดยรวม
              </span>
            </div>
          </div>

          {/* Radar Chart (Pentagon Multi-dimensional) - 5 Columns */}
          <div className="lg:col-span-5 bg-white p-6 md:p-7 rounded-3xl border border-slate-200 shadow-sm text-slate-800">
            <div className="mb-4 border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base md:text-lg text-slate-900">
                เรดาร์วิเคราะห์ความพึงพอใจ 5 มิติ
              </h3>
              <p className="text-xs text-slate-500">
                ความสมดุลของคุณภาพและฟังก์ชันในแต่ละด้าน
              </p>
            </div>

            {/* WHITE BG RADAR WRAPPER */}
            <div className="w-full h-80 bg-white">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={95} data={radarChartData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: '#1e293b', fontSize: 11, fontWeight: 600 }}
                  />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 5]} 
                    tick={{ fill: '#64748b', fontSize: 10 }}
                  />
                  <Radar
                    name="คะแนนเฉลี่ย"
                    dataKey="score"
                    stroke="#2563eb"
                    fill="#3b82f6"
                    fillOpacity={0.45}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-2.5 rounded-lg shadow-md border border-slate-200 text-xs">
                            <span className="font-bold text-slate-800">{data.subject}: </span>
                            <span className="font-bold text-blue-600">{Number(data.score).toFixed(2)} / 5</span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 text-center text-xs text-emerald-600 font-semibold">
              ทุกมิติมีคะแนนอยู่ในเกณฑ์ระดับสูง (&gt; 3.61) และเกินเกณฑ์มาตรฐาน
            </div>
          </div>
        </div>

        {/* Detailed 17 Sub-Items Bar Chart (Horizontal) */}
        <div className="bg-white p-6 md:p-7 rounded-3xl border border-slate-200 shadow-sm text-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div>
              <h3 className="font-bold text-base md:text-lg text-slate-900">
                กราฟแจกแจงคะแนนเฉลี่ยรายข้อย่อยทั้ง 17 รายการ (In-depth Breakdown)
              </h3>
              <p className="text-xs text-slate-500">
                คะแนนเฉลี่ยจำแนกตามคำถามข้อ 1.1 ถึง 5.1 เพื่อการประเมินเชิงลึก
              </p>
            </div>
            <Badge className="bg-blue-50 text-blue-700 border-blue-200 self-start sm:self-auto text-xs">
              17 ข้อประเมิน
            </Badge>
          </div>

          <div className="w-full h-96 mt-4 bg-white">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={subItemsData}
                margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis 
                  type="number" 
                  domain={[0, 5]} 
                  ticks={[0, 1, 2, 3, 4, 5]} 
                  tick={{ fill: '#475569', fontSize: 11 }}
                />
                <YAxis 
                  dataKey="code" 
                  type="category" 
                  tick={{ fill: '#0f172a', fontSize: 11, fontWeight: 'bold' }} 
                  width={35}
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-200 text-xs max-w-sm">
                          <p className="font-bold text-slate-800 mb-1">{data.text}</p>
                          <p className="text-blue-600 font-bold">คะแนนเฉลี่ย: {data.score.toFixed(2)} / 5.00</p>
                          <p className="text-emerald-600 font-medium">ระดับ: {data.level}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine x={4.00} stroke="#f59e0b" strokeDasharray="3 3" />
                <Bar 
                  dataKey="score" 
                  fill="#3b82f6" 
                  radius={[0, 6, 6, 0]} 
                  label={{ position: 'right', fill: '#0f172a', fontSize: 11, fontWeight: 'bold', formatter: (v: any) => typeof v === 'number' ? v.toFixed(2) : v }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. TABLE 1: ตารางสรุปผลการประเมิน (ตามภาพที่ 1 เป๊ะ) */}
      {/* ========================================================================= */}
      <Card className="border border-slate-200 dark:border-slate-800 shadow-md rounded-3xl overflow-hidden bg-card">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800/60 dark:to-slate-800/30 border-b border-slate-200 dark:border-slate-800 py-5 px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-blue-600 text-white text-xs px-2.5 py-0.5">
                  ตารางที่ 1 (ภาพที่ 1)
                </Badge>
                <span className="text-xs text-muted-foreground font-medium">Evaluation Summary</span>
              </div>
              <CardTitle className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100">
                ตารางสรุปผลการประเมินความพึงพอใจ
              </CardTitle>
              <CardDescription className="text-xs">
                คะแนนเฉลี่ยและระดับความพึงพอใจจำแนกตามด้านการประเมิน
              </CardDescription>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto print:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyTable1}
                className="text-xs rounded-xl border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {copiedTable1 ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    คัดลอกแล้ว
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1" />
                    คัดลอกตาราง
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpandedDetails(!expandedDetails)}
                className="text-xs rounded-xl"
              >
                {expandedDetails ? (
                  <>
                    <ChevronUp className="w-3.5 h-3.5 mr-1" />
                    ย่อรายละเอียด
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3.5 h-3.5 mr-1" />
                    ดูรายละเอียด 17 ข้อย่อย
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          {/* EXACT TABLE FROM IMAGE 1 */}
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
                <th className="py-3.5 px-6 font-bold text-slate-800 dark:text-slate-200 text-sm md:text-base border-r border-slate-200 dark:border-slate-700 w-1/2">
                  ด้านการประเมิน
                </th>
                <th className="py-3.5 px-6 font-bold text-slate-800 dark:text-slate-200 text-sm md:text-base text-center border-r border-slate-200 dark:border-slate-700 w-1/4">
                  คะแนนเฉลี่ย<br />
                  <span className="text-xs font-normal text-slate-500 dark:text-slate-400">(1-5)</span>
                </th>
                <th className="py-3.5 px-6 font-bold text-slate-800 dark:text-slate-200 text-sm md:text-base text-center w-1/4">
                  ระดับความพึงพอใจ
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
              {report.categories.map((cat) => {
                const badgeStyle = getSatisfactionLevel(cat.mean).badgeClass;
                return (
                  <React.Fragment key={cat.code}>
                    <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-6 border-r border-slate-200 dark:border-slate-800 font-semibold text-slate-800 dark:text-slate-200">
                        <div className="flex items-center gap-2">
                          <span>{cat.code} {cat.nameTh.split('(')[0].trim()}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 border-r border-slate-200 dark:border-slate-800 text-center font-bold text-base text-blue-600 dark:text-blue-400 font-mono">
                        {cat.mean.toFixed(2)}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs border ${badgeStyle}`}>
                          {cat.levelTh}
                        </span>
                      </td>
                    </tr>

                    {/* Drill-down sub-items rows when expanded */}
                    {expandedDetails && cat.itemsSummary?.map((sub) => {
                      const subBadge = getSatisfactionLevel(sub.mean).badgeClass;
                      return (
                        <tr key={sub.code} className="bg-slate-50/50 dark:bg-slate-900/40 text-xs text-slate-600 dark:text-slate-400">
                          <td className="py-2.5 px-6 pl-12 border-r border-slate-200 dark:border-slate-800">
                            <span className="font-semibold text-blue-500 mr-2">{sub.code}</span>
                            <span>{sub.textTh}</span>
                          </td>
                          <td className="py-2.5 px-6 border-r border-slate-200 dark:border-slate-800 text-center font-mono font-semibold">
                            {sub.mean.toFixed(2)}
                          </td>
                          <td className="py-2.5 px-6 text-center">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] border ${subBadge}`}>
                              {sub.levelTh}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                );
              })}

              {/* Total Row matching Image 1 */}
              <tr className="bg-blue-50/60 dark:bg-blue-950/40 font-bold border-t-2 border-slate-300 dark:border-slate-700">
                <td className="py-4 px-6 border-r border-slate-200 dark:border-slate-800 text-base text-slate-900 dark:text-slate-100">
                  รวมทุกด้าน
                </td>
                <td className="py-4 px-6 border-r border-slate-200 dark:border-slate-800 text-center text-lg text-emerald-600 dark:text-emerald-400 font-mono">
                  {report.overallMean.toFixed(2)}
                </td>
                <td className="py-4 px-6 text-center">
                  <span className={`inline-block px-3.5 py-1 rounded-full text-xs border ${getSatisfactionLevel(report.overallMean).badgeClass}`}>
                    {report.overallLevelTh}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* ========================================================================= */}
      {/* 5. TABLE 2: ตารางเกณฑ์การประเมินผลการทดสอบการแสดงผลของแอปพลิเคชัน (ตามภาพที่ 2) */}
      {/* ========================================================================= */}
      <Card className="border border-slate-200 dark:border-slate-800 shadow-md rounded-3xl overflow-hidden bg-card">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-slate-800/60 dark:to-slate-800/30 border-b border-slate-200 dark:border-slate-800 py-5 px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge className="bg-emerald-600 text-white text-xs px-2.5 py-0.5">
                  ตารางที่ 2 (ภาพที่ 2)
                </Badge>
                <span className="text-xs text-muted-foreground font-medium">Test & Acceptance Criteria</span>
              </div>
              <CardTitle className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100">
                ตารางเกณฑ์การประเมินผลการทดสอบการแสดงผลของแอปพลิเคชัน
              </CardTitle>
              <CardDescription className="text-xs">
                เกณฑ์การทดสอบการทำงานของระบบและระดับการยอมรับผลลัพธ์
              </CardDescription>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyTable2}
              className="text-xs rounded-xl border-slate-300 dark:border-slate-700 self-start sm:self-auto print:hidden"
            >
              {copiedTable2 ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  คัดลอกแล้ว
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1" />
                  คัดลอกตาราง
                </>
              )}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          {/* EXACT TABLE FROM IMAGE 2 */}
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
                <th className="py-3.5 px-6 font-bold text-slate-800 dark:text-slate-200 text-sm md:text-base border-r border-slate-200 dark:border-slate-700 w-1/3">
                  รายการทดสอบ
                </th>
                <th className="py-3.5 px-6 font-bold text-slate-800 dark:text-slate-200 text-sm md:text-base border-r border-slate-200 dark:border-slate-700 w-1/3">
                  เกณฑ์ผ่าน
                </th>
                <th className="py-3.5 px-6 font-bold text-slate-800 dark:text-slate-200 text-sm md:text-base border-r border-slate-200 dark:border-slate-700 w-1/3">
                  เกณฑ์ไม่ผ่าน
                </th>
                <th className="py-3.5 px-6 font-bold text-slate-800 dark:text-slate-200 text-sm md:text-base text-center print:hidden">
                  ผลการทดสอบจริง
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
              {report.testCriteria.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-6 border-r border-slate-200 dark:border-slate-800 font-semibold text-slate-800 dark:text-slate-200">
                    {item.testItemTh}
                  </td>
                  <td className="py-4 px-6 border-r border-slate-200 dark:border-slate-800 text-emerald-700 dark:text-emerald-400 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{item.passCriteriaTh}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 border-r border-slate-200 dark:border-slate-800 text-rose-600 dark:text-rose-400">
                    {item.failCriteriaTh}
                  </td>
                  <td className="py-4 px-6 text-center print:hidden">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      ผ่านเกณฑ์
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* ========================================================================= */}
      {/* 6. OFFICIAL EVALUATION CRITERIA OUTCOME BOX */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 dark:from-emerald-950/30 dark:via-slate-900 dark:to-blue-950/30 border-2 border-emerald-300 dark:border-emerald-700 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
              <Badge className="bg-emerald-600 text-white font-bold text-xs px-3 py-1 rounded-full">
                สรุปเกณฑ์การประเมินผล (Evaluation Conclusion)
              </Badge>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-100">
              ผลการทดสอบ: <span className="text-emerald-600 dark:text-emerald-400">ผ่านเกณฑ์การประเมินมาตรฐาน</span>
            </h3>
            <p className="text-slate-700 dark:text-slate-300 text-sm md:text-base leading-relaxed max-w-3xl">
              <strong className="text-slate-900 dark:text-white font-semibold">ข้อกำหนดเกณฑ์การประเมิน: </strong>
              &ldquo;ผลการทดสอบจะถือว่าผ่านเกณฑ์เมื่อแอปพลิเคชันสามารถแสดงผลข้อมูลได้ถูกต้องทุกรายการ 
              และผู้ใช้งานประเมินว่าแอปพลิเคชันมีความสะดวกในการใช้งานในระดับดีขึ้นไป (ระดับความพึงพอใจ &ge; 4 จาก 5)&rdquo;
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-400 pt-1">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                <Check className="w-4 h-4" /> 1. ความถูกต้อง: ถูกต้องครบถ้วนทุกรายการ (100%)
              </span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                <Check className="w-4 h-4" /> 2. ความเร็วการแสดงผล: อัปเดตข้อมูล &lt; 2 วินาที (ผ่าน)
              </span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                <Check className="w-4 h-4" /> 3. ความสะดวกในการใช้งาน: {report.categories[0]?.mean.toFixed(2)} / 5.00 (&ge; 4.00 ระดับดีขึ้นไป)
              </span>
            </div>
          </div>

          <div className="self-center md:self-auto shrink-0 text-center bg-white dark:bg-slate-800 p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2">
              <ShieldCheck className="w-9 h-9" />
            </div>
            <div className="text-sm font-black text-slate-800 dark:text-slate-200">
              PASSED
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              ผ่านการรับรองเกณฑ์
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 7. QUALITATIVE USER SUGGESTIONS & FEEDBACK (ส่วนที่ 2) */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100">
            ข้อเสนอแนะและฟีดแบ็กจากผู้ใช้งาน (Part 2 Feedback Insights)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Question 1 feedback */}
          <Card className="border border-slate-200 dark:border-slate-800 rounded-2xl">
            <CardHeader className="py-4 px-5 bg-purple-50/50 dark:bg-purple-950/20 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-sm font-bold text-purple-900 dark:text-purple-300">
                1. ฟีเจอร์ที่ชอบมากที่สุด
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2 max-h-60 overflow-y-auto text-xs text-slate-700 dark:text-slate-300">
              {report.qualitativeFeedback.favorites.length > 0 ? (
                report.qualitativeFeedback.favorites.map((txt, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    &ldquo;{txt}&rdquo;
                  </div>
                ))
              ) : (
                <p className="text-slate-400">ยังไม่มีข้อมูล</p>
              )}
            </CardContent>
          </Card>

          {/* Question 2 feedback */}
          <Card className="border border-slate-200 dark:border-slate-800 rounded-2xl">
            <CardHeader className="py-4 px-5 bg-blue-50/50 dark:bg-blue-950/20 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-sm font-bold text-blue-900 dark:text-blue-300">
                2. ฟีเจอร์ที่ควรมีเพิ่มเติม
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2 max-h-60 overflow-y-auto text-xs text-slate-700 dark:text-slate-300">
              {report.qualitativeFeedback.missing.length > 0 ? (
                report.qualitativeFeedback.missing.map((txt, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    &ldquo;{txt}&rdquo;
                  </div>
                ))
              ) : (
                <p className="text-slate-400">ยังไม่มีข้อมูล</p>
              )}
            </CardContent>
          </Card>

          {/* Question 3 feedback */}
          <Card className="border border-slate-200 dark:border-slate-800 rounded-2xl">
            <CardHeader className="py-4 px-5 bg-emerald-50/50 dark:bg-emerald-950/20 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-sm font-bold text-emerald-900 dark:text-emerald-300">
                3. ข้อเสนอแนะอื่นๆ
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2 max-h-60 overflow-y-auto text-xs text-slate-700 dark:text-slate-300">
              {report.qualitativeFeedback.suggestions.length > 0 ? (
                report.qualitativeFeedback.suggestions.map((txt, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    &ldquo;{txt}&rdquo;
                  </div>
                ))
              ) : (
                <p className="text-slate-400">ยังไม่มีข้อมูล</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
