import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, BarChart3, MessageSquare, Award, CheckCircle2, FileCheck } from 'lucide-react';
import { SurveyFormNew } from '@/components/survey/SurveyFormNew';
import { EvaluationReport } from '@/components/survey/EvaluationReport';
import { useLanguage } from '@/contexts/LanguageProvider';

const SatisfactionSurvey: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'results' ? 'results' : 'survey';
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const { t } = useLanguage();

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl === 'results' || tabFromUrl === 'survey') {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  const handleTabChange = (val: string) => {
    setActiveTab(val);
    setSearchParams({ tab: val });
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 py-8 md:py-12">
        <div className="container max-w-5xl mx-auto px-4">
          {/* Hero Header */}
          <div className="text-center mb-8 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold mb-4 border border-blue-200 dark:border-blue-800">
              <Award className="w-4 h-4 text-blue-600" />
              <span>แบบประเมินความพึงพอใจและรับรองผลการทดสอบระบบ D-MIND</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-3">
              การประเมินความพึงพอใจของผู้ใช้งานต่อระบบ D-MIND
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed">
              ขอเชิญร่วมประเมินความพึงพอใจการใช้งานระบบ D-MIND (Disaster Management Intelligence Hub) 
              และตรวจสอบรายงานผลการประเมินเชิงสถิติ กราฟสรุปผลทางการ และตารางเกณฑ์การประเมิน
            </p>
          </div>

          {/* Navigation Tabs */}
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <div className="flex justify-center mb-8 print:hidden">
              <TabsList className="grid w-full max-w-md grid-cols-2 bg-slate-200/80 dark:bg-slate-900 p-1 rounded-2xl h-auto border border-slate-300/60 dark:border-slate-800 shadow-inner">
                <TabsTrigger
                  value="survey"
                  className="rounded-xl py-2.5 text-xs sm:text-sm font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm transition-all"
                >
                  <MessageSquare className="w-4 h-4 mr-1.5" />
                  ทำแบบประเมิน
                </TabsTrigger>
                <TabsTrigger
                  value="results"
                  className="rounded-xl py-2.5 text-xs sm:text-sm font-bold data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400 data-[state=active]:shadow-sm transition-all"
                >
                  <BarChart3 className="w-4 h-4 mr-1.5" />
                  ผลการประเมิน & กราฟสถิติ
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab 1: Form */}
            <TabsContent value="survey" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
              <SurveyFormNew onSuccessSubmit={() => handleTabChange('results')} />
            </TabsContent>

            {/* Tab 2: Results & Official Report */}
            <TabsContent value="results" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
              <EvaluationReport />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default SatisfactionSurvey;
