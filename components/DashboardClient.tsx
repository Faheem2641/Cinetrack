"use client";

import { useState } from "react";
import Link from "next/link";
import MediaCard from "./MediaCard";
import { MediaItem } from "@/lib/tmdb";

interface WatchEntryData {
  id: string;
  tmdbId: string;
  mediaType: string;
  title: string;
  posterPath: string | null;
  releaseDate: string | null;
  rating: number | null;
  isWatched: boolean;
  isWishlist: boolean;
  isFavorite: boolean;
  updatedAt: string | Date;
}

interface DashboardClientProps {
  user: {
    id: string;
    name: string;
    username: string;
    image?: string | null;
  };
  watched: WatchEntryData[];
  wishlist: WatchEntryData[];
  favorites: WatchEntryData[];
  genreStats: Array<{ name: string; count: number; percentage: number; icon: string }>;
  ratingCounts: Record<string, number>;
  averageRating: number;
  totalRuntimeMinutes: number;
}

export default function DashboardClient({
  user,
  watched,
  wishlist,
  favorites,
  genreStats,
  ratingCounts,
  averageRating,
  totalRuntimeMinutes,
}: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState<"WATCHED" | "WISHLIST" | "FAVORITES" | "ANALYTICS">("WATCHED");

  // Computed metrics
  const watchedMoviesCount = watched.filter((w) => w.mediaType === "movie").length;
  const watchedTVCount = watched.filter((w) => w.mediaType === "tv").length;
  const totalHours = Math.round(totalRuntimeMinutes / 60);

  // Helper mapper to convert WatchEntryData to MediaItem for MediaCard
  const mapToMediaItem = (w: WatchEntryData): MediaItem => ({
    id: w.tmdbId,
    title: w.title,
    overview: "",
    posterPath: w.posterPath,
    backdropPath: null,
    releaseDate: w.releaseDate || "",
    mediaType: w.mediaType as "movie" | "tv",
    voteAverage: w.rating || 0,
    voteCount: 0,
  });

  const maxRatingCount = Math.max(...Object.values(ratingCounts), 1);

  return (
    <div className="w-full min-h-screen bg-[#0f1a1b] text-[#D3C3B9] pt-24 pb-32 px-4 sm:px-6 lg:px-12 font-sans selection:bg-[#B58863]/30">
      
      {/* ════════════════ DIRECTOR'S CONTROL DECK HEADER ════════════════ */}
      <div className="mx-auto max-w-7xl mb-10">
        
        {/* Skeuomorphic Slate Header Card */}
        <div className="relative bg-[#0d1f20]/95 backdrop-blur-2xl border border-[#3D4D55]/60 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden animate-glow-breathe">
          
          {/* Top Film Slate Strip */}
          <div className="absolute top-0 left-0 right-0 h-3 flex overflow-hidden border-b border-[#3D4D55]/40">
            {Array.from({ length: 40 }).map((_, i) => (
              <div key={i} className={`flex-1 h-full ${i % 2 === 0 ? "bg-[#0f1a1b]" : "bg-[#FAF6E8]/10"}`} />
            ))}
          </div>

          {/* Golden Viewfinder Corner Marks */}
          <div className="absolute top-4 left-4 w-3 h-3 border-t-2 border-l-2 border-[#B58863]/60 pointer-events-none" />
          <div className="absolute top-4 right-4 w-3 h-3 border-t-2 border-r-2 border-[#B58863]/60 pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-3 h-3 border-b-2 border-l-2 border-[#B58863]/60 pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-3 h-3 border-b-4 border-r-2 border-[#B58863]/60 pointer-events-none" />

          {/* Header Content */}
          <div className="pt-2 flex flex-col md:flex-row items-center md:items-start justify-between gap-6 relative z-10">
            
            {/* Left: User Avatar + Telemetry */}
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
                <div className="absolute inset-[-4px] rounded-full border border-dashed border-[#B58863]/40 animate-halo pointer-events-none" />
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#B58863] bg-[#103334] shadow-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={user.image || "/avatar-placeholder.png"}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#B58863]/10 border border-[#B58863]/30 text-[8px] font-mono uppercase tracking-widest text-[#B58863] mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>DIRECTOR CONTROL DECK</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-[#FAF6E8]">
                  {user.name}
                </h1>
                <p className="text-xs font-mono text-[#B58863]/80 tracking-widest mt-0.5">
                  @{user.username} • CINEMA REEL ARCHIVE
                </p>
              </div>
            </div>

            {/* Right: Quick Action Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/user/${user.username}`}
                className="px-4 py-2.5 rounded-xl text-[10px] font-mono font-black uppercase tracking-widest text-[#FAF6E8] bg-[#103334]/60 border border-[#3D4D55]/60 hover:border-[#B58863]/60 hover:bg-[#1e2e30] transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5 text-[#B58863]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                <span>View Public Pass</span>
              </Link>
              
              <Link
                href="/recommend"
                className="px-4 py-2.5 rounded-xl text-[10px] font-mono font-black uppercase tracking-widest text-[#0f1a1b] bg-gradient-to-r from-[#B58863] to-[#d4a87c] hover:brightness-110 active:scale-[0.98] transition-all flex items-center gap-1.5 font-bold shadow-lg shadow-[#B58863]/20"
              >
                <span>✦</span>
                <span>Match Finder</span>
              </Link>
            </div>
          </div>

          {/* Telemetry Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-[#3D4D55]/30">
            <div className="bg-[#103334]/30 border border-[#3D4D55]/30 rounded-2xl p-4 text-center">
              <span className="block text-[7.5px] font-mono text-slate-400 uppercase tracking-widest">TOTAL LOGGED</span>
              <span className="text-2xl font-black font-mono text-[#FAF6E8] mt-1 block">{watched.length}</span>
              <span className="text-[8px] font-mono text-[#B58863] mt-0.5 block">{watchedMoviesCount} Movies • {watchedTVCount} TV</span>
            </div>

            <div className="bg-[#103334]/30 border border-[#3D4D55]/30 rounded-2xl p-4 text-center">
              <span className="block text-[7.5px] font-mono text-slate-400 uppercase tracking-widest">AVG RATING</span>
              <span className="text-2xl font-black font-mono text-[#B58863] mt-1 block">
                {averageRating > 0 ? averageRating.toFixed(1) : "0.0"} <span className="text-xs text-[#A79E9C]">★</span>
              </span>
              <span className="text-[8px] font-mono text-slate-400 mt-0.5 block">OUT OF 5.0 STARS</span>
            </div>

            <div className="bg-[#103334]/30 border border-[#3D4D55]/30 rounded-2xl p-4 text-center">
              <span className="block text-[7.5px] font-mono text-slate-400 uppercase tracking-widest">TIME IN CINEMA</span>
              <span className="text-2xl font-black font-mono text-[#FAF6E8] mt-1 block">{totalHours}h</span>
              <span className="text-[8px] font-mono text-[#B58863] mt-0.5 block">ESTIMATED RUNTIME</span>
            </div>

            <div className="bg-[#103334]/30 border border-[#3D4D55]/30 rounded-2xl p-4 text-center">
              <span className="block text-[7.5px] font-mono text-slate-400 uppercase tracking-widest">WATCHLIST QUEUE</span>
              <span className="text-2xl font-black font-mono text-[#FAF6E8] mt-1 block">{wishlist.length}</span>
              <span className="text-[8px] font-mono text-slate-400 mt-0.5 block">FUTURE REELS</span>
            </div>
          </div>

        </div>
      </div>

      {/* ════════════════ INTERACTIVE TABS CONTROL ════════════════ */}
      <div className="mx-auto max-w-7xl mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#3D4D55]/40 pb-4">
          
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
            {[
              { id: "WATCHED", label: `Watched Reels (${watched.length})`, icon: "🎬" },
              { id: "WISHLIST", label: `Watchlist (${wishlist.length})`, icon: "📌" },
              { id: "FAVORITES", label: `Favorites (${favorites.length})`, icon: "⭐" },
              { id: "ANALYTICS", label: `Taste Analytics`, icon: "📊" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-[10px] font-mono font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-[#B58863] text-[#0f1a1b] font-bold shadow-lg shadow-[#B58863]/20"
                    : "bg-[#103334]/40 border border-[#3D4D55]/40 text-[#A79E9C] hover:text-white hover:bg-[#1e2e30]"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <span className="text-[8px] font-mono text-slate-500 tracking-widest uppercase hidden lg:block">
            ARCHIVE // LENS_TELEMETRY
          </span>
        </div>
      </div>

      {/* ════════════════ TAB CONTENT PANELS ════════════════ */}
      <div className="mx-auto max-w-7xl">
        
        {/* WATCHED TAB */}
        {activeTab === "WATCHED" && (
          <div>
            {watched.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {watched.map((item) => (
                  <MediaCard key={`watched:${item.id}`} item={mapToMediaItem(item)} />
                ))}
              </div>
            ) : (
              <EmptyState text="NO WATCHED REELS LOGGED YET" />
            )}
          </div>
        )}

        {/* WISHLIST TAB */}
        {activeTab === "WISHLIST" && (
          <div>
            {wishlist.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {wishlist.map((item) => (
                  <MediaCard key={`wishlist:${item.id}`} item={mapToMediaItem(item)} />
                ))}
              </div>
            ) : (
              <EmptyState text="YOUR WATCHLIST IS CURRENTLY EMPTY" />
            )}
          </div>
        )}

        {/* FAVORITES TAB */}
        {activeTab === "FAVORITES" && (
          <div>
            {favorites.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {favorites.map((item) => (
                  <MediaCard key={`fav:${item.id}`} item={mapToMediaItem(item)} />
                ))}
              </div>
            ) : (
              <EmptyState text="NO FAVORITE FILMS MARKED YET" />
            )}
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === "ANALYTICS" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Rating Spectrum */}
            <div className="bg-[#0d1f20]/95 border border-[#3D4D55]/60 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <h2 className="text-xs font-mono font-black uppercase tracking-[0.2em] text-[#B58863] mb-6 flex items-center gap-2">
                <span className="w-1.5 h-4 rounded bg-[#B58863]" />
                RATING SPECTRUM // DISTRIBUTION
              </h2>

              <div className="space-y-3">
                {Object.entries(ratingCounts)
                  .sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]))
                  .map(([stars, count]) => {
                    const percentage = (count / maxRatingCount) * 100;
                    return (
                      <div key={stars} className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold text-[#A79E9C] w-12 text-right">{stars} ★</span>
                        <div className="flex-1 bg-[#0f1a1b] h-6 rounded-xl overflow-hidden border border-[#3D4D55]/30 relative p-0.5">
                          <div
                            className="bg-gradient-to-r from-[#B58863] to-[#d4a87c] h-full rounded-lg transition-all duration-500"
                            style={{ width: `${count > 0 ? Math.max(percentage, 4) : 0}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono font-black text-[#FAF6E8] w-8">{count}</span>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Genre Affinity Matrix */}
            <div className="bg-[#0d1f20]/95 border border-[#3D4D55]/60 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <h2 className="text-xs font-mono font-black uppercase tracking-[0.2em] text-[#B58863] mb-6 flex items-center gap-2">
                <span className="w-1.5 h-4 rounded bg-[#B58863]" />
                GENRE AFFINITY MATRIX
              </h2>

              {genreStats.length > 0 ? (
                <div className="space-y-4">
                  {genreStats.map((item) => (
                    <div key={item.name} className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-[#FAF6E8] flex items-center gap-2">
                          <span>{item.icon}</span>
                          <span>{item.name}</span>
                        </span>
                        <span className="font-mono text-[#B58863] font-bold">{item.percentage}% ({item.count} titles)</span>
                      </div>
                      <div className="w-full bg-[#0f1a1b] h-3 rounded-full overflow-hidden border border-[#3D4D55]/30 p-0.5">
                        <div
                          className="bg-gradient-to-r from-[#B58863] to-[#d4a87c] h-full rounded-full transition-all duration-500"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs font-mono text-[#A79E9C] italic text-center py-12">
                  LOG FILMS TO GENERATE YOUR GENRE TASTE PROFILE.
                </p>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

/* ── Empty State ── */
function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 border border-dashed border-[#3D4D55]/40 rounded-3xl gap-4 bg-[#103334]/10">
      <div className="flex gap-1.5 opacity-25">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-10 h-14 bg-[#1e2e30] rounded-lg border border-[#3D4D55]/40" />
        ))}
      </div>
      <p className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#A79E9C] font-bold">{text}</p>
    </div>
  );
}
