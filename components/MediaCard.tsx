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
    <Link href={linkHref} className="group relative flex flex-col rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800/80 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-indigo-600/10 hover:border-zinc-700/80">
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-950">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={posterUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Media Type Badge */}
        <span className="absolute top-3 left-3 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-zinc-950/80 text-zinc-300 border border-zinc-800 backdrop-blur-sm">
          {mediaType === "movie" ? "Movie" : "TV"}
        </span>

        {/* Rating Badge (top right) */}
        {voteAverage > 0 && (
          <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/90 text-zinc-950 border border-amber-400 flex items-center gap-1 shadow">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
            </svg>
            {voteAverage.toFixed(1)}
          </span>
        )}

        {/* Hover overlay details */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <h3 className="text-sm font-bold text-white leading-tight drop-shadow truncate">{title}</h3>
          <p className="text-[11px] text-zinc-300 mt-1 font-semibold">{releaseYear}</p>
          <span className="text-[10px] text-indigo-400 font-semibold group-hover:underline mt-2 flex items-center gap-1">
            View Details
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </span>
        </div>
      </div>

      {/* Card Info (always visible at bottom) */}
      <div className="p-3.5 flex flex-col justify-between flex-grow">
        <h3 className="text-sm font-bold text-zinc-200 line-clamp-1 group-hover:text-white transition-colors">
          {title}
        </h3>
        <p className="text-xs text-zinc-500 mt-1">
          {releaseYear}
        </p>
      </div>
    </Link>
  );
}
