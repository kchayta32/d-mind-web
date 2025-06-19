
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DisasterMap from '@/components/DisasterMap';

const DisasterMapPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <header className="bg-white shadow-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="text-blue-600 hover:text-blue-700"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                กลับหน้าหลัก
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-800">แผนที่ภัยพิบัติและสถิติ</h1>
                <p className="text-sm text-gray-600">ติดตามสถานการณ์ภัยพิบัติแบบเรียลไทม์</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="h-[calc(100vh-200px)]">
          <DisasterMap />
        </div>
      </main>
    </div>
  );
};

export default DisasterMapPage;
