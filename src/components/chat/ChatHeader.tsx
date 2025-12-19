
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatHeaderProps {
  onGoBack: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onGoBack }) => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center shadow-lg">
      <Button
        variant="ghost"
        size="icon"
        className="text-white mr-3 hover:bg-blue-500/30 rounded-full"
        onClick={onGoBack}
      >
        <ArrowLeft size={24} />
      </Button>
      <div className="flex items-center">
        <img
          src="/dmind-premium-icon.png"
          alt="D-MIND Logo"
          className="h-8 w-8 mr-3"
        />
        <div>
          <h1 className="text-xl font-bold">ผู้ช่วย AI D-MIND</h1>
          <p className="text-sm opacity-90">สอบถามข้อมูลเกี่ยวกับความปลอดภัยและภัยพิบัติ</p>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
