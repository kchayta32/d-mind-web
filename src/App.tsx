
import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useServiceWorker } from "./hooks/useServiceWorker";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes: React.FC = () => {
  useServiceWorker();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/assistant" element={<AIAssistant />} />
        <Route path="/manual" element={<EmergencyManual />} />
        <Route path="/contacts" element={<EmergencyContacts />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/disaster-map" element={<DisasterMap />} />
        <Route path="/victim-reports" element={<VictimReports />} />
        <Route path="/incident-reports" element={<IncidentReports />} />
        <Route path="/satisfaction-survey" element={<SatisfactionSurvey />} />
        <Route path="/app-guide" element={<AppGuide />} />
        <Route path="/article/:id" element={<ArticleDetail />} />
        <Route path="/resource/:id" element={<ResourceDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App: React.FC = () => {
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    // Ensure React is fully initialized before rendering components with hooks
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 200); // Further increased delay to ensure full initialization
    
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-600 font-medium">กำลังโหลดระบบ...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AppRoutes />
    </QueryClientProvider>
  );
};

export default App;
