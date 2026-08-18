import React from 'react';
import NewsCarousel from './NewsCarousel';
import AppDownloadSection from './AppDownloadSection';
import NavigationCards from './NavigationCards';
import MapBanner from './MapBanner';
import MainLayout from '@/components/layout/MainLayout';

const NewDesktopLayout: React.FC = () => {
  return (
    <MainLayout className="bg-background text-foreground">
      {/* News Carousel (Replaces Hero) */}
      <NewsCarousel />

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

