import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Sparkles,
  Send,
  Bot,
  User,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Copy,
  Check,
  Phone,
  Compass,
  HeartHandshake,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  MapPin,
  Waves,
  Activity,
  Flame,
  Wind,
  Sun,
  Navigation,
  FileText,
  Volume2
} from 'lucide-react';
import { toast } from 'sonner';
import {
  DisasterTelemetry,
  TyphoonDisasterReport,
  TyphoonChatMessage,
  generateTyphoonDisasterReport,
  askTyphoonDisasterChat,
  calculateDisasterThreatScore
} from '@/services/typhoonDisasterService';
import { DisasterType } from './DisasterMap';
import { TyphoonMarkdownRenderer } from '@/components/chat/TyphoonMarkdownRenderer';

interface TyphoonDisasterModalProps {
  isOpen: boolean;
  onClose: () => void;
  telemetry: DisasterTelemetry;
  initialQuestion?: string;
  onOpenEvacuation?: () => void;
  onOpenSafetyCheckIn?: () => void;
  onOpenCrowdsource?: () => void;
}

export const TyphoonDisasterModal: React.FC<TyphoonDisasterModalProps> = ({
  isOpen,
  onClose,
  telemetry,
  initialQuestion,
  onOpenEvacuation,
  onOpenSafetyCheckIn,
  onOpenCrowdsource
}) => {
  const [activeTab, setActiveTab] = useState<'report' | 'chat'>('report');
  const [report, setReport] = useState<TyphoonDisasterReport | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Chat state
  const [chatMessages, setChatMessages] = useState<TyphoonChatMessage[]>([
    {
      id: 'welcome',
      sender: 'typhoon',
      text: `สวัสดีครับ! ผมคือ **Typhoon AI Disaster Intelligence** (โมเดล **typhoon-v2.5-30b-a3b-instruct**) ประจำระบบ D-MIND 🌐\n\nผมได้เชื่อมต่อโครงข่ายเซ็นเซอร์และดาวเทียมสำหรับภัยพิบัติที่กำลังตรวจวัด พร้อมตอบคำถาม ประเมินความเสี่ยงเชิงลึก และแนะนำขั้นตอนความปลอดภัยให้คุณตลอด 24 ชม. ครับ\n\n*สามารถเลือกคำถามด่วนด้านล่าง หรือพิมพ์คำถามที่ต้องการทราบได้เลยครับ!*`,
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-generate report when opened or disaster changes
  useEffect(() => {
    if (isOpen) {
      loadReport();
      if (initialQuestion) {
        setActiveTab('chat');
        handleSendMessage(initialQuestion);
      }
    }
  }, [isOpen, telemetry.disasterType, telemetry.selectedLocationName]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatLoading]);

  const loadReport = async () => {
    setIsGeneratingReport(true);
    try {
      const generated = await generateTyphoonDisasterReport(telemetry);
      setReport(generated);
    } catch (err) {
      console.error('Failed to generate Typhoon report:', err);
      toast.error('ไม่สามารถดึงข้อมูลรายงานได้');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleCopyReport = () => {
    if (!report) return;
    navigator.clipboard.writeText(report.rawMarkdownReport);
    setIsCopied(true);
    toast.success('คัดลอกรายงานสรุป Typhoon AI เรียบร้อยแล้ว');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSendMessage = async (msgText?: string) => {
    const textToSend = msgText || inputMessage;
    if (!textToSend.trim() || isChatLoading) return;

    const userMsg: TyphoonChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsChatLoading(true);

    try {
      const responseText = await askTyphoonDisasterChat(textToSend, telemetry, chatMessages);
      const aiMsg: TyphoonChatMessage = {
        id: `typhoon-${Date.now()}`,
        sender: 'typhoon',
        text: responseText,
        timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      toast.error('เกิดข้อผิดพลาดในการเชื่อมต่อ Typhoon AI');
    } finally {
      setIsChatLoading(false);
    }
  };

  const quickChips = getQuickChips(telemetry.disasterType);

  const threatColor =
    report?.threatLevel === 'critical'
      ? 'bg-red-500/15 text-red-400 border-red-500/40'
      : report?.threatLevel === 'warning'
      ? 'bg-orange-500/15 text-orange-400 border-orange-500/40'
      : report?.threatLevel === 'advisory'
      ? 'bg-amber-500/15 text-amber-400 border-amber-500/40'
      : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40';

  const threatScoreBadgeColor =
    report && report.threatScore >= 80
      ? 'from-red-600 to-rose-700'
      : report && report.threatScore >= 60
      ? 'from-orange-500 to-amber-600'
      : report && report.threatScore >= 40
      ? 'from-amber-500 to-yellow-600'
      : 'from-emerald-500 to-teal-600';

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[92vh] w-[95vw] sm:w-[90vw] p-0 overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 flex flex-col shadow-2xl">
        {/* Header with High-Tech Styling */}
        <DialogHeader className="p-4 sm:p-5 bg-gradient-to-r from-slate-50 via-sky-50/50 to-indigo-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative p-2.5 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-900/30 ring-1 ring-cyan-400/50 flex-shrink-0">
                <Sparkles className="w-5 h-5 animate-pulse" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <DialogTitle className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Typhoon AI Disaster Intelligence</span>
                  </DialogTitle>
                  <Badge variant="outline" className="text-[10px] bg-cyan-100 dark:bg-cyan-950/80 border-cyan-300 dark:border-cyan-700 text-cyan-800 dark:text-cyan-300 font-mono py-0 px-1.5 font-bold">
                    typhoon-v2.5-30b
                  </Badge>
                </div>
                <DialogDescription className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">
                  ระบบวิเคราะห์และพยากรณ์ความเสี่ยงภัยพิบัติอัจฉริยะแบบเรียลไทม์
                </DialogDescription>
              </div>
            </div>

            {/* Live Threat Badge */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              {report && (
                <div className="flex items-center gap-2">
                  <div className={`px-2.5 py-1 rounded-xl border text-xs font-bold flex items-center gap-1.5 ${threatColor}`}>
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>{report.threatLevelTh}</span>
                  </div>
                  <div className={`px-2.5 py-1 rounded-xl bg-gradient-to-r ${threatScoreBadgeColor} text-white text-xs font-black shadow-md`}>
                    Score: {report.threatScore}/100
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Context Strip */}
          <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <span className="text-blue-600 dark:text-cyan-400 font-bold">📍 บริบท:</span>
              <span className="font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800/90 px-2 py-0.5 rounded border border-slate-300 dark:border-slate-700">
                {report?.disasterTypeNameTh || telemetry.disasterType}
              </span>
              {telemetry.selectedLocationName && (
                <span className="text-slate-600 dark:text-slate-400">
                  (พิกัดเป้าหมาย: <span className="text-blue-700 dark:text-cyan-300 font-semibold">{telemetry.selectedLocationName}</span>)
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                onClick={loadReport}
                disabled={isGeneratingReport}
                className="h-7 text-[11px] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 gap-1 rounded-lg font-medium"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isGeneratingReport ? 'animate-spin' : ''}`} />
                <span>อัปเดตข้อมูล</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyReport}
                disabled={!report}
                className="h-7 text-[11px] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 gap-1 rounded-lg font-medium"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'คัดลอกแล้ว' : 'คัดลอกรายงาน'}</span>
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="flex-1 flex flex-col overflow-hidden">
          <div className="px-4 pt-2 pb-1 bg-slate-50/80 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
            <TabsList className="bg-slate-200/80 dark:bg-slate-800/80 p-0.5 rounded-xl border border-slate-300/80 dark:border-slate-700/60">
              <TabsTrigger
                value="report"
                className="text-xs text-slate-700 dark:text-slate-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-600 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-lg px-4 py-1.5 font-bold transition-all shadow-xs"
              >
                <FileText className="w-3.5 h-3.5 mr-1.5" />
                รายงานสถานการณ์สด (AI Report)
              </TabsTrigger>
              <TabsTrigger
                value="chat"
                className="text-xs text-slate-700 dark:text-slate-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-600 data-[state=active]:to-blue-600 data-[state=active]:text-white rounded-lg px-4 py-1.5 font-bold transition-all shadow-xs"
              >
                <Bot className="w-3.5 h-3.5 mr-1.5" />
                ถาม-ตอบ Typhoon AI (Live Q&A)
              </TabsTrigger>
            </TabsList>
          </div>

          {/* TAB 1: Situation Report */}
          <TabsContent value="report" className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 m-0 focus-visible:outline-none">
            {isGeneratingReport ? (
              <div className="py-16 flex flex-col items-center justify-center space-y-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border-4 border-cyan-500/30 border-t-cyan-400 animate-spin" />
                  <Sparkles className="w-5 h-5 text-cyan-400 absolute inset-0 m-auto animate-pulse" />
                </div>
                <p className="text-sm font-semibold text-slate-300">
                  Typhoon AI กำลังประมวลผลข้อมูลเซ็นเซอร์และดาวเทียมเรียลไทม์...
                </p>
                <p className="text-xs text-slate-500">
                  ตรวจสอบแบบจำลองสภาพอากาศ TMD, USGS, VIIRS และภาพถ่าย Sentinel-1
                </p>
              </div>
            ) : report ? (
              <>
                {/* 3 Live Telemetry Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
                    <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                      ระดับการประเมินภัย
                    </span>
                    <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-1">
                      {report.threatLevelTh.split('(')[0].trim()}
                    </span>
                    <span className="text-[10px] text-blue-600 dark:text-cyan-400 font-bold mt-1">
                      ดัชนีความเสี่ยงรวม {report.threatScore}/100
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
                    <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      พื้นที่เฝ้าระวังหลัก
                    </span>
                    <span className="text-sm font-bold text-amber-800 dark:text-amber-200 mt-1 truncate">
                      {report.highRiskZonesTh[0] || 'ตามแนวรอยต่อเซ็นเซอร์'}
                    </span>
                    <span className="text-[10px] text-slate-600 dark:text-slate-500 font-medium mt-1">
                      ครอบคลุม {report.highRiskZonesTh.length} โซนเสี่ยง
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
                    <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      สถานะระบบเฝ้าระวัง
                    </span>
                    <span className="text-base sm:text-lg font-black text-emerald-700 dark:text-emerald-300 mt-1">
                      Online 24 ชม.
                    </span>
                    <span className="text-[10px] text-slate-600 dark:text-slate-500 font-medium mt-1">
                      อัปเดตล่าสุด: {report.timestamp} น.
                    </span>
                  </div>
                </div>

                {/* Markdown Situation Report Output */}
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/90 shadow-xs">
                  <div className="mb-3 pb-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <h3 className="text-sm font-extrabold text-blue-900 dark:text-cyan-300 flex items-center gap-2">
                      <Bot className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                      <span>บทวิเคราะห์สถานการณ์อย่างเป็นทางการ (Official SitRep)</span>
                    </h3>
                    <Badge variant="outline" className="text-[10px] text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700 font-medium">
                      Auto-Synthesized
                    </Badge>
                  </div>
                  <TyphoonMarkdownRenderer content={report.rawMarkdownReport} />
                </div>

                {/* DO's & DON'Ts Interactive Checklist */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 space-y-2">
                    <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>สิ่งที่ควรทำทันที (Actionable Do's)</span>
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-800 dark:text-slate-300 font-medium">
                      {report.actionChecklistTh.dos.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/40 space-y-2">
                    <h4 className="text-xs font-bold text-red-800 dark:text-red-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <span>สิ่งที่ห้ามทำเด็ดขาด (Critical Don'ts)</span>
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-800 dark:text-slate-300 font-medium">
                      {report.actionChecklistTh.donts.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-red-600 dark:text-red-400 font-bold flex-shrink-0">✕</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Emergency Hotlines Strip */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-300 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-red-500" />
                      <span>สายด่วนช่วยเหลือฉุกเฉินสำหรับเหตุการณ์นี้</span>
                    </h4>
                    <span className="text-[10px] text-slate-500 font-medium">แตะเพื่อโทรออกทันที</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {report.hotlinesTh.map((hl, idx) => (
                      <a
                        key={idx}
                        href={`tel:${hl.number}`}
                        className="p-2 rounded-lg bg-white dark:bg-slate-900 hover:bg-red-50 dark:hover:bg-red-950/40 border border-slate-200 dark:border-slate-800 hover:border-red-200 dark:hover:border-red-700/60 transition group flex flex-col justify-between shadow-2xs"
                      >
                        <span className="text-[10.5px] font-semibold text-slate-800 dark:text-slate-300 truncate block">
                          {hl.name}
                        </span>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs font-black text-red-600 dark:text-red-400 font-mono group-hover:underline">
                            {hl.number}
                          </span>
                          <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-red-500" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  {onOpenSafetyCheckIn && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={onOpenSafetyCheckIn}
                      className="border-amber-400 dark:border-amber-600/50 hover:bg-amber-50 dark:hover:bg-amber-950/30 text-amber-800 dark:text-amber-300 text-xs rounded-xl h-9 gap-1.5 font-bold"
                    >
                      <HeartHandshake className="w-4 h-4" />
                      <span>Safety Check-in</span>
                    </Button>
                  )}
                  {onOpenEvacuation && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={onOpenEvacuation}
                      className="border-blue-400 dark:border-cyan-600/50 hover:bg-blue-50 dark:hover:bg-cyan-950/30 text-blue-800 dark:text-cyan-300 text-xs rounded-xl h-9 gap-1.5 font-bold"
                    >
                      <Compass className="w-4 h-4" />
                      <span>เส้นทางอพยพ</span>
                    </Button>
                  )}
                  {onOpenCrowdsource && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={onOpenCrowdsource}
                      className="border-indigo-400 dark:border-indigo-600/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 text-indigo-800 dark:text-indigo-300 text-xs rounded-xl h-9 gap-1.5 font-bold"
                    >
                      <span>📢 รายงานสดประชาชน</span>
                    </Button>
                  )}
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setActiveTab('chat')}
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl h-9 gap-1.5 shadow-md shadow-cyan-900/20"
                  >
                    <Bot className="w-4 h-4" />
                    <span>ถามคำถาม Typhoon AI ต่อ</span>
                  </Button>
                </div>
              </>
            ) : null}
          </TabsContent>

          {/* TAB 2: Live Interactive Chat */}
          <TabsContent value="chat" className="flex-1 flex flex-col min-h-0 m-0 focus-visible:outline-none">
            {/* Quick Prompt Chips */}
            <div className="p-2 sm:p-2.5 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 overflow-x-auto flex items-center gap-1.5 no-scrollbar">
              <span className="text-[10px] text-slate-600 dark:text-slate-400 font-bold uppercase tracking-wider flex-shrink-0 px-1">
                คำถามแนะนำ:
              </span>
              {quickChips.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(chip.prompt)}
                  disabled={isChatLoading}
                  className="text-[11px] bg-white dark:bg-slate-800/90 hover:bg-blue-50 dark:hover:bg-cyan-900/50 hover:border-blue-300 dark:hover:border-cyan-600 border border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 hover:text-blue-700 dark:hover:text-white px-2.5 py-1 rounded-full whitespace-nowrap transition flex items-center gap-1.5 flex-shrink-0 font-medium shadow-2xs"
                >
                  <span>{chip.icon}</span>
                  <span>{chip.label}</span>
                </button>
              ))}
            </div>

            {/* Chat Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50 dark:bg-slate-900/60">
              {chatMessages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 max-w-[90%] sm:max-w-[80%] ${
                    msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-xs ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 shadow-md'
                        : 'bg-gradient-to-tr from-cyan-600 to-indigo-600 shadow-md shadow-cyan-950/40 ring-1 ring-cyan-400/40'
                    }`}
                  >
                    {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div
                    className={`p-3 sm:p-3.5 rounded-2xl text-xs sm:text-sm shadow-xs ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-white dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none space-y-1.5'
                    }`}
                  >
                    {msg.sender === 'typhoon' ? (
                      <TyphoonMarkdownRenderer content={msg.text} />
                    ) : (
                      <p className="whitespace-pre-wrap leading-relaxed font-medium">{msg.text}</p>
                    )}
                    <span className={`text-[9px] block text-right mt-1 ${msg.sender === 'user' ? 'text-blue-100' : 'text-slate-500'}`}>
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {isChatLoading && (
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-xs p-2 font-medium">
                  <div className="w-5 h-5 rounded-full border-2 border-blue-500 dark:border-cyan-400 border-t-transparent animate-spin" />
                  <span>Typhoon AI กำลังวิเคราะห์ข้อมูลและเรียบเรียงคำตอบ...</span>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Chat Input Bar */}
            <div className="p-3 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex-shrink-0">
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <Input
                  value={inputMessage}
                  onChange={e => setInputMessage(e.target.value)}
                  placeholder="พิมพ์ถาม Typhoon AI เกี่ยวกับความเสี่ยง พื้นที่ เส้นทาง หรือความช่วยเหลือ..."
                  disabled={isChatLoading}
                  className="flex-1 bg-slate-50 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 rounded-xl h-10 text-xs sm:text-sm focus-visible:ring-blue-500 dark:focus-visible:ring-cyan-500 font-medium"
                />
                <Button
                  type="submit"
                  disabled={!inputMessage.trim() || isChatLoading}
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl h-10 px-4 flex-shrink-0 shadow-md shadow-cyan-950/30"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

function getQuickChips(disasterType: DisasterType) {
  switch (disasterType) {
    case 'earthquake':
      return [
        { icon: '⚠️', label: 'แนวโน้ม Aftershock 24 ชม.', prompt: 'มีโอกาสเกิด Aftershock ในบริเวณนี้อีกหรือไม่ และควรเฝ้าระวังถึงเมื่อไหร่?' },
        { icon: '🏢', label: 'การตรวจสอบอาคารสูง', prompt: 'หากพักอาศัยบนอาคารสูงหรือคอนโด มีจุดสังเกตรอยร้าวอันตรายอย่างไรบ้าง?' },
        { icon: '🏃‍♂️', label: 'แผนอพยพกรณีแผ่นดินไหว', prompt: 'แนะนำขั้นตอนการอพยพและจุดรวมพลที่ปลอดภัยหลังแผ่นดินไหวสงบ' }
      ];
    case 'airpollution':
      return [
        { icon: '😷', label: 'คำแนะนำสวมหน้ากาก', prompt: 'ค่า PM2.5 ระดับนี้ หน้ากากอนามัยธรรมดาป้องกันได้ไหม หรือจำเป็นต้องใช้ N95?' },
        { icon: '🏃', label: 'ออกกำลังกายกลางแจ้งได้ไหม?', prompt: 'สามารถวิ่งหรือออกกำลังกายกลางแจ้งช่วงเช้าหรือเย็นได้หรือไม่?' },
        { icon: '🏥', label: 'ค้นหาห้องปลอดฝุ่น (Clean Room)', prompt: 'แนะนำหลักเกณฑ์การจัดทำห้องปลอดฝุ่นและจุดพักในพื้นที่' }
      ];
    case 'flood':
    case 'bkk_road_flood':
      return [
        { icon: '🚗', label: 'รถเก๋งผ่านจุดไหนได้บ้าง?', prompt: 'ถนนสายใดที่มีน้ำท่วมขังเกิน 20 ซม. และรถเก๋งขนาดเล็กห้ามผ่านเด็ดขาด?' },
        { icon: '⚡', label: 'ระวังไฟฟ้ารั่วในน้ำท่วม', prompt: 'วิธีตรวจสอบและป้องกันไฟดูด/ไฟฟ้ารั่วเมื่อระดับน้ำเริ่มเอ่อเข้าตัวบ้าน' },
        { icon: '🌊', label: 'แนวโน้มน้ำหนุน 48 ชม.', prompt: 'ประเมินสถานการณ์น้ำทะเลหนุนและการระบายน้ำผ่านแม่น้ำเจ้าพระยา' }
      ];
    case 'wildfire':
      return [
        { icon: '🔥', label: 'รัศมีความเสี่ยงควันไฟ', prompt: 'กระแสลมกำลังพัดพาหมอกควันไปทางทิศใด และชุมชนใดเสี่ยงสูงสุด?' },
        { icon: '🛡️', label: 'การทำแนวกันไฟ', prompt: 'วิธีจัดทำแนวกันไฟรอบแปลงเกษตรและที่พักอาศัยที่ถูกต้อง' }
      ];
    case 'storm':
    case 'heavyrain':
    case 'openmeteorain':
      return [
        { icon: '🌀', label: 'พายุจะขึ้นฝั่งเวลาไหน?', prompt: 'พายุลูกนี้มีทิศทางการเคลื่อนตัวอย่างไร และคาดว่าจะขึ้นฝั่งเวลาไหน?' },
        { icon: '🌧️', label: 'พื้นที่เสี่ยงน้ำป่าไหลหลาก', prompt: 'พื้นที่เชิงเขาและลุ่มน้ำใดต้องเฝ้าระวังน้ำป่าไหลหลากและดินถล่ม?' }
      ];
    default:
      return [
        { icon: '📊', label: 'สรุปภาพรวมความเสี่ยง', prompt: 'สรุปสถานการณ์ความเสี่ยงและแนวโน้มใน 24-48 ชั่วโมงข้างหน้า' },
        { icon: '📞', label: 'เบอร์ติดต่อขอความช่วยเหลือ', prompt: 'ขอเบอร์โทรสายด่วนกู้ภัยและหน่วยงานบรรเทาสาธารณภัยที่เกี่ยวข้อง' }
      ];
  }
}
