
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { TrendingUp, Users, Star, ThumbsUp } from 'lucide-react';

// Mock data for demonstration
const overallRatingsData = [
  { rating: '5 ดาว', count: 45, percentage: 45 },
  { rating: '4 ดาว', count: 30, percentage: 30 },
  { rating: '3 ดาว', count: 15, percentage: 15 },
  { rating: '2 ดาว', count: 7, percentage: 7 },
  { rating: '1 ดาว', count: 3, percentage: 3 },
];

const featureRatingsData = [
  { feature: 'แผนที่ภัยพิบัติ', rating: 4.2 },
  { feature: 'AI Assistant', rating: 4.5 },
  { feature: 'ข้อมูลฉุกเฉิน', rating: 4.3 },
  { feature: 'การใช้งานแอพ', rating: 4.1 },
  { feature: 'ระบบแจ้งเตือน', rating: 4.4 },
];

const radarData = [
  { subject: 'แผนที่ภัยพิบัติ', A: 4.2, fullMark: 5 },
  { subject: 'AI Assistant', A: 4.5, fullMark: 5 },
  { subject: 'ข้อมูลฉุกเฉิน', A: 4.3, fullMark: 5 },
  { subject: 'การใช้งานแอพ', A: 4.1, fullMark: 5 },
  { subject: 'ระบบแจ้งเตือน', A: 4.4, fullMark: 5 },
];

const timeSeriesData = [
  { date: 'ม.ค.', rating: 3.8 },
  { date: 'ก.พ.', rating: 4.0 },
  { date: 'มี.ค.', rating: 4.1 },
  { date: 'เม.ย.', rating: 4.3 },
  { date: 'พ.ค.', rating: 4.2 },
  { date: 'มิ.ย.', rating: 4.4 },
];

const pieColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const SurveyResults: React.FC = () => {
  const totalResponses = 100;
  const averageRating = 4.3;
  const recommendationRate = 87;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">จำนวนผู้ตอบ</p>
                <p className="text-2xl font-bold text-blue-700">{totalResponses}</p>
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
                <p className="text-2xl font-bold text-green-700">{averageRating}/5</p>
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
                <p className="text-2xl font-bold text-yellow-700">{recommendationRate}%</p>
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
                <p className="text-2xl font-bold text-purple-700">+12%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
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
                  <BarChart data={overallRatingsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="rating" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [
                        `${value} คน (${overallRatingsData.find(d => d.count === value)?.percentage || 0}%)`,
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
                      data={overallRatingsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {overallRatingsData.map((entry, index) => (
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
                <BarChart data={featureRatingsData} layout="horizontal">
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
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[3, 5]} />
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SurveyResults;
