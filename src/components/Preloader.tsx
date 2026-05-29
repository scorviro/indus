"use client";

import { useEffect, useState } from "react";

interface PreloaderProps {
  onComplete: () => void;
  progress: number;
}

export default function Preloader({ onComplete, progress }: PreloaderProps) {
  const [visible, setVisible] = useState(true);
  const [contentFade, setContentFade] = useState(false);

  useEffect(() => {
    if (progress >= 100) {
      // 1. Content fades out first
      const fadeTimeout = setTimeout(() => {
        setContentFade(true);
      }, 400);

      // 2. Sliding doors finish opening, then complete preloading
      const completeTimeout = setTimeout(() => {
        setVisible(false);
        onComplete();
      }, 1500); // 400ms delay + 1100ms doors slide duration

      return () => {
        clearTimeout(fadeTimeout);
        clearTimeout(completeTimeout);
      };
    }
  }, [progress, onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none pointer-events-auto">
      {/* VMC-style Sliding Enclosure Doors (Split Horizontal Shutter) */}
      {/* Left Panel */}
      <div 
        className={`absolute left-0 top-0 w-1/2 h-full bg-[#fbfbfb] border-r border-zinc-200/50 transition-transform duration-[1100ms] ease-[cubic-bezier(0.85,0,0.15,1)] ${
          progress >= 100 ? "-translate-x-full" : "translate-x-0"
        }`}
      />
      {/* Right Panel */}
      <div 
        className={`absolute right-0 top-0 w-1/2 h-full bg-[#fbfbfb] border-l border-zinc-200/50 transition-transform duration-[1100ms] ease-[cubic-bezier(0.85,0,0.15,1)] ${
          progress >= 100 ? "translate-x-full" : "translate-x-0"
        }`}
      />

      {/* Technical HUD & Loader Content (Fades out before doors slide) */}
      <div 
        className={`absolute inset-0 flex flex-col items-center justify-center z-10 transition-all duration-500 ease-out ${
          contentFade ? "opacity-0 scale-95" : "opacity-100"
        }`}
      >
        {/* Decorative Industrial Border Lines */}
        <div className="absolute top-8 left-8 text-left font-mono text-[9px] text-zinc-400 space-y-1">
          <div>INDUS VMC-960 CORE</div>
          <div className="text-zinc-300">G54 5-AXIS KINEMATIC SYS</div>
        </div>
        <div className="absolute top-8 right-8 text-right font-mono text-[9px] text-zinc-400 space-y-1">
          <div>SPINDLE: 18,000 RPM</div>
          <div className="text-[#ff6b00]">THERMAL SHIELD: ACTIVE</div>
        </div>
        <div className="absolute bottom-8 left-8 text-left font-mono text-[9px] text-zinc-400 space-y-1">
          <div>AXES CALIBRATION: ±0.002MM</div>
          <div className="text-zinc-300">BUFFERING 960 FRAME CINEMATICS</div>
        </div>
        <div className="absolute bottom-8 right-8 text-right font-mono text-[9px] text-zinc-400 space-y-1">
          <div>SAFETY DOOR LOCKS: CLOSED</div>
          <div className="text-[#ff6b00]">{Math.round(progress)}% CONNECTED</div>
        </div>

        {/* Center Loading Module */}
        <div className="flex flex-col items-center space-y-6">
          {/* Spindle Technical SVG Animation */}
          <div className="relative">
            <svg className="w-28 h-28 text-zinc-800" viewBox="0 0 100 100">
              {/* Outer Technical Circular Scale */}
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                stroke="currentColor" 
                strokeWidth="0.4" 
                strokeDasharray="2 3" 
                fill="none" 
                className="animate-[spin_40s_linear_infinite]" 
              />
              
              {/* Spindle Rotating Collar */}
              <circle 
                cx="50" 
                cy="50" 
                r="38" 
                stroke="currentColor" 
                strokeWidth="0.8" 
                strokeDasharray="15 10 5 10" 
                fill="none" 
                className="animate-[spin_12s_linear_infinite]" 
              />
              
              {/* Axis Grid lines */}
              <line x1="50" y1="5" x2="50" y2="95" stroke="currentColor" strokeWidth="0.2" strokeDasharray="1 3" />
              <line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="0.2" strokeDasharray="1 3" />
              
              {/* Spindle Tool Holder */}
              <rect x="47" y="38" width="6" height="24" fill="none" stroke="currentColor" strokeWidth="1" />
              <path d="M43,45 L57,45 M45,52 L55,52" stroke="currentColor" strokeWidth="0.8" />
              
              {/* Rotating Cutting Bits Indicator */}
              <circle 
                cx="50" 
                cy="50" 
                r="28" 
                stroke="#ff6b00" 
                strokeWidth="1.2" 
                strokeDasharray="4 24" 
                fill="none" 
                className="animate-[spin_2.5s_linear_infinite]" 
              />
              <circle 
                cx="50" 
                cy="50" 
                r="28" 
                stroke="#ff6b00" 
                strokeWidth="1.2" 
                strokeDasharray="4 24" 
                fill="none" 
                className="animate-[spin_2.5s_linear_infinite]" 
                style={{ transformOrigin: 'center', transform: 'rotate(90deg)' }} 
              />

              {/* Center Pivot Pin */}
              <circle cx="50" cy="50" r="2.5" fill="#ff6b00" />
            </svg>
          </div>

          {/* Large Gauge Counters */}
          <div className="flex flex-col items-center space-y-1">
            <span className="font-mono text-[9px] tracking-[0.3em] text-[#ff6b00] uppercase font-bold animate-pulse">
              SYSTEM INITIALIZATION
            </span>
            <div className="flex items-baseline font-bebas text-zinc-950 leading-none">
              <span className="text-[8rem] md:text-[10rem] font-normal tracking-tighter">
                {String(Math.round(progress)).padStart(3, "0")}
              </span>
              <span className="text-3xl text-[#ff6b00] font-mono font-bold ml-1">%</span>
            </div>
          </div>

          {/* Minimalist Progress Line */}
          <div className="w-56 h-[2px] bg-zinc-200/50 relative overflow-hidden rounded-full">
            <div 
              className="absolute left-0 top-0 h-full bg-[#ff6b00] transition-all duration-300 ease-out" 
              style={{ width: `${progress}%` }} 
            />
          </div>

          {/* Changing Technical Logs */}
          <div className="font-mono text-[9px] tracking-wider text-zinc-400 uppercase h-4">
            {progress < 25 && "INITIALIZING SYSTEM KERNEL..."}
            {progress >= 25 && progress < 50 && "CALIBRATING G54 X/Y/Z MOTOR AXES..."}
            {progress >= 50 && progress < 75 && "LOADING 960 FRAME CINEMATIC MEMORY..."}
            {progress >= 75 && progress < 100 && "ESTABLISHING THERMAL STABILIZATION..."}
            {progress === 100 && "CALIBRATION COMPLETE // OPENING ENCLOSURE DOORS"}
          </div>
        </div>
      </div>
    </div>
  );
}
