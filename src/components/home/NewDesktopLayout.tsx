import React from 'react';
import NewsCarousel from './NewsCarousel';
import AppDownloadSection from './AppDownloadSection';
import NavigationCards from './NavigationCards';
import MapBanner from './MapBanner';
import BangkokFloodBanner from './BangkokFloodBanner';
import BangkokCafeFloodBanner from './BangkokCafeFloodBanner';
import VideoTourSection from './VideoTourSection';
import { SatisfactionSurveyBanner } from './SatisfactionSurveyBanner';
import { LiveCrisisTicker } from './LiveCrisisTicker';
import { SurvivalKitWidget } from './SurvivalKitWidget';
import MainLayout from '@/components/layout/MainLayout';

const NewDesktopLayout: React.FC = () => {
  return (
    <MainLayout className="bg-background text-foreground">
      {/* [NEW] Real-time Bangkok Disaster & Weather Status Pulse */}
      <LiveCrisisTicker />

      {/* News Carousel (Replaces Hero) */}
      <NewsCarousel />

      {/* Navigation Cards (บริการหลัก) */}
      <NavigationCards />

      {/* [NEW] Interactive 72-Hour Survival Go-Bag Checklist & Gamified Scoring */}
      <SurvivalKitWidget />

      {/* [NEW] แบบประเมินความพึงพอใจและผลการทดสอบระบบ D-MIND */}
      <SatisfactionSurveyBanner />

      {/* Watch a one-minute video tour of d-mind-web */}
      <VideoTourSection />

      {/* Map Banner (การ์ดสำรวจ แผนที่ภัยพิบัติ) */}
      <MapBanner />

      {/* [NEW] ระบบแผนที่ตรวจสอบสภาพน้ำท่วมขังถนนและโทรมาตรวัดน้ำ กทม. */}
      <BangkokFloodBanner />

      {/* [NEW] เรดาร์คาเฟ่ & บาร์ ที่เปิดให้บริการ ปลอดภัยจากน้ำท่วม กทม. และปริมณฑล */}
      <BangkokCafeFloodBanner />

      {/* App Download Section */}
      <AppDownloadSection />
    </MainLayout>
  );
};

export default NewDesktopLayout;
