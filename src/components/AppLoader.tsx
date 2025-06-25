
import React, { useState, useEffect } from 'react';

interface AppLoaderProps {
  children: React.ReactNode;
}

const AppLoader: React.FC<AppLoaderProps> = ({ children }) => {
  const [isReactReady, setIsReactReady] = useState(false);

  useEffect(() => {
    // Check if React and all its hooks are properly available
    const checkReactReadiness = () => {
      if (
        typeof React !== 'undefined' &&
        React &&
        React.useState &&
        React.useEffect &&
        React.useContext &&
        React.useLayoutEffect
      ) {
        console.log('React is ready');
        setIsReactReady(true);
        return true;
      }
      return false;
    };

    // Try immediately
    if (!checkReactReadiness()) {
      // If not ready, try again with intervals
      const checkInterval = setInterval(() => {
        if (checkReactReadiness()) {
          clearInterval(checkInterval);
        }
      }, 50);

      // Cleanup interval after 5 seconds max
      const timeout = setTimeout(() => {
        clearInterval(checkInterval);
        console.warn('React readiness check timed out');
        setIsReactReady(true); // Force proceed
      }, 5000);

      return () => {
        clearInterval(checkInterval);
        clearTimeout(timeout);
      };
    }
  }, []);

  if (!isReactReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-4 rounded-2xl shadow-lg">
            <img 
              src="/lovable-uploads/b5550bd4-d83d-4e1e-ac09-025117b87c86.png" 
              alt="D-MIND Logo" 
              className="h-12 w-12"
            />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-blue-800 mb-2">D-MIND</h1>
            <p className="text-blue-600">กำลังเริ่มต้นระบบ...</p>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AppLoader;
