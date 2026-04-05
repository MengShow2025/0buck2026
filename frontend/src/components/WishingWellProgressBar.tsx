import React from 'react';
import { motion } from 'motion/react';
import { Timer, Users, Zap } from 'lucide-react';

interface WishingWellProgressBarProps {
  voteCount: number;
  targetCount: number;
  expiryAt: string;
  status: string;
}

const WishingWellProgressBar: React.FC<WishingWellProgressBarProps> = ({ 
  voteCount, 
  targetCount, 
  expiryAt,
  status 
}) => {
  const progress = Math.min((voteCount / targetCount) * 100, 100);
  const isExpired = new Date(expiryAt) < new Date();
  const isFoundingPriceUnlocked = voteCount >= targetCount;

  // Calculate remaining time
  const getTimeRemaining = () => {
    const total = Date.parse(expiryAt) - Date.parse(new Date().toString());
    const hours = Math.floor((total / (1000 * 60 * 60)));
    const minutes = Math.floor((total / 1000 / 60) % 60);
    return { total, hours, minutes };
  };

  const remaining = getTimeRemaining();

  return (
    <div className="space-y-3 w-full">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-orange-500">
            <Users size={14} className="animate-pulse" />
            <span className="text-xs font-black uppercase tracking-tighter">
              {voteCount} / {targetCount} {voteCount >= targetCount ? 'Unlocked' : 'Supporters'}
            </span>
          </div>
          {isFoundingPriceUnlocked && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-1 text-[10px] font-black text-green-500 uppercase italic"
            >
              <Zap size={10} fill="currentColor" />
              Founding Team Price Active
            </motion.div>
          )}
        </div>
        
        <div className={`flex items-center gap-1.5 text-[10px] font-mono font-bold ${isExpired ? 'text-zinc-600' : 'text-zinc-400'}`}>
          <Timer size={12} />
          {isExpired ? (
            'EXPIRED'
          ) : (
            <span>{remaining.hours}H {remaining.minutes}M REMAINING</span>
          )}
        </div>
      </div>

      <div className="relative h-2 w-full bg-zinc-800 rounded-full overflow-hidden border border-white/5">
        {/* Glow effect for progress */}
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full relative rounded-full ${
            isFoundingPriceUnlocked 
              ? 'bg-gradient-to-r from-orange-500 to-yellow-400 shadow-[0_0_10px_rgba(249,115,22,0.5)]' 
              : 'bg-primary'
          }`}
        >
          {progress > 0 && (
            <div className="absolute top-0 right-0 h-full w-4 bg-white/20 skew-x-[-20deg] animate-[shimmer_2s_infinite]"></div>
          )}
        </motion.div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-20deg); }
          100% { transform: translateX(200%) skewX(-20deg); }
        }
      `}</style>
    </div>
  );
};

export default WishingWellProgressBar;
