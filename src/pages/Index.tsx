
import React from 'react';
import { useNavigate } from 'react-router-dom';
import DisasterAlert from '@/components/DisasterAlert';
import NavBar from '@/components/NavBar';
import DisasterResources from '@/components/DisasterResources';
import EnhancedChatBot from '@/components/chat/EnhancedChatBot';
import DisasterMap from '@/components/DisasterMap';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { MessageSquare, AlertTriangle, Sparkles } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleAssistantClick = () => {
    navigate('/assistant');
  };

  const handleManualClick = () => {
    navigate('/manual');
  };

  const handleContactsClick = () => {
    navigate('/contacts');
  };

  const handleAlertsClick = () => {
    navigate('/alerts');
  };
  
  const handleVictimReportsClick = () => {
    navigate('/victim-reports');
  };

  if (isMobile) {
    // Enhanced Mobile layout with modern glass morphism design
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br from-indigo-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Enhanced Header with glass effect */}
        <header className="bg-white/80 backdrop-blur-lg shadow-xl border-b border-white/20 sticky top-0 z-50 relative">
          <div className="px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <img 
                    src="/lovable-uploads/b5550bd4-d83d-4e1e-ac09-025117b87c86.png" 
                    alt="D-MIND Logo" 
                    className="h-7 w-7"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-800 bg-clip-text text-transparent">D-MIND</h1>
                  <p className="text-sm text-gray-600 font-medium">ระบบติดตามภัยพิบัติอัจฉริยะ</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-3 w-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full animate-pulse shadow-lg"></div>
                <span className="text-sm text-gray-700 font-semibold">ออนไลน์</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content with enhanced spacing and effects */}
        <main className="px-5 py-8 space-y-8 max-w-md mx-auto relative z-10">
          {/* Enhanced Alert Section */}
          <div className="space-y-6">
            <DisasterAlert isActive={true} />
          </div>
          
          {/* Enhanced Navigation Section */}
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-7 hover:shadow-3xl transition-all duration-500">
            <div className="flex items-center mb-6">
              <div className="h-2 w-12 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full mr-4 shadow-md"></div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">เมนูหลัก</h2>
              <Sparkles className="ml-2 h-5 w-5 text-yellow-500 animate-pulse" />
            </div>
            <NavBar 
              onAssistantClick={handleAssistantClick}
              onManualClick={handleManualClick}
              onContactsClick={handleContactsClick}
              onAlertsClick={handleAlertsClick}
            />
          </div>
          
          {/* Enhanced Emergency Report Button */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-500 via-pink-500 to-red-600 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-red-500 to-red-600 rounded-3xl shadow-2xl p-1">
              <Button 
                className="w-full bg-red-600 hover:bg-red-700 text-white shadow-none border-0 rounded-2xl py-5 font-bold text-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                onClick={handleVictimReportsClick}
              >
                <MessageSquare className="mr-3 h-6 w-6" />
                รายงานสถานะผู้ประสบภัย
              </Button>
            </div>
          </div>
          
          {/* Enhanced Disaster Map Section */}
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden hover:shadow-3xl transition-all duration-500">
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-100 px-7 py-5 border-b border-gray-100/50">
              <div className="flex items-center mb-2">
                <div className="h-2 w-12 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full mr-4 shadow-md"></div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">แผนที่ภัยพิบัติ</h2>
              </div>
              <p className="text-sm text-gray-600 font-medium">ข้อมูลสถานการณ์แบบเรียลไทม์</p>
            </div>
            <div className="h-[1000px] relative overflow-auto">
              <div className="min-h-full">
                <DisasterMap />
              </div>
            </div>
          </div>

          {/* Enhanced AI Chat Section */}
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 overflow-hidden hover:shadow-3xl transition-all duration-500">
            <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 px-7 py-5 border-b border-gray-100/50">
              <div className="flex items-center mb-2">
                <div className="h-2 w-12 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full mr-4 shadow-md"></div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">ปรึกษาผู้เชี่ยวชาญ</h2>
              </div>
              <p className="text-sm text-gray-600 font-medium">Dr.Mind ผู้เชี่ยวชาญด้านภัยธรรมชาติและแพทย์ฉุกเฉิน</p>
            </div>
            <div className="p-0">
              <EnhancedChatBot />
            </div>
          </div>
          
          {/* Enhanced Resources Section */}
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-7 hover:shadow-3xl transition-all duration-500">
            <div className="flex items-center mb-6">
              <div className="h-2 w-12 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-full mr-4 shadow-md"></div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">แหล่งข้อมูลฉุกเฉิน</h2>
            </div>
            <DisasterResources />
          </div>

          {/* Bottom spacing for better scroll experience */}
          <div className="h-8"></div>
        </main>
      </div>
    );
  }

  // Enhanced Desktop/Landscape layout
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-60 -right-60 w-96 h-96 bg-gradient-to-br from-blue-400/15 to-purple-400/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-60 -left-60 w-96 h-96 bg-gradient-to-br from-cyan-400/15 to-blue-400/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Enhanced Sidebar with glass effect */}
      <aside className="w-80 bg-white/80 backdrop-blur-lg shadow-2xl border-r border-white/20 flex flex-col relative z-10">
        {/* Enhanced Sidebar Header */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="relative z-10">
            <div className="flex items-center mb-4">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl mr-4 shadow-lg">
                <img 
                  src="/lovable-uploads/b5550bd4-d83d-4e1e-ac09-025117b87c86.png" 
                  alt="D-MIND Logo" 
                  className="h-10 w-10"
                />
              </div>
              <h1 className="text-2xl font-bold">D-MIND</h1>
            </div>
            <p className="text-sm opacity-90 leading-relaxed font-medium">
              ระบบติดตามภัยพิบัติและแจ้งเตือนอัจฉริยะ
            </p>
          </div>
        </div>

        {/* Enhanced Navigation */}
        <div className="p-7 space-y-6 flex-1">
          <DisasterAlert isActive={true} />
          
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center">
              <div className="h-1 w-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mr-2"></div>
              เมนูหลัก
            </h3>
            <NavBar 
              onAssistantClick={handleAssistantClick}
              onManualClick={handleManualClick}
              onContactsClick={handleContactsClick}
              onAlertsClick={handleAlertsClick}
            />
          </div>
          
          {/* Enhanced Victim Reports Button */}
          <div className="pt-6 border-t border-gray-100">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-red-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <Button 
                className="relative w-full bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={handleVictimReportsClick}
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                รายงานสถานะผู้ประสบภัย
              </Button>
            </div>
          </div>
          
          <div className="pt-6">
            <DisasterResources />
          </div>
        </div>
      </aside>

      {/* Enhanced Main Content */}
      <main className="flex-1 flex flex-col relative z-10">
        {/* Enhanced Top Bar */}
        <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-2 w-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mr-4 shadow-md"></div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">แผงควบคุมหลัก</h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600 flex items-center">
                สถานะระบบ: 
                <div className="ml-2 flex items-center">
                  <div className="h-2 w-2 bg-gradient-to-r from-green-400 to-green-500 rounded-full animate-pulse mr-2"></div>
                  <span className="text-green-600 font-bold">ออนไลน์</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Enhanced Content Area */}
        <div className="flex-1 p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Enhanced Map Section */}
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden hover:shadow-3xl transition-all duration-500">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center mb-2">
                <div className="h-1 w-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mr-3"></div>
                <h3 className="font-bold text-gray-800 text-lg">แผนที่ภัยพิบัติ</h3>
              </div>
              <p className="text-sm text-gray-600 font-medium">ข้อมูลสถานการณ์แบบเรียลไทม์</p>
            </div>
            <div className="p-8 h-[calc(100%-100px)] min-h-[500px]">
              <DisasterMap />
            </div>
          </div>

          {/* Enhanced Chatbot Section */}
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden hover:shadow-3xl transition-all duration-500">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50">
              <div className="flex items-center mb-2">
                <div className="h-1 w-8 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full mr-3"></div>
                <h3 className="font-bold text-gray-800 text-lg">ปรึกษาผู้เชี่ยวชาญ</h3>
              </div>
              <p className="text-sm text-gray-600 font-medium">Dr.Mind ผู้เชี่ยวชาญด้านภัยธรรมชาติและแพทย์ฉุกเฉิน</p>
            </div>
            <div className="h-[calc(100%-100px)]">
              <EnhancedChatBot className="h-full border-0 shadow-none" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
