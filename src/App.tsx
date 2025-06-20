
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
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
  useServiceWorker(); // Initialize service worker after React is ready

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

// Create a wrapper component that ensures React context is ready
const AppWrapper: React.FC = () => {
  // Use a simple state to ensure React is fully initialized
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    // Ensure React context is ready before rendering providers
    setIsReady(true);
  }, []);

  if (!isReady) {
    return <div>Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AppRoutes />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

const App: React.FC = () => {
  return <AppWrapper />;
};

export default App;
