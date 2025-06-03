
import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavButton from './NavButton';
import { MessageSquare, Phone, BookOpen, Bell, Star, HelpCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavBarProps {
  onAssistantClick: () => void;
  onManualClick: () => void;
  onContactsClick: () => void;
  onAlertsClick: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ 
  onAssistantClick, 
  onManualClick,
  onContactsClick,
  onAlertsClick
}) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const handleSurveyClick = () => {
    navigate('/satisfaction-survey');
  };

  const handleAppGuideClick = () => {
    navigate('/app-guide');
  };

  if (isMobile) {
    // Enhanced Mobile layout with beautiful gradient cards
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 w-full">
          <NavButton 
            icon={<MessageSquare size={24} />}
            label="AI Assistant"
            onClick={onAssistantClick}
            gradient="from-blue-500 to-cyan-500"
          />
          <NavButton 
            icon={<BookOpen size={24} />}
            label="Emergency Manual"
            onClick={onManualClick}
            gradient="from-green-500 to-emerald-500"
          />
          <NavButton 
            icon={<Phone size={24} />}
            label="Emergency Contacts"
            onClick={onContactsClick}
            gradient="from-red-500 to-pink-500"
          />
          <NavButton 
            icon={<Bell size={24} />}
            label="การแจ้งเตือนภัยทั้งหมด"
            onClick={onAlertsClick}
            gradient="from-orange-500 to-yellow-500"
          />
          <NavButton 
            icon={<HelpCircle size={24} />}
            label="คู่มือการใช้งานแอพ"
            onClick={handleAppGuideClick}
            gradient="from-purple-500 to-indigo-500"
            className="col-span-2"
          />
        </div>
        
        {/* Enhanced Survey Button */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
          <NavButton 
            icon={<Star size={24} />}
            label="ประเมินความพึงพอใจ"
            onClick={handleSurveyClick}
            gradient="from-yellow-400 to-orange-400"
            className="relative w-full bg-white border-0 text-orange-600 hover:text-orange-700 shadow-lg"
          />
        </div>
      </div>
    );
  }

  // Enhanced Desktop layout with modern styling
  return (
    <div className="space-y-3 w-full">
      <NavButton 
        icon={<MessageSquare size={20} />}
        label="AI Assistant"
        onClick={onAssistantClick}
        gradient="from-blue-500 to-cyan-500"
        className="w-full justify-start text-left"
      />
      <NavButton 
        icon={<BookOpen size={20} />}
        label="คู่มือและบทความ"
        onClick={onManualClick}
        gradient="from-green-500 to-emerald-500"
        className="w-full justify-start text-left"
      />
      <NavButton 
        icon={<Phone size={20} />}
        label="หมายเลขฉุกเฉิน"
        onClick={onContactsClick}
        gradient="from-red-500 to-pink-500"
        className="w-full justify-start text-left"
      />
      <NavButton 
        icon={<Bell size={20} />}
        label="การแจ้งเตือนภัยทั้งหมด"
        onClick={onAlertsClick}
        gradient="from-orange-500 to-yellow-500"
        className="w-full justify-start text-left"
      />
      <NavButton 
        icon={<HelpCircle size={20} />}
        label="คู่มือการใช้งานแอพ"
        onClick={handleAppGuideClick}
        gradient="from-purple-500 to-indigo-500"
        className="w-full justify-start text-left"
      />
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
        <NavButton 
          icon={<Star size={20} />}
          label="ประเมินความพึงพอใจ"
          onClick={handleSurveyClick}
          gradient="from-yellow-400 to-orange-400"
          className="relative w-full justify-start text-left bg-white border-0 text-orange-600 hover:text-orange-700"
        />
      </div>
    </div>
  );
};

export default NavBar;
