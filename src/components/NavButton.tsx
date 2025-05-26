
import React from 'react';
import { cn } from '@/lib/utils';

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
}

const NavButton: React.FC<NavButtonProps> = ({ icon, label, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow-md transition-all hover:shadow-lg hover:scale-105 flex-1 min-w-[70px] h-24 border border-guardian-light-blue/20",
        className
      )}
    >
      <div className="text-guardian-blue mb-2">
        {icon}
      </div>
      <span className="text-xs text-center font-medium line-clamp-2 text-guardian-dark-blue">{label}</span>
    </button>
  );
};

export default NavButton;
