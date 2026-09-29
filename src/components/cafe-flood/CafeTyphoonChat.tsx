import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Trash2, 
  Compass, 
  Coffee, 
  ShieldCheck, 
  AlertTriangle, 
  Waves, 
  X,
  RefreshCw,
  Zap,
  CornerDownLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CafeVenue, FilterState } from '@/types/cafeFlood';
import { askTyphoonCafeConcierge } from '@/services/typhoonCafeService';
import { TyphoonMarkdownRenderer } from '@/components/chat/TyphoonMarkdownRenderer';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface CafeTyphoonChatProps {
  venuesContext: CafeVenue[];
  selectedVenue?: CafeVenue | null;
  filterState?: FilterState;
  onSelectVenue?: (venue: CafeVenue) => void;
  onClose?: () => void;
  className?: string;
  initialQuery?: string;
}

const QUICK_PROMPT_CHIPS = [
  { label: '🍵 หาร้านมัทฉะเปิดตอนนี้ น้ำไม่ท่วม', text: 'หาร้านมัทฉะเกรดพรีเมียมที่เปิดให้บริการตอนนี้ และอยู่ในพื้นที่ปลอดภัยจากน้ำท่วม' },
  { label: '☕ ร้านกาแฟนั่งทำงาน มีปลั๊ก & แอร์ฉ่ำ', text: 'แนะนำร้านกาแฟ Specialty สำหรับนั่งทำงานยาวๆ มีปลั๊กไฟ แอร์เย็น และ Wi-Fi เสถียร' },
  { label: '🍸 แนะนำบาร์ลับฝั่งธนฯ คืนนี้', text: 'คืนนี้มีบาร์ลับหรือ Speakeasy แนะนำฝั่งธนบุรีไหม ที่เดินทางสะดวกและน้ำไม่ท่วม' },
  { label: '🚗 คาเฟ่ที่มีที่จอดรถในร่ม ปลอดภัยตอนฝนตก', text: 'แนะนำคาเฟ่ที่มีที่จอดรถในร่ม ปลอดภัยไม่ต้องลุยน้ำท่วมขังเวลาฝนตก' },
  { label: '🌧️ ฝนตกหนักแถวสุขุมวิท ไปไหนดี', text: 'ตอนนี้ฝนตกหนักแถวสุขุมวิท/อโศก/ทองหล่อ แนะนำร้านที่เดินทางเชื่อม Skywalk ปลอดภัยที่สุด' },
];

export const CafeTyphoonChat: React.FC<CafeTyphoonChatProps> = ({
  venuesContext,
  selectedVenue,
  filterState,
  onSelectVenue,
  onClose,
  className = '',
  initialQuery,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      content: `สวัสดีครับ! ผมคือ **Typhoon AI Barista & Flood Weather Concierge** 🌪️☕
      
พร้อมแนะนำร้านกาแฟ Specialty, มัทฉะพรีเมียม, ค็อกเทลบาร์ และพื้นที่นั่งทำงานที่ตรงใจ พร้อมประเมิน **ความปลอดภัยจากน้ำท่วม กทม.** ให้คุณเดินทางได้อย่างสบายใจ ไร้กังวล

คุณสามารถพิมพ์คำถาม หรือเลือกหัวข้อด่วนด้านล่างได้เลยครับ!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle auto query if passed from card/modal
  useEffect(() => {
    if (initialQuery && initialQuery.trim().length > 0) {
      sendMessage(initialQuery);
    }
  }, [initialQuery]);

  // Handle ask regarding selectedVenue change
  useEffect(() => {
    if (selectedVenue) {
      const prompt = `ขอคำแนะนำเพิ่มเติมเกี่ยวกับร้าน "${selectedVenue.name}" (${selectedVenue.district}) ทั้งเรื่องเมนูเด่น ความสะดวกในการนั่งทำงาน และความปลอดภัยจากน้ำท่วม`;
      sendMessage(prompt);
    }
  }, [selectedVenue?.id]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const reply = await askTyphoonCafeConcierge(
        text,
        venuesContext,
        filterState
      );

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        content:
          'ขออภัยครับ ขณะนี้ระบบการเชื่อมต่อชั่วคราวติดขัด แต่คุณยังสามารถค้นหาและตรวจสอบหมุดร้านที่ปลอดภัยจากน้ำท่วมได้บนแผนที่ทันทีครับ!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        content: 'เริ่มต้นการสนทนาใหม่แล้วครับ! มีอะไรให้ Typhoon AI ช่วยแนะนำคาเฟ่หรือความปลอดภัยน้ำท่วมวันนี้ไหมครับ? ☕',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div
      className={`flex flex-col h-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md ${className}`}
    >
      {/* Chat Header */}
      <div className="p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-600/30">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-slate-950" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                <span>Typhoon AI บาริสต้า & หลบน้ำท่วม</span>
              </h3>
              <Badge
                variant="outline"
                className="bg-cyan-100 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-300 border-cyan-300 dark:border-cyan-700/50 text-[10px] px-1.5 py-0 font-mono"
              >
                typhoon-v2.5
              </Badge>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Powered by typhoon-v2.5-30b-a3b-instruct
            </p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={clearChat}
            className="w-8 h-8 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            title="ล้างข้อความทั้งหมด"
          >
            <Trash2 className="w-4 h-4" />
          </Button>

          {onClose && (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={onClose}
              className="w-8 h-8 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Messages Thread Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-800">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-3.5 shadow-md ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
                }`}
              >
                {/* Message Content */}
                {isUser ? (
                  <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
                    {msg.content}
                  </p>
                ) : (
                  <TyphoonMarkdownRenderer
                    content={msg.content}
                  />
                )}

                <div
                  className={`text-[10px] mt-1.5 flex items-center gap-1 ${
                    isUser ? 'text-blue-200 justify-end' : 'text-slate-400 justify-start'
                  }`}
                >
                  {!isUser && <Bot className="w-3 h-3 text-cyan-400 inline" />}
                  <span>{msg.timestamp}</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-2">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none p-3 shadow-md flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-xs text-slate-300 font-medium">
                Typhoon AI กำลังวิเคราะห์ร้านและข้อมูลน้ำท่วม...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Chips */}
      <div className="px-3 py-2 bg-slate-50/90 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800/80 overflow-x-auto scrollbar-none flex items-center gap-1.5 shrink-0">
        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium shrink-0 flex items-center gap-1 pl-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          คำถามด่วน:
        </span>
        {QUICK_PROMPT_CHIPS.map((chip, i) => (
          <button
            key={i}
            onClick={() => sendMessage(chip.text)}
            disabled={isLoading}
            className="text-[11px] font-medium bg-white hover:bg-slate-100 dark:bg-slate-800/90 dark:hover:bg-slate-700/90 disabled:opacity-50 text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700/60 whitespace-nowrap transition-colors shrink-0 shadow-xs"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Input Box Footer */}
      <div className="p-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="พิมพ์คำถาม เช่น ร้านมัทฉะใกล้รถไฟฟ้า, กาแฟนั่งทำงานน้ำไม่ท่วม..."
              disabled={isLoading}
              className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-50 transition-all pr-8"
            />
            {inputValue && (
              <button
                type="button"
                onClick={() => setInputValue('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <Button
            type="button"
            onClick={() => sendMessage(inputValue)}
            disabled={!inputValue.trim() || isLoading}
            className="h-10 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-cyan-900/30 disabled:opacity-40 transition-all"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline text-xs">ส่ง</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CafeTyphoonChat;
