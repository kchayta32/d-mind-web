
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { TrendingUp, Users, Star, ThumbsUp, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

interface SurveyStats {
  totalResponses: number;
  averageRating: number;
  recommendationRate: number;
  overallRatings: Array<{ rating: string; count: number; percentage: number }>;
  featureRatings: Array<{ feature: string; rating: number }>;
  monthlyTrends: Array<{ date: string; rating: number }>;
}

const SurveyResults: React.FC = () => {
  const [stats, setStats] = useState<SurveyStats>({
    totalResponses: 0,
    averageRating: 0,
    recommendationRate: 0,
    overallRatings: [],
    featureRatings: [],
    monthlyTrends: []
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchSurveyData = async () => {
    setIsLoading(true);
    try {
      const { data: surveys, error } = await supabase
        .from('satisfaction_surveys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching survey data:', error);
        return;
      }

      if (!surveys || surveys.length === 0) {
        setStats({
          totalResponses: 0,
          averageRating: 0,
          recommendationRate: 0,
          overallRatings: [],
          featureRatings: [],
          monthlyTrends: []
        });
        return;
      }

      // Calculate total responses
      const totalResponses = surveys.length;

      // Calculate average overall rating
      const averageRating = surveys.reduce((sum, survey) => sum + survey.overall_rating, 0) / totalResponses;

      // Calculate recommendation rate (4-5 stars out of would_recommend)
      const recommendCount = surveys.filter(s => s.would_recommend >= 4).length;
      const recommendationRate = Math.round((recommendCount / totalResponses) * 100);

      // Calculate overall rating distribution
      const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      surveys.forEach(survey => {
        ratingCounts[survey.overall_rating as keyof typeof ratingCounts]++;
      });

      const overallRatings = Object.entries(ratingCounts).map(([rating, count]) => ({
        rating: `${rating} ดาว`,
        count,
        percentage: Math.round((count / totalResponses) * 100)
      }));

      // Calculate feature ratings
      const featureRatings = [
        { 
          feature: 'แผนที่ภัยพิบัติ', 
          rating: surveys.filter(s => s.map_visualization_rating).reduce((sum, s) => sum + (s.map_visualization_rating || 0), 0) / surveys.filter(s => s.map_visualization_rating).length || 0
        },
        { 
          feature: 'AI Assistant', 
          rating: surveys.filter(s => s.ai_assistant_rating).reduce((sum, s) => sum + (s.ai_assistant_rating || 0), 0) / surveys.filter(s => s.ai_assistant_rating).length || 0
        },
        { 
          feature: 'ข้อมูลฉุกเฉิน', 
          rating: surveys.filter(s => s.emergency_info_rating).reduce((sum, s) => sum + (s.emergency_info_rating || 0), 0) / surveys.filter(s => s.emergency_info_rating).length || 0
        },
        { 
          feature: 'การใช้งานแอพ', 
          rating: surveys.filter(s => s.user_interface_rating).reduce((sum, s) => sum + (s.user_interface_rating || 0), 0) / surveys.filter(s => s.user_interface_rating).length || 0
        },
        { 
          feature: 'ระบบแจ้งเตือน', 
          rating: surveys.filter(s => s.alert_system_rating).reduce((sum, s) => sum + (s.alert_system_rating || 0), 0) / surveys.filter(s => s.alert_system_rating).length || 0
        },
      ].map(item => ({ ...item, rating: Math.round(item.rating * 10) / 10 }));

      // Calculate monthly trends (group by month)
      const monthlyData = surveys.reduce((acc, survey) => {
        const date = new Date(survey.created_at);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!acc[monthKey]) {
          acc[monthKey] = { total: 0, count: 0 };
        }
        acc[monthKey].total += survey.overall_rating;
        acc[monthKey].count += 1;
        
        return acc;
      }, {} as Record<string, { total: number; count: number }>);

      const monthlyTrends = Object.entries(monthlyData)
        .map(([month, data]) => ({
          date: month,
          rating: Math.round((data.total / data.count) * 10) / 10
        }))
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-6); // Last 6 months

      setStats({
        totalResponses,
        averageRating: Math.round(averageRating * 10) / 10,
        recommendationRate,
        overallRatings,
        featureRatings,
        monthlyTrends
      });

    } catch (error) {
      console.error('Unexpected error fetching survey data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSurveyData();
  }, []);

  const pieColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const radarData = stats.featureRatings.map(item => ({
    subject: item.feature,
    A: item.rating,
    fullMark: 5
  }));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">กำลังโหลดข้อมูล...</span>
      </div>
    );
  }

  if (stats.totalResponses === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          <Star className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold mb-2">ยังไม่มีข้อมูลการประเมิน</h3>
          <p>เมื่อมีผู้ใช้ส่งแบบประเมินเข้ามา ผลการประเมินจะแสดงที่นี่</p>
        </div>
        <Button onClick={fetchSurveyData} variant="outline" className="mt-4">
          <RefreshCw className="h-4 w-4 mr-2" />
          รีเฟรชข้อมูล
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">จำนวนผู้ตอบ</p>
                <p className="text-2xl font-bold text-blue-700">{stats.totalResponses}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">คะแนนเฉลี่ย</p>
                <p className="text-2xl font-bold text-green-700">{stats.averageRating}/5</p>
              </div>
              <Star className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">อัตราแนะนำ</p>
                <p className="text-2xl font-bold text-yellow-700">{stats.recommendationRate}%</p>
              </div>
              <ThumbsUp className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">แนวโน้ม</p>
                <p className="text-2xl font-bold text-purple-700">
                  {stats.monthlyTrends.length >= 2 ? 
                    (stats.monthlyTrends[stats.monthlyTrends.length - 1].rating > stats.monthlyTrends[stats.monthlyTrends.length - 2].rating ? '+' : '') +
                    Math.round(((stats.monthlyTrends[stats.monthlyTrends.length - 1].rating - stats.monthlyTrends[stats.monthlyTrends.length - 2].rating) / stats.monthlyTrends[stats.monthlyTrends.length - 2].rating) * 100) + '%'
                    : 'N/A'
                  }
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={fetchSurveyData} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          รีเฟรชข้อมูล
        </Button>
      </div>

      {/* Charts Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">ภาพรวม</TabsTrigger>
          <TabsTrigger value="features">ฟีเจอร์</TabsTrigger>
          <TabsTrigger value="trends">แนวโน้ม</TabsTrigger>
          <TabsTrigger value="radar">เปรียบเทียบ</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  การให้คะแนนโดยรวม
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.overallRatings}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="rating" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        `${value} คน (${stats.overallRatings.find(d => d.count === value)?.percentage || 0}%)`,
                        'จำนวนผู้ตอบ'
                      ]}
                    />
                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  สัดส่วนการให้คะแนน
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.overallRatings}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {stats.overallRatings.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name, props) => [
                        `${value} คน (${props.payload.percentage}%)`,
                        props.payload.rating
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">
                คะแนนประเมินฟีเจอร์ต่างๆ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={stats.featureRatings} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 5]} />
                  <YAxis dataKey="feature" type="category" width={120} />
                  <Tooltip 
                    formatter={(value) => [`${value}/5 ดาว`, 'คะแนนเฉลี่ย']}
                  />
                  <Bar dataKey="rating" fill="#10b981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">
                แนวโน้มคะแนนประเมินรายเดือน
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.monthlyTrends.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={stats.monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip 
                      formatter={(value) => [`${value}/5 ดาว`, 'คะแนนเฉลี่ย']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="rating" 
                      stroke="#f59e0b" 
                      strokeWidth={3}
                      dot={{ fill: '#f59e0b', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  ต้องมีข้อมูลอย่างน้อย 2 เดือนเพื่อแสดงแนวโน้ม
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Radar Tab */}
        <TabsContent value="radar">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800">
                การเปรียบเทียบฟีเจอร์ทั้งหมด
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.featureRatings.some(f => f.rating > 0) ? (
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={90} domain={[0, 5]} />
                    <Radar
                      name="คะแนนประเมิน"
                      dataKey="A"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value}/5 ดาว`, 'คะแนนเฉลี่ย']}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  ต้องมีการประเมินฟีเจอร์เพื่อแสดงกราฟเปรียบเทียบ
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SurveyResults;
