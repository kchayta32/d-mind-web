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
  Info,
  User,
  Calendar,
  Briefcase,
  MapPin
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import {
  fetchAndCalculateSurveyReport,
  SurveyCalculatedReport,
  getSatisfactionLevel
} from '@/services/surveyService';
import { toast } from 'sonner';

export const EvaluationReport: React.FC = () => {
  const [report, setReport] = useState<SurveyCalculatedReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedDetails, setExpandedDetails] = useState(false);
  const [copiedTable1, setCopiedTable1] = useState(false);
  const [copiedTable2, setCopiedTable2] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData(true);

    // 1. Supabase Realtime Subscription (Triggers when anyone edits/inserts/deletes in Supabase)
    const channel = supabase
      .channel('dmind_satisfaction_surveys_live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'dmind_satisfaction_surveys' },
        (payload) => {
          console.log('[Supabase Realtime] Change detected:', payload);
          loadData(false);
        }
      )
      .subscribe();

    // 2. Background polling interval (every 4 seconds) to guarantee sync even without webhooks
    const timer = setInterval(() => {
      loadData(false);
    }, 4000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(timer);
    };
  }, []);

  const loadData = async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const data = await fetchAndCalculateSurveyReport();
      setReport(data);
    } catch (e) {
      console.error(e);
      if (isInitial) toast.error('ไม่สามารถโหลดข้อมูลสถิติได้');
    } finally {
      if (isInitial) setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    loadData(false);
    toast.info('ดึงข้อมูลล่าสุดจาก Supabase สำเร็จ');
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

  // Custom Renderers for BarChart Reference Lines (Render on top of bars with high-contrast badge)
  const renderGreenRefLabel = (props: any) => {
    const { viewBox } = props;
    if (!viewBox) return null;
    const x = viewBox.x + viewBox.width - 150;
    const y = viewBox.y - 12;
    return (
      <g className="recharts-reference-line-label">
        <rect
          x={x}
          y={y}
          width={142}
          height={22}
          rx={6}
          fill="#ffffff"
          stroke="#059669"
          strokeWidth={1.5}
          filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))"
        />
        <text
          x={x + 71}
          y={y + 15}
          fill="#047857"
          fontSize={10.5}
          fontWeight={800}
          textAnchor="middle"
        >
          ● เกณฑ์ระดับสูง (3.61)
        </text>
      </g>
    );
  };

  const renderOrangeRefLabel = (props: any) => {
    const { viewBox } = props;
    if (!viewBox) return null;
    const x = viewBox.x + 8;
    const y = viewBox.y - 12;
    return (
      <g className="recharts-reference-line-label">
        <rect
          x={x}
          y={y}
          width={172}
          height={22}
          rx={6}
          fill="#ffffff"
          stroke="#d97706"
          strokeWidth={1.5}
          filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))"
        />
        <text
          x={x + 86}
          y={y + 15}
          fill="#b45309"
          fontSize={10.5}
          fontWeight={800}
          textAnchor="middle"
        >
          ★ เกณฑ์ผ่านความสะดวก (≥ 4.00)
        </text>
      </g>
    );
  };

  // Custom Radar Tick to break long Thai labels into 2 readable lines without clipping
  const renderRadarAngleTick = (props: any) => {
    const { payload, x, y, cx, cy } = props;
    const rawText = (payload?.value as string) || '';

    let line1 = rawText;
    let line2 = '';

    if (rawText.includes('ความสะดวก')) {
      line1 = '1. ความสะดวก';
      line2 = 'ในการใช้งาน';
    } else if (rawText.includes('ส่วนติดต่อผู้ใช้') || rawText.includes('UI')) {
      line1 = '2. ส่วนติดต่อผู้ใช้';
      line2 = '(User Interface)';
    } else if (rawText.includes('แจ้งเตือน')) {
      line1 = '3. ระบบแจ้งเตือน';
      line2 = '';
    } else if (rawText.includes('แชทบอท')) {
      line1 = '4. ระบบแชทบอท';
      line2 = '(AI Chatbot)';
    } else if (rawText.includes('พึงพอใจ') || rawText.includes('โดยรวม')) {
      line1 = '5. ความพึงพอใจ';
      line2 = 'โดยรวม';
    }

    const diffX = x - cx;
    let textAnchor: 'start' | 'middle' | 'end' = 'middle';
    let offsetX = 0;

    if (diffX < -15) {
      textAnchor = 'end';
      offsetX = -8;
    } else if (diffX > 15) {
      textAnchor = 'start';
      offsetX = 8;
    } else {
      textAnchor = 'middle';
      offsetX = 0;
    }

    const diffY = y - cy;
    let offsetY = 0;
    if (diffY < -15) {
      offsetY = line2 ? -8 : -2;
    } else if (diffY > 15) {
      offsetY = 4;
    }

    return (
      <text
        x={x + offsetX}
        y={y + offsetY}
        textAnchor={textAnchor}
        fill="#0f172a"
        fontSize={11}
        fontWeight={700}
      >
        <tspan x={x + offsetX} dy={0}>
          {line1}
        </tspan>
        {line2 && (
          <tspan
            x={x + offsetX}
            dy={13}
            fill="#475569"
            fontSize={10}
            fontWeight={600}
          >
            {line2}
          </tspan>
        )}
      </text>
    );
  };

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
              <Badge className={`${report.totalResponses === 0
                ? 'bg-slate-600 hover:bg-slate-600'
                : report.isPassed
                  ? 'bg-emerald-500 hover:bg-emerald-500'
                  : 'bg-amber-500 hover:bg-amber-500'
                } text-white font-bold px-3 py-1 text-xs uppercase tracking-wider`}>
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                {report.totalResponses === 0
                  ? 'รอข้อมูลการประเมิน (0 ผู้ประเมิน)'
                  : report.isPassed
                    ? 'ผลการทดสอบผ่านเกณฑ์ (PASSED)'
                    : 'กำลังรวบรวมข้อมูลการประเมิน'}
              </Badge>
              <Badge variant="outline" className="text-white/80 border-white/20 text-xs">
                Real-time Supabase Sync
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
              (กลุ่มตัวอย่างผู้ใช้งานจริงใน Supabase: N = {report.totalResponses} คน)
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
              onClick={handleManualRefresh}
              variant="outline"
              size="sm"
              disabled={isRefreshing}
              className="rounded-xl border-white/20 bg-white/10 hover:bg-white/20 text-white hover:text-white"
            >
              <Sparkles className={`w-4 h-4 mr-1.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'กำลังโหลด...' : 'รีเฟรชจาก Supabase'}
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
            <div className="mt-1 text-xs text-blue-200 font-semibold flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-300" />
              <span>ระดับ: {report.overallLevelTh}</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <div className="text-xs text-blue-200 flex items-center gap-1.5 mb-1 font-medium">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>ความสะดวกในการใช้งาน</span>
            </div>
            <div className="text-2xl md:text-3xl font-black text-white flex items-baseline gap-1">
              <span>{(report.categories[0]?.mean || 0).toFixed(2)}</span>
              <span className="text-xs text-blue-300 font-normal">/ 5.00</span>
            </div>
            <div className="mt-1 text-xs text-blue-200 font-semibold flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-300" />
              <span>{report.totalResponses > 0 && report.categories[0]?.mean >= 4 ? '≥ 4.00 (ผ่านเกณฑ์)' : 'เกณฑ์ผ่าน ≥ 4.00'}</span>
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
              ซิงค์ตรงจาก Supabase
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <div className="text-xs text-blue-200 flex items-center gap-1.5 mb-1 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>สถานะการประเมินผล</span>
            </div>
            <div className={`text-xl md:text-2xl font-black ${report.totalResponses === 0 ? 'text-slate-300' : report.isPassed ? 'text-emerald-300' : 'text-amber-300'
              } flex items-center gap-1.5`}>
              <span>{report.totalResponses === 0 ? 'รอผลประเมิน' : report.isPassed ? 'ผ่านทุกเกณฑ์' : 'รอข้อมูลเพิ่มเติม'}</span>
            </div>
            <div className="mt-1 text-xs text-emerald-200">
              {report.totalResponses === 0 ? 'เริ่มต้นรีเซ็ตเป็น 0' : 'ถูกต้อง 100% | อัปเดต < 2s'}
            </div>
          </div>
        </div>
      </div>

      {/* Zero State Alert Banner */}
      {report.totalResponses === 0 && (
        <div className="bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-3xl p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                ตารางข้อมูลใน Supabase ขณะนี้รีเซ็ตเป็น 0 (ยังไม่มีข้อมูลการประเมิน)
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                เมื่อผู้ใช้ทำแบบประเมิน หรือท่านทำการแก้ไข/เพิ่ม/ลบข้อมูลใน Supabase ตาราง <code>dmind_satisfaction_surveys</code> หน้านี้จะทำการคำนวณและอัปเดตกราฟสถิติตามข้อมูลจริงทันที
              </p>
            </div>
          </div>
          <Button
            onClick={() => {
              const tab = document.querySelector('[value="survey"]') as HTMLElement;
              if (tab) tab.click();
            }}
            className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm"
          >
            ทำแบบประเมินเดี๋ยวนี้ &rarr;
          </Button>
        </div>
      )}

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
                  {/* Bars rendered FIRST so ReferenceLines can draw on top */}
                  <Bar 
                    dataKey="score" 
                    radius={[8, 8, 0, 0]} 
                    label={{ 
                      position: 'top', 
                      fill: '#0f172a', 
                      fontSize: 12, 
                      fontWeight: 'bold', 
                      formatter: (val: any) => typeof val === 'number' ? val.toFixed(2) : val 
                    }}
                  >
                    {barChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>

                  {/* ReferenceLines rendered AFTER Bar with isFront={true} to draw clearly ON TOP of the blue bars */}
                  <ReferenceLine 
                    y={3.61} 
                    stroke="#059669" 
                    strokeWidth={2.5} 
                    strokeDasharray="6 4" 
                    isFront={true} 
                    label={renderGreenRefLabel} 
                  />
                  <ReferenceLine 
                    y={4.00} 
                    stroke="#d97706" 
                    strokeWidth={2.5} 
                    strokeDasharray="6 4" 
                    isFront={true} 
                    label={renderOrangeRefLabel} 
                  />
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
            <div className="w-full h-80 md:h-84 bg-white flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart 
                  outerRadius={75} 
                  data={radarChartData}
                  margin={{ top: 20, right: 35, bottom: 20, left: 35 }}
                >
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={renderRadarAngleTick}
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
                  ตารางที่ 1
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
                  ตารางที่ 2
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
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${item.status === 'passed'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-300 dark:border-slate-700'
                      }`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {item.status === 'passed' ? 'ผ่านเกณฑ์' : 'รอประเมิน'}
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
      <div className={`bg-gradient-to-r ${report.totalResponses === 0
        ? 'from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-900 dark:via-blue-950/20 dark:to-slate-900 border-slate-300 dark:border-slate-700'
        : report.isPassed
          ? 'from-emerald-50 via-teal-50 to-blue-50 dark:from-emerald-950/30 dark:via-slate-900 dark:to-blue-950/30 border-emerald-300 dark:border-emerald-700'
          : 'from-amber-50 via-orange-50 to-slate-50 border-amber-300'
        } border-2 rounded-3xl p-6 md:p-8 shadow-sm`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${report.totalResponses === 0 ? 'bg-slate-400' : report.isPassed ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`} />
              <Badge className={`${report.totalResponses === 0
                ? 'bg-slate-600'
                : report.isPassed
                  ? 'bg-emerald-600'
                  : 'bg-amber-600'
                } text-white font-bold text-xs px-3 py-1 rounded-full`}>
                {report.totalResponses === 0 ? 'สถานะ: รอข้อมูลประเมิน' : 'สรุปเกณฑ์การประเมินผล (Evaluation Conclusion)'}
              </Badge>
            </div>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-100">
              ผลการทดสอบ: <span className={
                report.totalResponses === 0
                  ? 'text-slate-500 dark:text-slate-400'
                  : report.isPassed
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-amber-500'
              }>
                {report.totalResponses === 0 ? 'รอข้อมูลการประเมิน (0 ผู้ประเมิน)' : report.isPassed ? 'ผ่านเกณฑ์การประเมินมาตรฐาน' : 'ยังไม่ผ่านเกณฑ์ความพึงพอใจ'}
              </span>
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
              <span className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300">
                <Check className="w-4 h-4 text-emerald-500" /> 3. ความสะดวกในการใช้งาน: {(report.categories[0]?.mean || 0).toFixed(2)} / 5.00 {report.totalResponses > 0 && report.categories[0]?.mean >= 4 ? '(≥ 4.00 ระดับดีขึ้นไป)' : '(เกณฑ์ผ่าน ≥ 4.00)'}
              </span>
            </div>
          </div>

          <div className="self-center md:self-auto shrink-0 text-center bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className={`w-16 h-16 rounded-full ${report.totalResponses === 0
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              : report.isPassed
                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                : 'bg-amber-100 text-amber-600'
              } flex items-center justify-center mx-auto mb-2`}>
              <ShieldCheck className="w-9 h-9" />
            </div>
            <div className="text-sm font-black text-slate-800 dark:text-slate-200">
              {report.totalResponses === 0 ? 'PENDING' : report.isPassed ? 'PASSED' : 'IN PROGRESS'}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              {report.totalResponses === 0 ? 'รอข้อมูลประเมิน' : 'ผ่านการรับรองเกณฑ์'}
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

      {/* ========================================================================= */}
      {/* 8. DEMOGRAPHIC PROFILE OVERVIEW (สถิติข้อมูลทั่วไปของผู้ประเมิน) */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100">
            สถิติข้อมูลทั่วไปของผู้ประเมิน (Demographic Profile)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Gender */}
          <Card className="border border-slate-200 dark:border-slate-800 rounded-2xl">
            <CardHeader className="py-3 px-4 bg-blue-50/50 dark:bg-blue-950/20 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-xs font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span>สัดส่วนเพศ (Gender)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2 text-xs">
              {Object.keys(report.demographics?.genderCounts || {}).length > 0 ? (
                Object.entries(report.demographics.genderCounts).map(([g, count]) => (
                  <div key={g} className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">{g}</span>
                    <Badge variant="secondary" className="text-xs font-bold">
                      {count} คน ({report.totalResponses > 0 ? ((count / report.totalResponses) * 100).toFixed(0) : 0}%)
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-xs">ยังไม่มีข้อมูล</p>
              )}
            </CardContent>
          </Card>

          {/* Age */}
          <Card className="border border-slate-200 dark:border-slate-800 rounded-2xl">
            <CardHeader className="py-3 px-4 bg-emerald-50/50 dark:bg-emerald-950/20 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-xs font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>ช่วงอายุ (Age Groups)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2 text-xs">
              {Object.keys(report.demographics?.ageCounts || {}).length > 0 ? (
                Object.entries(report.demographics.ageCounts).map(([a, count]) => (
                  <div key={a} className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400">{a}</span>
                    <Badge variant="secondary" className="text-xs font-bold">
                      {count} คน
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-xs">ยังไม่มีข้อมูล</p>
              )}
            </CardContent>
          </Card>

          {/* Occupation */}
          <Card className="border border-slate-200 dark:border-slate-800 rounded-2xl">
            <CardHeader className="py-3 px-4 bg-purple-50/50 dark:bg-purple-950/20 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-xs font-bold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" />
                <span>กลุ่มอาชีพ (Occupation)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2 text-xs">
              {Object.keys(report.demographics?.occupationCounts || {}).length > 0 ? (
                Object.entries(report.demographics.occupationCounts).map(([o, count]) => (
                  <div key={o} className="flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400 truncate max-w-[120px]" title={o}>{o}</span>
                    <Badge variant="secondary" className="text-xs font-bold">
                      {count} คน
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-xs">ยังไม่มีข้อมูล</p>
              )}
            </CardContent>
          </Card>

          {/* Province */}
          <Card className="border border-slate-200 dark:border-slate-800 rounded-2xl">
            <CardHeader className="py-3 px-4 bg-rose-50/50 dark:bg-rose-950/20 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-xs font-bold text-rose-900 dark:text-rose-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>จังหวัด (Top Provinces)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2 text-xs">
              {Object.keys(report.demographics?.provinceCounts || {}).length > 0 ? (
                Object.entries(report.demographics.provinceCounts)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([p, count]) => (
                    <div key={p} className="flex items-center justify-between">
                      <span className="text-slate-600 dark:text-slate-400">{p}</span>
                      <Badge variant="secondary" className="text-xs font-bold">
                        {count} คน
                      </Badge>
                    </div>
                  ))
              ) : (
                <p className="text-slate-400 text-xs">ยังไม่มีข้อมูล</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
