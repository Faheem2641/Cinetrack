"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import type { MediaItem } from "@/lib/tmdb";

// ─── Genre definitions ──────────────────────────────────────────────────────

const GENRE_GROUPS = [
  {
    label: "Action & Thrills",
    emoji: "⚡",
    color: "from-orange-500 to-red-600",
    genres: ["Action", "Action & Adventure", "Thriller", "Crime"],
  },
  {
    label: "Sci-Fi & Fantasy",
    emoji: "🚀",
    color: "from-blue-500 to-cyan-500",
    genres: ["Science Fiction", "Sci-Fi & Fantasy", "Fantasy"],
  },
  {
    label: "Drama",
    emoji: "🎭",
    color: "from-purple-500 to-violet-600",
    genres: ["Drama"],
  },
  {
    label: "Comedy",
    emoji: "😂",
    color: "from-yellow-400 to-orange-400",
    genres: ["Comedy"],
  },
  {
    label: "Horror & Mystery",
    emoji: "👻",
    color: "from-gray-700 to-red-900",
    genres: ["Horror", "Mystery"],
  },
  {
    label: "Adventure",
    emoji: "🗺️",
    color: "from-emerald-500 to-teal-600",
    genres: ["Adventure"],
  },
  {
    label: "Romance",
    emoji: "💕",
    color: "from-pink-500 to-rose-500",
    genres: ["Romance"],
  },
  {
    label: "Animation",
    emoji: "✨",
    color: "from-indigo-400 to-purple-500",
    genres: ["Animation", "Family"],
  },
  {
    label: "Documentary",
    emoji: "📹",
    color: "from-zinc-600 to-zinc-500",
    genres: ["Documentary"],
  },
  {
    label: "History & War",
    emoji: "⚔️",
    color: "from-amber-700 to-yellow-600",
    genres: ["History", "War", "War & Politics"],
  },
  {
    label: "Music",
    emoji: "🎵",
    color: "from-fuchsia-500 to-pink-500",
    genres: ["Music"],
  },
  {
    label: "Western",
    emoji: "🤠",
    color: "from-stone-600 to-amber-700",
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
    <div className="min-h-screen bg-zinc-950 text-white overflow-x-hidden">
      {/* ─── Hero / Page Header ─────────────────────────────── */}
      <div className="relative pt-24 pb-12 px-4 text-center overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-violet-600/10 blur-[120px]" />
          <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] rounded-full bg-pink-600/8 blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-300 text-xs font-semibold tracking-wider mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            AI POWERED RECOMMENDATIONS
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
              Match Finder
            </span>
          </h1>

          <p className="text-zinc-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Tell us what you love — we&apos;ll find what to watch next from your
            personal inventory, filtered to what you haven&apos;t seen yet.
          </p>

          {isLoggedIn && (
            <p className="mt-3 text-xs text-zinc-500">
              Analysing against{" "}
              <span className="text-violet-400 font-semibold">{totalWatched}</span>{" "}
              titles already watched
            </p>
          )}
        </div>
      </div>

      {/* ─── Step Indicator ─────────────────────────────────── */}
      <div className="flex items-center justify-center gap-3 mb-10 px-4">
        {(["type", "genre", "results"] as Step[]).map((s, i) => {
          const labels = ["Content Type", "Genres", "Results"];
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
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  active
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-500/30"
                    : done
                    ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 cursor-pointer"
                    : "bg-zinc-900 text-zinc-600 cursor-default"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                    active
                      ? "bg-white/20"
                      : done
                      ? "bg-green-500/20 text-green-400"
                      : "bg-zinc-800"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </span>
                {labels[i]}
              </button>
              {i < 2 && <span className="w-6 h-px bg-zinc-800" />}
            </div>
          );
        })}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* ═══════════════════════════════════════════════
            STEP 1 – Content Type
        ═══════════════════════════════════════════════ */}
        {step === "type" && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-center text-xl font-bold text-zinc-100 mb-2">
              What are you in the mood for?
            </h2>
            <p className="text-center text-sm text-zinc-500 mb-8">
              Choose a content type to narrow your search
            </p>

            <div className="grid grid-cols-3 gap-4">
              {MEDIA_TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setMediaFilter(opt.value)}
                  className={`group relative flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all duration-200 ${
                    mediaFilter === opt.value
                      ? "border-violet-500 bg-violet-500/10 shadow-lg shadow-violet-500/20"
                      : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 hover:bg-zinc-900"
                  }`}
                >
                  <span className="text-4xl">{opt.emoji}</span>
                  <span
                    className={`text-sm font-bold ${
                      mediaFilter === opt.value ? "text-violet-300" : "text-zinc-300"
                    }`}
                  >
                    {opt.label}
                  </span>
                  {mediaFilter === opt.value && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
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
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-violet-600 to-pink-600 text-white font-bold text-sm shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 transition-all duration-200"
              >
                Next: Pick Genres
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════
            STEP 2 – Genre Picker
        ═══════════════════════════════════════════════ */}
        {step === "genre" && (
          <div>
            <h2 className="text-center text-xl font-bold text-zinc-100 mb-2">
              Pick your favourite genres
            </h2>
            <p className="text-center text-sm text-zinc-500 mb-8">
              Select one or more — we&apos;ll blend them to find your perfect match
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-w-4xl mx-auto">
              {GENRE_GROUPS.map((group, i) => {
                const selected = selectedGroupIndexes.includes(i);
                return (
                  <button
                    key={group.label}
                    onClick={() => toggleGroup(i)}
                    className={`relative group overflow-hidden flex items-center gap-3 px-4 py-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                      selected
                        ? "border-transparent shadow-lg"
                        : "border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-900"
                    }`}
                  >
                    {/* Gradient background when selected */}
                    {selected && (
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${group.color} opacity-20`}
                      />
                    )}
                    {selected && (
                      <div
                        className={`absolute inset-0 rounded-2xl border-2 bg-gradient-to-br ${group.color} [mask-image:linear-gradient(black,black)] opacity-0`}
                        style={{
                          borderImage: `linear-gradient(to bottom right, var(--tw-gradient-from), var(--tw-gradient-to)) 1`,
                        }}
                      />
                    )}
                    {selected && (
                      <div className={`absolute inset-0 rounded-2xl border-2 bg-gradient-to-br ${group.color} opacity-0`} />
                    )}

                    {/* Border glow effect when selected */}
                    {selected && (
                      <div className={`absolute inset-0 rounded-xl ring-2 ring-inset ring-white/10`} />
                    )}

                    <span
                      className={`relative z-10 flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all ${
                        selected
                          ? `bg-gradient-to-br ${group.color} shadow-md`
                          : "bg-zinc-800 group-hover:bg-zinc-700"
                      }`}
                    >
                      {group.emoji}
                    </span>

                    <span
                      className={`relative z-10 text-xs font-bold leading-tight ${
                        selected ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"
                      }`}
                    >
                      {group.label}
                    </span>

                    {selected && (
                      <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-white/20 flex items-center justify-center z-10">
                        <svg
                          className="w-2.5 h-2.5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
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
              <div className="mt-6 text-center">
                <p className="text-xs text-zinc-500 mb-2">Selected genres:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {selectedGenres.map((g) => (
                    <span
                      key={g}
                      className="px-2.5 py-1 rounded-full bg-violet-500/15 border border-violet-500/25 text-violet-300 text-[11px] font-semibold"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                onClick={() => setStep("type")}
                className="px-5 py-2.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm font-semibold hover:bg-zinc-800 transition-all"
              >
                ← Back
              </button>
              <button
                onClick={handleFindMatches}
                disabled={selectedGroupIndexes.length === 0}
                className={`inline-flex items-center gap-2 px-8 py-3 rounded-full text-white font-bold text-sm transition-all duration-200 ${
                  selectedGroupIndexes.length > 0
                    ? "bg-gradient-to-r from-violet-600 to-pink-600 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105"
                    : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                }`}
              >
                ✦ Find My Matches
                {selectedGroupIndexes.length > 0 && (
                  <span className="bg-white/20 rounded-full px-2 py-0.5 text-[10px] font-black">
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-xl font-bold text-zinc-100">
                  {recommendations.length > 0 ? (
                    <>
                      <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                        {recommendations.length}
                      </span>{" "}
                      matches found
                    </>
                  ) : (
                    "No matches found"
                  )}
                </h2>
                <p className="text-sm text-zinc-500 mt-1">
                  {mediaFilter !== "both" &&
                    `${mediaFilter === "movie" ? "Movies" : "TV Shows"} · `}
                  {selectedGenres.slice(0, 3).join(", ")}
                  {selectedGenres.length > 3 && ` +${selectedGenres.length - 3} more`}
                  {isLoggedIn && recommendations.length > 0 && (
                    <span className="ml-2 text-green-400">
                      · {totalWatched} already-watched titles excluded
                    </span>
                  )}
                </p>
              </div>

              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-semibold hover:bg-zinc-800 hover:text-zinc-200 transition-all"
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
                Start Over
              </button>
            </div>

            {/* Empty state */}
            {recommendations.length === 0 && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🎬</div>
                <p className="text-zinc-400 text-lg font-semibold mb-2">
                  No matches in your inventory
                </p>
                <p className="text-zinc-600 text-sm mb-6">
                  Try selecting different genres or a broader content type
                </p>
                <button
                  onClick={() => setStep("genre")}
                  className="px-6 py-2.5 rounded-full bg-violet-600 text-white text-sm font-semibold hover:bg-violet-500 transition-all"
                >
                  Adjust Genres
                </button>
              </div>
            )}

            {/* Results grid */}
            {recommendations.length > 0 && (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {displayed.map((item, index) => (
                    <RecommendCard key={`${item.mediaType}:${item.id}`} item={item} rank={index + 1} />
                  ))}
                </div>

                {!showAll && recommendations.length > 18 && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={() => setShowAll(true)}
                      className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm font-semibold hover:bg-zinc-800 hover:border-zinc-700 transition-all"
                    >
                      Show all {recommendations.length} matches
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
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

// ─── Card component ──────────────────────────────────────────────────────────

function RecommendCard({ item, rank }: { item: MediaItem; rank: number }) {
  const href = `/${item.mediaType === "movie" ? "movies" : "tv"}/${item.id}`;
  const posterUrl = item.posterPath
    ? `https://image.tmdb.org/t/p/w342${item.posterPath}`
    : null;

  const rating = item.voteAverage.toFixed(1);

  return (
    <Link
      href={href}
      className="group relative block rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-violet-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-1"
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] bg-zinc-800 overflow-hidden">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={item.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-zinc-700">
            <svg
              className="w-10 h-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-1.5-3.75 1.5 3.75M3.375 8.25h17.25M12 12v9"
              />
            </svg>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Rank badge */}
        {rank <= 3 && (
          <div
            className={`absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black shadow-lg ${
              rank === 1
                ? "bg-gradient-to-br from-yellow-400 to-amber-500 text-black"
                : rank === 2
                ? "bg-gradient-to-br from-zinc-300 to-zinc-400 text-black"
                : "bg-gradient-to-br from-amber-700 to-orange-800 text-white"
            }`}
          >
            #{rank}
          </div>
        )}

        {/* Media type badge */}
        <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-black/70 text-[9px] font-bold text-zinc-300 backdrop-blur-sm">
          {item.mediaType === "movie" ? "MOVIE" : "TV"}
        </div>

        {/* Hover CTA */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="px-3 py-1.5 rounded-full bg-violet-600 text-white text-[10px] font-bold shadow-lg">
            View Details →
          </span>
        </div>
      </div>

      {/* Info panel */}
      <div className="p-3">
        {/* Rating row */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <div className="flex items-center gap-0.5">
            <svg
              className="w-2.5 h-2.5 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-[11px] font-bold text-yellow-400">{rating}</span>
          </div>
          {item.genres && item.genres.length > 0 && (
            <span className="text-[9px] text-zinc-600">·</span>
          )}
          <span className="text-[9px] text-zinc-500 truncate">
            {item.genres?.slice(0, 2).join(", ")}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xs font-bold text-zinc-200 group-hover:text-white leading-tight line-clamp-2 transition-colors">
          {item.title}
        </h3>

        {/* Release year */}
        {item.releaseDate && (
          <p className="text-[10px] text-zinc-600 mt-1">
            {item.releaseDate.substring(0, 4)}
          </p>
        )}
      </div>
    </Link>
  );
}
