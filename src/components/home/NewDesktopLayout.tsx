import React from 'react';
import NewsCarousel from './NewsCarousel';
import AppDownloadSection from './AppDownloadSection';
import NavigationCards from './NavigationCards';
import MapBanner from './MapBanner';
import VideoTourSection from './VideoTourSection';
import MainLayout from '@/components/layout/MainLayout';

const NewDesktopLayout: React.FC = () => {
  return (
    <MainLayout className="bg-background text-foreground">
      {/* News Carousel (Replaces Hero) */}
      <NewsCarousel />

      {/* Navigation Cards */}
      <NavigationCards />

      {/* Watch a one-minute video tour of d-mind-web */}
      <VideoTourSection />

      {/* Map Banner */}
      <MapBanner />

      {/* App Download Section */}
      <AppDownloadSection />
    </MainLayout>
  );
};

export default NewDesktopLayout;

