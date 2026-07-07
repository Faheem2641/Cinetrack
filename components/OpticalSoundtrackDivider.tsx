import React from "react";

interface OpticalSoundtrackDividerProps {
  quote?: string;
  source?: string;
  className?: string;
}

export default function OpticalSoundtrackDivider({
  quote = "THE CINEMA IS AN INVENTION WITHOUT ANY FUTURE.",
  source = "LOUIS LUMIÈRE // 1895",
  className = ""
}: OpticalSoundtrackDividerProps) {
  return (
    <div className={`relative w-full h-16 bg-[#091011] overflow-hidden select-none pointer-events-none z-20 flex items-center justify-between border-y border-white/[0.03] px-6 group/soundtrack ${className}`}>
      
      {/* Self-contained CSS Animations for wave pulse and laser scan */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes laser-scan {
          0% { left: -10%; }
          100% { left: 110%; }
        }
        @keyframes wave-bounce {
          0%, 100% { transform: scaleY(1); opacity: 0.7; }
          50% { transform: scaleY(1.35); opacity: 1; }
        }
        @keyframes signal-glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.95; }
        }
        .animate-laser {
          animation: laser-scan 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .animate-wave-p {
          animation: wave-bounce 2s ease-in-out infinite;
        }
        .animate-sig {
          animation: signal-glow 1.5s ease-in-out infinite;
        }
      `}} />

      {/* Background optical sound track lines */}
      <div className="absolute inset-y-0 left-24 right-24 flex items-center justify-between opacity-20 pointer-events-none">
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="w-[1px] bg-[#B58863]"
            style={{
              height: `${15 + Math.sin(i * 0.4) * 12}px`,
              opacity: 0.3 + Math.cos(i * 0.15) * 0.3
            }}
          />
        ))}
      </div>

      {/* Left Column — Analog VU Levels Panel */}
      <div className="flex items-center gap-3 flex-shrink-0 z-10">
        <div className="flex flex-col gap-0.5 text-[6px] font-mono tracking-widest text-[#B58863]/50">
          <span>CH L</span>
          <span>CH R</span>
        </div>
        
        {/* VU LED Bars */}
        <div className="flex flex-col gap-1.5">
          {/* L Channel */}
          <div className="flex gap-0.5">
            {Array.from({ length: 12 }).map((_, i) => {
              const color = i < 8 ? "bg-emerald-500/60" : i < 10 ? "bg-amber-500/60" : "bg-red-500/60";
              const glow = i < 8 ? "group-hover/soundtrack:bg-emerald-400" : i < 10 ? "group-hover/soundtrack:bg-amber-400" : "group-hover/soundtrack:bg-red-400";
              return (
                <div
                  key={`vu-l-${i}`}
                  className={`w-1 h-1.5 rounded-[0.5px] transition-colors duration-300 ${color} ${glow}`}
                  style={{ transitionDelay: `${i * 30}ms` }}
                />
              );
            })}
          </div>
          {/* R Channel */}
          <div className="flex gap-0.5">
            {Array.from({ length: 12 }).map((_, i) => {
              const color = i < 7 ? "bg-emerald-500/60" : i < 10 ? "bg-amber-500/60" : "bg-red-500/60";
              const glow = i < 7 ? "group-hover/soundtrack:bg-emerald-400" : i < 10 ? "group-hover/soundtrack:bg-amber-400" : "group-hover/soundtrack:bg-red-400";
              return (
                <div
                  key={`vu-r-${i}`}
                  className={`w-1 h-1.5 rounded-[0.5px] transition-colors duration-300 ${color} ${glow}`}
                  style={{ transitionDelay: `${(12 - i) * 35}ms` }}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Center Section — The Waveform Soundtrack & Optical Reader Scan line */}
      <div className="relative flex-grow mx-8 h-10 flex items-center justify-center overflow-hidden bg-black/45 border border-white/[0.03] rounded-lg">
        
        {/* Laser Reading Head Scan Bar (moves on hover) */}
        <div className="absolute inset-y-0 w-0.5 bg-red-500/80 shadow-[0_0_12px_#ef4444,0_0_4px_#ef4444] animate-laser pointer-events-none z-20" />
        
        {/* Dynamic Waveform SVG */}
        <svg
          viewBox="0 0 800 40"
          preserveAspectRatio="none"
          className="w-full h-8 px-10 text-[#d4a87c] animate-wave-p origin-center z-10"
        >
          <path
            d="M0,20 Q10,12 20,20 T40,20 T60,20 T80,10 T100,30 T120,20 T140,20 T160,28 T180,12 T200,20 T220,20 T240,5 T260,35 T280,20 T300,20 T320,15 T340,25 T360,20 T380,20 T400,20 T420,10 T440,30 T460,20 T480,20 T500,8 T520,32 T540,20 T560,20 T580,18 T600,22 T620,20 T640,20 T660,10 T680,30 T700,20 T720,20 T740,15 T760,25 T780,20 T800,20 L800,20 L0,20 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="opacity-70 group-hover/soundtrack:opacity-100 transition-opacity duration-300"
          />
          <path
            d="M0,20 Q10,28 20,20 T40,20 T60,20 T80,30 T100,10 T120,20 T140,20 T160,12 T180,28 T200,20 T220,20 T240,35 T260,5 T280,20 T300,20 T320,25 T340,15 T360,20 T380,20 T400,20 T420,30 T440,10 T460,20 T480,20 T500,32 T520,8 T540,20 T560,20 T580,22 T600,18 T620,20 T640,20 T660,30 T680,10 T700,20 T720,20 T740,25 T760,15 T780,20 T800,20 L800,20 L0,20 Z"
            fill="none"
            stroke="#B58863"
            strokeWidth="1"
            strokeLinecap="round"
            className="opacity-40 group-hover/soundtrack:opacity-75 transition-opacity duration-300"
          />
        </svg>
        
        {/* Glowing time marker label */}
        <div className="absolute top-1 left-2 font-mono text-[5px] text-white/20 select-none tracking-widest uppercase">
          optical track // 8000hz
        </div>
        <div className="absolute bottom-1 right-2 font-mono text-[5px] text-[#d4a87c]/40 select-none tracking-widest uppercase flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-red-500 animate-sig" />
          scanner active
        </div>

        {/* Cinematic quote print in the background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none mix-blend-overlay">
          <span className="font-mono text-[6px] sm:text-[7px] font-black tracking-[0.45em] text-[#FAF6E8] opacity-5 sm:opacity-10 uppercase truncate max-w-[80%]">
            &ldquo;{quote}&rdquo; — {source}
          </span>
        </div>
      </div>

      {/* Right Column — Optical Sound standard indicators */}
      <div className="flex items-center gap-6 flex-shrink-0 z-10">
        <div className="hidden md:flex flex-col items-end text-right font-mono text-[6px] tracking-widest text-[#B58863]/50 uppercase gap-0.5">
          <span>Dolby SR A-Type</span>
          <span>analog optical</span>
        </div>

        <div className="flex items-center gap-1.5 border border-[#B58863]/25 bg-[#B58863]/5 px-2.5 py-1 rounded">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4a87c] animate-sig" />
          <span className="font-mono text-[7px] font-black tracking-widest text-[#d4a87c]">
            35MM MONO
          </span>
        </div>
      </div>
      
    </div>
  );
}
