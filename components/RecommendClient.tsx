"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import type { MediaItem } from "@/lib/tmdb";
import FilmstripDivider from "@/components/FilmstripDivider";

// ─── Genre definitions ──────────────────────────────────────────────────────

const GENRE_GROUPS = [
  {
    label: "Action & Thrills",
    emoji: "⚡",
    color: "from-orange-500/20 to-red-600/20 border-red-500/30",
    genres: ["Action", "Action & Adventure", "Thriller", "Crime"],
  },
  {
    label: "Sci-Fi & Fantasy",
    emoji: "🚀",
    color: "from-blue-500/20 to-cyan-500/20 border-cyan-500/30",
    genres: ["Science Fiction", "Sci-Fi & Fantasy", "Fantasy"],
  },
  {
    label: "Drama",
    emoji: "🎭",
    color: "from-purple-500/20 to-violet-600/20 border-violet-500/30",
    genres: ["Drama"],
  },
  {
    label: "Comedy",
    emoji: "😂",
    color: "from-yellow-400/20 to-orange-400/20 border-yellow-500/30",
    genres: ["Comedy"],
  },
  {
    label: "Horror & Mystery",
    emoji: "👻",
    color: "from-gray-700/20 to-red-900/20 border-red-900/30",
    genres: ["Horror", "Mystery"],
  },
  {
    label: "Adventure",
    emoji: "🗺️",
    color: "from-emerald-500/20 to-teal-600/20 border-emerald-500/30",
    genres: ["Adventure"],
  },
  {
    label: "Romance",
    emoji: "💕",
    color: "from-pink-500/20 to-rose-500/20 border-pink-500/30",
    genres: ["Romance"],
  },
  {
    label: "Animation",
    emoji: "✨",
    color: "from-indigo-400/20 to-purple-500/20 border-indigo-500/30",
    genres: ["Animation", "Family"],
  },
  {
    label: "Documentary",
    emoji: "📹",
    color: "from-zinc-600/20 to-zinc-500/20 border-zinc-500/30",
    genres: ["Documentary"],
  },
  {
    label: "History & War",
    emoji: "⚔️",
    color: "from-amber-700/20 to-yellow-600/20 border-amber-700/30",
    genres: ["History", "War", "War & Politics"],
  },
  {
    label: "Music",
    emoji: "🎵",
    color: "from-fuchsia-500/20 to-pink-500/20 border-fuchsia-500/30",
    genres: ["Music"],
  },
  {
    label: "Western",
    emoji: "🤠",
    color: "from-stone-600/20 to-amber-700/20 border-amber-900/30",
    genres: ["Western"],
  },
];

const MEDIA_TYPE_OPTIONS = [
  { label: "Movies", value: "movie" as const, emoji: "🎬" },
  { label: "TV Shows", value: "tv" as const, emoji: "📺" },
  { label: "Both", value: "both" as const, emoji: "🍿" },
];

// ─── Types ──────────────────────────────────────────────────────────────────

type MediaFilter = "movie" | "tv" | "both";
type Step = "type" | "genre" | "results";

interface Props {
  inventory: MediaItem[];
  watchedIds: string[];
  isLoggedIn: boolean;
}

// ─── Scoring / recommendation engine ────────────────────────────────────────

function scoreItem(
  item: MediaItem,
  selectedGenres: string[],
  watchedIds: Set<string>
): number {
  const key = `${item.mediaType}:${item.id}`;
  if (watchedIds.has(key)) return -1; // already watched → exclude

  const itemGenres = item.genres ?? [];
  const genreMatches = selectedGenres.filter((g) => itemGenres.includes(g)).length;
  if (selectedGenres.length > 0 && genreMatches === 0) return 0; // no match

  // Score: genre overlap * 40 + voteAverage * 10 + voteCount_bonus
  const voteBonus = Math.min(item.voteCount / 5000, 5); // max 5 extra points for popularity
  return genreMatches * 40 + item.voteAverage * 10 + voteBonus;
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function RecommendClient({ inventory, watchedIds, isLoggedIn }: Props) {
  const [step, setStep] = useState<Step>("type");
  const [mediaFilter, setMediaFilter] = useState<MediaFilter>("both");
  const [selectedGroupIndexes, setSelectedGroupIndexes] = useState<number[]>([]);
  const [showAll, setShowAll] = useState(false);

  const watchedSet = useMemo(() => new Set(watchedIds), [watchedIds]);

  // Derive all selected genres from group selections
  const selectedGenres = useMemo(
    () =>
      selectedGroupIndexes.flatMap((i) => GENRE_GROUPS[i]?.genres ?? []),
    [selectedGroupIndexes]
  );

  // Filtered inventory by media type
  const filteredByType = useMemo(
    () =>
      inventory.filter((item) =>
        mediaFilter === "both" ? true : item.mediaType === mediaFilter
      ),
    [inventory, mediaFilter]
  );

  // Score and sort
  const recommendations = useMemo(() => {
    if (step !== "results") return [];
    return filteredByType
      .map((item) => ({
        item,
        score: scoreItem(item, selectedGenres, watchedSet),
      }))
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ item }) => item);
  }, [step, filteredByType, selectedGenres, watchedSet]);

  const displayed = showAll ? recommendations : recommendations.slice(0, 18);
  const totalWatched = watchedIds.length;

  const toggleGroup = (i: number) => {
    setSelectedGroupIndexes((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );
  };

  const handleFindMatches = () => {
    setShowAll(false);
    setStep("results");
  };

  const handleReset = () => {
    setStep("type");
    setSelectedGroupIndexes([]);
    setMediaFilter("both");
    setShowAll(false);
  };

  return (
    <div className="min-h-screen bg-[#0f1a1b] text-[#D3C3B9] overflow-x-hidden selection:bg-[#B58863]/30 selection:text-[#FAF6E8]">
      {/* Spacer to clear the fixed navbar height */}
      <div className="h-20 w-full" />

      {/* Filmstrip transition section border */}
      <FilmstripDivider
        bgClass="bg-[#122123]"
        aboveColor="text-[#0f1a1b]"
        belowColor="text-[#0f1a1b]"
        reelLabel="REEL_02 // MATCH FINDER DETECT"
      />

      {/* ─── Hero / Page Header ─────────────────────────────── */}
      <div className="relative pt-12 pb-14 px-4 text-center overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-[#B58863]/5 blur-[120px]" />
          <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] rounded-full bg-[#d4a87c]/3 blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Viewfinder-style Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#B58863]/15 border border-[#B58863]/30 text-[#d4a87c] text-[9px] font-mono tracking-widest uppercase mb-6 shadow-sm select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span>✦ CINEMATIC MATCH FINDER // ENG-v2</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-5">
            <span className="bg-gradient-to-r from-[#B58863] via-[#d4a87c] to-[#FAF6E8] bg-clip-text text-transparent uppercase font-mono">
              Match Finder
            </span>
          </h1>

          <p className="text-[#A79E9C] text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Configure your mood parameters below. Cinetrack will cross-examine your local library logs and draft custom title matches, skipping anything you&apos;ve checked off.
          </p>

          {isLoggedIn && (
            <p className="mt-4 font-mono text-[10px] tracking-wider text-slate-500 select-none">
              ANALYST ENGINE ACTIVE //{" "}
              <span className="text-[#B58863] font-bold">{totalWatched}</span>{" "}
              TITLES FILTERED FROM POOL
            </p>
          )}
        </div>
      </div>

      {/* ─── Step Indicator ─────────────────────────────────── */}
      <div className="flex items-center justify-center gap-3 mb-12 px-4 select-none">
        {(["type", "genre", "results"] as Step[]).map((s, i) => {
          const labels = ["Content Type", "Genres List", "Match Results"];
          const active = s === step;
          const done =
            (s === "type" && (step === "genre" || step === "results")) ||
            (s === "genre" && step === "results");
          return (
            <div key={s} className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (done) setStep(s);
                }}
                className={`flex items-center gap-2.5 px-4.5 py-2 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider transition-all duration-300 ${
                  active
                    ? "bg-gradient-to-r from-[#B58863] to-[#d4a87c] text-[#0f1a1b] shadow-md shadow-[#B58863]/25"
                    : done
                    ? "bg-[#103334]/80 text-[#FAF6E8] border border-[#B58863]/40 hover:bg-[#1e2e30] cursor-pointer"
                    : "bg-[#103334]/20 text-[#A79E9C] border border-white/5 cursor-default"
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black ${
                    active
                      ? "bg-[#0f1a1b]/15 text-[#0f1a1b]"
                      : done
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-[#0f1a1b]/35 text-[#A79E9C]"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </span>
                {labels[i]}
              </button>
              {i < 2 && <span className="w-8 h-[1px] bg-[#3D4D55]/30" />}
            </div>
          );
        })}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-28">
        {/* ═══════════════════════════════════════════════
            STEP 1 – Content Type
        ═══════════════════════════════════════════════ */}
        {step === "type" && (
          <div className="max-w-2xl mx-auto">
            {/* Viewfinder telemetry box wrapper */}
            <div className="relative p-6 sm:p-8 rounded-3xl bg-[#103334]/20 border border-[#3D4D55]/30 shadow-2xl">
              
              {/* Corner ticks */}
              <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-[#B58863]/30" />
              <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-[#B58863]/30" />
              <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-[#B58863]/30" />
              <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-[#B58863]/30" />

              <h2 className="text-center text-lg font-bold text-[#FAF6E8] uppercase tracking-wider mb-1 font-mono">
                Select Format // deck_type
              </h2>
              <p className="text-center text-xs text-[#A79E9C] mb-8 font-mono">
                INDICATE MOOD CATEGORY PREFERENCE FOR TMDB SWEEP
              </p>

              <div className="grid grid-cols-3 gap-4">
                {MEDIA_TYPE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setMediaFilter(opt.value)}
                    className={`group relative flex flex-col items-center gap-3.5 p-6 rounded-2xl border-2 transition-all duration-300 ${
                      mediaFilter === opt.value
                        ? "border-[#B58863] bg-[#B58863]/10 shadow-lg shadow-[#B58863]/15 text-[#FAF6E8]"
                        : "border-[#3D4D55]/30 bg-[#103334]/40 text-[#A79E9C] hover:border-[#B58863]/40 hover:bg-[#103334]/60 cursor-pointer"
                    }`}
                  >
                    <span className="text-4xl group-hover:scale-110 transition-transform duration-300 select-none">{opt.emoji}</span>
                    <span className="text-xs font-mono font-black uppercase tracking-wider">
                      {opt.label}
                    </span>
                    {mediaFilter === opt.value && (
                      <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-[#B58863] flex items-center justify-center shadow-md">
                        <svg
                          className="w-2.5 h-2.5 text-[#0f1a1b]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={() => setStep("genre")}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-[#B58863] to-[#d4a87c] text-[#0f1a1b] font-mono font-black text-xs uppercase tracking-widest shadow-lg shadow-[#B58863]/25 hover:shadow-[#B58863]/40 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 cursor-pointer"
                >
                  Configure Genres →
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════
            STEP 2 – Genre Picker
        ═══════════════════════════════════════════════ */}
        {step === "genre" && (
          <div>
            <h2 className="text-center text-lg font-bold text-[#FAF6E8] uppercase tracking-wider mb-1 font-mono">
              Taste profile override // selector_matrix
            </h2>
            <p className="text-center text-xs text-[#A79E9C] mb-8 font-mono">
              COMBINE GENRE NODES TO DICTATE DYNAMIC SCORING COEFFICIENTS
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {GENRE_GROUPS.map((group, i) => {
                const selected = selectedGroupIndexes.includes(i);
                return (
                  <button
                    key={group.label}
                    onClick={() => toggleGroup(i)}
                    className={`relative group overflow-hidden flex items-center gap-3.5 px-4.5 py-4 rounded-2xl border-2 text-left transition-all duration-300 ${
                      selected
                        ? "border-[#B58863] bg-[#B58863]/10 shadow-lg shadow-[#B58863]/15 text-[#FAF6E8]"
                        : "border-[#3D4D55]/30 bg-[#103334]/40 text-[#A79E9C] hover:border-[#B58863]/40 hover:bg-[#103334]/60 cursor-pointer"
                    }`}
                  >
                    <span
                      className={`relative z-10 flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all ${
                        selected
                          ? "bg-gradient-to-br from-[#B58863] to-[#d4a87c] text-[#0f1a1b] shadow-md shadow-[#B58863]/35"
                          : "bg-[#103334] group-hover:bg-[#1e2e30] text-[#D3C3B9]"
                      }`}
                    >
                      {group.emoji}
                    </span>

                    <span className="relative z-10 text-xs font-mono font-black uppercase tracking-wider leading-tight">
                      {group.label}
                    </span>

                    {selected && (
                      <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#B58863] flex items-center justify-center z-10 shadow-sm">
                        <svg
                          className="w-2.5 h-2.5 text-[#0f1a1b]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Genre selection summary */}
            {selectedGroupIndexes.length > 0 && (
              <div className="mt-8 text-center animate-fade-in">
                <span className="font-mono text-[9px] tracking-wider text-slate-500 uppercase block mb-3.5">Active Coefficients //</span>
                <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto">
                  {selectedGenres.map((g) => (
                    <span
                      key={g}
                      className="px-3.5 py-1 rounded-full bg-[#B58863]/15 border border-[#B58863]/30 text-[#d4a87c] text-[10px] font-mono uppercase tracking-wider"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-10 flex items-center justify-center gap-4">
              <button
                onClick={() => setStep("type")}
                className="px-6 py-3 rounded-full bg-[#103334]/50 border border-[#3D4D55]/40 text-[#A79E9C] text-xs font-mono font-bold uppercase tracking-widest hover:text-[#FAF6E8] hover:bg-[#103334] active:scale-[0.97] transition-all cursor-pointer"
              >
                ← Back
              </button>
              <button
                onClick={handleFindMatches}
                disabled={selectedGroupIndexes.length === 0}
                className={`inline-flex items-center gap-2 px-8 py-3 rounded-full font-mono font-black text-xs uppercase tracking-widest transition-all duration-300 ${
                  selectedGroupIndexes.length > 0
                    ? "bg-gradient-to-r from-[#B58863] to-[#d4a87c] text-[#0f1a1b] shadow-lg shadow-[#B58863]/25 hover:shadow-[#B58863]/40 hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
                    : "bg-[#103334]/20 border border-white/5 text-[#A79E9C]/30 cursor-not-allowed"
                }`}
              >
                ✦ Scan Database
                {selectedGroupIndexes.length > 0 && (
                  <span className="bg-[#0f1a1b]/15 rounded-full px-2 py-0.5 text-[10px] font-black font-mono">
                    {selectedGroupIndexes.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════
            STEP 3 – Results
        ═══════════════════════════════════════════════ */}
        {step === "results" && (
          <div>
            {/* Results header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 border-b border-[#3D4D55]/30 pb-6 select-none">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#FAF6E8] font-mono uppercase tracking-tight">
                  {recommendations.length > 0 ? (
                    <>
                      Found{" "}
                      <span className="bg-gradient-to-r from-[#B58863] to-[#d4a87c] bg-clip-text text-transparent">
                        {recommendations.length}
                      </span>{" "}
                      Matched Profiles
                    </>
                  ) : (
                    "No matching profiles drafted"
                  )}
                </h2>
                <p className="text-xs font-mono text-[#A79E9C] mt-2 flex flex-wrap items-center gap-1.5">
                  {mediaFilter !== "both" && (
                    <span className="uppercase text-[#FAF6E8]">{mediaFilter === "movie" ? "Movies" : "TV Shows"}</span>
                  )}
                  {mediaFilter !== "both" && <span className="text-[#3D4D55]">•</span>}
                  <span className="text-[#B58863]">{selectedGenres.slice(0, 3).join(", ")}</span>
                  {selectedGenres.length > 3 && (
                    <span className="text-slate-500">+{selectedGenres.length - 3} MORE</span>
                  )}
                  {isLoggedIn && recommendations.length > 0 && (
                    <>
                      <span className="text-[#3D4D55]">•</span>
                      <span className="text-emerald-400 font-bold">
                        {totalWatched} LOGGED SEEN EXCLUDED
                      </span>
                    </>
                  )}
                </p>
              </div>

              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#103334]/60 border border-[#3D4D55]/50 text-[#A79E9C] hover:text-[#FAF6E8] text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#103334] active:scale-[0.97] transition-all cursor-pointer"
              >
                <svg
                  className="w-3.5 h-3.5 text-[#B58863]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
                Configure Filter
              </button>
            </div>

            {/* Empty state */}
            {recommendations.length === 0 && (
              <div className="text-center py-24 bg-[#103334]/10 rounded-3xl border border-[#3D4D55]/20 max-w-2xl mx-auto relative p-8">
                {/* Corner ticks */}
                <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-[#B58863]/30" />
                <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-[#B58863]/30" />
                <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-[#B58863]/30" />
                <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-[#B58863]/30" />

                <div className="text-6xl mb-6 select-none">🎬</div>
                <p className="text-[#FAF6E8] text-lg font-bold font-mono uppercase tracking-wide mb-2">
                  No draft compiled
                </p>
                <p className="text-[#A79E9C] text-xs max-w-md mx-auto mb-8 leading-relaxed font-mono">
                  THE SELECTED COEFFICIENTS RETURNED ZERO HIT INTERSECTS. TRY BROADENING TARGET MOOD NODES.
                </p>
                <button
                  onClick={() => setStep("genre")}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#B58863] to-[#d4a87c] text-[#0f1a1b] text-xs font-mono font-black uppercase tracking-widest shadow-md hover:scale-[1.02] transition-all cursor-pointer"
                >
                  Refine Parameters
                </button>
              </div>
            )}

            {/* Results grid */}
            {recommendations.length > 0 && (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
                  {displayed.map((item, index) => (
                    <RecommendCard key={`${item.mediaType}:${item.id}`} item={item} rank={index + 1} />
                  ))}
                </div>

                {!showAll && recommendations.length > 18 && (
                  <div className="mt-12 text-center">
                    <button
                      onClick={() => setShowAll(true)}
                      className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#103334]/60 border border-[#3D4D55]/50 text-[#A79E9C] hover:text-[#FAF6E8] text-xs font-mono font-bold uppercase tracking-widest hover:bg-[#103334] transition-all cursor-pointer"
                    >
                      Load {recommendations.length - 18} Remaining Matches
                      <svg
                        className="w-4 h-4 text-[#B58863]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m19.5 8.25-7.5 7.5-7.5-7.5"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Card component (Styled exactly to match Cinetrack's homepage cards) ──────

function RecommendCard({ item, rank }: { item: MediaItem; rank: number }) {
  const href = `/${item.mediaType === "movie" ? "movies" : "tv"}/${item.id}`;
  const posterUrl = item.posterPath
    ? `https://image.tmdb.org/t/p/w342${item.posterPath}`
    : null;

  const rating = item.voteAverage.toFixed(1);
  const releaseYear = item.releaseDate ? item.releaseDate.split("-")[0] : "N/A";
  const frameNumber = String(Number(item.id) % 99).padStart(2, "0");

  return (
    <Link
      href={href}
      className="group relative flex flex-col p-3 rounded-xl bg-slate-900/90 border border-white/10 hover:border-[#B58863]/50 hover:bg-slate-900 transition-[transform,border-color] duration-200 ease-out hover:shadow-[0_4px_15px_rgba(181,136,99,0.15)] hover:translate-y-[-4px] hover:z-30 select-none"
    >
      {/* Left Sprocket Column (Skeuomorphic film strip detail) */}
      <div className="absolute left-1.5 top-8 bottom-8 z-20 flex flex-col justify-between py-1.5 pointer-events-none select-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={`left-sprock-${i}`} className="w-1.5 h-2.5 bg-[#0f1a1b] rounded-[1px] border border-white/5 shadow-inner" />
        ))}
      </div>

      {/* Poster image container inside the film strip card */}
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-[#0f1a1b] border border-white/5 shadow-inner">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-zinc-700 bg-slate-950 font-mono text-[9px]">
            NO POSTER
          </div>
        )}

        {/* Gradient overlay inside poster */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

        {/* Rank badge */}
        {rank <= 3 ? (
          <div
            className={`absolute top-2.5 left-3 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shadow-lg font-mono ${
              rank === 1
                ? "bg-gradient-to-br from-[#B58863] to-[#d4a87c] text-[#0f1a1b]"
                : rank === 2
                ? "bg-gradient-to-br from-[#FAF6E8] to-[#D3C3B9] text-[#0f1a1b]"
                : "bg-gradient-to-br from-[#3D4D55] to-[#A79E9C] text-white"
            }`}
          >
            #{rank}
          </div>
        ) : (
          <div className="absolute top-2.5 left-3 w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold bg-[#0f1a1b]/60 text-[#A79E9C] backdrop-blur-sm border border-white/5 font-mono shadow">
            #{rank}
          </div>
        )}

        {/* Media type badge */}
        <div className="absolute top-2.5 right-2.5 px-1.5 py-0.5 rounded bg-[#0f1a1b]/70 border border-white/10 text-[7px] font-black font-mono text-[#FAF6E8] tracking-widest backdrop-blur-sm select-none">
          {item.mediaType === "movie" ? "MOVIE" : "TV"}
        </div>
      </div>

      {/* Info panel */}
      <div className="mt-3 px-1.5 pb-1 flex-grow flex flex-col justify-between">
        
        {/* Title */}
        <h3 className="text-[11px] font-black text-[#D3C3B9] group-hover:text-[#FAF6E8] leading-snug line-clamp-2 transition-colors">
          {item.title}
        </h3>

        <div>
          {/* Metadata Row (Year and Frame spec) */}
          <div className="flex items-center justify-between mt-2.5 text-[8px] font-mono text-slate-500">
            <span>RUN: S_{frameNumber}</span>
            <span>{releaseYear}</span>
          </div>

          {/* Golden Rating Indicator Bar */}
          <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-white/[0.05]">
            <div className="flex items-center gap-0.5">
              <svg
                className="w-2.5 h-2.5 text-[#B58863]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-[10px] font-black text-[#B58863] font-mono leading-none">{rating}</span>
            </div>
            {item.genres && item.genres.length > 0 && (
              <span className="text-slate-700 text-[8px] font-mono select-none">|</span>
            )}
            <span className="text-[9px] font-mono text-[#A79E9C] truncate">
              {item.genres?.slice(0, 1).join("").toUpperCase()}
            </span>
          </div>
        </div>

      </div>
    </Link>
  );
}
