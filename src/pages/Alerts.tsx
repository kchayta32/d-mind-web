
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDisasterAlerts } from '@/components/disaster-alerts/useDisasterAlerts';
import AlertFilters from '@/components/disaster-alerts/AlertFilters';
import AlertsList from '@/components/disaster-alerts/AlertsList';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, ArrowLeft, Activity, plus, MapPin } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEarthquakeData } from '@/components/disaster-map/useEarthquakeData';

const Alerts: React.FC = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { 
    alerts, 
    isLoading, 
    filters, 
    updateFilters, 
    refetch, 
    alertTypes, 
    severityLevels 
  } = useDisasterAlerts();

  const { earthquakes, statistics, refreshing, fetchEarthquakeData } = useEarthquakeData();

  if (isMobile) {
    // Mobile layout
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 shadow-lg">
          <div className="container mx-auto max-w-7xl flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white mr-3 hover:bg-blue-400/30 rounded-full" 
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/b5550bd4-d83d-4e1e-ac09-025117b87c86.png" 
                alt="D-MIND Logo" 
                className="h-8 w-8 mr-3"
              />
              <h1 className="text-xl font-bold">การแจ้งเตือนภัยพิบัติ</h1>
            </div>
          </div>
        </header>

        {/* Main Content with Tabs */}
        <main className="container mx-auto p-4 max-w-7xl">
          <Tabs defaultValue="alerts" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="alerts" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                การแจ้งเตือน
              </TabsTrigger>
              <TabsTrigger value="earthquake" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                แผ่นดินไหว 24 ชม.
              </TabsTrigger>
            </TabsList>

            <TabsContent value="alerts">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Filters Sidebar */}
                <div className="lg:col-span-1">
                  <div className="mb-4 flex justify-end lg:justify-start">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => refetch()} 
                      disabled={isLoading}
                      className="flex items-center gap-2 bg-white hover:bg-blue-50 border-blue-200 text-blue-600 hover:text-blue-700"
                    >
                      <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                      รีเฟรช
                    </Button>
                  </div>
                  
                  <AlertFilters
                    filters={filters}
                    updateFilters={updateFilters}
                    availableTypes={alertTypes}
                    availableSeverities={severityLevels}
                  />
                </div>
                
                {/* Alerts List */}
                <div className="lg:col-span-3">
                  <AlertsList
                    alerts={alerts}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="earthquake">
              <div className="space-y-6">
                {/* Header with refresh button */}
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-800">แผ่นดินไหวในช่วง 24 ชม.ที่ผ่านมา</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={fetchEarthquakeData} 
                    disabled={refreshing}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                    รีเฟรช
                  </Button>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-blue-600">{statistics.total}</div>
                      <div className="text-sm text-gray-600">รวมทั้งหมด</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-green-600">{statistics.last24Hours}</div>
                      <div className="text-sm text-gray-600">24 ชม.ที่ผ่านมา</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-orange-600">{statistics.maxMagnitude}</div>
                      <div className="text-sm text-gray-600">แมกนิจูดสูงสุด</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-red-600">{statistics.significantCount}</div>
                      <div className="text-sm text-gray-600">ขนาดใหญ่ (≥2.5M)</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Map placeholder */}
                <Card className="min-h-[400px]">
                  <CardHeader>
                    <CardTitle>แผนที่แผ่นดินไหว</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <MapPin className="h-12 w-12 mx-auto mb-2" />
                        <p>แผนที่แผ่นดินไหวจะแสดงที่นี่</p>
                        <p className="text-sm">พบแผ่นดินไหว {earthquakes.length} ครั้ง</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex">
      {/* Sidebar */}
      <aside className="w-80 bg-white shadow-xl border-r border-blue-100">
        <div className="p-6">
          <Button 
            variant="ghost" 
            className="mb-4 text-blue-600 hover:bg-blue-50"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            กลับหน้าหลัก
          </Button>
          
          <div className="flex items-center mb-6">
            <img 
              src="/lovable-uploads/b5550bd4-d83d-4e1e-ac09-025117b87c86.png" 
              alt="D-MIND Logo" 
              className="h-8 w-8 mr-3"
            />
            <h1 className="text-xl font-bold text-blue-700">การแจ้งเตือนภัยพิบัติ</h1>
          </div>

          <Tabs defaultValue="alerts" className="w-full">
            <TabsList className="grid w-full grid-cols-1 gap-2 h-auto bg-transparent">
              <TabsTrigger value="alerts" className="w-full justify-start gap-2 data-[state=active]:bg-blue-100">
                <Activity className="h-4 w-4" />
                การแจ้งเตือนทั้งหมด
              </TabsTrigger>
              <TabsTrigger value="earthquake" className="w-full justify-start gap-2 data-[state=active]:bg-blue-100">
                <MapPin className="h-4 w-4" />
                แผ่นดินไหว 24 ชม.
              </TabsTrigger>
            </TabsList>

            <TabsContent value="alerts" className="mt-4">
              <div className="mb-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => refetch()} 
                  disabled={isLoading}
                  className="w-full flex items-center gap-2 bg-white hover:bg-blue-50 border-blue-200 text-blue-600 hover:text-blue-700"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  รีเฟรชข้อมูล
                </Button>
              </div>
              
              <AlertFilters
                filters={filters}
                updateFilters={updateFilters}
                availableTypes={alertTypes}
                availableSeverities={severityLevels}
              />
            </TabsContent>

            <TabsContent value="earthquake" className="mt-4">
              <div className="space-y-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={fetchEarthquakeData} 
                  disabled={refreshing}
                  className="w-full flex items-center gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                  รีเฟรชข้อมูล
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Card>
                    <CardContent className="p-3">
                      <div className="text-lg font-bold text-blue-600">{statistics.total}</div>
                      <div className="text-xs text-gray-600">รวมทั้งหมด</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3">
                      <div className="text-lg font-bold text-green-600">{statistics.last24Hours}</div>
                      <div className="text-xs text-gray-600">24 ชม.</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <h2 className="text-2xl font-semibold text-gray-800">การแจ้งเตือนภัยพิบัติ</h2>
          <p className="text-gray-600 mt-2">ติดตามข้อมูลการแจ้งเตือนภัยพิบัติและสถานการณ์ฉุกเฉิน</p>
        </header>

        <div className="flex-1 p-6">
          <Tabs defaultValue="alerts" className="h-full">
            <TabsContent value="alerts" className="h-full">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
                <div className="p-6 border-b border-gray-200 bg-gray-50">
                  <h3 className="font-semibold text-gray-800">รายการแจ้งเตือน</h3>
                </div>
                <div className="p-6 overflow-auto">
                  <AlertsList
                    alerts={alerts}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="earthquake" className="h-full">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
                <div className="p-6 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">แผ่นดินไหวในช่วง 24 ชม.ที่ผ่านมา</h3>
                    <div className="text-sm text-gray-600">
                      ข้อมูลจากกรมอุตุนิยมวิทยา
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold text-blue-600">{statistics.total}</div>
                        <div className="text-sm text-gray-600">รวมทั้งหมด</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold text-green-600">{statistics.last24Hours}</div>
                        <div className="text-sm text-gray-600">24 ชม.ที่ผ่านมา</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold text-orange-600">{statistics.maxMagnitude}</div>
                        <div className="text-sm text-gray-600">แมกนิจูดสูงสุด</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-2xl font-bold text-red-600">{statistics.significantCount}</div>
                        <div className="text-sm text-gray-600">ขนาดใหญ่ (≥2.5M)</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <MapPin className="h-12 w-12 mx-auto mb-2" />
                      <p>แผนที่แผ่นดินไหวจะแสดงที่นี่</p>
                      <p className="text-sm">พบแผ่นดินไหว {earthquakes.length} ครั้ง</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Alerts;
