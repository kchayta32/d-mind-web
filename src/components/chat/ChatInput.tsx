
import React from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  message, 
  setMessage, 
  onSendMessage, 
  isLoading 
}) => {
  return (
    <div className="p-4 bg-white border-t border-blue-200 shadow-lg">
      <form onSubmit={onSendMessage} className="flex gap-3">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="ถามคำถามเกี่ยวกับภัยพิบัติหรือความช่วยเหลือฉุกเฉิน..."
          className="flex-1 border-blue-200 focus:border-blue-400 focus:ring-blue-400 rounded-full px-4 py-3"
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-full w-12 h-12 p-0 flex items-center justify-center shadow-md"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
        </Button>
      </form>
    </div>
  );
};

export default ChatInput;
