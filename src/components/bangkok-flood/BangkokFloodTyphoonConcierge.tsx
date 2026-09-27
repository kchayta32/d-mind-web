import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Car, 
  AlertTriangle, 
  RotateCcw, 
  Check, 
  Copy, 
  Radio, 
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  X,
  Compass
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  askTyphoonFloodConcierge, 
  VehicleProfile, 
  VEHICLE_PROFILES 
} from '@/services/typhoonFloodService';
import { BangkokRoadSegment } from '@/types/bangkokFlood';
import { BangkokCctvCamera } from '@/data/bangkokCctvData';

export interface BangkokFloodTyphoonConciergeProps {
  roads?: BangkokRoadSegment[];
  cctvs?: BangkokCctvCamera[];
  onSelectRoadByName?: (roadName: string) => void;
  initialQuestion?: string;
  isOpen?: boolean;
  onClose?: () => void;
  isFloating?: boolean;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'typhoon';
  text: string;
  timestamp: string;
  vehicleType?: VehicleProfile;
}

const QUICK_PROMPT_CHIPS = [
  {
    icon: '🚗',
    label: 'สยามไปพระราม 9 น้ำท่วมไหม?',
    prompt: 'จะเดินทางจากสยามไปพระราม 9 ระดับน้ำท่วมถนนเส้นไหนบ้าง และรถของฉันจะผ่านได้ไหม?'
  },
  {
    icon: '⚠️',
    label: '5 จุดถนนน้ำท่วมวิกฤต',
    prompt: 'สรุป 5 จุดถนนใน กทม. ที่มีระดับน้ำท่วมขังวิกฤตและห้ามผ่านในขณะนี้'
  },
  {
    icon: '🛵',
    label: 'เส้นทางปลอดภัยสำหรับมอเตอร์ไซค์',
    prompt: 'ขับขี่มอเตอร์ไซค์ใน กทม. วันนี้ มีจุดไหนและอุโมงค์ไหนที่ต้องหลีกเลี่ยงเด็ดขาด?'
  },
  {
    icon: '📹',
    label: 'CCTV จุดไหนระดับน้ำสูงที่สุด?',
    prompt: 'จากกล้อง CCTV และเซ็นเซอร์ กทม. จุดไหนตรวจพบระดับน้ำรอระบายสูงสุด?'
  },
  {
    icon: '🛣️',
    label: 'ทางด่วนยกระดับที่แนะนำ',
    prompt: 'แนะนำเส้นทางด่วนพิเศษยกระดับที่ปลอดภัยจากน้ำท่วมขัง 100% สำหรับเดินทางข้ามเมือง'
  }
];

export const BangkokFloodTyphoonConcierge: React.FC<BangkokFloodTyphoonConciergeProps> = ({
  roads = [],
  cctvs = [],
  onSelectRoadByName,
  initialQuestion,
  isOpen = true,
  onClose,
  isFloating = false
}) => {
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleProfile>('sedan');
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'typhoon',
      text: `สวัสดีครับ! ผมคือ **Typhoon AI Flood Concierge** ผู้ช่วยปัญญาประดิษฐ์วางแผนเส้นทางหลบน้ำท่วม กทม. (ขับเคลื่อนด้วย **typhoon-v2.5-30b-a3b-instruct**)\n\nผมพร้อมวิเคราะห์ระดับน้ำท่วมขังบนผิวถนนแบบเรียลไทม์ ตรวจสอบความปลอดภัยตามประเภทยานพาหนะของคุณ และแนะนำทางเลี่ยงที่แห้งและปลอดภัยที่สุดครับ 🌧️🚗\n\n*เลือกประเภทยานพาหนะของคุณด้านบน แล้วกดเลือกคำถามด่วนหรือพิมพ์จุดหมายได้เลยครับ!*`,
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Handle initial question from external props if provided
  useEffect(() => {
    if (initialQuestion && initialQuestion.trim() !== '') {
      handleSendMessage(initialQuestion);
    }
  }, [initialQuestion]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      vehicleType: selectedVehicle
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const aiReply = await askTyphoonFloodConcierge(text, selectedVehicle, roads, cctvs);
      const typhoonMsg: ChatMessage = {
        id: `typhoon-${Date.now()}`,
        sender: 'typhoon',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
        vehicleType: selectedVehicle
      };
      setMessages(prev => [...prev, typhoonMsg]);
    } catch (err) {
      console.error('Error in Typhoon Concierge:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(id);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'typhoon',
        text: `รีเซ็ตการสนทนาเรียบร้อยครับ! สอบถามเส้นทางหรือจุดน้ำท่วมขังที่ต้องการตรวจสอบได้เลยครับ`,
        timestamp: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className={`rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col transition-all duration-300 ${
      isFloating ? 'fixed bottom-6 right-6 w-full max-w-lg z-50 max-h-[85vh] border-blue-500/30 ring-1 ring-blue-500/20' : 'w-full'
    }`}>
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between gap-3 select-none">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-xl shadow-inner">
            🌪️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm sm:text-base text-white tracking-tight flex items-center gap-1.5">
                Typhoon AI ผู้ช่วยหลบน้ำท่วม กทม.
              </h3>
              <Badge className="bg-emerald-500/90 text-white text-[10px] font-mono px-2 py-0 border-0 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                v2.5 30B
              </Badge>
            </div>
            <p className="text-[11px] text-blue-100/80 line-clamp-1">
              วิเคราะห์ความปลอดภัยเส้นทางตามประเภทรถ & แนะนำทางเลี่ยงแบบเรียลไทม์
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleResetChat}
            title="ล้างประวัติการคุย"
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {isFloating && (
            <>
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition"
              >
                {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {!isCollapsed && (
        <>
          {/* 2. Vehicle Selector Filter Bar */}
          <div className="p-3 bg-slate-50 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-2">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                เลือกประเภทยานพาหนะของคุณ (เพื่อคำนวณระดับน้ำที่ปลอดภัย):
              </span>
              <span className="text-blue-600 dark:text-blue-400 font-mono">
                ปลอดภัย &le; {VEHICLE_PROFILES[selectedVehicle].safeDepthCm} ซม.
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {(Object.keys(VEHICLE_PROFILES) as VehicleProfile[]).map(vType => {
                const info = VEHICLE_PROFILES[vType];
                const isSelected = selectedVehicle === vType;
                const icon = vType === 'sedan' ? '🚗' : vType === 'suv' ? '🚙' : vType === 'motorcycle' ? '🛵' : '🚆';

                return (
                  <button
                    key={vType}
                    onClick={() => setSelectedVehicle(vType)}
                    className={`px-2.5 py-1.5 rounded-xl text-left border text-xs font-semibold flex items-center gap-2 transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-blue-400'
                    }`}
                  >
                    <span className="text-sm">{icon}</span>
                    <div className="truncate">
                      <div className="truncate font-bold leading-tight">{info.nameTh.split('/')[0]}</div>
                      <div className={`text-[10px] leading-tight ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                        {vType === 'public_transit' ? 'Skywalk' : `< ${info.safeDepthCm} cm`}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Quick 1-Click Prompt Chips */}
          <div className="px-3 py-2 bg-slate-100/60 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800/80 overflow-x-auto flex items-center gap-1.5 no-scrollbar">
            <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap pl-1">คำถามด่วน:</span>
            {QUICK_PROMPT_CHIPS.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip.prompt)}
                disabled={isLoading}
                className="whitespace-nowrap flex items-center gap-1 px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:text-blue-700 dark:hover:text-blue-300 transition shadow-2xs"
              >
                <span>{chip.icon}</span>
                <span>{chip.label}</span>
              </button>
            ))}
          </div>

          {/* 4. Chat Messages Scroll Area */}
          <div className="p-4 space-y-3.5 overflow-y-auto max-h-[380px] sm:max-h-[420px] bg-slate-50/50 dark:bg-slate-950/40">
            {messages.map(msg => {
              const isUser = msg.sender === 'user';

              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center text-sm flex-shrink-0 shadow-sm mt-0.5">
                      🌪️
                    </div>
                  )}

                  <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-sm transition-all ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-tr-xs'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-xs'
                  }`}>
                    {/* Message Header info for AI */}
                    {!isUser && (
                      <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-100 dark:border-slate-800 text-[10px] text-slate-400">
                        <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                          <Bot className="w-3 h-3" />
                          Typhoon AI Concierge
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span>{msg.timestamp}</span>
                          <button
                            onClick={() => handleCopy(msg.id, msg.text)}
                            title="คัดลอกข้อความ"
                            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                          >
                            {copiedMessageId === msg.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Content formatted */}
                    <div className="whitespace-pre-line space-y-1 font-sans">
                      {msg.text}
                    </div>

                    {isUser && (
                      <div className="text-[10px] text-blue-200 text-right mt-1 font-mono">
                        {msg.timestamp}
                      </div>
                    )}
                  </div>

                  {isUser && (
                    <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs flex-shrink-0 mt-0.5 font-bold">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Typing Loader */}
            {isLoading && (
              <div className="flex gap-2.5 items-start">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center text-sm flex-shrink-0 shadow-sm animate-pulse">
                  🌪️
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl rounded-tl-xs p-3.5 shadow-sm flex items-center gap-2 text-xs text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]"></span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 ml-1">
                    Typhoon AI กำลังวิเคราะห์ข้อมูลระดับน้ำและเส้นทางหลบน้ำท่วม...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* 5. Message Input Footer */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="พิมพ์จุดหมายหรือชื่อถนน เช่น 'ลาดพร้าวไปบางนา', 'รัชดาไปสยาม'..."
                  disabled={isLoading}
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <span>ส่งคำถาม</span>
                <Send className="w-3.5 h-3.5" />
              </Button>
            </form>

            <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1">
              <span>ขับเคลื่อนโดย OpenTyphoon LLM v2.5 30B</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                ● วิเคราะห์ข้อมูลจราจร & น้ำท่วม BMA สด
              </span>
            </div>
          </div>
        </>
      )}

    </div>
  );
};

export default BangkokFloodTyphoonConcierge;
