import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import DisasterMapComponent from '@/components/DisasterMap';
import { DisasterMapSidebar } from '@/components/disaster-map/DisasterMapSidebar';
import MobileUsageTip from '@/components/disaster-map/MobileUsageTip';
import Navbar from '@/components/layout/Navbar';
import { DisasterMapErrorBoundary } from '@/components/disaster-map/ErrorBoundary';

const DisasterMap: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50 dark:bg-background text-foreground flex-col transition-colors duration-300">
        <Navbar />

        <div className="flex-1 flex pt-16 h-screen overflow-hidden">
          {/* Sidebar for disaster map */}
          <DisasterMapSidebar />

          <div className="flex-1 flex flex-col relative z-0 overflow-y-auto lg:overflow-hidden">
            {/* Main Content with dedicated Error Boundary */}
            <div className="flex-1 relative p-2 sm:p-3 lg:p-4 overflow-y-auto lg:overflow-hidden flex flex-col">
              <DisasterMapErrorBoundary>
                <DisasterMapComponent />
              </DisasterMapErrorBoundary>
            </div>
          </div>

          {/* Mobile Usage Tip */}
          {isMobile && <MobileUsageTip />}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DisasterMap;
