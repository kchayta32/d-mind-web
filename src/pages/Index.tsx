
import React from 'react';
import { useNavigate } from 'react-router-dom';
import DisasterAlert from '@/components/DisasterAlert';
import NavBar from '@/components/NavBar';
import DisasterResources from '@/components/DisasterResources';
import AIChat from '@/components/AIChat';
import DisasterMap from '@/components/DisasterMap';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { MessageSquare, AlertTriangle } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-guardian-light-blue to-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-guardian-gradient-start to-guardian-gradient-end text-white p-4 flex flex-col items-start shadow-lg">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/b5550bd4-d83d-4e1e-ac09-025117b87c86.png" 
            alt="D-MIND Logo" 
            className="h-8 w-8 mr-3"
          />
          <h1 className="text-2xl font-bold font-sans">D-MIND</h1>
        </div>
        <p className="text-sm mt-2 font-sans opacity-90">
          ระบบติดตามภัยพิบัติและแจ้งเตือนอัจฉริยะ (Disaster Monitoring and Intelligent Notification Device)
        </p>
      </header>

      {/* Main Content */}
      <main className="container max-w-md mx-auto p-4">
        <DisasterAlert isActive={true} />
        
        <NavBar 
          onAssistantClick={handleAssistantClick}
          onManualClick={handleManualClick}
          onContactsClick={handleContactsClick}
          onAlertsClick={handleAlertsClick}
        />
        
        {/* Victim Reports Button */}
        <div className="my-4">
          <Button 
            className="w-full bg-red-600 hover:bg-red-700 text-white shadow-md"
            onClick={handleVictimReportsClick}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            รายงานสถานะผู้ประสบภัย
          </Button>
        </div>
        
        <DisasterMap />
        
        <DisasterResources />
        
        <div id="ai-chat">
          <AIChat />
        </div>
      </main>
    </div>
  );
};

export default Index;
