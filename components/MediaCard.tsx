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

  const releaseYear = releaseDate ? releaseDate.split("-")[0] : "";
  const linkHref = mediaType === "movie" ? `/movies/${id}` : `/tv/${id}`;

  return (
    <div className="group relative aspect-[2/3] w-full overflow-hidden rounded-2xl bg-[#080d0e] border border-white/10 hover:border-[#B58863]/60 transition-[transform,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] hover:-translate-y-2 hover:scale-[1.03] active:scale-[0.98] shadow-lg hover:shadow-[0_22px_45px_rgba(0,0,0,0.85),0_0_30px_rgba(181,136,99,0.25)] z-10 hover:z-30 select-none">
      <Link href={linkHref} className="absolute inset-0 z-10">
        {/* Poster Image - Pure Edge-to-Edge Canvas */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={posterUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110 group-hover:brightness-105"
          loading="lazy"
        />

        {/* Ambient Dark Gradient Base (Always visible for readable title) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080d0e] via-[#080d0e]/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Top Badges (Floating Frosted Glass) */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-none">
          {/* Media Type Badge */}
          <span className="text-[8px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#080d0e]/80 backdrop-blur-md text-[#D3C3B9] border border-white/10 shadow-md group-hover:border-[#B58863]/40 transition-colors">
            {mediaType === "movie" ? "Movie" : "TV"}
          </span>

          {/* Rating Badge */}
          {voteAverage > 0 && (
            <span className="text-[9px] font-bold tracking-wide px-2 py-0.5 rounded-md bg-[#080d0e]/80 backdrop-blur-md text-[#B58863] border border-white/10 flex items-center gap-1 shadow-md group-hover:border-[#B58863]/40 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5 text-[#B58863]">
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
              </svg>
              {voteAverage.toFixed(1)}
            </span>
          )}
        </div>

        {/* Sliding Apple TV / A24 Glassmorphism Drawer Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3.5 pt-8 bg-gradient-to-t from-[#080d0e] via-[#080d0e]/95 to-transparent backdrop-blur-[2px] group-hover:backdrop-blur-md z-20 flex flex-col justify-end translate-y-3 group-hover:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]">
          {/* Title */}
          <h3 className="text-[13px] font-black text-[#FAF6E8] leading-tight truncate group-hover:text-white transition-colors">
            {title}
          </h3>

          {/* Subtitle / Metadata Row */}
          <div className="flex items-center gap-2 mt-1 text-[10px] font-medium text-slate-400">
            {releaseYear && <span>{releaseYear}</span>}
            {releaseYear && <span className="w-1 h-1 rounded-full bg-[#3D4D55]" />}
            <span className="uppercase text-[8.5px] tracking-wider text-[#B58863] font-mono">
              {mediaType === "movie" ? "Film" : "Series"}
            </span>
          </div>

          {/* Action Buttons (Reveals on Hover) */}
          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-white/10 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 delay-75">
            {/* Primary Watch Action Pill */}
            <div className="flex-1 py-1.5 px-3 rounded-lg bg-[#B58863] text-[#080d0e] font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md hover:bg-[#d4a87c] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                <path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
              </svg>
              <span>View Details</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
