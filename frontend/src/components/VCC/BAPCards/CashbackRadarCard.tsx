import React from 'react';
import { Target, Gift } from 'lucide-react';

interface CashbackRadarProps {
  current_phase: number;
  total_phases: number;
  amount_returned: number;
  amount_total: number;
}

export const CashbackRadarCard: React.FC<CashbackRadarProps> = ({ 
  current_phase, 
  total_phases, 
  amount_returned, 
  amount_total 
}) => {
  const percentage = Math.min((current_phase / total_phases) * 100, 100);
  
  return (
    <div className="w-[270px] bg-white rounded-xl p-4 shadow-sm border border-gray-100 my-1 self-start rounded-tl-none relative overflow-hidden">
      
      {/* Decorative BG Icon */}
      <Target className="absolute -right-4 -bottom-4 w-20 h-20 text-[var(--wa-bg)] opacity-30" />
      
      <div className="flex justify-between items-center mb-4 relative z-10">
        <div className="flex items-center gap-1.5 font-bold text-gray-800 text-[15px]">
          <span className="text-orange-500">📡</span> Cashback Radar
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[var(--wa-teal)] font-extrabold text-[16px]">${amount_returned.toFixed(2)}</span>
          <span className="text-[10px] text-gray-400 font-medium leading-none">of ${amount_total.toFixed(2)}</span>
        </div>
      </div>
      
      {/* Progress Bar Container */}
      <div className="relative z-10">
        <div className="flex justify-between text-[11px] text-gray-500 font-semibold mb-1">
          <span>Phase {current_phase}</span>
          <span>Goal: {total_phases}</span>
        </div>
        
        <div className="h-2.5 w-full bg-[#f3f4f6] rounded-full overflow-hidden mb-3 relative">
          <div 
            className="h-full bg-[var(--wa-teal)] rounded-full shadow-[inset_0_1px_rgba(255,255,255,0.3)] transition-all duration-1000 ease-out" 
            style={{ width: `${percentage}%` }} 
          />
        </div>
        
        <div className="text-[12px] text-gray-600 font-medium flex items-center justify-center gap-1 bg-orange-50 py-1.5 rounded-lg border border-orange-100 text-orange-700">
          <Gift className="w-3 h-3" />
          {total_phases - current_phase > 0 
            ? `${total_phases - current_phase} phases left to full unlock` 
            : 'Reward fully unlocked!'}
        </div>
      </div>
    </div>
  );
};
