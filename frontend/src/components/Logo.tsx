import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  mode?: 'horizontal' | 'vertical' | 'icon';
}

export default function Logo({ className = '', size = 40, mode = 'vertical' }: LogoProps) {
  // 竖屏/正方形 LOGO
  const VERTICAL_LOGO = "https://sc01.alicdn.com/kf/S5c2d19b3c7d04f1f92b5e712d641b581z.png";
  // 横排 LOGO
  const HORIZONTAL_LOGO = "https://sc01.alicdn.com/kf/S2fe2c76096a24851bd98835d504b678cJ.png";

  if (mode === 'horizontal') {
    return (
      <div className={`flex items-baseline font-headline tracking-tighter ${className}`} style={{ fontSize: size }}>
        <span className="text-primary font-black">0buck</span>
        <span className="text-secondary font-bold ml-0.5" style={{ fontSize: '0.7em' }}>.com</span>
      </div>
    );
  }

  if (mode === 'icon') {
    return (
      <div 
        className={`bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-sm flex-shrink-0 border border-zinc-500/10 ${className}`}
        style={{ width: size, height: size }}
      >
        <span className="font-headline font-black" style={{ fontSize: size * 0.5 }}>0B</span>
      </div>
    );
  }

  return (
    <div className={`flex items-baseline font-headline tracking-tighter ${className}`} style={{ fontSize: size }}>
      <span className="text-primary font-black">0buck</span>
      <span className="text-secondary font-bold ml-0.5" style={{ fontSize: '0.7em' }}>.com</span>
    </div>
  );
}
