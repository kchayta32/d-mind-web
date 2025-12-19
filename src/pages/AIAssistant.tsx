import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EnhancedChatBot from '@/components/chat/EnhancedChatBot';
import AppLogo from '@/components/AppLogo';
import { useLanguage } from '@/contexts/LanguageProvider';

const AIAssistant = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 shadow-lg border-b border-blue-100 dark:border-slate-800 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGoBack}
                className="p-2 hover:bg-blue-50 dark:hover:bg-slate-800"
              >
                <ArrowLeft className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </Button>
              <div className="flex items-center space-x-3">
                <AppLogo />
                <div>
                  <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">{t('aiAssistant.title')}</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{t('aiAssistant.subtitle')}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">{t('aiAssistant.online')}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-4xl mx-auto p-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-800 overflow-hidden">
          <EnhancedChatBot className="h-[calc(100vh-140px)] border-0 shadow-none dark:bg-slate-900" />
        </div>
      </main>
    </div>
  );
};

export default AIAssistant;
