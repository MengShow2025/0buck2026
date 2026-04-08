import React, { useState } from 'react';
import { Plus, Send, X } from 'lucide-react';
import { MagicPocketMenu } from './MagicPocketMenu';

interface VCCInputProps {
  onSendMessage: (text: string) => void;
}

export const VCCInput: React.FC<VCCInputProps> = ({ onSendMessage }) => {
  const [text, setText] = useState('');
  const [showPocket, setShowPocket] = useState(false);

  const quickReplies = ['⚡️ 0Buck 严选', '💸 我的返现', '📦 查物流', '🤝 拼团广场'];

  const handleSend = () => {
    if (text.trim()) {
      onSendMessage(text.trim());
      setText('');
    }
  };

  return (
    <div className="flex flex-col w-full bg-transparent pb-4 z-20 transition-all">
      
      {/* Floating Quick Replies (Capsules) */}
      <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide no-scrollbar w-full">
        {quickReplies.map(reply => (
          <button 
            key={reply}
            onClick={() => onSendMessage(reply)}
            className="whitespace-nowrap px-4 py-2 bg-white border border-gray-200 rounded-full text-[var(--wa-teal)] text-[13px] font-semibold shadow-sm active:bg-gray-50 flex-shrink-0 transition-transform active:scale-95"
          >
            {reply}
          </button>
        ))}
      </div>

      {/* Main WhatsApp-style Input Bar */}
      <div className="flex items-center gap-2 px-3 pb-2">
        <button 
          onClick={() => setShowPocket(!showPocket)} 
          className="p-2 text-gray-500 transition-transform active:scale-90"
        >
          {showPocket ? <X className="w-7 h-7 text-[var(--wa-teal)]" /> : <Plus className="w-7 h-7" />}
        </button>
        
        <div className="flex-1 bg-white rounded-3xl border border-gray-300 px-4 py-2.5 flex items-center shadow-sm">
          <input 
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Message Dumbo..."
            className="w-full outline-none text-gray-800 bg-transparent text-[15px] placeholder:text-gray-400"
          />
        </div>
        
        <button 
          onClick={handleSend}
          className={`w-11 h-11 rounded-full flex items-center justify-center shadow-md transition-all active:scale-90 ${
            text.trim() ? 'bg-[var(--wa-teal)] text-white' : 'bg-gray-200 text-gray-400'
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
