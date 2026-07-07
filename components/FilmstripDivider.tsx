import React from "react";

interface FilmstripDividerProps {
  className?: string;
  bgClass?: string;       // Background of the film strip ribbon itself (e.g. bg-[#122123])
  aboveColor?: string;    // Color of the section above (e.g. text-[#0f1a1b])
  belowColor?: string;    // Color of the section below (e.g. text-[#0a1214])
  reelLabel?: string;
}

export default function FilmstripDivider({
  className = "",
  bgClass = "bg-[#122123]",
  aboveColor = "text-[#0f1a1b]",
  belowColor = "text-[#0a1214]",
  reelLabel = "REEL_02 // SEC. 04"
}: FilmstripDividerProps) {
  // Irregular jagged SVG path for natural, non-straight film tear lines
  const jaggedPath = "M0,0 L1200,0 L1200,10 L1175,6 L1150,9 L1120,5 L1095,8 L1070,4 L1040,7 L1015,5 L990,9 L965,4 L935,7 L910,5 L885,8 L860,4 L830,7 L805,5 L780,9 L755,4 L725,7 L700,5 L675,8 L650,4 L620,7 L595,5 L570,9 L545,4 L515,7 L490,5 L465,8 L440,4 L410,7 L385,5 L360,9 L335,4 L305,7 L280,5 L255,8 L230,4 L200,7 L175,5 L150,9 L125,4 L95,7 L70,5 L45,8 L20,4 L0,8 Z";

  return (
    <div className={`relative w-full h-11 flex items-center justify-between overflow-hidden select-none pointer-events-none z-20 ${bgClass} ${className}`}>
      
      {/* Top Jagged Film Tear Overlay (masks with color of the section above) */}
      <svg
        viewBox="0 0 1200 12"
        preserveAspectRatio="none"
        className={`absolute top-0 left-0 w-full h-[8px] fill-current ${aboveColor} z-10`}
      >
        <path d={jaggedPath} />
      </svg>

      {/* Sprocket holes track */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 gap-4">
        {Array.from({ length: 48 }).map((_, i) => (
          <div
            key={i}
            className="w-2.5 h-3.5 bg-black/60 rounded-[1px] border border-white/[0.04] shadow-[inset_0_1px_3px_rgba(0,0,0,0.9)] flex-shrink-0"
          />
        ))}
      </div>
      
      {/* Celluloid Metadata overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={`px-8 py-1.5 flex items-center gap-5 text-[9px] font-mono font-bold tracking-[0.3em] text-[#d4a87c] uppercase ${bgClass} z-20`}>
          <span>✦ EASTMAN KODAK</span>
          <span className="text-[#B58863]/30 select-none">|</span>
          <span className="text-[#FAF6E8]">{reelLabel}</span>
          <span className="text-[#B58863]/30 select-none">|</span>
          <span>SAFETY FILM ✦</span>
        </div>
      </div>

      {/* Bottom Jagged Film Tear Overlay (masks with color of the section below) */}
      <svg
        viewBox="0 0 1200 12"
        preserveAspectRatio="none"
        className={`absolute bottom-0 left-0 w-full h-[8px] fill-current ${belowColor} rotate-180 z-10`}
      >
        <path d={jaggedPath} />
      </svg>

    </div>
  );
}
