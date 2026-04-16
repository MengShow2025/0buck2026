import React, { useRef, useEffect } from 'react';
import { VCCHeader } from './VCCHeader';

interface VortexContainerProps {
  children: React.ReactNode;
}

export const VortexContainer: React.FC<VortexContainerProps> = ({ children }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom whenever children change (i.e. new messages)
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [children]);

  return (
    <>
      <VCCHeader />
      
      <div className="flex-1 relative overflow-hidden bg-transparent">
        {/* Chat Stream Render Area (Scrollable) */}
        <div className="absolute inset-0 overflow-y-auto scrollbar-hide z-10 flex flex-col">
          <div className="p-4 flex flex-col gap-2 min-h-full">
            {children}
            <div ref={bottomRef} />
          </div>
        </div>
      </div>
    </>
  );
};
