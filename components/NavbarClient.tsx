"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface NavbarClientProps {
  session: any;
  logoutAction: any;
}

export default function NavbarClient({ session, logoutAction }: NavbarClientProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [mobileQuery, setMobileQuery] = useState("");
  const [mobileSuggestions, setMobileSuggestions] = useState<any[]>([]);
  const [showMobileSuggestions, setShowMobileSuggestions] = useState(false);

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim().length >= 2) {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(val)}`);
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data);
          setShowSuggestions(true);
        }
      } catch (err) {
        console.error("Failed to fetch suggestions", err);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleMobileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setMobileQuery(val);
    if (val.trim().length >= 2) {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(val)}`);
        if (response.ok) {
          const data = await response.json();
          setMobileSuggestions(data);
          setShowMobileSuggestions(true);
        }
      } catch (err) {
        console.error("Failed to fetch suggestions", err);
      }
    } else {
      setMobileSuggestions([]);
      setShowMobileSuggestions(false);
    }
  };



  const searchFormClass = isHome
    ? "bg-black/25 border border-white/10 focus-within:border-[#B58863] focus-within:bg-black/45"
    : "bg-white/5 border border-white/10 focus-within:border-[#B58863] focus-within:bg-white/10";

  const searchInputClass = isHome
    ? "text-white placeholder-white/40"
    : "text-white placeholder-white/40";

  const searchBtnClass = isHome
    ? "text-white/60 hover:text-[#B58863]"
    : "text-white/60 hover:text-[#B58863]";

  const authTextClass = isHome
    ? "text-slate-300 hover:text-white"
    : "text-slate-300 hover:text-white";

  const brandTextClass = isHome
    ? "bg-gradient-to-r from-[#B58863] via-[#d4a87c] to-white bg-clip-text text-transparent"
    : "bg-gradient-to-r from-[#B58863] via-[#d4a87c] to-white bg-clip-text text-transparent";

  const dividerClass = isHome
    ? "border-white/15"
    : "border-white/15";

  if (!isHome) {
    return (
      <>
      <header className="sticky top-3 z-50 w-full px-3 sm:px-6 py-1 select-none">
        <div className="mx-auto max-w-7xl w-full bg-[#0b1618]/90 backdrop-blur-2xl border border-[#3D4D55]/60 rounded-2xl px-4 py-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.65)] relative flex items-center justify-between transition-all duration-300">

          {/* Golden Viewfinder Corner Marks */}
          <div className="absolute top-1.5 left-1.5 w-2 h-2 border-t-2 border-l-2 border-[#B58863]/60 pointer-events-none" />
          <div className="absolute top-1.5 right-1.5 w-2 h-2 border-t-2 border-r-2 border-[#B58863]/60 pointer-events-none" />
          <div className="absolute bottom-1.5 left-1.5 w-2 h-2 border-b-2 border-l-2 border-[#B58863]/60 pointer-events-none" />
          <div className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b-2 border-r-2 border-[#B58863]/60 pointer-events-none" />

          {/* Brand Logo & Lens Tag */}
          <div className="flex items-center gap-3 z-10">
            <Link href="/" className="group flex items-center gap-2">
              <span className="text-xs sm:text-sm font-mono font-black tracking-[0.25em] bg-gradient-to-r from-[#B58863] via-[#d4a87c] to-white bg-clip-text text-transparent group-hover:brightness-110 transition-all">
                CINETRACK
              </span>
            </Link>
            <div className="hidden lg:flex items-center gap-2 text-[8px] font-mono text-slate-400 border-l border-[#3D4D55]/50 pl-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[#B58863] font-bold">24FPS</span>
            </div>
          </div>

          {/* Desktop Navigation Links & Controls */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3 z-10">
            <Link
              href="/dashboard"
              className={`px-4 py-2 rounded-xl text-sm font-mono font-black uppercase tracking-wider transition-all ${pathname === "/dashboard"
                  ? "bg-[#B58863]/20 border border-[#B58863]/60 text-[#FAF6E8]"
                  : "text-[#D3C3B9]/80 hover:text-white hover:bg-white/5"
                }`}
            >
              Dashboard
            </Link>

            {/* Live Search Form */}
            <form
              action="/search"
              method="GET"
              className="relative flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-2 focus-within:border-[#B58863] transition-all ml-1"
              onFocus={() => setShowSuggestions(searchQuery.trim().length >= 2)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            >
              <input
                type="text"
                name="q"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search catalog..."
                className="w-28 sm:w-36 lg:w-44 bg-transparent text-sm text-white placeholder-white/40 focus:outline-none font-mono"
                required
                autoComplete="off"
              />
              <button type="submit" className="text-white/60 hover:text-[#B58863] cursor-pointer pl-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.604 10.604Z" />
                </svg>
              </button>

              {/* Autocomplete Dropdown */}
              {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#0c1416]/98 backdrop-blur-2xl border border-[#3D4D55]/60 rounded-2xl p-2.5 shadow-2xl z-50 animate-search-dropdown flex flex-col gap-1 min-w-[240px]">
                  <div className="absolute top-1.5 left-1.5 w-2 h-2 border-t border-l border-[#B58863]/30 pointer-events-none" />
                  <div className="absolute top-1.5 right-1.5 w-2 h-2 border-t border-r border-[#B58863]/30 pointer-events-none" />
                  <div className="absolute bottom-1.5 left-1.5 w-2 h-2 border-b border-l border-[#B58863]/30 pointer-events-none" />
                  <div className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b border-r border-[#B58863]/30 pointer-events-none" />

                  <span className="block font-mono text-[7px] text-slate-500 uppercase tracking-widest pl-2 mb-1 select-none">
                    MATCHING FRAMES // LENS_INSPECT
                  </span>

                  {suggestions.length > 0 ? (
                    suggestions.map((item) => (
                      <Link
                        key={item.id}
                        href={`/${item.mediaType === "movie" ? "movies" : "tv"}/${item.id}`}
                        onClick={() => {
                          setSearchQuery("");
                          setShowSuggestions(false);
                        }}
                        className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-[#103334]/60 transition-colors group text-left"
                      >
                        <div className="relative w-8 h-12 bg-black rounded-lg overflow-hidden flex-shrink-0 border border-white/5 shadow-inner">
                          {item.posterPath ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={`https://image.tmdb.org/t/p/w92${item.posterPath}`}
                              alt=""
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[6px] text-white/20 font-mono">NO IMG</div>
                          )}
                        </div>
                        <div className="flex-grow min-w-0">
                          <h4 className="text-[10px] font-black text-[#D3C3B9] group-hover:text-[#FAF6E8] truncate leading-tight">
                            {item.title}
                          </h4>
                          <p className="text-[8px] font-mono text-slate-500 mt-1 flex items-center gap-1">
                            <span className="text-[#B58863]">{item.mediaType === "movie" ? "MOVIE" : "SERIES"}</span>
                            <span>•</span>
                            <span>{item.releaseDate ? item.releaseDate.split("-")[0] : "N/A"}</span>
                            <span>•</span>
                            <span className="text-[#d4a87c]">★ {item.voteAverage.toFixed(1)}</span>
                          </p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="py-4 text-center text-[9px] font-mono text-slate-500 select-none">
                      NO COMPATIBLE REELS FOUND
                    </div>
                  )}
                </div>
              )}
            </form>

            {/* Account Dropdown */}
            {session?.user ? (
              <div className="group relative flex items-center ml-1">
                <button className="flex items-center focus:outline-none cursor-pointer">
                  <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-[#B58863] to-[#d4a87c] shadow-md hover:scale-105 transition-transform duration-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={session.user.image || "/avatar-placeholder.png"}
                      alt={session.user.name || "User Avatar"}
                      className="w-9 h-9 rounded-full object-cover bg-slate-100"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border border-white rounded-full" />
                  </div>
                </button>

                <div className="absolute right-0 top-full mt-3.5 w-52 rounded-xl bg-[#0e1a1c]/95 backdrop-blur-xl border border-white/[0.08] py-2.5 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform origin-top-right translate-y-1 group-hover:translate-y-0">
                  <div className="absolute -top-1.5 right-3.5 w-3 h-3 rotate-45 bg-[#0e1a1c] border-t border-l border-white/[0.08]" />
                  <div className="relative z-10 px-4 py-2 border-b border-white/[0.07] mb-1.5">
                    <p className="text-xs font-bold text-white truncate">{session.user.name}</p>
                  </div>
                  <Link
                    href="/profile"
                    className="relative z-10 block px-4 py-2 text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    Profile
                  </Link>
                  <form action={logoutAction} className="relative z-10 border-t border-white/[0.07] mt-1 pt-1">
                    <button
                      type="submit"
                      className="block w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-white/5 cursor-pointer transition-colors"
                    >
                      Sign Out
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-sm font-bold bg-gradient-to-r from-[#B58863] to-[#d4a87c] text-[#0f1a1b] px-5 py-2 rounded-xl transition-all shadow-md shadow-[#B58863]/20 hover:opacity-90 font-mono tracking-wider"
              >
                Sign In
              </Link>
            )}
          </div>

        </div>
      </header>
      <MobileBottomNav pathname={pathname} session={session} />
      </>
    );
  }

  return (
    <>
    <header
      className="absolute top-0 left-0 right-0 z-40 w-full flex h-20 items-center justify-between px-4 sm:px-8 lg:px-12 select-none bg-gradient-to-b from-[#080e0f]/85 via-[#080e0f]/30 to-transparent border-none shadow-none transition-all duration-500 ease-in-out"
    >
      <div className="mx-auto flex w-full max-w-[98%] items-center justify-between relative">

        {/* Left Segment: Skeuomorphic Viewfinder Brand Logo & Info */}
        <div className="flex items-center gap-4 z-10">
          <Link href="/" className="relative px-3.5 py-1.5 group flex-shrink-0">
            {/* Viewfinder Crop Marks in Gold */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#B58863]/60 group-hover:border-[#d4a87c] transition-colors" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#B58863]/60 group-hover:border-[#d4a87c] transition-colors" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#B58863]/60 group-hover:border-[#d4a87c] transition-colors" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#B58863]/60 group-hover:border-[#d4a87c] transition-colors" />

            <span className={`text-xs sm:text-sm font-black tracking-[0.25em] ${brandTextClass} group-hover:brightness-110 transition-all font-mono`}>
              CINETRACK
            </span>
          </Link>

          {/* Tech Spec Overlay Tags */}
          <div className={`hidden lg:flex flex-col text-[7px] font-mono text-slate-400 border-l ${dividerClass} pl-3.5 leading-none select-none tracking-wider`}>
            <span>LENS: 35MM</span>
            <span className="text-[#B58863]/80 mt-0.5 font-bold">24FPS • 1.85:1</span>
          </div>
        </div>

        {/* Right Segment: Links, Search & Auth (Desktop - Nested in Hero Cutout Shelf) */}
        <div className="hidden md:flex items-center gap-2 lg:gap-2.5 z-10 translate-y-10 lg:translate-y-11 transition-all duration-300">

          {/* Premium Capsule Navigation Controls (Desktop) */}
          <div className="flex items-center gap-1.5 lg:gap-2">
            <Link
              href="/dashboard"
              className="relative group px-4 py-1.5 rounded-full text-xs font-mono font-black uppercase tracking-wider text-[#D3C3B9] bg-white/5 border border-white/10 hover:border-[#B58863]/40 hover:text-white transition-all h-9 flex items-center justify-center"
            >
              Dashboard
            </Link>
          </div>

          <form
            action="/search"
            method="GET"
            className={`relative flex items-center rounded-full px-3 py-1 transition-all duration-300 h-9 ${searchFormClass}`}
            onFocus={() => setShowSuggestions(searchQuery.trim().length >= 2)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          >
            <input
              type="text"
              name="q"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search..."
              className={`w-24 sm:w-28 md:w-32 lg:w-36 bg-transparent text-xs focus:outline-none transition-all duration-300 font-mono ${searchInputClass}`}
              required
              autoComplete="off"
            />
            <button type="submit" className={`cursor-pointer pl-1 transition-colors ${searchBtnClass}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.604 10.604Z" />
              </svg>
            </button>

            {/* Viewfinder-styled Autocomplete Dropdown */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#0c1416]/98 backdrop-blur-2xl border border-[#3D4D55]/60 rounded-2xl p-2.5 shadow-2xl z-50 animate-search-dropdown flex flex-col gap-1 min-w-[240px]">
                {/* Viewfinder ticks */}
                <div className="absolute top-1.5 left-1.5 w-2 h-2 border-t border-l border-[#B58863]/30 pointer-events-none" />
                <div className="absolute top-1.5 right-1.5 w-2 h-2 border-t border-r border-[#B58863]/30 pointer-events-none" />
                <div className="absolute bottom-1.5 left-1.5 w-2 h-2 border-b border-l border-[#B58863]/30 pointer-events-none" />
                <div className="absolute bottom-1.5 right-1.5 w-2 h-2 border-b border-r border-[#B58863]/30 pointer-events-none" />

                <span className="block font-mono text-[7px] text-slate-500 uppercase tracking-widest pl-2 mb-1 select-none">
                  MATCHING FRAMES // LENS_INSPECT
                </span>

                {suggestions.length > 0 ? (
                  suggestions.map((item) => (
                    <Link
                      key={item.id}
                      href={`/${item.mediaType === "movie" ? "movies" : "tv"}/${item.id}`}
                      onClick={() => {
                        setSearchQuery("");
                        setShowSuggestions(false);
                      }}
                      className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-[#103334]/60 transition-colors group text-left"
                    >
                      <div className="relative w-8 h-12 bg-black rounded-lg overflow-hidden flex-shrink-0 border border-white/5 shadow-inner">
                        {item.posterPath ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={`https://image.tmdb.org/t/p/w92${item.posterPath}`}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[6px] text-white/20 font-mono">NO IMG</div>
                        )}
                      </div>
                      <div className="flex-grow min-w-0">
                        <h4 className="text-[10px] font-black text-[#D3C3B9] group-hover:text-[#FAF6E8] truncate leading-tight">
                          {item.title}
                        </h4>
                        <p className="text-[8px] font-mono text-slate-500 mt-1 flex items-center gap-1">
                          <span className="text-[#B58863]">{item.mediaType === "movie" ? "MOVIE" : "SERIES"}</span>
                          <span>•</span>
                          <span>{item.releaseDate ? item.releaseDate.split("-")[0] : "N/A"}</span>
                          <span>•</span>
                          <span className="text-[#d4a87c]">★ {item.voteAverage.toFixed(1)}</span>
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="py-4 text-center text-[9px] font-mono text-slate-500 select-none">
                    NO COMPATIBLE REELS FOUND
                  </div>
                )}
              </div>
            )}
          </form>

          {/* Director Shutter REC Marker */}
          <div className="hidden xl:flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-red-500/80 bg-red-550/5 border border-red-500/30 px-3 py-1 rounded-full select-none h-9">
            <span className="w-2 h-2 rounded-full bg-red-500 pulse-red" />
            <span className="text-red-500 font-bold">REC</span>
          </div>

          {/* Auth dropdown */}
          {session?.user ? (
            <div className="group relative flex items-center">
              <button className="flex items-center focus:outline-none cursor-pointer">
                <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-[#B58863] to-[#d4a87c] shadow-md shadow-[#B58863]/10 hover:scale-105 transition-transform duration-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={session.user.image || "/avatar-placeholder.png"}
                    alt={session.user.name || "User Avatar"}
                    className="w-8 h-8 rounded-full object-cover bg-slate-100"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border border-white rounded-full" />
                </div>
              </button>

              <div className="absolute right-0 top-full mt-3.5 w-52 rounded-xl bg-[#0e1a1c]/95 backdrop-blur-xl border border-white/[0.08] py-2.5 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform origin-top-right translate-y-1 group-hover:translate-y-0">
                <div className="absolute -top-1.5 right-3.5 w-3 h-3 rotate-45 bg-[#0e1a1c] border-t border-l border-white/[0.08]" />
                <div className="relative z-10 px-4 py-2 border-b border-white/[0.07] mb-1.5">
                  <p className="text-xs font-bold text-white truncate">{session.user.name}</p>
                </div>
                <Link
                  href="/profile"
                  className="relative z-10 block px-4 py-2 text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                >
                  Profile
                </Link>
                <form action={logoutAction} className="relative z-10 border-t border-white/[0.07] mt-1 pt-1">
                  <button
                    type="submit"
                    className="block w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    Sign Out
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex items-center">
              <Link
                href="/login"
                className="text-sm font-bold bg-gradient-to-r from-[#B58863] to-[#d4a87c] text-[#0f1a1b] px-5 py-1.5 rounded-full transition-all shadow-md shadow-[#B58863]/20 hover:shadow-[#B58863]/40 hover:opacity-90 font-mono tracking-wider h-10 flex items-center justify-center"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
    <MobileBottomNav pathname={pathname} session={session} />
    </>
  );
}

const MobileBottomNav = ({ pathname, session }: { pathname: string; session: any }) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0b1618]/95 backdrop-blur-xl border-t border-white/10 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      <div className="flex justify-around items-center h-16 px-2">
        <Link href="/" className={`flex flex-col items-center justify-center w-full h-full gap-1 active:scale-95 transition-transform ${pathname === "/" ? "text-[#B58863]" : "text-slate-400 hover:text-slate-200"}`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
          <span className="text-[10px] font-bold">Home</span>
        </Link>
        <Link href="/search" className={`flex flex-col items-center justify-center w-full h-full gap-1 active:scale-95 transition-transform ${pathname === "/search" ? "text-[#B58863]" : "text-slate-400 hover:text-slate-200"}`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.604 10.604Z" />
          </svg>
          <span className="text-[10px] font-bold">Search</span>
        </Link>
        <Link href="/dashboard" className={`flex flex-col items-center justify-center w-full h-full gap-1 active:scale-95 transition-transform ${pathname === "/dashboard" ? "text-[#B58863]" : "text-slate-400 hover:text-slate-200"}`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
          </svg>
          <span className="text-[10px] font-bold">List</span>
        </Link>
        <Link href={session?.user ? "/profile" : "/login"} className={`flex flex-col items-center justify-center w-full h-full gap-1 active:scale-95 transition-transform ${pathname === "/profile" || pathname === "/login" ? "text-[#B58863]" : "text-slate-400 hover:text-slate-200"}`}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
          <span className="text-[10px] font-bold">Profile</span>
        </Link>
      </div>
    </nav>
  );
};
