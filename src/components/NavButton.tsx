
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
  gradient?: string;
}

const NavButton: React.FC<NavButtonProps> = ({ 
  icon, 
  label, 
  onClick, 
  className,
  gradient = "from-blue-500 to-indigo-500"
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="relative group">
      <div className={cn(
        "absolute -inset-0.5 bg-gradient-to-r rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300",
        `${gradient}`
      )}></div>
      <Button 
        variant="outline" 
        className={cn(
          "relative h-auto p-5 flex flex-col items-center justify-center gap-3 bg-white/90 backdrop-blur-sm hover:bg-white border-0 text-gray-700 hover:text-gray-800 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] font-semibold rounded-xl",
          className
        )}
        onClick={onClick}
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-lg bg-gradient-to-r text-white shadow-lg",
            `${gradient}`
          )}>
            {icon}
          </div>
          {!isMobile && <span className="text-sm font-semibold">{label}</span>}
        </div>
        {isMobile && <span className="text-xs font-medium text-center leading-tight">{label}</span>}
      </Button>
    </div>
  );
};

export default NavButton;
