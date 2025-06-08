
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FeatureChart } from './charts/FeatureChart';
import { UsabilityChart } from './charts/UsabilityChart';

const SurveyResults: React.FC = () => {
  // Mock data - replace with real data from your survey system
  const featureScores = [
    { feature: 'แผนที่ภัยพิบัติ', score: 4.2 },
    { feature: 'แจ้งเตือนภัย', score: 4.0 },
    { feature: 'คู่มือฉุกเฉิน', score: 3.8 },
    { feature: 'รายงานเหตุการณ์', score: 3.5 },
    { feature: 'ผู้ช่วย AI', score: 4.1 },
  ];

  const usabilityData = [
    { name: 'ใช้งานง่ายมาก', value: 35 },
    { name: 'ใช้งานง่าย', value: 28 },
    { name: 'ปานกลาง', value: 20 },
    { name: 'ใช้งานยาก', value: 12 },
    { name: 'ใช้งานยากมาก', value: 5 },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>ผลการประเมินความพึงพอใจ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">คะแนนประเมินฟีเจอร์ต่างๆ</h3>
              <FeatureChart data={featureScores} />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4">ความง่ายในการใช้งาน</h3>
              <UsabilityChart data={usabilityData} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>สถิติการตอบแบบสอบถาม</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">1,245</div>
              <div className="text-sm text-gray-600">ผู้ตอบแบบสอบถาม</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">4.1</div>
              <div className="text-sm text-gray-600">คะแนนเฉลี่ย</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">87%</div>
              <div className="text-sm text-gray-600">ความพึงพอใจ</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">92%</div>
              <div className="text-sm text-gray-600">แนะนำต่อ</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SurveyResults;
