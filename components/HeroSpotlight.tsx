"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { MediaItem } from "@/lib/tmdb";

interface HeroSpotlightProps {
  items: MediaItem[];
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

export default function HeroSpotlight({ items }: HeroSpotlightProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayTimer = useRef<NodeJS.Timeout | null>(null);

  const featured = items.slice(0, 5); // Take top 5 items

  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1200, height: 720 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

    const observer = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        updateDimensions();
      });
    });
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const isMobile = dimensions.width < 768;



  useEffect(() => {
    if (featured.length === 0) return;

    if (!isPaused) {
      autoPlayTimer.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % featured.length);
      }, 7000); // Rotate every 7 seconds
    }

    return () => {
      if (autoPlayTimer.current) {
        clearInterval(autoPlayTimer.current);
      }
    };
  }, [isPaused, featured.length]);

  if (featured.length === 0) return null;

  const currentItem = featured[activeIndex];
  const releaseYear = currentItem.releaseDate ? currentItem.releaseDate.split("-")[0] : "";
  const linkHref = currentItem.mediaType === "movie" ? `/movies/${currentItem.id}` : `/tv/${currentItem.id}`;

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % featured.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + featured.length) % featured.length);
  };



  return (
    <div className="w-full relative overflow-hidden px-2 sm:px-4 lg:px-6 pb-6 pt-2 select-none">
      
      {/* Dynamic Clip Path Def for card cutout */}
      <svg className="absolute w-0 h-0 pointer-events-none">
        <defs>
          <clipPath id="hero-cutout-clip">
            <path
              d={`M 0 0 L ${dimensions.width - 600} 0 C ${dimensions.width - 560} 0, ${dimensions.width - 560} 64, ${dimensions.width - 520} 64 L ${dimensions.width - 40} 64 A 40 40 0 0 1 ${dimensions.width} 104 L ${dimensions.width} ${dimensions.height} L 0 ${dimensions.height} Z`}
            />
          </clipPath>
        </defs>
      </svg>

      {/* Ambient Backdrop Bleed - Cinematic Depth */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {featured.map((item, idx) => {
          const isSelected = idx === activeIndex;
          const bgUrl = item.backdropPath
            ? `https://image.tmdb.org/t/p/w1280${item.backdropPath}`
            : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1600";
          return (
            <div
              key={`ambient-${item.id}`}
              className="absolute inset-0 transition-opacity duration-700 ease-in-out"
              style={{ opacity: isSelected ? 1 : 0 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={bgUrl}
                alt=""
                className="w-full h-full object-cover blur-[6px] brightness-75 contrast-105"
              />
            </div>
          );
        })}
        {/* Dark overlay for cinema readability & bottom blending */}
        <div className="absolute inset-0 bg-slate-950/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/30 to-[#0f1a1b]" />
      </div>

      <div className="mx-auto w-full max-w-[98%] relative pt-20 z-10">

        <section
          ref={containerRef}
          style={{ clipPath: mounted && !isMobile ? "url(#hero-cutout-clip)" : "none" }}
          className="relative w-full aspect-[21/10] min-h-[500px] sm:min-h-[600px] md:min-h-[650px] lg:min-h-[720px] overflow-hidden bg-black rounded-3xl md:rounded-[40px] shadow-2xl transition-shadow duration-300"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Background Backdrops Container */}
          <div className="absolute inset-0">
            {featured.map((item, idx) => {
              const isSelected = idx === activeIndex;
              const bgUrl = item.backdropPath
                ? `https://image.tmdb.org/t/p/w1280${item.backdropPath}`
                : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1600";
              return (
                <div
                  key={item.id}
                  className={`absolute inset-0 transition-[opacity,transform] duration-700 ease-in-out ${
                    isSelected
                      ? "opacity-100 scale-100 pointer-events-auto"
                      : "opacity-0 scale-105 pointer-events-none"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={bgUrl}
                    alt={item.title}
                    className="w-full h-full object-cover brightness-[0.55] contrast-[1.05]"
                  />
                </div>
              );
            })}
          </div>

          {/* Projector Shutter Flash celluloid flicker overlay */}
          <div key={`shutter-${activeIndex}`} className="absolute inset-0 bg-[#B58863]/10 mix-blend-color-dodge z-20 pointer-events-none animate-shutter-flash" />

          {/* Cinematic Overlays (Fades image into the page background) */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1a1b] via-[#0f1a1b]/45 to-transparent z-10" />
          <div className="absolute inset-y-0 left-0 w-full sm:w-[60%] bg-gradient-to-r from-[#0f1a1b] via-[#0f1a1b]/60 to-transparent z-10 pointer-events-none" />

          {/* Viewfinder Safe Title Frame Overlay */}
          <div className="absolute inset-4 md:inset-8 z-10 border border-[#B58863]/10 pointer-events-none rounded-[20px] md:rounded-[32px] overflow-hidden">
            {/* Corner tick marks */}
            <div className="absolute top-2.5 left-2.5 w-3 h-3 border-t border-l border-[#B58863]/30" />
            <div className="absolute top-2.5 right-2.5 w-3 h-3 border-t border-r border-[#B58863]/30" />
            <div className="absolute bottom-2.5 left-2.5 w-3 h-3 border-b border-l border-[#B58863]/30" />
            <div className="absolute bottom-2.5 right-2.5 w-3 h-3 border-b border-r border-[#B58863]/30" />
            
            {/* Center Viewfinder Crosshair */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center opacity-10">
              <div className="w-5 h-[1px] bg-[#B58863]" />
              <div className="h-5 w-[1px] bg-[#B58863] absolute" />
            </div>
          </div>

          {/* Viewfinder Telemetry Overlay */}
          <div className="absolute top-6 left-6 md:top-10 md:left-12 z-30 font-mono text-[9px] tracking-widest text-[#B58863] select-none flex items-center gap-2.5 bg-[#0f1a1b]/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/5 shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <TimecodeCounter activeIndex={activeIndex} />
            <span className="text-white/20">|</span>
            <span>TAKE_0{activeIndex + 1}</span>
            <span className="text-white/20">|</span>
            <span className="text-[8px] font-bold text-red-500/80">REC</span>
          </div>

          {/* Color Calibration Strip */}
          <div className="absolute top-16 left-6 md:top-20 md:left-12 z-30 hidden sm:flex items-center gap-1.5 bg-[#0f1a1b]/40 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/5 font-mono text-[7px] tracking-wider text-slate-500 select-none">
            <span>CAL //</span>
            <div className="flex gap-0.5">
              <span className="w-1.5 h-1.5 bg-[#B58863] rounded-sm" />
              <span className="w-1.5 h-1.5 bg-[#d4a87c] rounded-sm" />
              <span className="w-1.5 h-1.5 bg-red-500 rounded-sm" />
              <span className="w-1.5 h-1.5 bg-green-500 rounded-sm" />
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-sm" />
              <span className="w-1.5 h-1.5 bg-white rounded-sm" />
            </div>
          </div>

          {/* Camera Specs Overlay */}
          <div className="absolute bottom-6 right-6 md:bottom-10 md:right-12 z-30 font-mono text-[8px] tracking-widest text-slate-400/85 select-none hidden md:flex items-center gap-3 bg-[#0f1a1b]/40 backdrop-blur-sm px-3 py-1 rounded-full border border-white/5">
            <span>LENS: ANAMORPHIC 50MM</span>
            <span className="text-white/10">•</span>
            <span>ISO 800</span>
            <span className="text-white/10">•</span>
            <span>SHUTTER 180°</span>
          </div>

          {/* Slide Content */}
          <div className="absolute inset-0 z-20 flex flex-col justify-end px-6 sm:px-12 md:px-20 pb-16 md:pb-24 max-w-7xl mx-auto w-full">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 w-full">
              <div className="max-w-2xl text-left space-y-4 md:space-y-6">
                
                {/* Film Slate Metadata Row */}
                <div className="flex flex-wrap items-center gap-3 font-mono text-[9px] tracking-widest text-[#B58863]">
                  <span className="px-2.5 py-1 rounded bg-[#B58863]/25 border border-[#B58863]/30 text-[#d4a87c] font-black uppercase">
                    ROLL A_0{activeIndex + 1}
                  </span>
                  {releaseYear && (
                    <span className="text-slate-400">
                      [YEAR // {releaseYear}]
                    </span>
                  )}
                  <span className="text-white/20">•</span>
                  <span className="text-slate-400">FPS 24.0</span>
                  <span className="text-white/20">•</span>
                  <span className="text-slate-400 font-bold">RATING {currentItem.voteAverage ? currentItem.voteAverage.toFixed(1) : "N/A"}/10</span>
                </div>

                {/* Title */}
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
                  {currentItem.title}
                </h1>

                {/* Script-Citation styled description */}
                <div className="border-l-2 border-[#B58863]/40 pl-4 py-0.5 space-y-1">
                  <span className="block font-mono text-[8px] tracking-widest text-slate-500 uppercase select-none">
                    [LOG LINE // EXP-0{activeIndex + 1}]
                  </span>
                  <p className="text-xs sm:text-sm md:text-base text-slate-200/90 leading-relaxed line-clamp-3 max-w-xl">
                    {currentItem.overview}
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href={linkHref}
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-[#B58863] to-[#d4a87c] text-[#0f1a1b] font-bold text-xs sm:text-sm hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-[#B58863]/20 flex items-center gap-2"
                  >
                    <span>Explore Title</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                  </Link>

                  <Link
                    href="/search"
                    className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-slate-200 font-bold text-xs sm:text-sm hover:bg-white/10 hover:text-white transition-colors"
                  >
                    Browse Catalog
                  </Link>
                </div>
              </div>

              {/* Right: Floating Movie Poster */}
              {currentItem.posterPath && (
                <div className="hidden md:block w-44 lg:w-52 aspect-[2/3] rounded-2xl overflow-hidden border border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.8)] transform rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-300 flex-shrink-0 bg-black/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://image.tmdb.org/t/p/w500${currentItem.posterPath}`}
                    alt={`${currentItem.title} Poster`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Left/Right Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-slate-900/60 backdrop-blur-sm border border-white/10 text-white hover:bg-[#B58863] hover:text-[#0f1a1b] hover:border-transparent opacity-0 group-hover:opacity-100 md:opacity-20 hover:opacity-100! active:scale-90 transition-all duration-300 cursor-pointer"
            aria-label="Previous Slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-slate-900/60 backdrop-blur-sm border border-white/10 text-white hover:bg-[#B58863] hover:text-[#0f1a1b] hover:border-transparent opacity-0 group-hover:opacity-100 md:opacity-20 hover:opacity-100! active:scale-90 transition-all duration-300 cursor-pointer"
            aria-label="Next Slide"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          {/* Bottom Progress Indicator Pills */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
            {featured.map((_, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`relative h-1.5 rounded-full transition-all duration-300 cursor-pointer overflow-hidden bg-[#3D4D55]/60 ${
                    isActive ? "w-10" : "w-1.5"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                >
                  {isActive && (
                    <div
                      key={activeIndex}
                      className="absolute top-0 left-0 bottom-0 bg-[#B58863] animate-slide-progress"
                      style={{
                        animationDuration: "7000ms",
                        animationPlayState: isPaused ? "paused" : "running",
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
