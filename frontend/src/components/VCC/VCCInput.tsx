import React, { useState, useRef, useEffect } from 'react';
import { Plus, Send, X } from 'lucide-react';
import { MagicPocketMenu } from './MagicPocketMenu';
import { useAppContext } from './AppContext';

interface VCCInputProps {
  onSendMessage: (text: string) => void;
}

export const VCCInput: React.FC<VCCInputProps> = ({ onSendMessage }) => {
  const { t } = useAppContext();
  const [text, setText] = useState('');
  const [showPocket, setShowPocket] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close pocket when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowPocket(false);
      }
    };

    if (showPocket) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPocket]);

  const quickReplies = [
    { key: 'ai.quick_reply.check_in', text: t('ai.quick_reply.check_in') },
    { key: 'ai.quick_reply.jpy', text: t('ai.quick_reply.jpy') },
    { key: 'ai.quick_reply.auto_currency', text: t('ai.quick_reply.auto_currency') },
    { key: 'ai.quick_reply.notify_off', text: t('ai.quick_reply.notify_off') },
    { key: 'ai.quick_reply.dark_mode', text: t('ai.quick_reply.dark_mode') },
  ];

  const handleSend = () => {
    if (text.trim()) {
      onSendMessage(text.trim());
      setText('');
      setShowPocket(false);
    }
  };

  return (
    <div className="flex flex-col w-full bg-transparent pb-4 z-20 transition-all border-t-0" ref={containerRef}>
      
      {/* Floating Quick Replies (Capsules) */}
      <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide no-scrollbar w-full">
        {quickReplies.map(reply => (
          <button 
            key={reply.key}
            onClick={() => onSendMessage(reply.text)}
            className="whitespace-nowrap px-3.5 py-1.5 bg-white dark:bg-[#1C1C1E] border border-black/8 dark:border-white/8 rounded-full text-[var(--wa-teal)] text-[13px] font-medium shadow-sm active:opacity-70 flex-shrink-0 transition-all active:scale-95"
          >
            {reply.text}
          </button>
        ))}
      </div>

      {/* Main WhatsApp-style Input Bar */}
      <div className="flex items-center gap-2 px-3 pb-2">
        <button 
          onClick={() => setShowPocket(!showPocket)} 
          className="p-2 text-gray-500 dark:text-gray-400 transition-transform active:scale-90"
        >
          {showPocket ? <X className="w-7 h-7 text-[var(--wa-teal)]" /> : <Plus className="w-7 h-7" />}
        </button>
        
        <div className="flex-1 bg-white dark:bg-[#1C1C1E] rounded-2xl border border-black/8 dark:border-white/8 px-4 py-2.5 flex items-center shadow-sm">
          <input 
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('ai.input_placeholder')}
            className="w-full outline-none text-gray-800 dark:text-white bg-transparent text-[15px] placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
        </div>
        
        <button 
          onClick={handleSend}
          className={`w-11 h-11 rounded-full flex items-center justify-center shadow-md transition-all active:scale-90 shrink-0 ${
            text.trim() ? 'bg-[var(--wa-teal)] text-white' : 'bg-gray-200 dark:bg-white/10 text-gray-400'
          }`}
          disabled={!text.trim()}
        >
          <Send className="w-5 h-5 ml-1" />
        </button>
      </div>

      {/* Magic Pocket Drawer (WeChat Extensions) */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showPocket ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
        <MagicPocketMenu isOpen={showPocket} />
      </div>
      
    </div>
  );
};
