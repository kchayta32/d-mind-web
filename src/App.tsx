import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Component, ErrorInfo, ReactNode } from "react";
import Index from "./pages/Index";
import AIAssistant from "./pages/AIAssistant";
import EmergencyManual from "./pages/EmergencyManual";
import EmergencyContacts from "./pages/EmergencyContacts";
import Alerts from "./pages/Alerts";
import VictimReports from "./pages/VictimReports";
import IncidentReports from "./pages/IncidentReports";
import SatisfactionSurvey from "./pages/SatisfactionSurvey";
import AppGuide from "./pages/AppGuide";
import ArticleDetail from "./pages/ArticleDetail";
import ResourceDetail from "./pages/ResourceDetail";
import DisasterMap from "./pages/DisasterMap";
import Analytics from "./pages/Analytics";
import NotificationSettings from "./pages/NotificationSettings";
import DamageAssessment from "./pages/DamageAssessment";
import NotFound from "./pages/NotFound";
import ContactUs from "./pages/ContactUs";

const queryClient = new QueryClient();

// Basic loading component without hooks
const BasicLoadingScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl blur-lg opacity-30 animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-blue-500 to-blue-700 p-6 rounded-3xl shadow-2xl">
            <img
              src="/dmind-premium-icon.png"
              alt="D-MIND Logo"
              className="h-20 w-20 drop-shadow-lg"
            />
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
            D-MIND
          </h1>
          <p className="text-blue-600/70 text-lg font-medium">
            ระบบจัดการเหตุการณ์ภาวะฉุกเฉิน
          </p>
        </div>
        <div className="text-blue-600 text-lg font-medium">กำลังเริ่มต้นระบบ...</div>
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

// Error boundary class component
class AppErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; isReady: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, isReady: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
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
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">เกิดข้อผิดพลาด</h1>
            <p className="text-red-500">กรุณารีเฟรชหน้าเว็บ</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              รีเฟรช
            </button>
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
        <Route path="/victim-reports" element={<VictimReports />} />
        <Route path="/incident-reports" element={<IncidentReports />} />
        <Route path="/damage-assessment" element={<DamageAssessment />} />
        <Route path="/satisfaction-survey" element={<SatisfactionSurvey />} />
        <Route path="/app-guide" element={<AppGuide />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/notifications" element={<NotificationSettings />} />
        <Route path="/article/:id" element={<ArticleDetail />} />
        <Route path="/resource/:id" element={<ResourceDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

import { ThemeProvider } from "@/contexts/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageProvider";

const App = () => {
  return (
    <AppErrorBoundary>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <LanguageProvider defaultLanguage="th" storageKey="app-language">
          <QueryClientProvider client={queryClient}>
            <AppRoutes />
            <Toaster />
            <Sonner />
          </QueryClientProvider>
        </LanguageProvider>
      </ThemeProvider>
    </AppErrorBoundary>
  );
};

export default App;
