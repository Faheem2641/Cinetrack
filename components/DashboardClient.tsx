"use client";

import { useState } from "react";
import Link from "next/link";
import MediaCard from "./MediaCard";
import { MediaItem } from "@/lib/tmdb";
import { updateMediaRating, toggleWatchStatus } from "@/app/actions/log";

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
  const [activeTab, setActiveTab] = useState<"WATCHED" | "WISHLIST" | "FAVORITES" | "ANALYTICS" | "LOGGER">("WATCHED");
  
  // Quick Reel Logger states
  const [loggerQuery, setLoggerQuery] = useState("");
  const [loggerResults, setLoggerResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<any | null>(null);
  const [logRating, setLogRating] = useState<number>(4.0);
  const [logWatched, setLogWatched] = useState(true);
  const [logWishlist, setLogWishlist] = useState(false);
  const [logFavorite, setLogFavorite] = useState(false);
  const [logSuccessMsg, setLogSuccessMsg] = useState("");

  const watchedMoviesCount = watched.filter((w) => w.mediaType === "movie").length;
  const watchedTVCount = watched.filter((w) => w.mediaType === "tv").length;
  const totalHours = Math.round(totalRuntimeMinutes / 60);

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

  // Search API handler for Quick Logger
  const handleLoggerSearch = async (val: string) => {
    setLoggerQuery(val);
    if (val.trim().length >= 2) {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(val)}`);
        if (res.ok) {
          const data = await res.json();
          setLoggerResults(data);
        }
      } catch (e) {
        console.error("Quick logger search failed", e);
      } finally {
        setIsSearching(false);
      }
    } else {
      setLoggerResults([]);
    }
  };

  // Quick Reel Log submit handler
  const handleLogSubmit = async () => {
    if (!selectedMedia) return;
    try {
      const tmdbId = String(selectedMedia.id);
      const mediaType = selectedMedia.mediaType as "movie" | "tv";
      const title = selectedMedia.title;
      const posterPath = selectedMedia.posterPath;
      const releaseDate = selectedMedia.releaseDate;

      if (logWatched) {
        await updateMediaRating(tmdbId, mediaType, title, posterPath, releaseDate, logRating);
      } else if (logWishlist) {
        await toggleWatchStatus(tmdbId, mediaType, title, posterPath, releaseDate, "isWishlist");
      }
      if (logFavorite) {
        await toggleWatchStatus(tmdbId, mediaType, title, posterPath, releaseDate, "isFavorite");
      }

      setLogSuccessMsg(`"${selectedMedia.title}" logged successfully to your studio archive!`);
      setTimeout(() => {
        setLogSuccessMsg("");
        setSelectedMedia(null);
        setLoggerQuery("");
        setLoggerResults([]);
      }, 2000);
    } catch (err) {
      console.error("Failed to log entry", err);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0f1a1b] text-[#D3C3B9] pt-8 pb-32 px-4 sm:px-6 lg:px-12 font-sans selection:bg-[#B58863]/30 overflow-x-hidden">
      
      {/* ════════════════ CONTROL DECK HEADER ════════════════ */}
      <div className="mx-auto max-w-7xl mb-10">
        <div className="bg-[#0d1f20]/95 backdrop-blur-2xl border border-[#3D4D55]/60 rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative overflow-hidden animate-glow-breathe">
          
          {/* Top Film Slate Bar */}
          <div className="h-2.5 -mx-8 -mt-8 mb-6 flex overflow-hidden border-b border-[#3D4D55]/40 select-none">
            {Array.from({ length: 40 }).map((_, i) => (
              <div key={i} className={`flex-1 h-full ${i % 2 === 0 ? "bg-[#0f1a1b]" : "bg-[#FAF6E8]/10"}`} />
            ))}
          </div>

          {/* Golden Viewfinder Corner Marks */}
          <div className="absolute top-5 left-5 w-3 h-3 border-t-2 border-l-2 border-[#B58863]/60 pointer-events-none" />
          <div className="absolute top-5 right-5 w-3 h-3 border-t-2 border-r-2 border-[#B58863]/60 pointer-events-none" />
          <div className="absolute bottom-5 left-5 w-3 h-3 border-b-2 border-l-2 border-[#B58863]/60 pointer-events-none" />
          <div className="absolute bottom-5 right-5 w-3 h-3 border-b-2 border-r-2 border-[#B58863]/60 pointer-events-none" />

          {/* Director Identity Header */}
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 relative z-10">
            
            {/* Left: Avatar + Title */}
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0">
                <div className="absolute inset-[-5px] rounded-full border border-dashed border-[#B58863]/40 animate-halo pointer-events-none" />
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#B58863] bg-[#103334] shadow-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={user.image || "/avatar-placeholder.png"}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B58863]/10 border border-[#B58863]/30 text-[8.5px] font-mono uppercase tracking-widest text-[#B58863] mb-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>STUDIO ARCHIVE • DIRECTOR ID #{user.id.slice(0, 8)}</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-wider text-[#FAF6E8]">
                  {user.name}
                </h1>
                <p className="text-xs font-mono text-[#B58863]/80 tracking-widest mt-1">
                  @{user.username} • CINEMA CONTROL CONSOLE
                </p>
              </div>
            </div>

            {/* Right: Quick Action Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActiveTab("LOGGER")}
                className="px-4 py-2.5 rounded-xl text-[10px] font-mono font-black uppercase tracking-widest text-[#0f1a1b] bg-gradient-to-r from-[#B58863] to-[#d4a87c] hover:brightness-110 active:scale-[0.98] transition-all flex items-center gap-2 font-bold shadow-lg shadow-[#B58863]/20 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span>Log New Film / Show</span>
              </button>

              <Link
                href={`/user/${user.username}`}
                className="px-4 py-2.5 rounded-xl text-[10px] font-mono font-black uppercase tracking-widest text-[#FAF6E8] bg-[#103334]/60 border border-[#3D4D55]/60 hover:border-[#B58863]/60 hover:bg-[#1e2e30] transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>View Public Pass</span>
              </Link>
            </div>
          </div>

          {/* Telemetry Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-[#3D4D55]/30">
            <div className="bg-[#103334]/30 border border-[#3D4D55]/40 rounded-2xl p-4 text-center">
              <span className="block text-[7.5px] font-mono text-slate-400 uppercase tracking-widest">LOGGED REELS</span>
              <span className="text-2xl font-black font-mono text-[#FAF6E8] mt-1 block">{watched.length}</span>
              <span className="text-[8px] font-mono text-[#B58863] mt-0.5 block">{watchedMoviesCount} Movies • {watchedTVCount} TV</span>
            </div>

            <div className="bg-[#103334]/30 border border-[#3D4D55]/40 rounded-2xl p-4 text-center">
              <span className="block text-[7.5px] font-mono text-slate-400 uppercase tracking-widest">AVG STAR RATING</span>
              <span className="text-2xl font-black font-mono text-[#B58863] mt-1 block">
                {averageRating > 0 ? averageRating.toFixed(1) : "0.0"} <span className="text-xs text-[#A79E9C]">★</span>
              </span>
              <span className="text-[8px] font-mono text-slate-400 mt-0.5 block">OUT OF 5.0 STARS</span>
            </div>

            <div className="bg-[#103334]/30 border border-[#3D4D55]/40 rounded-2xl p-4 text-center">
              <span className="block text-[7.5px] font-mono text-slate-400 uppercase tracking-widest">TIME IN CINEMA</span>
              <span className="text-2xl font-black font-mono text-[#FAF6E8] mt-1 block">{totalHours}h</span>
              <span className="text-[8px] font-mono text-[#B58863] mt-0.5 block">TOTAL RUNTIME</span>
            </div>

            <div className="bg-[#103334]/30 border border-[#3D4D55]/40 rounded-2xl p-4 text-center">
              <span className="block text-[7.5px] font-mono text-slate-400 uppercase tracking-widest">WATCHLIST QUEUE</span>
              <span className="text-2xl font-black font-mono text-[#FAF6E8] mt-1 block">{wishlist.length}</span>
              <span className="text-[8px] font-mono text-slate-400 mt-0.5 block">FUTURE REELS</span>
            </div>
          </div>

        </div>
      </div>

      {/* ════════════════ INTERACTIVE TAB NAVIGATION ════════════════ */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#3D4D55]/40 pb-4">
          
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
            {[
              { id: "WATCHED", label: `Watched Archive (${watched.length})`, icon: "🎬" },
              { id: "WISHLIST", label: `Watchlist (${wishlist.length})`, icon: "📌" },
              { id: "FAVORITES", label: `Favorites (${favorites.length})`, icon: "⭐" },
              { id: "ANALYTICS", label: `Taste Analytics`, icon: "📊" },
              { id: "LOGGER", label: `Quick Film Logger`, icon: "➕" },
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

          <span className="text-[8px] font-mono text-slate-500 tracking-widest uppercase hidden lg:block select-none">
            STUDIO CONTROL // TELEMETRY_ACTIVE
          </span>
        </div>
      </div>

      {/* ════════════════ TAB PANELS ════════════════ */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 pb-24">
        
        {/* QUICK FILM LOGGER CONSOLE */}
        {activeTab === "LOGGER" && (
          <div className="bg-[#0d1f20]/95 border border-[#3D4D55]/60 rounded-3xl p-6 sm:p-8 shadow-2xl mb-12">
            <h2 className="text-sm font-mono font-black uppercase tracking-[0.2em] text-[#B58863] mb-4 flex items-center gap-2">
              <span className="w-1.5 h-4 rounded bg-[#B58863]" />
              STUDIO CUTTING ROOM // QUICK REEL LOGGER
            </h2>
            <p className="text-xs text-[#A79E9C] mb-6">
              Search any film or TV show to instantly rate, log, or save to your watchlist.
            </p>

            {/* Search Input */}
            <div className="relative mb-6">
              <input
                type="text"
                value={loggerQuery}
                onChange={(e) => handleLoggerSearch(e.target.value)}
                placeholder="Type movie or TV show title..."
                className="w-full bg-[#0f1a1b] border border-[#3D4D55]/60 rounded-2xl px-5 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#B58863] font-mono transition-colors"
              />
              {isSearching && (
                <span className="absolute right-4 top-4 text-xs font-mono text-[#B58863] animate-pulse">SEARCHING...</span>
              )}
            </div>

            {/* Search Results Grid */}
            {loggerResults.length > 0 && !selectedMedia && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-1">
                {loggerResults.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedMedia(item)}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-[#103334]/30 border border-[#3D4D55]/40 hover:border-[#B58863]/60 hover:bg-[#103334]/60 transition-all text-left group cursor-pointer"
                  >
                    <div className="w-10 h-14 bg-black rounded-lg overflow-hidden flex-shrink-0 border border-white/5">
                      {item.posterPath ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={`https://image.tmdb.org/t/p/w92${item.posterPath}`} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[6px] text-white/20 font-mono">NO IMG</div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-[#D3C3B9] group-hover:text-white truncate">{item.title}</h4>
                      <p className="text-[9px] font-mono text-slate-500 mt-1">
                        <span className="text-[#B58863]">{item.mediaType === "movie" ? "MOVIE" : "SERIES"}</span> • {item.releaseDate ? item.releaseDate.split("-")[0] : "N/A"}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Selected Reel Logger Form */}
            {selectedMedia && (
              <div className="bg-[#103334]/40 border border-[#B58863]/50 rounded-2xl p-6 relative">
                <button
                  onClick={() => setSelectedMedia(null)}
                  className="absolute top-4 right-4 text-xs font-mono text-slate-400 hover:text-white cursor-pointer"
                >
                  ✕ CANCEL
                </button>

                <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                  <div className="w-24 h-36 bg-black rounded-xl overflow-hidden flex-shrink-0 border border-[#B58863]/40 shadow-xl">
                    {selectedMedia.posterPath ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={`https://image.tmdb.org/t/p/w185${selectedMedia.posterPath}`} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs font-mono text-white/20">NO POSTER</div>
                    )}
                  </div>

                  <div className="flex-1 w-full space-y-4">
                    <div>
                      <span className="text-[8px] font-mono text-[#B58863] uppercase tracking-widest">SELECTED REEL</span>
                      <h3 className="text-lg font-black text-[#FAF6E8]">{selectedMedia.title}</h3>
                    </div>

                    {/* Star Rating selector */}
                    <div>
                      <label className="block text-[8px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">RATING SCORE ({logRating} ★)</label>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setLogRating(star)}
                            className={`text-xl cursor-pointer transition-transform hover:scale-125 ${
                              star <= logRating ? "text-[#B58863]" : "text-slate-600"
                            }`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Checkbox Toggles */}
                    <div className="flex flex-wrap gap-4 pt-2">
                      <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer">
                        <input type="checkbox" checked={logWatched} onChange={(e) => setLogWatched(e.target.checked)} className="accent-[#B58863]" />
                        <span>Log as Watched</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer">
                        <input type="checkbox" checked={logWishlist} onChange={(e) => setLogWishlist(e.target.checked)} className="accent-[#B58863]" />
                        <span>Save to Watchlist</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs font-mono text-slate-300 cursor-pointer">
                        <input type="checkbox" checked={logFavorite} onChange={(e) => setLogFavorite(e.target.checked)} className="accent-[#B58863]" />
                        <span>Mark as Favorite</span>
                      </label>
                    </div>

                    <button
                      onClick={handleLogSubmit}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-[#B58863] to-[#d4a87c] text-[#0f1a1b] font-mono font-black text-xs uppercase tracking-widest hover:brightness-110 cursor-pointer transition-all shadow-lg shadow-[#B58863]/20 mt-4"
                    >
                      LOG REEL TO ARCHIVE
                    </button>

                    {logSuccessMsg && (
                      <p className="text-xs font-mono text-emerald-400 font-bold text-center mt-2">{logSuccessMsg}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

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
