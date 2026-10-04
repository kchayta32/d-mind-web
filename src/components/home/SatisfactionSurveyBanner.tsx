import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  BarChart3, 
  CheckCircle2, 
  ArrowRight, 
  Award,
  Clock,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageProvider';
import { supabase } from '@/integrations/supabase/client';
import { fetchAndCalculateSurveyReport, SurveyCalculatedReport } from '@/services/surveyService';

export const SatisfactionSurveyBanner: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isEn = language === 'en';
  const [report, setReport] = useState<SurveyCalculatedReport | null>(null);

  const loadData = async () => {
    try {
      const data = await fetchAndCalculateSurveyReport();
      setReport(data);
    } catch (err) {
      console.error('Failed to load survey report for banner:', err);
    }
  };

  useEffect(() => {
    loadData();

    // 1. Realtime Supabase Channel
    const channel = supabase
      .channel('dmind_survey_banner_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'dmind_satisfaction_surveys' },
        () => {
          loadData();
        }
      )
      .subscribe();

    // 2. Fallback polling every 4 seconds to guarantee sync
    const interval = setInterval(loadData, 4000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, []);

  const totalResponses = report?.totalResponses || 0;
  const categories = report?.categories || [];

  const usabilityCat = categories.find(c => c.categoryKey === 'usability');
  const uiCat = categories.find(c => c.categoryKey === 'ui');
  const alertCat = categories.find(c => c.categoryKey === 'alert');
  const chatbotCat = categories.find(c => c.categoryKey === 'chatbot');
  const overallCat = categories.find(c => c.categoryKey === 'overall');

  const usabilityScore = usabilityCat?.mean || 0;
  const uiScore = uiCat?.mean || 0;
  const alertScore = alertCat?.mean || 0;
  const chatbotScore = chatbotCat?.mean || 0;
  const overallSingleScore = overallCat?.mean || 0;
  const totalMean = report?.overallMean || 0;

  const isPassed = totalResponses > 0 && usabilityScore >= 4.0;

  const getLevelBadgeClass = (score: number) => {
    if (totalResponses === 0 || score <= 0) {
      return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
    if (score >= 3.61) {
      return 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30';
    }
    if (score >= 2.41) {
      return 'bg-amber-500/20 text-amber-300 border-amber-400/30';
    }
    return 'bg-rose-500/20 text-rose-300 border-rose-400/30';
  };

  return (
    <section className="py-8 md:py-12 bg-gradient-to-b from-background via-slate-50/50 to-background dark:via-slate-900/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white relative">
            {/* Background Glows */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

            <CardContent className="p-6 md:p-10 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left Column: Info & Action */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {totalResponses === 0 ? (
                      <Badge className="bg-slate-700 hover:bg-slate-700 text-slate-200 font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-sm border border-slate-600">
                        <Clock className="w-3.5 h-3.5 text-blue-400" />
                        {isEn ? 'WAITING FOR DATA (0 RESPONSES)' : 'รอข้อมูลการประเมิน (0 คน)'}
                      </Badge>
                    ) : isPassed ? (
                      <Badge className="bg-emerald-500 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {isEn ? 'PASSED CRITERIA' : 'ผ่านเกณฑ์การประเมินมาตรฐาน'}
                      </Badge>
                    ) : (
                      <Badge className="bg-amber-500 hover:bg-amber-500 text-white font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        <Clock className="w-3.5 h-3.5" />
                        {isEn ? `EVALUATION IN PROGRESS (N=${totalResponses})` : `กำลังรวบรวมผลการประเมิน (N=${totalResponses})`}
                      </Badge>
                    )}

                    <Badge variant="outline" className="border-white/20 text-blue-200 text-xs flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-cyan-300" />
                      <span>Realtime Supabase Sync</span>
                    </Badge>
                  </div>

                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
                    {isEn ? (
                      <>User Satisfaction Evaluation <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-sky-200 to-emerald-300">&amp; Test Report</span></>
                    ) : (
                      <>แบบประเมินความพึงพอใจ <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-sky-200 to-emerald-300">&amp; รายงานผลการทดสอบระบบ D-MIND</span></>
                    )}
                  </h2>

                  <p className="text-blue-100/80 text-sm md:text-base leading-relaxed">
                    {isEn ? (
                      'Evaluate the D-MIND application across 5 categories and 17 indicators. View academic charts on white backgrounds and formal evaluation summary tables.'
                    ) : (
                      'ร่วมประเมินประสบการณ์การใช้งานระบบ D-MIND ทั้ง 5 ด้าน 17 ข้อย่อย พร้อมตรวจสอบรายงานสถิติผลการประเมิน กราฟวิชาการพื้นหลังสีขาว และตารางสรุปผลการทดสอบตามเกณฑ์มาตรฐาน'
                    )}
                  </p>

                  {/* Highlights Pills */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 text-xs">
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 border border-white/10">
                      <div className="text-blue-300 font-medium">ระดับคะแนน</div>
                      <div className="font-bold text-white mt-0.5">1 - 5 ระดับ</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 border border-white/10">
                      <div className="text-emerald-300 font-medium">คะแนนเฉลี่ยรวม</div>
                      <div className="font-bold text-white mt-0.5">
                        {totalResponses > 0 ? `${totalMean.toFixed(2)} (${report?.overallLevelTh})` : '0.00 (รอประเมิน)'}
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 border border-white/10 col-span-2 sm:col-span-1">
                      <div className="text-yellow-300 font-medium">เกณฑ์ผ่าน</div>
                      <div className="font-bold text-white mt-0.5">
                        {totalResponses > 0 ? (isPassed ? 'ผ่านเกณฑ์ (≥ 4.00)' : 'ต่ำกว่าเกณฑ์ (< 4.00)') : 'ความสะดวก ≥ 4.00'}
                      </div>
                    </div>
                  </div>

                  {/* Call to Actions */}
                  <div className="flex flex-wrap items-center gap-3 pt-3">
                    <Button
                      onClick={() => navigate('/satisfaction-survey?tab=survey')}
                      size="lg"
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold rounded-2xl px-6 shadow-lg shadow-blue-500/25 transition-all hover:scale-105"
                    >
                      <Star className="w-4 h-4 mr-2 fill-yellow-300 text-yellow-300" />
                      {isEn ? 'Take Satisfaction Survey' : 'ทำแบบประเมินความพึงพอใจ'}
                    </Button>
                    <Button
                      onClick={() => navigate('/satisfaction-survey?tab=results')}
                      variant="outline"
                      size="lg"
                      className="border-white/20 bg-white/10 hover:bg-white/20 text-white hover:text-white font-semibold rounded-2xl px-5 transition-all"
                    >
                      <BarChart3 className="w-4 h-4 mr-2 text-emerald-400" />
                      {isEn ? 'View Evaluation Charts' : 'ดูผลการประเมิน & กราฟ'}
                      <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  </div>
                </div>

                {/* Right Column: Visual Summary Preview Card */}
                <div className="lg:col-span-5">
                  <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-3xl p-6 shadow-2xl relative">
                    <div className="flex items-center justify-between pb-4 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                          <Award className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">ตารางสรุปผลการประเมิน (ภาพที่ 1)</h4>
                          <span className="text-[11px] text-blue-200">
                            {totalResponses > 0 ? `อัปเดตจาก Supabase (N = ${totalResponses} คน)` : 'เกณฑ์การตีความ Likert Scale'}
                          </span>
                        </div>
                      </div>
                      <Badge className={`text-[10px] ${
                        totalResponses === 0 
                          ? 'bg-slate-500/30 text-slate-300 border-slate-400/30' 
                          : isPassed 
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30' 
                            : 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                      }`}>
                        {totalResponses === 0 ? 'รอข้อมูล' : isPassed ? 'ผ่านเกณฑ์' : 'รอสรุปผล'}
                      </Badge>
                    </div>

                    <div className="space-y-2.5 py-4 text-xs">
                      {/* 1.1 */}
                      <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                        <span className="text-slate-200">1.1 ความสะดวกในการใช้งาน</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white font-mono">{usabilityScore.toFixed(2)}</span>
                          <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] border ${getLevelBadgeClass(usabilityScore)}`}>
                            {totalResponses > 0 ? (usabilityCat?.levelTh || 'สูง') : 'รอข้อมูล'}
                          </span>
                        </div>
                      </div>

                      {/* 1.2 */}
                      <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                        <span className="text-slate-200">1.2 ส่วนติดต่อผู้ใช้ (UI)</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white font-mono">{uiScore.toFixed(2)}</span>
                          <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] border ${getLevelBadgeClass(uiScore)}`}>
                            {totalResponses > 0 ? (uiCat?.levelTh || 'สูง') : 'รอข้อมูล'}
                          </span>
                        </div>
                      </div>

                      {/* 1.3 */}
                      <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                        <span className="text-slate-200">1.3 ระบบแจ้งเตือน</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white font-mono">{alertScore.toFixed(2)}</span>
                          <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] border ${getLevelBadgeClass(alertScore)}`}>
                            {totalResponses > 0 ? (alertCat?.levelTh || 'สูง') : 'รอข้อมูล'}
                          </span>
                        </div>
                      </div>

                      {/* 1.4 */}
                      <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                        <span className="text-slate-200">1.4 ระบบแชทบอท (Dr.Mind)</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white font-mono">{chatbotScore.toFixed(2)}</span>
                          <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] border ${getLevelBadgeClass(chatbotScore)}`}>
                            {totalResponses > 0 ? (chatbotCat?.levelTh || 'สูง') : 'รอข้อมูล'}
                          </span>
                        </div>
                      </div>

                      {/* 1.5 */}
                      <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                        <span className="text-slate-200">1.5 ความพึงพอใจโดยรวม</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white font-mono">{overallSingleScore.toFixed(2)}</span>
                          <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] border ${getLevelBadgeClass(overallSingleScore)}`}>
                            {totalResponses > 0 ? (overallCat?.levelTh || 'สูง') : 'รอข้อมูล'}
                          </span>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-400/30">
                        <span className="text-emerald-200 font-bold">รวมทุกด้าน</span>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-white font-mono text-sm">{totalMean.toFixed(2)}</span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-400 text-slate-900 font-extrabold text-[10px]">
                            {totalResponses > 0 ? (report?.overallLevelTh || 'สูง') : 'รอข้อมูล'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 text-center">
                      <button
                        onClick={() => navigate('/satisfaction-survey?tab=results')}
                        className="text-xs text-blue-300 hover:text-white transition-colors underline decoration-dotted"
                      >
                        ดูตารางเกณฑ์การประเมิน (ภาพที่ 2) และกราฟวิชาการ &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
