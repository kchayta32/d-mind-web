import React from 'react';
import NewsCarousel from './NewsCarousel';
import AppDownloadSection from './AppDownloadSection';
import NavigationCards from './NavigationCards';
import DailyStatsCard from './DailyStatsCard';
import MapBanner from './MapBanner';
import MainLayout from '@/components/layout/MainLayout';

const NewDesktopLayout: React.FC = () => {
  return (
    <MainLayout className="bg-slate-900">
      {/* News Carousel (Replaces Hero) */}
      <NewsCarousel />

      {/* Daily Statistics */}
      <div className="container mx-auto px-4 py-12">
        <DailyStatsCard />
      </div>

      {/* Navigation Cards */}
      <NavigationCards />

      {/* Map Banner */}
      <MapBanner />

      {/* App Download Section */}
      <AppDownloadSection />
    </MainLayout>
  );
};

export default NewDesktopLayout;
