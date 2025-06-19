
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AIAssistant from "./pages/AIAssistant";
import EmergencyContacts from "./pages/EmergencyContacts";
import EmergencyManual from "./pages/EmergencyManual";
import ArticleDetail from "./pages/ArticleDetail";
import ResourceDetail from "./pages/ResourceDetail";
import VictimReports from "./pages/VictimReports";
import SatisfactionSurvey from "./pages/SatisfactionSurvey";
import AppGuide from "./pages/AppGuide";
import Alerts from "./pages/Alerts";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import SharedData from "./pages/SharedData";
import DisasterMapPage from "./pages/DisasterMapPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/assistant" element={<AIAssistant />} />
            <Route path="/contacts" element={<EmergencyContacts />} />
            <Route path="/manual" element={<EmergencyManual />} />
            <Route path="/article/:id" element={<ArticleDetail />} />
            <Route path="/resource/:id" element={<ResourceDetail />} />
            <Route path="/victim-reports" element={<VictimReports />} />
            <Route path="/satisfaction-survey" element={<SatisfactionSurvey />} />
            <Route path="/app-guide" element={<AppGuide />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/shared-data" element={<SharedData />} />
            <Route path="/disaster-map" element={<DisasterMapPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
