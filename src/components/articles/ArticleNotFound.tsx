
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ArticleNotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">ไม่พบบทความ</h1>
        <Button onClick={() => navigate('/manual')}>กลับสู่คู่มือฉุกเฉิน</Button>
      </div>
    </div>
  );
};

export default ArticleNotFound;
