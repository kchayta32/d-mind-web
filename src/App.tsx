import React, { Component, ReactNode, ErrorInfo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider } from './contexts/LanguageProvider';
import { ThemeProvider } from './contexts/ThemeProvider';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

// Pages
import Index from './pages/Index';
import AIAssistant from './pages/AIAssistant';
import EmergencyManual from './pages/EmergencyManual';
import EmergencyContacts from './pages/EmergencyContacts';
import Alerts from './pages/Alerts';
import ContactUs from './pages/ContactUs';
import DisasterMap from './pages/DisasterMap';
import DisasterNews from './pages/DisasterNews';
import VictimReports from './pages/VictimReports';
import IncidentReports from './pages/IncidentReports';
import DamageAssessment from './pages/DamageAssessment';
import SatisfactionSurvey from './pages/SatisfactionSurvey';
import AppGuide from './pages/AppGuide';
import Analytics from './pages/Analytics';
import NotificationSettings from './pages/NotificationSettings';
import ArticleDetail from './pages/ArticleDetail';
import ResourceDetail from './pages/ResourceDetail';
import RagComparison from './pages/RagComparison';
import NotFound from './pages/NotFound';

// Simple QueryClient without complex config
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Basic Loading Screen
const BasicLoadingScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <h2 className="text-xl font-semibold text-gray-700">กำลังโหลด D-MIND...</h2>
      <p className="text-gray-500 text-sm mt-2">กรุณารอสักครู่</p>
    </div>
  </div>
);

// Simple Error Boundary
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; isReady: boolean; error?: Error }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, isReady: false };
  }

  static getDerivedStateFromError(error: Error): { hasError: boolean; error: Error } {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  componentDidMount() {
    // Simple timeout to ensure React is ready
    setTimeout(() => {
      this.setState({ isReady: true });
    }, 100);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 flex items-center justify-center p-4">
          <div className="text-center max-w-md bg-white p-6 rounded-2xl shadow-xl border border-red-100">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              ⚠️
            </div>
            <h1 className="text-2xl font-bold text-red-600 mb-2">เกิดข้อผิดพลาด</h1>
            <p className="text-gray-600 text-sm mb-4">
              เกิดข้อผิดพลาดบางอย่างในการแสดงผล กรุณากดปุ่มด้านล่างเพื่อลองใหม่อีกครั้ง
            </p>
            {this.state.error && (
              <p className="text-xs text-red-500 bg-red-50 p-2 rounded mb-4 font-mono text-left overflow-auto max-h-24">
                {this.state.error.message}
              </p>
            )}
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: undefined });
                  window.location.reload();
                }}
                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition shadow-sm"
              >
                รีเฟรชหน้าเว็บ
              </button>
              <button
                onClick={() => {
                  window.location.href = '/';
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition"
              >
                กลับสู่หน้าหลัก
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (!this.state.isReady) {
      return <BasicLoadingScreen />;
    }

    return this.props.children;
  }
}

// Main app routes component
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/assistant" element={<AIAssistant />} />
        <Route path="/manual" element={<EmergencyManual />} />
        <Route path="/contacts" element={<EmergencyContacts />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/contactme" element={<ContactUs />} />
        <Route path="/disaster-map" element={<DisasterMap />} />
        <Route path="/disaster-news" element={<DisasterNews />} />
        <Route path="/victim-reports" element={<VictimReports />} />
        <Route path="/incident-reports" element={<IncidentReports />} />
        <Route path="/damage-assessment" element={<DamageAssessment />} />
        <Route path="/satisfaction-survey" element={<SatisfactionSurvey />} />
        <Route path="/app-guide" element={<AppGuide />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/notifications" element={<NotificationSettings />} />
        <Route path="/article/:id" element={<ArticleDetail />} />
        <Route path="/resource/:id" element={<ResourceDetail />} />
        <Route path="/rag-web" element={<RagComparison />} />
        <Route path="/arena" element={<RagComparison />} />
        <Route path="/llm-arena" element={<RagComparison />} />
        <Route path="/rag-comparison" element={<RagComparison />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

// Main App Component
const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="app-theme">
          <LanguageProvider>
            <TooltipProvider>
              <AppRoutes />
              <Toaster />
              <Sonner />
            </TooltipProvider>
          </LanguageProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
