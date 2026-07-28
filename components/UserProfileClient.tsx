"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

/* ───────── Types ───────── */
interface TasteProfileItem { icon: string; name: string; percentage: number; color: string; }
interface MediaItem { id: string; title: string; posterPath: string | null; releaseDate: string; mediaType: "movie" | "tv"; voteAverage: number; }
interface ReviewItem { id: string; tmdbId: string; mediaType: "movie" | "tv"; title: string; posterPath: string | null; content: string; rating: number | null; createdAt: string; }
interface UserProfileClientProps {
  isOwnProfile: boolean;
  user: {
    username: string; name: string; avatarUrl: string | null; bio: string | null;
    stats: { filmsCount: number; followingCount: number; followersCount: number; };
    tasteProfile: TasteProfileItem[];
    watched: MediaItem[]; watchlist: MediaItem[]; reviews: ReviewItem[];
  };
}

/* ───────── Helpers ───────── */
const TMDB = (path: string, w = "w342") => `https://image.tmdb.org/t/p/${w}${path}`;

/* ─── Animated Counter ─── */
function AnimatedCount({ to, duration = 1200 }: { to: number; duration?: number }) {
  const [val, setVal] = useState(0);
  const ref = useRef<number>(0);
  useEffect(() => {
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      setVal(Math.round(ease * to));
      if (p < 1) ref.current = requestAnimationFrame(step);
    };
    ref.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(ref.current);
  }, [to, duration]);
  return <>{val.toLocaleString()}</>;
}

/* ─── Lone Poster Card ─── */
function FilmCard({ item, index }: { item: MediaItem; index: number }) {
  const href = `/${item.mediaType === "movie" ? "movies" : "tv"}/${item.id}`;
  const src = item.posterPath ? TMDB(item.posterPath) : null;
  const year = item.releaseDate?.split("-")[0] ?? "—";
  const score = item.voteAverage?.toFixed(1) ?? "—";
  const frameId = String((Number(item.id) + index * 7) % 9900 + 100);

  return (
    <Link href={href} className="group relative flex-shrink-0 w-full select-none block">
      <div className="relative overflow-hidden rounded-xl border border-white/[0.07] bg-[#0a1315] hover:border-[#B58863]/50 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6),0_0_20px_rgba(181,136,99,0.12)]">
        {/* Sprocket strip left */}
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-[#060e0f] z-10 flex flex-col justify-evenly items-center py-2 pointer-events-none">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="w-2 h-3 rounded-[2px] bg-[#0f1a1b] border border-white/[0.06] shadow-inner" />
          ))}
        </div>
        {/* Poster */}
        <div className="ml-4 aspect-[2/3] overflow-hidden relative bg-[#0a1315]">
          {src ? (
            <img src={src} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]" loading="lazy" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[8px] font-mono text-white/10">NO IMAGE</div>
          )}
          {/* Score badge */}
          <span className="absolute top-2 right-2 bg-[#0a1315]/90 backdrop-blur border border-[#B58863]/40 text-[#B58863] text-[9px] font-mono font-black px-2 py-0.5 rounded-md leading-none">
            ★ {score}
          </span>
          {/* Type tag */}
          <span className={`absolute top-2 left-2 text-[7px] font-mono font-black uppercase tracking-widest px-1.5 py-0.5 rounded-sm leading-none ${
            item.mediaType === "movie"
              ? "bg-[#B58863]/20 text-[#d4a87c] border border-[#B58863]/25"
              : "bg-teal-900/40 text-teal-400 border border-teal-700/30"
          }`}>{item.mediaType === "movie" ? "FILM" : "SERIES"}</span>
          {/* Bottom gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#0a1315] via-[#0a1315]/40 to-transparent pointer-events-none" />
        </div>
        {/* Metadata strip */}
        <div className="ml-4 px-3 pt-2 pb-3 flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-[10px] font-black text-[#D3C3B9] group-hover:text-white leading-tight truncate transition-colors">{item.title}</p>
            <p className="text-[7px] font-mono text-slate-600 mt-1">{year}</p>
          </div>
          <div className="text-[6px] font-mono text-slate-700 text-right shrink-0 pl-2">
            <div>F:{frameId}</div>
            <div>35MM</div>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ─── Review Ticket ─── */
function ReviewTicket({ rev }: { rev: ReviewItem }) {
  const href = `/${rev.mediaType === "movie" ? "movies" : "tv"}/${rev.tmdbId}`;
  const month = new Date(rev.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }).toUpperCase();
  const stars = rev.rating ? Math.round(rev.rating) : 0;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#3D4D55]/40 bg-gradient-to-br from-[#0d1f20] via-[#0f1a1b] to-[#0a1315] ticket-shimmer-effect group hover:border-[#B58863]/35 transition-all duration-300">
      {/* Perforation holes on the left */}
      <div className="absolute left-0 top-0 bottom-0 w-5 flex flex-col justify-evenly items-center py-3 z-10 pointer-events-none">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-2 h-2 rounded-full bg-[#060e0f] border border-[#1e2e30]/70 shadow-inner" />
        ))}
      </div>
      {/* Dashed tear line */}
      <div className="absolute left-5 top-0 bottom-0 border-l border-dashed border-[#3D4D55]/30 pointer-events-none" />

      <div className="pl-8 pr-5 py-5 flex gap-4">
        {/* Poster */}
        {rev.posterPath && (
          <Link href={href} className="flex-shrink-0 w-14 aspect-[2/3] rounded-lg overflow-hidden border border-white/[0.08] block relative">
            <Image src={TMDB(rev.posterPath, "w185")} alt={rev.title} fill sizes="56px" className="object-cover group-hover:scale-105 transition-transform duration-500" />
          </Link>
        )}

        <div className="flex-grow min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-2.5">
            <Link href={href} className="text-[11px] font-black uppercase tracking-wider text-[#FAF6E8] hover:text-[#B58863] transition-colors leading-tight line-clamp-1 flex-grow">
              {rev.title}
            </Link>
            <div className="flex gap-0.5 flex-shrink-0">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                  className={`w-2.5 h-2.5 transition-colors ${i < stars ? "text-[#B58863]" : "text-white/10"}`}>
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                </svg>
              ))}
            </div>
          </div>

          {/* Italic critic text */}
          <p className="text-[11px] leading-relaxed text-[#A79E9C] italic line-clamp-3 font-serif">
            &ldquo;{rev.content}&rdquo;
          </p>

          {/* Footer stamp */}
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[7px] font-mono text-slate-600 uppercase tracking-widest">{month}</span>
            <span className="text-[7px] font-mono text-[#B58863]/50 uppercase tracking-widest">
              {rev.rating ? `${rev.rating.toFixed(1)} / 5.0` : "UNRATED"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────── Main Component ───────── */
export default function UserProfileClient({ isOwnProfile, user }: UserProfileClientProps) {
  const [activeTab, setActiveTab] = useState<"FILMS" | "QUEUE" | "DISPATCH">("FILMS");
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(user.stats.followersCount);
  const [copied, setCopied] = useState(false);
  const [coverTheme, setCoverTheme] = useState("void");
  const [showCoverPicker, setShowCoverPicker] = useState(false);
  const [activeModal, setActiveModal] = useState<"followers" | "following" | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const coverThemes = [
    { id: "void", label: "Void Black", gradient: "from-[#060e0f] via-[#0f1a1b] to-[#060e0f]", img: null },
    { id: "mars", label: "Mars Dunes", gradient: "from-[#1a0a00] via-[#2e1500] to-[#0f1a1b]", img: null },
    { id: "teal", label: "Deep Teal", gradient: "from-[#001a1a] via-[#103334] to-[#0f1a1b]", img: null },
    { id: "slate", label: "Midnight Slate", gradient: "from-[#0a0d14] via-[#1c2535] to-[#0f1a1b]", img: null },
    { id: "sand", label: "Amber Dusk", gradient: "from-[#1a1200] via-[#2a1f00] to-[#0f1a1b]", img: null },
  ];
  const activeCover = coverThemes.find(t => t.id === coverTheme) || coverThemes[0];

  const mockFollowers = [
    { name: "Christopher Nolan", username: "chrisnolan", bio: "Director. Architect of time." },
    { name: "Martin Scorsese", username: "marty", bio: "Cinema is a mirror of life itself." },
    { name: "Quentin Tarantino", username: "quentint", bio: "Film is my religion." },
    { name: "Greta Gerwig", username: "gretagw", bio: "Stories are empathy machines." },
  ];
  const mockFollowing = [
    { name: "Denis Villeneuve", username: "denisvill", bio: "Silence speaks louder than words." },
    { name: "Bong Joon Ho", username: "bongjoonho", bio: "Parasite. Snowpiercer. Memories." },
    { name: "David Fincher", username: "fincher", bio: "Details are not details." },
    { name: "Stanley Kubrick", username: "kubrick2001", bio: "1928–1999. Still relevant." },
  ];

  // Dynamic rating buckets from user watched items and reviews
  const rBuckets = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  const allRatings: number[] = [
    ...user.watched.map((w) => (w.voteAverage > 0 ? (w.voteAverage > 5 ? w.voteAverage / 2.0 : w.voteAverage) : null)),
    ...user.reviews.map((r) => r.rating),
  ].filter((r): r is number => r !== null && r > 0);

  allRatings.forEach((r) => {
    const s = Math.min(5, Math.max(1, Math.round(r))) as 1 | 2 | 3 | 4 | 5;
    rBuckets[s] = (rBuckets[s] || 0) + 1;
  });
  const maxR = Math.max(...Object.values(rBuckets), 1);

  // Favorites
  const favs: MediaItem[] = user.watched.slice(0, 4);

  const handleFollow = () => {
    setIsFollowing(p => !p);
    setFollowerCount(p => isFollowing ? p - 1 : p + 1);
  };
  const handleShare = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/user/${user.username}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const modalList = activeModal === "followers" ? mockFollowers : mockFollowing;

  return (
    <div className="w-full min-h-screen bg-[#0f1a1b] text-[#D3C3B9] pt-8 pb-32 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto selection:bg-[#B58863]/30 overflow-x-hidden font-sans">
      {/* ─── HERO IDENTITY ROW ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch mb-12 pt-2">

          {/* LEFT: Avatar + ID Card */}
          <div className="lg:col-span-4 sm:col-span-12 flex flex-col animate-panel-enter">
            {/* Director's Clapper ID Card */}
            <div className="relative bg-[#0d1f20]/95 backdrop-blur-2xl border border-[#3D4D55]/50 rounded-3xl overflow-hidden animate-glow-breathe shadow-2xl h-full flex flex-col justify-between">
              {/* Top clapper bar (black & white stripes) */}
              <div className="h-5 flex overflow-hidden">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div key={i} className={`flex-1 h-full ${i % 2 === 0 ? "bg-[#0f1a1b]" : "bg-[#FAF6E8]/10"}`} />
                ))}
              </div>
              {/* Card header */}
              <div className="bg-[#B58863] px-4 py-2 flex items-center justify-between">
                <span className="text-xs font-mono font-black uppercase tracking-[0.3em] text-[#0f1a1b]">CINETRACK // DIRECTOR I.D.</span>
                <span className="text-xs font-mono text-[#0f1a1b]/80 font-bold">SCENE 01-A</span>
              </div>

              {/* Content */}
              <div className="px-5 pt-5 pb-6 flex flex-col items-center text-center gap-4">
                {/* Avatar with spinning ring */}
                <div className="relative w-24 h-24">
                  {/* Spinning outer halo */}
                  <div className="animate-halo absolute inset-[-6px] rounded-full border border-dashed border-[#B58863]/30 pointer-events-none" />
                  {/* Inner static ring */}
                  <div className="absolute inset-[-2px] rounded-full bg-gradient-to-tr from-[#B58863]/60 via-[#d4a87c]/30 to-[#3D4D55]/20" />
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#0d1f20]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={user.avatarUrl || "/profile_avatar.png"}
                      alt={user.name}
                      className="w-full h-full object-cover grayscale brightness-90"
                    />
                  </div>
                </div>

                {/* Name & username */}
                <div>
                  <h1 className="text-2xl font-black uppercase tracking-wider text-[#FAF6E8] leading-tight">
                    {user.name}
                  </h1>
                </div>

                {/* Bio in screenplay style */}
                {user.bio && (
                  <div className="w-full border-t border-b border-[#3D4D55]/30 py-3.5 text-left">
                    <span className="block text-xs font-mono text-slate-400 uppercase tracking-widest mb-1.5 select-none font-bold">
                      [INT. CHARACTER INTRO]
                    </span>
                    <p className="text-xs sm:text-sm text-[#D3C3B9] leading-relaxed italic font-serif">
                      &ldquo;{user.bio}&rdquo;
                    </p>
                  </div>
                )}

                {/* Stats row — mini odometers */}
                <div className="w-full grid grid-cols-3 text-center">
                  <div>
                    <div className="text-xl sm:text-2xl font-black font-mono text-[#FAF6E8] overflow-hidden">
                      {mounted ? <AnimatedCount to={user.stats.filmsCount} /> : user.stats.filmsCount}
                    </div>
                    <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mt-1 font-bold">Films</div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-black font-mono text-[#FAF6E8]">
                      {mounted ? <AnimatedCount to={user.reviews.length} duration={900} /> : user.reviews.length}
                    </div>
                    <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mt-1 font-bold">Reviews</div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-black font-mono text-[#FAF6E8]">
                      {mounted ? <AnimatedCount to={user.watchlist.length} duration={1000} /> : user.watchlist.length}
                    </div>
                    <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mt-1 font-bold">Watchlist</div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="w-full flex gap-2.5">
                  <button
                    onClick={handleShare}
                    className="flex-1 py-3 px-3 rounded-xl text-xs font-mono font-black uppercase tracking-widest text-center text-[#B58863] bg-[#B58863]/10 border border-[#B58863]/40 hover:bg-[#B58863]/20 hover:border-[#B58863]/60 transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-[0.98]"
                  >
                    {copied ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-emerald-400">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                        <span className="text-emerald-400 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5" />
                        </svg>
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                  {isOwnProfile && (
                    <Link
                      href="/dashboard"
                      className="flex-1 py-3 px-3 rounded-xl text-xs font-mono font-black uppercase tracking-widest text-center text-[#A79E9C] bg-[#103334]/40 border border-[#3D4D55]/50 hover:border-[#B58863]/40 hover:text-[#FAF6E8] hover:bg-[#1e2e30] transition-all flex items-center justify-center gap-1.5"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                      </svg>
                      <span>Dashboard</span>
                    </Link>
                  )}
                </div>

                {/* Bottom barcode */}
                <div className="w-full flex flex-col items-center pt-2 border-t border-[#3D4D55]/25">
                  <div className="flex gap-[1.5px] items-stretch h-5 opacity-20 select-none">
                    {[2,3,1,4,1.5,1,2.5,1,3.5,2,1,3,1.5,1,2,3,1,4,1.5,2].map((w, i) => (
                      <div key={i} style={{ width: `${w * 1.5}px` }} className="bg-[#B58863]" />
                    ))}
                  </div>
                  <span className="text-[5.5px] font-mono tracking-[0.35em] text-[#B58863]/30 mt-1 uppercase select-none">
                    CT-{user.username.padEnd(8, "0").toUpperCase().slice(0, 8)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Analytics + Favorite Cinema */}
          <div className="lg:col-span-8 sm:col-span-12 flex flex-col gap-6 justify-between min-w-0">

            {/* Genre VU Meters */}
            <div className="animate-panel-enter-delay-1 bg-[#0d1f20]/80 backdrop-blur-xl border border-[#3D4D55]/40 rounded-3xl p-6 relative overflow-hidden">
              {/* Viewfinder ticks */}
              <div className="absolute top-3 left-3 w-2.5 h-2.5 border-t border-l border-[#B58863]/30 pointer-events-none" />
              <div className="absolute top-3 right-3 w-2.5 h-2.5 border-t border-r border-[#B58863]/30 pointer-events-none" />

              <h2 className="text-xs font-mono font-black uppercase tracking-[0.25em] text-[#B58863] mb-5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#B58863] animate-pulse" />
                GENRE AFFINITY // SIGNAL MATRIX
              </h2>

              <div className="space-y-5">
                {user.tasteProfile.length === 0 ? (
                  <div className="py-6 text-center border border-dashed border-[#3D4D55]/30 rounded-2xl bg-[#0a1315]/40">
                    <p className="text-xs font-mono font-black uppercase tracking-wider text-[#A79E9C]/60">NO GENRE SIGNAL LOGGED</p>
                    <p className="text-xs font-mono text-slate-500 mt-1">Start marking movies or TV shows as watched to generate your affinity matrix.</p>
                  </div>
                ) : (
                  user.tasteProfile.map((g, idx) => {
                    const lit = Math.max(1, Math.round(g.percentage / 8.5));
                    return (
                      <div key={g.name}>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-xs font-mono font-black uppercase tracking-wider text-[#D3C3B9] flex items-center gap-1.5">
                            <span>{g.icon}</span><span>{g.name}</span>
                          </span>
                          <span className="text-xs font-mono text-[#FAF6E8] font-black">{g.percentage}%</span>
                        </div>
                        {/* VU meter segments */}
                        <div className="flex gap-[2px] h-3">
                          {Array.from({ length: 12 }).map((_, si) => {
                            const isLit = si < lit;
                            const color = isLit
                              ? si < 6 ? "bg-teal-500/80 shadow-[0_0_4px_rgba(20,184,166,0.5)]"
                                : si < 9 ? "bg-[#B58863] shadow-[0_0_5px_rgba(181,136,99,0.5)]"
                                : "bg-[#d4a87c] shadow-[0_0_8px_rgba(212,168,124,0.7)]"
                              : "bg-[#1e2e30]/60 border border-white/[0.04]";
                            return <div key={si} className={`flex-grow rounded-[1px] transition-all duration-700 ${color}`} style={{ transitionDelay: `${idx * 60 + si * 20}ms` }} />;
                          })}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Rating Histogram inline */}
              <div className="mt-6 pt-5 border-t border-[#3D4D55]/25">
                <h3 className="text-xs font-mono font-black uppercase tracking-[0.25em] text-[#B58863] mb-3">
                  GRADING HISTOGRAM // FREQ_DIST
                </h3>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((s) => {
                    const count = rBuckets[s as 1|2|3|4|5];
                    const pct = (count / maxR) * 100;
                    return (
                      <div key={s} className="flex items-center gap-3">
                        <span className="text-xs font-mono w-10 text-right text-[#B58863] font-black shrink-0">{"★".repeat(s)}</span>
                        <div className="flex-grow bg-[#0a1315] h-2 rounded-full overflow-hidden border border-white/[0.04]">
                          <div className="h-full bg-gradient-to-r from-[#B58863]/60 to-[#d4a87c] rounded-full transition-all duration-1000" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="w-8 text-xs font-mono text-right text-[#FAF6E8] font-black shrink-0">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Favorite Cinema — 4-poster grid with dramatic hover */}
            <div className="animate-panel-enter-delay-2 bg-[#0d1f20]/80 backdrop-blur-xl border border-[#3D4D55]/40 rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute top-3 left-3 w-2.5 h-2.5 border-t border-l border-[#B58863]/30 pointer-events-none" />
              <div className="absolute top-3 right-3 w-2.5 h-2.5 border-t border-r border-[#B58863]/30 pointer-events-none" />
              <div className="absolute bottom-3 left-3 w-2.5 h-2.5 border-b border-l border-[#B58863]/30 pointer-events-none" />
              <div className="absolute bottom-3 right-3 w-2.5 h-2.5 border-b border-r border-[#B58863]/30 pointer-events-none" />

              <h2 className="text-xs font-mono font-black uppercase tracking-[0.25em] text-[#B58863] mb-5 flex items-center gap-2 select-none">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                SPOTLIGHT REEL // FAVORITE CINEMA
              </h2>

              {favs.length === 0 ? (
                <div className="py-6 text-center border border-dashed border-[#3D4D55]/30 rounded-2xl bg-[#0a1315]/40">
                  <p className="text-[10px] font-mono font-black uppercase tracking-wider text-[#A79E9C]/60">NO SPOTLIGHT TITLES</p>
                  <p className="text-[8px] font-mono text-slate-600 mt-1">Mark movies as watched to feature your top titles here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {favs.map((item, i) => (
                    <FilmCard key={item.id} item={item} index={i} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ─── TAB CONSOLE ─── */}
        <div className="animate-panel-enter-delay-3 mb-8">
          {/* Mixing board style tab strip */}
          <div className="flex items-end gap-0 border-b border-[#3D4D55]/35 overflow-x-auto scrollbar-none">
            {(["FILMS", "QUEUE", "DISPATCH"] as const).map((tab, i) => {
              const labels: Record<string, string> = { FILMS: "FILM LOG", QUEUE: "WATCHLIST", DISPATCH: "CRITIC DISPATCH" };
              const counts: Record<string, number> = { FILMS: user.watched.length, QUEUE: user.watchlist.length, DISPATCH: user.reviews.length };
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative flex items-center gap-2 px-5 py-3.5 text-[9px] font-mono font-black uppercase tracking-widest transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "text-[#FAF6E8] bg-[#0d1f20]/80 border border-b-0 border-[#3D4D55]/35 -mb-px rounded-t-xl"
                      : "text-[#A79E9C]/60 hover:text-[#A79E9C]"
                  }`}
                >
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#B58863] animate-pulse" />}
                  <span>{labels[tab]}</span>
                  <span className={`text-[7px] px-1.5 py-0.5 rounded font-black ${isActive ? "bg-[#B58863]/20 text-[#B58863]" : "bg-[#1e2e30] text-[#3D4D55]"}`}>
                    {counts[tab]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── TAB CONTENT ─── */}
        <div className="animate-panel-enter-delay-4">

          {/* FILM LOG */}
          {activeTab === "FILMS" && (
            user.watched.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {user.watched.map((item, i) => <FilmCard key={item.id} item={item} index={i} />)}
              </div>
            ) : (
              <EmptyState text="NO FILM RECORDS LOGGED" />
            )
          )}

          {/* WATCHLIST / QUEUE */}
          {activeTab === "QUEUE" && (
            user.watchlist.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {user.watchlist.map((item, i) => <FilmCard key={item.id} item={item} index={i} />)}
              </div>
            ) : (
              <EmptyState text="WATCHLIST IS EMPTY" />
            )
          )}

          {/* REVIEWS */}
          {activeTab === "DISPATCH" && (
            user.reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {user.reviews.map(rev => <ReviewTicket key={rev.id} rev={rev} />)}
              </div>
            ) : (
              <EmptyState text="NO REVIEWS DISPATCHED" />
            )
          )}
        </div>

      {/* ════════ COVER PICKER MODAL ════════ */}
      {showCoverPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md" onClick={() => setShowCoverPicker(false)}>
          <div className="bg-[#0d1f20] border border-[#3D4D55]/60 rounded-3xl p-6 w-full max-w-xs mx-4 shadow-2xl relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowCoverPicker(false)} className="absolute top-4 right-4 text-[#A79E9C] hover:text-white cursor-pointer transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
            </button>
            <h3 className="text-[8.5px] font-mono font-black uppercase tracking-[0.25em] text-[#B58863] mb-4">COVER FILTER // LENS SELECT</h3>
            <div className="space-y-2">
              {coverThemes.map(t => (
                <button key={t.id} onClick={() => { setCoverTheme(t.id); setShowCoverPicker(false); }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                    coverTheme === t.id ? "border-[#B58863]/60 bg-[#B58863]/8 text-[#FAF6E8]" : "border-[#3D4D55]/35 text-[#A79E9C] hover:border-[#3D4D55]/60 hover:bg-[#1e2e30]/40"
                  }`}
                >
                  <div className={`w-12 h-7 rounded-lg bg-gradient-to-br ${t.gradient} flex-shrink-0 border border-white/10`} />
                  <span className="text-[10px] font-mono font-black uppercase tracking-wider">{t.label}</span>
                  {coverTheme === t.id && <span className="ml-auto text-[#B58863] text-[8px] font-mono">ACTIVE</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Empty State ── */
function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 border border-dashed border-[#3D4D55]/30 rounded-2xl gap-3">
      <div className="flex gap-1 opacity-20">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-8 h-12 bg-[#1e2e30] rounded border border-[#3D4D55]/30" />
        ))}
      </div>
      <p className="text-[8.5px] font-mono uppercase tracking-[0.3em] text-slate-600">{text}</p>
    </div>
  );
}
