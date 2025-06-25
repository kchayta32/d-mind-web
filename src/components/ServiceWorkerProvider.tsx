
import React, { useEffect, useState } from 'react';
import { useServiceWorker } from '@/hooks/useServiceWorker';

interface ServiceWorkerProviderProps {
  children: React.ReactNode;
}

const ServiceWorkerProvider: React.FC<ServiceWorkerProviderProps> = ({ children }) => {
  const [canUseHooks, setCanUseHooks] = useState(false);

  useEffect(() => {
    // Ensure React is fully ready before allowing hooks to run
    const checkReactReady = () => {
      try {
        // Test if React hooks system is working
        const testState = React.useState(true);
        if (testState && Array.isArray(testState) && testState.length === 2) {
          setCanUseHooks(true);
          return true;
        }
      } catch (error) {
        console.warn('React hooks not ready yet, retrying...', error);
        return false;
      }
      return false;
    };

    // Try immediately first
    if (!checkReactReady()) {
      // If not ready, try again after a short delay
      const timer = setTimeout(() => {
        if (!checkReactReady()) {
          // Force enable after timeout to prevent infinite waiting
          console.warn('Forcing hook enablement after timeout');
          setCanUseHooks(true);
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, []);

  // Conditionally use service worker only when React is ready
  if (canUseHooks) {
    // This component will re-render once canUseHooks becomes true
    return <ServiceWorkerWrapper>{children}</ServiceWorkerWrapper>;
  }

  return <>{children}</>;
};

// Separate component to isolate hook usage
const ServiceWorkerWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useServiceWorker();
  return <>{children}</>;
};

export default ServiceWorkerProvider;
