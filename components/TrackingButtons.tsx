"use client";

import { useTransition, useState } from "react";
import { toggleWatchStatus, updateMediaRating } from "@/app/actions/log";

interface WatchEntryData {
  isWatched: boolean;
  isWishlist: boolean;
  isCurrentlyWatching: boolean;
  isFavorite: boolean;
  rating: number | null;
}

interface TrackingButtonsProps {
  tmdbId: string;
  mediaType: "movie" | "tv";
  title: string;
  posterPath: string | null;
  releaseDate: string | null;
  initialWatchEntry: WatchEntryData | null;
}

export default function TrackingButtons({
  tmdbId,
  mediaType,
  title,
  posterPath,
  releaseDate,
  initialWatchEntry,
}: TrackingButtonsProps) {
  const [isPending, startTransition] = useTransition();
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  // Fallback defaults if no database log entry exists yet
  const entry = initialWatchEntry || {
    isWatched: false,
    isWishlist: false,
    isCurrentlyWatching: false,
    isFavorite: false,
    rating: null,
  };

  const handleToggle = (field: "isWatched" | "isWishlist" | "isCurrentlyWatching" | "isFavorite") => {
    startTransition(async () => {
      try {
        await toggleWatchStatus(tmdbId, mediaType, title, posterPath, releaseDate, field);
      } catch (err) {
        console.error("Failed to toggle status:", err);
      }
    });
  };

  const handleRate = (stars: number | null) => {
    startTransition(async () => {
      try {
        await updateMediaRating(tmdbId, mediaType, title, posterPath, releaseDate, stars);
      } catch (err) {
        console.error("Failed to update rating:", err);
      }
    });
  };

  const ratingValue = hoverRating !== null ? hoverRating : entry.rating || 0;

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Action Buttons Row */}
      <div className="flex flex-wrap gap-2.5 items-center">
        {/* Watched Toggle (Eye) */}
        <button
          onClick={() => handleToggle("isWatched")}
          disabled={isPending}
          className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full border transition-all cursor-pointer ${
            entry.isWatched
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-[#103334]/40 border-[#3D4D55]/40 text-[#A79E9C] hover:text-[#D3C3B9] hover:border-[#3D4D55]/70"
          }`}
          title="Mark as Watched"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
          {entry.isWatched ? "Watched" : "Mark Watched"}
        </button>

        {/* Wishlist Toggle (Clock/Bookmark) */}
        <button
          onClick={() => handleToggle("isWishlist")}
          disabled={isPending}
          className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full border transition-all cursor-pointer ${
            entry.isWishlist
              ? "bg-[#3D4D55]/30 border-[#3D4D55]/60 text-[#D3C3B9]"
              : "bg-[#103334]/40 border-[#3D4D55]/40 text-[#A79E9C] hover:text-[#D3C3B9] hover:border-[#3D4D55]/70"
          }`}
          title="Add to Watch Later / Wishlist"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          {entry.isWishlist ? "In Wishlist" : "Wishlist"}
        </button>

        {/* Currently Watching Toggle (Play) */}
        <button
          onClick={() => handleToggle("isCurrentlyWatching")}
          disabled={isPending}
          className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full border transition-all cursor-pointer ${
            entry.isCurrentlyWatching
              ? "bg-[#B58863]/10 border-[#B58863]/30 text-[#B58863]"
              : "bg-[#103334]/40 border-[#3D4D55]/40 text-[#A79E9C] hover:text-[#D3C3B9] hover:border-[#3D4D55]/70"
          }`}
          title="Mark as Currently Watching"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
          </svg>
          {entry.isCurrentlyWatching ? "Watching" : "Currently Watching"}
        </button>

        {/* Favorite Toggle (Heart) */}
        <button
          onClick={() => handleToggle("isFavorite")}
          disabled={isPending}
          className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full border transition-all cursor-pointer ${
            entry.isFavorite
              ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
              : "bg-[#103334]/40 border-[#3D4D55]/40 text-[#A79E9C] hover:text-[#D3C3B9] hover:border-[#3D4D55]/70"
          }`}
          title="Add to Favorites"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill={entry.isFavorite ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>
          {entry.isFavorite ? "Favorite" : "Favorite"}
        </button>
      </div>

      {/* Star Rating Widget (0.5 to 5.0 stars with split-star halves) */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#A79E9C]">Your Rating:</span>
          {entry.rating !== null && (
            <span className="text-xs font-bold text-[#B58863] bg-[#B58863]/10 border border-[#B58863]/20 px-2 py-0.5 rounded">
              {entry.rating.toFixed(1)} / 5.0
            </span>
          )}
          {entry.rating !== null && (
            <button
              onClick={() => handleRate(null)}
              className="text-[10px] text-[#A79E9C] hover:text-[#D3C3B9] underline cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* 5-Star Row */}
        <div className="flex items-center">
          <div className="flex relative select-none">
            {[1, 2, 3, 4, 5].map((starIdx) => {
              return (
                <div key={starIdx} className="relative w-8 h-8 flex items-center justify-center">
                  {/* Left Half (e.g. starIdx - 0.5) */}
                  <div
                    className="absolute top-0 left-0 w-4 h-8 z-20 cursor-pointer"
                    onMouseEnter={() => setHoverRating(starIdx - 0.5)}
                    onMouseLeave={() => setHoverRating(null)}
                    onClick={() => handleRate(starIdx - 0.5)}
                  />
                  {/* Right Half (e.g. starIdx) */}
                  <div
                    className="absolute top-0 right-0 w-4 h-8 z-20 cursor-pointer"
                    onMouseEnter={() => setHoverRating(starIdx)}
                    onMouseLeave={() => setHoverRating(null)}
                    onClick={() => handleRate(starIdx)}
                  />

                  {/* Visual Render of the Star */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-7 h-7 pointer-events-none"
                  >
                    {/* Background grey star */}
                    <path
                      fillRule="evenodd"
                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                      clipRule="evenodd"
                      className="text-[#3D4D55]"
                    />
                    {/* Filled/Partial Amber Overlay */}
                    {ratingValue >= starIdx ? (
                      /* Full Star */
                      <path
                        fillRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                        clipRule="evenodd"
                        className="text-amber-500 absolute inset-0"
                      />
                    ) : ratingValue >= starIdx - 0.5 ? (
                      /* Half Star clip path */
                      <path
                        fillRule="evenodd"
                        d="M12 18.354l-4.627 2.826c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434L10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354V3.21"
                        clipRule="evenodd"
                        className="text-amber-500 absolute inset-0"
                      />
                    ) : null}
                  </svg>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
