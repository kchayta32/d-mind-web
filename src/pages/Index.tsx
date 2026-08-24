import React, { useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { useOfflineMode } from '@/hooks/useOfflineMode';
import { useNotifications } from '@/hooks/useNotifications';
import NewMobileLayout from '@/components/home/NewMobileLayout';
import NewDesktopLayout from '@/components/home/NewDesktopLayout';
import ErrorBoundary from '@/components/ErrorBoundary';

const Index = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { isOnline, cacheData } = useOfflineMode();
  const { requestPermission } = useNotifications();

  // Prevent auto-scroll with useLayoutEffect for immediate execution
  useLayoutEffect(() => {
    // Force scroll to top immediately
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Prevent any scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  // Force scroll to top on mount cleanly
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Request notification permission immediately on first load
  useEffect(() => {
    const hasRequestedPermission = localStorage.getItem('dmind-notification-requested');
    if (!hasRequestedPermission) {
      // Request permission immediately when app loads
      setTimeout(() => {
        requestPermission();
        localStorage.setItem('dmind-notification-requested', 'true');
      }, 1000); // Reduced from 3000 to 1000ms
    }
  }, [requestPermission]);

  if (isMobile) {
    return (
      <ErrorBoundary>
        <NewMobileLayout />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <NewDesktopLayout />
    </ErrorBoundary>
  );
};

export default Index;
