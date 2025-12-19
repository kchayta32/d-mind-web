import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import DisasterMapComponent from '@/components/DisasterMap';
import { DisasterMapSidebar } from '@/components/disaster-map/DisasterMapSidebar';
import MobileUsageTip from '@/components/disaster-map/MobileUsageTip';
import Navbar from '@/components/layout/Navbar';

const DisasterMap: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50 flex-col">
        <Navbar />

        <div className="flex-1 flex pt-16 h-screen overflow-hidden">
          {/* Added pt-16 for navbar and overflow-hidden for map container */}
          <DisasterMapSidebar />

          <div className="flex-1 flex flex-col relative z-0">
            {/* Main Content */}
            <div className="flex-1 relative">
              <DisasterMapComponent />
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
