"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { MediaItem, PersonProfile } from "@/lib/tmdb";

interface PersonSpotlightItem {
  id: number;
  role: string;
  label: string;
  profile: PersonProfile | null;
  films: MediaItem[];
}

interface HeroPersonSpotlightProps {
  items: PersonSpotlightItem[];
}

function TimecodeCounter({ activeIndex }: { activeIndex: number }) {
  const [timecode, setTimecode] = useState("00:00:00:00");

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const diff = Date.now() - start;
      const totalSec = Math.floor(diff / 1000);
      const hours = String(Math.floor(totalSec / 3600) % 24).padStart(2, "0");
      const mins = String(Math.floor(totalSec / 60) % 60).padStart(2, "0");
      const secs = String(totalSec % 60).padStart(2, "0");
      const frames = String(Math.floor((diff % 1000) / 41)).padStart(2, "0");
      setTimecode(`${hours}:${mins}:${secs}:${frames}`);
    }, 41);
    return () => clearInterval(interval);
  }, [activeIndex]);

  return <span>TC {timecode}</span>;
}

// Aesthetic Vast Palettes mapping based on index
const PALETTES = [
  { bg: "from-[#102a43] to-[#0f1a1b]", accent: "text-[#4fc3f7]", ring: "ring-[#4fc3f7]/30" }, // Deep Teal
  { bg: "from-[#3e2723] to-[#0f1a1b]", accent: "text-[#ffca28]", ring: "ring-[#ffca28]/30" }, // Amber Dark
  { bg: "from-[#311b92] to-[#0f1a1b]", accent: "text-[#b388ff]", ring: "ring-[#b388ff]/30" }, // Deep Purple
  { bg: "from-[#4a148c] to-[#0f1a1b]", accent: "text-[#ea80fc]", ring: "ring-[#ea80fc]/30" }, // Magenta
  { bg: "from-[#b71c1c] to-[#0f1a1b]", accent: "text-[#ff8a80]", ring: "ring-[#ff8a80]/30" }, // Crimson
  { bg: "from-[#1b5e20] to-[#0f1a1b]", accent: "text-[#69f0ae]", ring: "ring-[#69f0ae]/30" }, // Forest
];

export default function HeroPersonSpotlight({ items }: HeroPersonSpotlightProps) {
  // Randomize initial starting point on mount so it's different every time
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [mounted, setMounted] = useState(false);
  const autoPlayTimer = useRef<NodeJS.Timeout | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1600, height: 720 });

  // Filter out invalid items
  const validItems = items.filter(item => item.profile && item.films.length > 0);

  useEffect(() => {
    if (validItems.length > 0) {
      setActiveIndex(Math.floor(Math.random() * validItems.length));
    }
    setMounted(true);
  }, [validItems.length]);

  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateDimensions();
    const observer = new ResizeObserver(() => requestAnimationFrame(updateDimensions));
    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (validItems.length === 0) return;

    if (!isPaused) {
      autoPlayTimer.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % validItems.length);
      }, 8000); // Rotate every 8 seconds
    }

    return () => {
      if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
    };
  }, [isPaused, validItems.length]);

  if (validItems.length === 0 || !mounted) return <div className="h-[720px] bg-[#0f1a1b]" />;

  const currentItem = validItems[activeIndex];
  const profile = currentItem.profile!;
  const palette = PALETTES[activeIndex % PALETTES.length];

  const w = dimensions.width > 0 ? dimensions.width : 1600;
  const h = dimensions.height > 0 ? dimensions.height : 720;
  const cutoutPathD = `M 0 40 A 40 40 0 0 1 40 0 L ${w - 520} 0 C ${w - 470} 0, ${w - 470} 54, ${w - 430} 54 L ${w - 40} 54 A 40 40 0 0 1 ${w} 94 L ${w} ${h - 40} A 40 40 0 0 1 ${w - 40} ${h} L 40 ${h} A 40 40 0 0 1 0 ${h - 40} Z`;

  const nextSlide = () => setActiveIndex((prev) => (prev + 1) % validItems.length);
  const prevSlide = () => setActiveIndex((prev) => (prev - 1 + validItems.length) % validItems.length);

  return (
    <div className="w-full relative overflow-hidden px-2 sm:px-4 lg:px-6 pb-6 pt-2 select-none">
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <clipPath id="hero-cutout-clip">
            <path d={cutoutPathD} />
          </clipPath>
        </defs>
      </svg>

      <div
        ref={containerRef}
        className={`relative w-full h-[600px] md:h-[720px] rounded-[40px] bg-gradient-to-br ${palette.bg} transition-colors duration-1000 group`}
        style={{ clipPath: dimensions.width >= 768 ? "url(#hero-cutout-clip)" : "none" }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Background Profile Image with Ken Burns effect */}
        {profile.profilePath && (
          <div className="absolute inset-0 w-full h-full opacity-30 md:opacity-40 overflow-hidden mix-blend-luminosity">
            <img
              key={profile.id}
              src={`https://image.tmdb.org/t/p/original${profile.profilePath}`}
              alt={profile.name}
              className="w-full h-full object-cover object-top scale-105 animate-[kenBurns_20s_ease-out_infinite_alternate]"
            />
            {/* Vast Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t ${palette.bg} opacity-90`} />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f1a1b] via-[#0f1a1b]/60 to-transparent" />
          </div>
        )}

        <div className="absolute inset-0 flex flex-col md:flex-row p-6 md:p-12 z-10">
          {/* Main Info Area */}
          <div className="flex-1 flex flex-col justify-end md:justify-center md:pr-12">
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 text-[10px] uppercase tracking-widest font-bold border border-current rounded-full ${palette.accent}`}>
                SPOTLIGHT
              </span>
              <span className={`text-[10px] uppercase tracking-[0.2em] font-mono opacity-80 ${palette.accent}`}>
                {currentItem.label}
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[100px] font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[#D3C3B9] leading-[0.9] tracking-tighter mb-6 drop-shadow-2xl">
              {profile.name}
            </h1>

            {profile.biography && (
              <p className="text-sm md:text-base text-[#A79E9C] max-w-2xl line-clamp-3 md:line-clamp-4 leading-relaxed mb-8 drop-shadow-md">
                {profile.biography}
              </p>
            )}

            <div className="flex gap-4 items-center">
              <button onClick={prevSlide} className={`w-12 h-12 rounded-full flex items-center justify-center bg-[#0a1214]/50 backdrop-blur-md border border-white/10 hover:border-white/30 transition-all text-white hover:scale-105 active:scale-95 hover:bg-[#122123]`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button onClick={nextSlide} className={`w-12 h-12 rounded-full flex items-center justify-center bg-[#0a1214]/50 backdrop-blur-md border border-white/10 hover:border-white/30 transition-all text-white hover:scale-105 active:scale-95 hover:bg-[#122123]`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>

              <div className="ml-4 flex gap-2 hidden sm:flex">
                {validItems.map((_, idx) => (
                  <div key={idx} className={`w-2 h-2 rounded-full transition-all duration-500 ${idx === activeIndex ? `w-8 bg-white ${palette.ring} ring-2` : "bg-white/20"}`} />
                ))}
              </div>
            </div>
          </div>

          {/* Filmstrip Side */}
          <div className="hidden md:flex w-[400px] flex-col justify-end items-end shrink-0">
            <div className="w-full flex flex-col gap-4">
              <div className="flex justify-between items-end mb-2 w-full">
                <span className={`text-xs font-bold uppercase tracking-widest ${palette.accent}`}>Iconic Works</span>
              </div>
              <div className="flex gap-4 w-full h-[240px]">
                {currentItem.films.slice(0, 3).map((film, idx) => (
                  <Link
                    key={film.id}
                    href={film.mediaType === "movie" ? `/movies/${film.id}` : `/tv/${film.id}`}
                    className={`relative flex-1 rounded-2xl overflow-hidden group/film border border-white/5 hover:border-white/20 transition-all duration-300 hover:-translate-y-2 ring-0 hover:${palette.ring} hover:ring-4`}
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    {film.posterPath ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w500${film.posterPath}`}
                        alt={film.title}
                        className="w-full h-full object-cover group-hover/film:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#122123] flex items-center justify-center text-xs text-white/50 text-center p-2">
                        {film.title}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/film:opacity-100 transition-opacity duration-300 flex items-end p-3">
                      <span className="text-white text-xs font-bold line-clamp-2 leading-tight">{film.title}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Top-Right Info (only desktop) */}
        <div className="hidden md:flex absolute top-4 right-8 z-20 items-center gap-6">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${palette.bg.split(' ')[0].replace('from-', 'bg-')}`} />
            <span className="font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase">Live Rotation</span>
          </div>
          <div className="font-mono text-[10px] text-white/40 tracking-[0.2em]">
            <TimecodeCounter activeIndex={activeIndex} />
          </div>
        </div>
      </div>
    </div>
  );
}
