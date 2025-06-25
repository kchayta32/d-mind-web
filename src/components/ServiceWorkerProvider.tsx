
import React, { useEffect, useState } from 'react';
import { useServiceWorker } from '@/hooks/useServiceWorker';

interface ServiceWorkerProviderProps {
  children: React.ReactNode;
}

const ServiceWorkerProvider: React.FC<ServiceWorkerProviderProps> = ({ children }) => {
  const [isFullyReady, setIsFullyReady] = useState(false);

  useEffect(() => {
    const checkFullReadiness = () => {
      try {
        // Multiple layer check for React readiness
        if (
          typeof React !== 'undefined' &&
          React &&
          React.useState &&
          React.useContext &&
          React.useEffect &&
          // Check if we're in a proper React component context
          typeof React.createElement === 'function'
        ) {
          // Test hook creation in a safe way
          try {
            const testState = React.useState(true);
            const testContext = React.useContext;
            
            if (testState && 
                Array.isArray(testState) && 
                testState.length === 2 &&
                typeof testContext === 'function') {
              console.log('All React systems ready for ServiceWorker');
              return true;
            }
          } catch (hookError) {
            console.warn('React hooks still not ready:', hookError);
            return false;
          }
        }
        return false;
      } catch (error) {
        console.warn('React system check failed:', error);
        return false;
      }
    };

    // Progressive readiness check
    let attempts = 0;
    const maxAttempts = 10;
    
    const checkWithRetry = () => {
      attempts++;
      
      if (checkFullReadiness()) {
        setIsFullyReady(true);
        return;
      }
      
      if (attempts < maxAttempts) {
        // Exponential backoff
        const delay = Math.min(100 * Math.pow(1.5, attempts), 1000);
        setTimeout(checkWithRetry, delay);
      } else {
        // Force enable after max attempts to prevent infinite waiting
        console.warn('Forcing ServiceWorker enablement after max attempts');
        setIsFullyReady(true);
      }
    };

    // Start checking after a brief initial delay
    const initialTimer = setTimeout(checkWithRetry, 200);

    return () => {
      clearTimeout(initialTimer);
    };
  }, []);

  // Only render ServiceWorkerWrapper when fully ready
  if (isFullyReady) {
    return <ServiceWorkerWrapper>{children}</ServiceWorkerWrapper>;
  }

  // Return children without ServiceWorker while not ready
  return <>{children}</>;
};

// Separate component to completely isolate hook usage
const ServiceWorkerWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Extra safety check before using hooks
  try {
    useServiceWorker();
  } catch (error) {
    console.warn('ServiceWorker hook failed, continuing without it:', error);
  }
  
  return <>{children}</>;
};

export default ServiceWorkerProvider;
