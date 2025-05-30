
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const AppLogo: React.FC<AppLogoProps> = ({ size = 'md', className = '' }) => {
  const navigate = useNavigate();

  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-6 w-6', 
    lg: 'h-8 w-8'
  };

  const containerClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3'
  };

  const handleClick = () => {
    navigate('/');
  };

  return (
    <div 
      className={`bg-gradient-to-br from-blue-600 to-blue-700 ${containerClasses[size]} rounded-xl shadow-md cursor-pointer transition-transform hover:scale-105 ${className}`}
      onClick={handleClick}
      title="กลับหน้าหลัก"
    >
      <img 
        src="/lovable-uploads/b5550bd4-d83d-4e1e-ac09-025117b87c86.png" 
        alt="D-MIND Logo" 
        className={sizeClasses[size]}
      />
    </div>
  );
};

export default AppLogo;
