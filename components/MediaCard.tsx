import Link from "next/link";
import { MediaItem } from "@/lib/tmdb";

interface MediaCardProps {
  item: MediaItem;
}

export default function MediaCard({ item }: MediaCardProps) {
  const { id, title, posterPath, releaseDate, voteAverage, mediaType } = item;
  
  const posterUrl = posterPath
    ? `https://image.tmdb.org/t/p/w500${posterPath}`
    : `https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=500&auto=format&fit=crop&q=60`;

  const releaseYear = releaseDate ? releaseDate.split("-")[0] : "N/A";
  const linkHref = mediaType === "movie" ? `/movies/${id}` : `/tv/${id}`;

  // Generate a mock film frame number based on ID
  const frameNumber = String(Number(id) % 99).padStart(2, "0");

  return (
    <div className="group relative flex flex-col p-3 rounded-xl bg-slate-900/90 border border-white/10 hover:border-[#B58863]/50 hover:bg-slate-900 transition-[transform,border-color] duration-200 ease-out hover:shadow-[0_4px_15px_rgba(181,136,99,0.15)] hover:translate-y-[-4px] hover:z-30 select-none">
      
      {/* Left Sprocket Column (Skeuomorphic film strip detail) */}
      <div className="absolute left-1.5 top-8 bottom-8 z-20 flex flex-col justify-between py-1.5 pointer-events-none select-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={`left-sprock-${i}`} className="w-1.5 h-2.5 bg-[#0f1a1b] rounded-[1px] border border-white/5 shadow-inner" />
        ))}
      </div>

      {/* Right Sprocket Column (Skeuomorphic film strip detail) */}
      <div className="absolute right-1.5 top-8 bottom-8 z-20 flex flex-col justify-between py-1.5 pointer-events-none select-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={`right-sprock-${i}`} className="w-1.5 h-2.5 bg-[#0f1a1b] rounded-[1px] border border-white/5 shadow-inner" />
        ))}
      </div>

      {/* Top Slide Markings */}
      <div className="flex items-center justify-between px-1.5 pb-2 text-[7px] font-mono tracking-widest text-[#B58863] group-hover:text-[#d4a87c] transition-colors uppercase">
        <span>✦ KODAK 500T</span>
        <span>ROLL A_{frameNumber}</span>
      </div>

      {/* Main Slide Window (Poster Wrapper) */}
      <Link
        href={linkHref}
        className="relative aspect-[2/3] w-full overflow-hidden rounded-md bg-[#0f1a1b] border-2 border-slate-950 shadow-inner group/poster"
      >
        {/* Projector backlight flash effect (glow inside card behind poster) */}
        <div className="absolute inset-0 bg-[#B58863]/5 opacity-0 group-hover/poster:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={posterUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 group-hover:brightness-[1.05] bg-black"
          loading="lazy"
        />
        
        {/* Media Type Badge (frosted top-left) */}
        <span className="absolute top-2 left-2 text-[7px] uppercase font-black tracking-wider px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur-md text-slate-300 border border-white/5 shadow z-20">
          {mediaType === "movie" ? "Movie" : "TV"}
        </span>

        {/* Rating Badge (frosted top-right) */}
        {voteAverage > 0 && (
          <span className="absolute top-2 right-2 text-[7px] font-black tracking-wide px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur-md text-[#B58863] border border-white/5 flex items-center gap-1 shadow z-20">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-2 h-2 text-[#B58863]">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
            </svg>
            {voteAverage.toFixed(1)}
          </span>
        )}

        {/* ── Per-card Swipe Hint ────────────────────────────────────────
            Appears centered on the right edge of every card on hover.
            Slides in from the right, fades out when cursor leaves.       */}
        <div className="
          pointer-events-none absolute right-0 top-0 bottom-0 z-30
          flex items-center justify-end
          opacity-0 group-hover:opacity-100
          transition-all duration-300
        ">
          {/* Vertical pill anchored to right edge */}
          <div className="
            mr-[-1px] flex flex-col items-center gap-1.5
            bg-[#0a1214]/85 backdrop-blur-sm
            border border-[#B58863]/35 border-r-0
            rounded-l-xl px-2 py-3
            shadow-[-4px_0_20px_rgba(0,0,0,0.5)]
            translate-x-2 group-hover:translate-x-0
            transition-transform duration-300
          ">
            {/* Three stacked animated chevrons pointing right */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
              className="w-2.5 h-2.5 text-[#B58863] animate-[swipe-nudge_1.2s_ease-in-out_infinite]"
              style={{ animationDelay: "0ms" }}>
              <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd"/>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
              className="w-2.5 h-2.5 text-[#d4a87c] animate-[swipe-nudge_1.2s_ease-in-out_infinite]"
              style={{ animationDelay: "180ms" }}>
              <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd"/>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
              className="w-2.5 h-2.5 text-[#B58863]/50 animate-[swipe-nudge_1.2s_ease-in-out_infinite]"
              style={{ animationDelay: "360ms" }}>
              <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd"/>
            </svg>

            {/* Rotated SWIPE label */}
            <span className="
              mt-1 text-[7px] font-mono font-bold tracking-[0.2em] text-[#d4a87c]/80
              uppercase select-none
              [writing-mode:vertical-rl] rotate-180
            ">
              SWIPE
            </span>
          </div>
        </div>

        {/* Tactile Masking Tape Title Label (Handwritten) */}
        <div className="absolute -bottom-1 left-2.5 right-2.5 rotate-[-1.5deg] bg-[#FAF6E8] border border-[#d4cbaf] shadow-md px-2.5 py-1 z-20 text-center transition-all duration-300 group-hover:rotate-0 select-none">
          <span className="font-handwritten text-[11px] text-[#2b2723] font-bold block truncate leading-none">
            {title}
          </span>
        </div>
      </Link>

      {/* Bottom Slide Markings */}
      <div className="flex items-center justify-between px-1.5 pt-2 text-[7px] font-mono tracking-widest text-slate-400 group-hover:text-slate-300 transition-colors uppercase">
        <span>SAFETY FILM</span>
        <span>24 FPS</span>
      </div>

      {/* Title Details (overlay/card bottom) */}
      <div className="mt-3 px-1 pb-0.5">
        <div className="flex items-center gap-1.5 mb-1 text-[8px] font-bold text-slate-400">
          <span>{releaseYear !== "N/A" ? releaseYear : ""}</span>
          {releaseYear !== "N/A" && <span className="w-1 h-1 rounded-full bg-[#3D4D55]/60" />}
          <span className="uppercase tracking-wider font-mono">{mediaType === "movie" ? "Film" : "Series"}</span>
        </div>

        <div className="relative group/title overflow-hidden">
          <Link
            href={linkHref}
            className="text-[11px] font-black text-[#D3C3B9] hover:text-white transition-all duration-300 truncate block leading-normal pr-4 relative"
            title={title}
          >
            {title}
            <span className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-350 text-[9px] text-[#B58863] leading-none">
              →
            </span>
          </Link>
          <div className="h-[1px] w-0 group-hover:w-full bg-[#B58863] transition-all duration-500 mt-1 rounded-full" />
        </div>
      </div>
    </div>
  );
}
