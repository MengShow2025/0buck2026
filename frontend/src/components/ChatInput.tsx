import React from 'react';
import { PlusCircle, ImageIcon, Paperclip, Mic, Send, Plus } from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  placeholder?: string;
  compact?: boolean;
}

export default function ChatInput({ value, onChange, onSubmit, placeholder, compact = false }: ChatInputProps) {
  return (
    <form 
      onSubmit={onSubmit}
      className={`flex items-center bg-[#050505]/90 border border-zinc-800 shadow-2xl focus-within:border-[#FF5C00]/50 transition-all duration-500 group/form w-full relative z-50 ${
        compact ? 'rounded-2xl py-2 px-3 gap-2' : 'rounded-[2rem] px-8 py-4 gap-6'
      }`}
    >
      {/* Plus Button with Flyout */}
      <div className="relative group/plus flex items-center">
        <button type="button" className={`hover:text-[#FF5C00] transition-colors flex items-center justify-center text-zinc-500 ${compact ? 'p-1' : 'p-2.5 rounded-2xl hover:bg-white/5'}`}>
          {compact ? <Plus className="w-5 h-5" /> : <PlusCircle className="w-6 h-6" />}
        </button>
        
        {/* Flyout Menu - Added pb-4 bridge to prevent hover loss when moving mouse up */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 pb-4 opacity-0 pointer-events-none group-hover/plus:opacity-100 group-hover/plus:pointer-events-auto transition-all duration-200 z-[100]">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-1.5 flex gap-1.5 shadow-2xl transform origin-bottom scale-95 group-hover/plus:scale-100 transition-all">
            <div className="hover:text-[#FF5C00] text-zinc-400 hover:bg-white/10 p-2.5 rounded-lg cursor-pointer transition-colors" title="Upload Image">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div className="hover:text-[#FF5C00] text-zinc-400 hover:bg-white/10 p-2.5 rounded-lg cursor-pointer transition-colors" title="Upload File">
              <Paperclip className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {!compact && <div className="h-8 w-px bg-zinc-800/80"></div>}

      <input 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Type a message..."}
        className={`bg-transparent border-none text-zinc-200 focus:ring-0 w-full placeholder:text-zinc-600 font-bold tracking-tight outline-none ${
          compact ? 'text-sm' : 'text-base'
        }`}
      />

      <button type="button" className={`hover:text-[#FF5C00] transition-colors flex items-center justify-center text-zinc-500 ${compact ? 'p-1' : 'p-2.5 rounded-2xl hover:bg-white/5'}`}>
        <Mic className={compact ? "w-5 h-5" : "w-6 h-6"} />
      </button>

      <button 
        type="submit"
        className={`bg-gradient-to-r from-primary to-[#FF5C00] text-white shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center flex-shrink-0 ${
          compact ? 'p-2 rounded-xl' : 'p-3 rounded-2xl'
        }`}
      >
        <Send className={compact ? "w-4 h-4" : "w-5 h-5"} />
      </button>
    </form>
  );
}