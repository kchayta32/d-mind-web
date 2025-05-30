
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EnhancedChatBot from '@/components/chat/EnhancedChatBot';
import AppLogo from '@/components/AppLogo';

const AIAssistant = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-blue-100 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleGoBack}
                className="p-2 hover:bg-blue-50"
              >
                <ArrowLeft className="h-5 w-5 text-blue-600" />
              </Button>
              <div className="flex items-center space-x-3">
                <AppLogo />
                <div>
                  <h1 className="text-xl font-bold text-gray-800">Dr.Mind - ผู้เชี่ยวชาญฉุกเฉิน</h1>
                  <p className="text-xs text-gray-500 font-medium">ภัยธรรมชาติ & แพทย์ฉุกเฉิน</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-600 font-medium">ออนไลน์</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <EnhancedChatBot className="h-[calc(100vh-140px)] border-0 shadow-none" />
        </div>
      </main>
    </div>
  );
};

export default AIAssistant;
