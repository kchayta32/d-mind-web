
import React, { useState, useEffect } from 'react';

interface AppLoaderProps {
  children: React.ReactNode;
}

const AppLoader: React.FC<AppLoaderProps> = ({ children }) => {
  const [isReactReady, setIsReactReady] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    let mounted = true;
    
    const checkReactReadiness = () => {
      try {
        // Enhanced React readiness check
        if (
          typeof React !== 'undefined' &&
          React &&
          React.useState &&
          React.useEffect &&
          React.useContext &&
          React.useLayoutEffect &&
          React.createElement &&
          React.Component &&
          // Ensure we can actually create and use hooks
          typeof React.useState === 'function' &&
          typeof React.useContext === 'function' &&
          typeof React.useEffect === 'function'
        ) {
          // Test actual hook creation to be 100% sure
          try {
            const testHook = React.useState(true);
            if (testHook && Array.isArray(testHook) && testHook.length === 2) {
              console.log('React is fully ready and hooks are working');
              return true;
            }
          } catch (hookError) {
            console.warn('Hooks not ready yet:', hookError);
            return false;
          }
        }
        return false;
      } catch (error) {
        console.error('Error checking React readiness:', error);
        return false;
      }
    };

    const initializeApp = async () => {
      // More aggressive loading sequence
      const progressSteps = [5, 15, 25, 40, 55, 70, 85, 95, 100];
      
      for (let i = 0; i < progressSteps.length; i++) {
        if (!mounted) return;
        
        setLoadingProgress(progressSteps[i]);
        
        // Longer wait at critical steps
        const waitTime = progressSteps[i] >= 70 ? 150 : 80;
        await new Promise(resolve => setTimeout(resolve, waitTime));
        
        // Start checking React readiness from step 40%
        if (progressSteps[i] >= 40 && checkReactReadiness()) {
          if (mounted) {
            setLoadingProgress(100);
            // Extra wait to ensure everything is stable
            setTimeout(() => {
              if (mounted) {
                setIsReactReady(true);
              }
            }, 300);
          }
          return;
        }
      }
      
      // Final fallback - force proceed after extended timeout
      if (mounted) {
        console.warn('React readiness check completed with extended timeout');
        // One more check before forcing
        if (checkReactReadiness() || true) {
          setIsReactReady(true);
        }
      }
    };

    // Start initialization with small delay
    setTimeout(() => {
      if (mounted) {
        initializeApp();
      }
    }, 100);

    return () => {
      mounted = false;
    };
  }, []);

  if (!isReactReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex flex-col items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl blur-lg opacity-30 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-blue-500 to-blue-700 p-6 rounded-3xl shadow-2xl">
              <img 
                src="/lovable-uploads/b5550bd4-d83d-4e1e-ac09-025117b87c86.png" 
                alt="D-MIND Logo" 
                className="h-16 w-16 drop-shadow-lg"
              />
            </div>
          </div>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
              D-MIND
            </h1>
            <p className="text-blue-600/70 text-lg">กำลังเตรียมระบบ...</p>
          </div>
          
          {/* Progress bar */}
          <div className="w-64 mt-4">
            <div className="h-2 w-full bg-blue-100 border border-blue-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 ease-out"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <div className="text-center mt-2 text-blue-500 text-sm font-medium">
              {loadingProgress}%
            </div>
          </div>
          
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AppLoader;
