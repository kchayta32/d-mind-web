
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useOfflineMode } from '@/hooks/useOfflineMode';
import { useNotifications } from '@/hooks/useNotifications';
import MobileHeader from '@/components/home/MobileHeader';
import MobileMainContent from '@/components/home/MobileMainContent';
import DesktopLayout from '@/components/home/DesktopLayout';
import ErrorBoundary from '@/components/ErrorBoundary';

const Index = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { isOnline, cacheData } = useOfflineMode();
  const { requestPermission } = useNotifications();

  // Fix auto-scroll issue
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const preventAutoScroll = (e: Event) => {
      e.preventDefault();
    };
    
    const timeoutId = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  // Request notification permission on first load
  useEffect(() => {
    const hasRequestedPermission = localStorage.getItem('dmind-notification-requested');
    if (!hasRequestedPermission) {
      setTimeout(() => {
        requestPermission();
        localStorage.setItem('dmind-notification-requested', 'true');
      }, 3000); // Wait 3 seconds before asking
    }
  }, [requestPermission]);

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

  const handleLineClick = () => {
    window.open('https://line.me/R/ti/p/@307rcire', '_blank');
  };

  if (isMobile) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
          <MobileHeader />
          <MobileMainContent
            onAssistantClick={handleAssistantClick}
            onManualClick={handleManualClick}
            onContactsClick={handleContactsClick}
            onAlertsClick={handleAlertsClick}
            onVictimReportsClick={handleVictimReportsClick}
            onLineClick={handleLineClick}
          />
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <DesktopLayout
        onAssistantClick={handleAssistantClick}
        onManualClick={handleManualClick}
        onContactsClick={handleContactsClick}
        onAlertsClick={handleAlertsClick}
        onVictimReportsClick={handleVictimReportsClick}
      />
    </ErrorBoundary>
  );
};

export default Index;
