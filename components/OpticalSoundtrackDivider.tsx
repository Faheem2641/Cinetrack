import React from "react";

interface OpticalSoundtrackDividerProps {
  quote?: string;
  source?: string;
  className?: string;
}

export default function OpticalSoundtrackDivider({
  quote = "CINEMA IS TRUTH 24 FRAMES-PER-SECOND.",
  source = "JEAN-LUC GODARD // 1960",
  className = ""
}: OpticalSoundtrackDividerProps) {
  return (
    <div className={`relative w-full h-16 bg-[#080e0f] overflow-hidden select-none pointer-events-none z-20 flex items-center justify-between border-y border-[#B58863]/20 px-4 sm:px-8 group/projector ${className}`}>
      
      {/* 35mm Projector & Light Shuttle Keyframe Animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes projector-shuttle {
          0% { left: -8%; }
          50% { left: 98%; }
          100% { left: -8%; }
        }
        @keyframes shutter-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes beam-flicker {
          0%, 100% { opacity: 0.85; }
          25% { opacity: 0.65; }
          50% { opacity: 0.95; }
          75% { opacity: 0.75; }
        }
        @keyframes reel-pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.95); }
          50% { opacity: 0.9; transform: scale(1.05); }
        }
        .animate-projector {
          animation: projector-shuttle 10s ease-in-out infinite;
        }
        .animate-shutter {
          animation: shutter-spin 2.5s linear infinite;
        }
        .animate-beam {
          animation: beam-flicker 0.15s infinite;
        }
        .animate-reel {
          animation: reel-pulse 2s ease-in-out infinite;
        }
      `}} />

      {/* Background 35mm Celluloid Sprocket Holes Track (Top & Bottom edges) */}
      <div className="absolute top-1 inset-x-0 flex justify-between px-2 opacity-30">
        {Array.from({ length: 50 }).map((_, i) => (
          <div key={`sprock-t-${i}`} className="w-2 h-1.5 bg-[#0f1a1b] rounded-[1px] border border-white/10" />
        ))}
      </div>
      <div className="absolute bottom-1 inset-x-0 flex justify-between px-2 opacity-30">
        {Array.from({ length: 50 }).map((_, i) => (
          <div key={`sprock-b-${i}`} className="w-2 h-1.5 bg-[#0f1a1b] rounded-[1px] border border-white/10" />
        ))}
      </div>

      {/* Left Column — Vintage Projector Motor Controls */}
      <div className="flex items-center gap-3.5 flex-shrink-0 z-10">
        {/* Spinning Mechanical Reel Indicator */}
        <div className="relative w-7 h-7 rounded-full border border-[#B58863]/50 flex items-center justify-center bg-[#0f1a1b] shadow-[0_0_12px_rgba(181,136,99,0.2)]">
          <div className="w-5 h-5 rounded-full border border-dashed border-[#d4a87c] animate-shutter flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#B58863]" />
          </div>
        </div>

        <div className="flex flex-col gap-0.5 font-mono text-[7px] tracking-widest text-[#B58863]">
          <span className="font-bold uppercase text-[#FAF6E8] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-reel" />
            MOTOR RUNNING
          </span>
          <span className="text-slate-400">24.00 FPS // 35MM</span>
        </div>
      </div>

      {/* Center Section — Moving 35mm Projector Lens & Light Shuttle */}
      <div className="relative flex-grow mx-4 sm:mx-10 h-11 flex items-center justify-center overflow-hidden bg-black/60 border border-[#B58863]/30 rounded-xl shadow-[inner_0_2px_10px_rgba(0,0,0,0.8)]">
        
        {/* Celluloid Frame Grid Guidelines */}
        <div className="absolute inset-0 flex items-center justify-between opacity-15 pointer-events-none px-6">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="w-[1px] h-full bg-[#B58863]" />
          ))}
        </div>

        {/* ── THE MOVING 35MM PROJECTOR LENS CARRIAGE & LIGHT BEAM ── */}
        <div className="absolute top-0 bottom-0 animate-projector pointer-events-none z-30 flex items-center">
          
          {/* Forward Light Beam Cone (illuminates background text as it sweeps) */}
          <div 
            className="absolute left-4 w-48 h-24 bg-gradient-to-r from-[#B58863]/40 via-[#d4a87c]/20 to-transparent animate-beam"
            style={{
              clipPath: "polygon(0% 40%, 100% 0%, 100% 100%, 0% 60%)"
            }}
          />

          {/* Mechanical Projector Lens Housing */}
          <div className="relative w-8 h-8 rounded-full border-2 border-[#B58863] bg-[#0f1a1b] flex items-center justify-center shadow-[0_0_20px_#B58863,0_0_35px_rgba(181,136,99,0.5)] z-20">
            {/* Spinning 3-Blade Shutter inside Lens */}
            <div className="absolute inset-0.5 rounded-full border border-[#FAF6E8]/20 animate-shutter flex items-center justify-center">
              <div className="w-full h-0.5 bg-[#B58863]/70 rotate-0 absolute" />
              <div className="w-full h-0.5 bg-[#B58863]/70 rotate-60 absolute" />
              <div className="w-full h-0.5 bg-[#B58863]/70 rotate-120 absolute" />
            </div>

            {/* Glowing Lens Center Crystal */}
            <div className="w-3 h-3 rounded-full bg-[#FAF6E8] shadow-[0_0_10px_#FAF6E8] z-30" />
          </div>

          {/* Trailing Lens Flare Trace */}
          <div className="absolute right-4 w-24 h-0.5 bg-gradient-to-l from-[#B58863] to-transparent shadow-[0_0_8px_#B58863]" />
        </div>

        {/* Illuminated Director Quote in background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-6">
          <span className="font-mono text-[7px] sm:text-[9px] font-bold tracking-[0.35em] text-[#FAF6E8]/30 group-hover/projector:text-[#FAF6E8]/60 transition-colors uppercase truncate max-w-[90%] select-none">
            &ldquo;{quote}&rdquo; — {source}
          </span>
        </div>

        {/* Telemetry Frame Counter in corner */}
        <div className="absolute bottom-1 right-3 font-mono text-[6px] text-[#B58863]/60 uppercase tracking-widest flex items-center gap-2">
          <span>KODAK SAFETY</span>
          <span>//</span>
          <span className="text-[#FAF6E8]">FRAME 024</span>
        </div>
      </div>

      {/* Right Column — Projector Optics & Sound Standard Badge */}
      <div className="flex items-center gap-3.5 flex-shrink-0 z-10">
        <div className="hidden lg:flex flex-col items-end text-right font-mono text-[7px] tracking-widest text-[#B58863]/60 uppercase gap-0.5">
          <span>PROJECTOR SHUTTER // OK</span>
          <span>ANAMORPHIC LENS 2.39:1</span>
        </div>

        <div className="flex items-center gap-2 border border-[#B58863]/40 bg-[#B58863]/10 px-3 py-1 rounded-full backdrop-blur-md shadow-[0_0_15px_rgba(181,136,99,0.15)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4a87c] animate-reel" />
          <span className="font-mono text-[8px] font-black tracking-widest text-[#d4a87c]">
            35MM BEAM
          </span>
        </div>
      </div>

    </div>
  );
}
