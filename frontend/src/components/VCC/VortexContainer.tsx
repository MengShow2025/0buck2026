import React from 'react';
import { VCCHeader } from './VCCHeader';
import './styles.css';

interface VortexContainerProps {
  children: React.ReactNode;
}

export const VortexContainer: React.FC<VortexContainerProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-[var(--wa-bg)] relative overflow-hidden shadow-2xl font-sans">
      <VCCHeader />
      
      <div className="flex-1 overflow-y-auto relative">
        {/* Subtle Chat Background Pattern */}
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none" 
          style={{ 
            backgroundImage: "url('data:image/svg+xml;utf8,<svg width=\"100\" height=\"100\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"100\" height=\"100\" fill=\"%23ECE5DD\"/><path d=\"M10 10c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10-10zm40 40c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10-10z\" fill=\"%23e0d8d0\" fill-opacity=\"0.5\"/></svg>')",
            backgroundSize: '100px 100px'
          }} 
        />
        
        {/* Chat Stream Render Area */}
        <div className="relative z-10 h-full p-4 flex flex-col gap-2">
            {children}
        </div>
      </div>
    </div>
  );
};
