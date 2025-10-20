import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { SurveyFilters } from './SurveyFilters';

interface DemoAppSurvey {
  id: string;
  gender: string;
  age: string;
  occupation: string;
  device: string;
  ux_ratings: Record<string, number>;
  useful_features: string[];
  likes?: string;
  improvements?: string;
  mobile_app_interest?: string;
  consent: boolean;
  created_at: string;
}

interface BoothSurvey {
  id: string;
  gender: string;
  age: string;
  status: string;
  knew_before: string;
  booth_ratings: Record<string, number>;
  most_liked?: string;
  improvements?: string;
  follow_interest?: string;
  consent: boolean;
  created_at: string;
}

const SurveyResultsDashboard: React.FC = () => {
  const [demoAppSurveys, setDemoAppSurveys] = useState<DemoAppSurvey[]>([]);
  const [boothSurveys, setBoothSurveys] = useState<BoothSurvey[]>([]);
  const [loading, setLoading] = useState(true);
  const [demoDateFilter, setDemoDateFilter] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
  const [boothDateFilter, setBoothDateFilter] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    setLoading(true);
    try {
      const [demoResult, boothResult] = await Promise.all([
        supabase.from('demo_app_surveys').select('*').order('created_at', { ascending: false }),
        supabase.from('booth_surveys').select('*').order('created_at', { ascending: false })
      ]);

      if (demoResult.data) setDemoAppSurveys(demoResult.data as DemoAppSurvey[]);
      if (boothResult.data) setBoothSurveys(boothResult.data as BoothSurvey[]);
    } catch (error) {
      console.error('Error fetching surveys:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterByDate = (surveys: any[], dateFilter: { start: Date | null; end: Date | null }) => {
    if (!dateFilter.start && !dateFilter.end) return surveys;
    
    return surveys.filter(survey => {
      const surveyDate = new Date(survey.created_at);
      if (dateFilter.start && surveyDate < dateFilter.start) return false;
      if (dateFilter.end && surveyDate > dateFilter.end) return false;
      return true;
    });
  };

  const calculateDemoAppStats = (surveys: DemoAppSurvey[]) => {
    if (surveys.length === 0) return { radarData: [], barData: [], avgRating: 0 };

    const ratingKeys = [
      'accessibility', 'menu_clarity', 'map_display', 'report_understanding',
      'data_accuracy', 'system_speed', 'chart_display', 'overall_satisfaction'
    ];

    const ratingLabels: Record<string, string> = {
      accessibility: 'ความสะดวกในการเข้าถึง',
      menu_clarity: 'ความชัดเจดของเมนู',
      map_display: 'การแสดงผลแผนที่',
      report_understanding: 'ความเข้าใจหน้ารายงาน',
      data_accuracy: 'ความถูกต้องของข้อมูล',
      system_speed: 'ความรวดเร็วของระบบ',
      chart_display: 'การแสดงผลกราฟ',
      overall_satisfaction: 'ความพึงพอใจโดยรวม'
    };

    const radarData = ratingKeys.map(key => {
      const sum = surveys.reduce((acc, survey) => acc + (survey.ux_ratings[key] || 0), 0);
      const avg = sum / surveys.length;
      return {
        subject: ratingLabels[key],
        score: parseFloat(avg.toFixed(2)),
        fullMark: 5
      };
    });

    const avgRating = radarData.reduce((acc, item) => acc + item.score, 0) / radarData.length;

    return { radarData, avgRating };
  };

  const calculateBoothStats = (surveys: BoothSurvey[]) => {
    if (surveys.length === 0) return { radarData: [], avgRating: 0 };

    const ratingKeys = [
      'booth_design', 'info_clarity', 'demo_understanding', 'tech_interest',
      'team_service', 'practicality', 'overall_satisfaction'
    ];

    const ratingLabels: Record<string, string> = {
      booth_design: 'ความสวยงามของบูธ',
      info_clarity: 'ความชัดเจนของข้อมูล',
      demo_understanding: 'ความเข้าใจการสาธิต',
      tech_interest: 'ความน่าสนใจของเทคโนโลยี',
      team_service: 'การให้บริการของทีม',
      practicality: 'ความเป็นไปได้ในการใช้จริง',
      overall_satisfaction: 'ความพึงพอใจโดยรวม'
    };

    const radarData = ratingKeys.map(key => {
      const sum = surveys.reduce((acc, survey) => acc + (survey.booth_ratings[key] || 0), 0);
      const avg = sum / surveys.length;
      return {
        subject: ratingLabels[key],
        score: parseFloat(avg.toFixed(2)),
        fullMark: 5
      };
    });

    const avgRating = radarData.reduce((acc, item) => acc + item.score, 0) / radarData.length;

    return { radarData, avgRating };
  };

  const filteredDemoSurveys = filterByDate(demoAppSurveys, demoDateFilter);
  const filteredBoothSurveys = filterByDate(boothSurveys, boothDateFilter);

  const demoStats = calculateDemoAppStats(filteredDemoSurveys);
  const boothStats = calculateBoothStats(filteredBoothSurveys);

  const allDemoDates = demoAppSurveys.map(s => s.created_at);
  const allBoothDates = boothSurveys.map(s => s.created_at);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="demo-app" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="demo-app">ความพึงพอใจ Demo แอพ</TabsTrigger>
          <TabsTrigger value="booth">ความพึงพอใจบูธ</TabsTrigger>
        </TabsList>

        <TabsContent value="demo-app" className="space-y-6">
          <SurveyFilters
            surveyDates={allDemoDates}
            onDateRangeChange={(start, end) => setDemoDateFilter({ start, end })}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">สรุปผลการประเมิน</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">จำนวนผู้ตอบแบบประเมิน</span>
                    <span className="text-2xl font-bold">{filteredDemoSurveys.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">คะแนนเฉลี่ย</span>
                    <span className="text-2xl font-bold text-primary">{demoStats.avgRating.toFixed(2)}/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">กราฟเรดาร์คะแนนประเมิน</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={demoStats.radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={90} domain={[0, 5]} />
                    <Radar name="คะแนน" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="booth" className="space-y-6">
          <SurveyFilters
            surveyDates={allBoothDates}
            onDateRangeChange={(start, end) => setBoothDateFilter({ start, end })}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">สรุปผลการประเมิน</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">จำนวนผู้ตอบแบบประเมิน</span>
                    <span className="text-2xl font-bold">{filteredBoothSurveys.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">คะแนนเฉลี่ย</span>
                    <span className="text-2xl font-bold text-primary">{boothStats.avgRating.toFixed(2)}/5</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">กราฟเรดาร์คะแนนประเมิน</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={boothStats.radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={90} domain={[0, 5]} />
                    <Radar name="คะแนน" dataKey="score" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SurveyResultsDashboard;
