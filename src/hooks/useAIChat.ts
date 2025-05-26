
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ChatMessage } from '@/types/chat';

export const useAIChat = () => {
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "ฉันเป็นผู้ช่วย AI ด้านภัยพิบัติ สามารถช่วยคุณเกี่ยวกับความปลอดภัยและการรับมือกับเหตุฉุกเฉินได้ คุณมีคำถามอะไรไหมคะ?",
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleQuestionSelect = (question: string) => {
    setMessage(question);
    // Auto-submit the selected question
    setTimeout(() => {
      handleSendMessage(new Event('submit') as any);
    }, 100);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;

    // เพิ่มข้อความของผู้ใช้ในแชท
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);
    
    try {
      // สร้างประวัติการแชทในรูปแบบที่ OpenAI ต้องการ
      const chatHistory = messages.slice(1).map(msg => ({
        role: msg.sender,
        content: msg.content
      }));

      // เรียกใช้ Edge Function
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message,
          chatHistory
        }
      });

      if (error) throw new Error(error.message);

      // เพิ่มข้อความการตอบกลับจาก AI
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      
      toast({
        title: "ข้อความใหม่",
        description: "ผู้ช่วย AI ได้ตอบกลับข้อความของคุณแล้ว",
      });
    } catch (error) {
      console.error('Error calling AI:', error);
      
      toast({
        title: "ขออภัย",
        description: "เกิดข้อผิดพลาดในการเรียกใช้ AI กรุณาลองอีกครั้ง",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    message,
    setMessage,
    messages,
    isLoading,
    handleQuestionSelect,
    handleSendMessage
  };
};
