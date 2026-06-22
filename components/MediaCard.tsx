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

  return (
    <div className="group flex flex-col relative p-1.5 rounded-[22px] bg-[#103334]/40 border border-[#3D4D55]/30 hover:border-[#B58863]/30 hover:bg-[#1e2e30]/60 transition-all duration-500 hover:shadow-2xl hover:shadow-[#B58863]/10 hover:-translate-y-1.5 hover:scale-[1.02]">
      {/* Inner Poster Wrapper */}
      <Link
        href={linkHref}
        className="relative aspect-[2/3] w-full overflow-hidden rounded-[18px] bg-[#0f1a1b] border border-[#3D4D55]/20 shadow-inner"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={posterUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Media Type Badge (frosted top-left) */}
        <span className="absolute top-2.5 left-2.5 text-[9px] uppercase font-black tracking-wider px-2 py-0.5 rounded-lg bg-[#0f1a1b]/75 backdrop-blur-md text-[#A79E9C] border border-[#3D4D55]/50 shadow">
          {mediaType === "movie" ? "Movie" : "TV"}
        </span>

        {/* Rating Badge (frosted bottom-right) */}
        {voteAverage > 0 && (
          <span className="absolute bottom-2.5 right-2.5 text-[9px] font-black tracking-wide px-2.5 py-1 rounded-xl bg-[#0f1a1b]/75 backdrop-blur-md text-[#B58863] border border-[#3D4D55]/40 flex items-center gap-1 shadow">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-[#B58863]">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
            </svg>
            {voteAverage.toFixed(1)}
          </span>
        )}
      </Link>

      {/* Details below poster inside outer card */}
      <div className="mt-3.5 px-2.5 pb-2 flex flex-col justify-between">
        {/* Metadata Pill row */}
        <div className="flex items-center gap-2 mb-1.5">
          {mediaType === "movie" ? (
            <span className="bg-[#B58863]/10 text-[#B58863] border border-[#B58863]/20 rounded-full px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wider">
              Movie
            </span>
          ) : (
            <span className="bg-[#3D4D55]/30 text-[#A79E9C] border border-[#3D4D55]/40 rounded-full px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wider">
              Series
            </span>
          )}
          {releaseYear !== "N/A" && (
            <span className="bg-[#1e2e30]/60 text-[#A79E9C] border border-[#3D4D55]/30 rounded-full px-2 py-0.5 text-[8px] font-extrabold tracking-wider">
              {releaseYear}
            </span>
          )}
        </div>
        
        {/* Title link with gradient hover */}
        <div className="relative group/title overflow-hidden pt-0.5">
          <Link
            href={linkHref}
            className="text-xs font-black text-[#D3C3B9] group-hover:bg-gradient-to-r group-hover:from-[#B58863] group-hover:via-[#d4a87c] group-hover:to-[#D3C3B9] group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 truncate block leading-normal pr-4 relative"
            title={title}
          >
            {title}
            {/* Sliding caret indicator */}
            <span className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-350 text-[10px] text-[#B58863] leading-none">
              →
            </span>
          </Link>
          {/* Expanding bottom gradient accent bar on hover */}
          <div className="h-[1.5px] w-0 group-hover:w-full bg-gradient-to-r from-[#B58863] via-[#d4a87c] to-[#D3C3B9] transition-all duration-500 mt-1 rounded-full" />
        </div>
      </div>
    </div>
  );
}
