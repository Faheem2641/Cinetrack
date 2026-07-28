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
      <header className="sticky top-0 z-50 w-full px-3 sm:px-6 pt-3 pb-1 select-none pointer-events-none">
        <div className="mx-auto max-w-7xl w-full bg-[#0d1f20]/90 backdrop-blur-2xl border border-[#3D4D55]/60 rounded-2xl px-4 py-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.65)] relative flex items-center justify-between transition-all duration-300 pointer-events-auto">
          
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
              href="/movies"
              className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-black uppercase tracking-wider transition-all ${
                pathname === "/movies"
                  ? "bg-[#B58863]/20 border border-[#B58863]/60 text-[#FAF6E8]"
                  : "text-[#D3C3B9]/80 hover:text-white hover:bg-white/5"
              }`}
            >
              Movies
            </Link>

            <Link
              href="/tv"
              className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-black uppercase tracking-wider transition-all ${
                pathname === "/tv"
                  ? "bg-[#B58863]/20 border border-[#B58863]/60 text-[#FAF6E8]"
                  : "text-[#D3C3B9]/80 hover:text-white hover:bg-white/5"
              }`}
            >
              TV Shows
            </Link>

            <Link
              href="/recommend"
              className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-black uppercase tracking-wider transition-all flex items-center gap-1 ${
                pathname === "/recommend"
                  ? "bg-gradient-to-r from-[#B58863] to-[#d4a87c] text-[#0f1a1b] font-bold"
                  : "text-[#B58863] hover:text-[#d4a87c] bg-[#B58863]/10 border border-[#B58863]/30 hover:bg-[#B58863]/20"
              }`}
            >
              <span>✦</span>
              <span>Match Finder</span>
            </Link>

            <Link
              href="/dashboard"
              className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-black uppercase tracking-wider transition-all ${
                pathname === "/dashboard"
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
              className="relative flex items-center bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 focus-within:border-[#B58863] transition-all ml-1"
              onFocus={() => setShowSuggestions(searchQuery.trim().length >= 2)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            >
              <input
                type="text"
                name="q"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search catalog..."
                className="w-28 sm:w-36 lg:w-44 bg-transparent text-[10px] text-white placeholder-white/40 focus:outline-none font-mono"
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
                      className="w-7.5 h-7.5 rounded-full object-cover bg-slate-100"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border border-white rounded-full" />
                  </div>
                </button>
                
                <div className="absolute right-0 top-full mt-3.5 w-52 rounded-xl bg-[#0e1a1c]/95 backdrop-blur-xl border border-white/[0.08] py-2.5 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform origin-top-right translate-y-1 group-hover:translate-y-0">
                  <div className="absolute -top-1.5 right-3.5 w-3 h-3 rotate-45 bg-[#0e1a1c] border-t border-l border-white/[0.08]" />
                  <div className="relative z-10 px-4 py-2 border-b border-white/[0.07] mb-1.5">
                    <p className="text-xs font-bold text-white truncate">{session.user.name}</p>
                    <p className="text-[9px] font-mono text-slate-400 truncate">@{session.user.username}</p>
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
                className="text-[10px] font-bold bg-gradient-to-r from-[#B58863] to-[#d4a87c] text-[#0f1a1b] px-4 py-1.5 rounded-xl transition-all shadow-md shadow-[#B58863]/20 hover:opacity-90 font-mono tracking-wider"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Drawer Trigger for Inner Pages */}
          <div className="flex md:hidden items-center gap-3 z-10">
            <input type="checkbox" id="mobile-menu-toggle-inner" className="peer hidden" />
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm opacity-0 pointer-events-none peer-checked:opacity-100 peer-checked:pointer-events-auto transition-opacity duration-300 z-40" />
            <label
              htmlFor="mobile-menu-toggle-inner"
              className="flex items-center justify-center p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4.5 h-4.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </label>
            
            <div className="fixed top-0 right-0 bottom-0 w-72 bg-[#0c1618]/97 backdrop-blur-2xl border-l border-white/[0.07] shadow-2xl translate-x-full peer-checked:translate-x-0 transition-transform duration-300 ease-in-out z-50 p-6 flex flex-col justify-between pointer-events-auto">
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-white/[0.07] pb-4">
                  <span className="font-mono text-[9px] text-[#B58863] tracking-widest uppercase">NAV CONSOLE</span>
                  <label htmlFor="mobile-menu-toggle-inner" className="cursor-pointer text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </label>
                </div>
                
                <nav className="flex flex-col gap-2">
                  <Link href="/movies" className="text-xs font-mono font-bold uppercase tracking-wider py-2 text-slate-300 border-b border-white/5 hover:text-white">Movies</Link>
                  <Link href="/tv" className="text-xs font-mono font-bold uppercase tracking-wider py-2 text-slate-300 border-b border-white/5 hover:text-white">TV Shows</Link>
                  <Link href="/recommend" className="text-xs font-mono font-bold uppercase tracking-wider py-2 text-[#B58863] border-b border-white/5">✦ Match Finder</Link>
                  <Link href="/dashboard" className="text-xs font-mono font-bold uppercase tracking-wider py-2 text-slate-300 border-b border-white/5 hover:text-white">Dashboard</Link>
                  <Link href="/profile" className="text-xs font-mono font-bold uppercase tracking-wider py-2 text-slate-300 border-b border-white/5 hover:text-white">Profile</Link>
                </nav>
              </div>

              <div className="border-t border-white/[0.07] pt-4">
                {session?.user ? (
                  <form action={logoutAction}>
                    <button type="submit" className="w-full py-2 text-xs bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl font-bold">Sign Out</button>
                  </form>
                ) : (
                  <Link href="/login" className="block text-center py-2 text-xs bg-[#B58863] text-[#0f1a1b] rounded-xl font-bold font-mono">Sign In</Link>
                )}
              </div>
            </div>
          </div>

        </div>
      </header>
    );
  }

  return (
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
        
        {/* Right Segment: Links, Search, REC dot & Auth (Desktop - Nested in Hero Cutout Shelf) */}
        <div className="hidden md:flex items-center gap-2.5 lg:gap-3.5 z-10 translate-y-11 lg:translate-y-12 transition-all duration-300">
          
          {/* Premium Capsule Navigation Controls (Desktop) */}
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="relative group px-3.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-[#D3C3B9] bg-white/5 border border-white/10 hover:border-[#B58863]/40 hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 h-8.5 flex items-center justify-center"
            >
              Dashboard
            </Link>
          </div>
          
          <form 
            action="/search" 
            method="GET" 
            className={`relative flex items-center rounded-full px-3 py-1 transition-all duration-300 h-8.5 ${searchFormClass}`}
            onFocus={() => setShowSuggestions(searchQuery.trim().length >= 2)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          >
            <input
              type="text"
              name="q"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search catalog..."
              className={`w-32 sm:w-40 md:w-48 lg:w-54 bg-transparent text-[10px] focus:outline-none transition-all duration-300 font-mono ${searchInputClass}`}
              required
              autoComplete="off"
            />
            <button type="submit" className={`cursor-pointer pl-1 transition-colors ${searchBtnClass}`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
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
          <div className="hidden xl:flex items-center gap-1.5 font-mono text-[7.5px] tracking-widest text-red-500/80 bg-red-550/5 border border-red-500/30 px-2.5 py-0.5 rounded-full select-none h-7.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 pulse-red" />
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
                    className="w-7 h-7 rounded-full object-cover bg-slate-100"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border border-white rounded-full" />
                </div>
              </button>
              
              <div className="absolute right-0 top-full mt-3.5 w-52 rounded-xl bg-[#0e1a1c]/95 backdrop-blur-xl border border-white/[0.08] py-2.5 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform origin-top-right translate-y-1 group-hover:translate-y-0">
                <div className="absolute -top-1.5 right-3.5 w-3 h-3 rotate-45 bg-[#0e1a1c] border-t border-l border-white/[0.08]" />
                <div className="relative z-10 px-4 py-2 border-b border-white/[0.07] mb-1.5">
                  <p className="text-xs font-bold text-white truncate">{session.user.name}</p>
                  <p className="text-[9px] font-mono text-slate-400 truncate">@{session.user.username}</p>
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
                className="text-[10px] font-bold bg-gradient-to-r from-[#B58863] to-[#d4a87c] text-[#0f1a1b] px-4.5 py-1 rounded-full transition-all shadow-md shadow-[#B58863]/20 hover:shadow-[#B58863]/40 hover:opacity-90 font-mono tracking-wider h-8.5 flex items-center justify-center"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Layout: Responsive Drawer Interface */}
        <div className="flex md:hidden items-center gap-3 z-10">
          {/* Mobile Drawer Checkbox Toggle */}
          <input type="checkbox" id="mobile-menu-toggle" className="peer hidden" />
          
          {/* Dark blurred background overlay */}
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm opacity-0 pointer-events-none peer-checked:opacity-100 peer-checked:pointer-events-auto transition-opacity duration-300 z-40 md:hidden" />
          
          {/* Hamburger trigger */}
          <label
            htmlFor="mobile-menu-toggle"
            className="flex items-center justify-center p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4.5 h-4.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </label>
          
          {/* Drawer Sidebar Menu */}
          <div className="fixed top-0 right-0 bottom-0 w-72 bg-[#0c1618]/97 backdrop-blur-2xl border-l border-white/[0.07] shadow-2xl translate-x-full peer-checked:translate-x-0 transition-transform duration-300 ease-in-out z-50 p-6 flex flex-col justify-between pointer-events-auto">
            <div className="space-y-8">
              
              {/* Close button header */}
              <div className="flex justify-between items-center border-b border-white/[0.07] pb-4">
                <span className="font-mono text-[9px] text-[#B58863] tracking-widest uppercase">NAV CONSOLE</span>
                <label htmlFor="mobile-menu-toggle" className="cursor-pointer text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </label>
              </div>
              
              {/* Navigation lists */}
              <nav className="flex flex-col gap-3">
                
                <Link
                  href="/recommend"
                  className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#B58863] to-[#d4a87c] py-2 border-b border-white/[0.07] transition-all hover:brightness-110"
                >
                  <span>✦ Match Finder</span>
                  <span className="text-[9px] text-[#B58863] font-mono">[MATCH]</span>
                </Link>
                
                <Link
                  href="/profile"
                  className="flex items-center justify-between text-xs font-black uppercase tracking-widest text-slate-300 hover:text-white py-2 border-b border-white/[0.07] transition-colors"
                >
                  <span>Profile</span>
                  <span className="text-[9px] text-[#B58863]/80 font-mono">[USER]</span>
                </Link>
              </nav>
              
              {/* Mobile Search Tool */}
              <div className="pt-2">
                <form 
                  action="/search" 
                  method="GET" 
                  className="relative flex items-center bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 focus-within:border-[#B58863] transition-all duration-300"
                  onFocus={() => setShowMobileSuggestions(mobileQuery.trim().length >= 2)}
                  onBlur={() => setTimeout(() => setShowMobileSuggestions(false), 200)}
                >
                  <input
                    type="text"
                    name="q"
                    value={mobileQuery}
                    onChange={handleMobileChange}
                    placeholder="Search catalog..."
                    className="w-full bg-transparent text-xs text-white placeholder-white/40 focus:outline-none font-mono"
                    required
                    autoComplete="off"
                  />
                  <button type="submit" className="text-white/40 hover:text-[#B58863] cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.604 10.604Z" />
                    </svg>
                  </button>

                  {/* Autocomplete suggestions for Mobile */}
                  {showMobileSuggestions && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#0c1618] border border-white/[0.08] rounded-xl p-2 shadow-2xl z-50 animate-search-dropdown flex flex-col gap-1 w-full max-h-60 overflow-y-auto">
                      {mobileSuggestions.length > 0 ? (
                        mobileSuggestions.map((item) => (
                          <Link
                            key={item.id}
                            href={`/${item.mediaType === "movie" ? "movies" : "tv"}/${item.id}`}
                            onClick={() => {
                              setMobileQuery("");
                              setShowMobileSuggestions(false);
                            }}
                            className="flex items-center gap-3.5 p-1.5 rounded-lg hover:bg-white/5 transition-colors text-left"
                          >
                            <div className="relative w-7 h-10 bg-black rounded overflow-hidden flex-shrink-0 border border-white/5">
                              {item.posterPath ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={`https://image.tmdb.org/t/p/w92${item.posterPath}`}
                                  alt=""
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[5px] text-white/20 font-mono">NO IMG</div>
                              )}
                            </div>
                            <div className="flex-grow min-w-0">
                              <h4 className="text-[10px] font-black text-slate-300 truncate leading-tight">
                                {item.title}
                              </h4>
                              <p className="text-[8px] font-mono text-slate-500 mt-0.5 flex items-center gap-1">
                                <span className="text-[#B58863]">{item.mediaType === "movie" ? "MOVIE" : "SERIES"}</span>
                                <span>•</span>
                                <span>{item.releaseDate ? item.releaseDate.split("-")[0] : "N/A"}</span>
                              </p>
                            </div>
                          </Link>
                        ))
                      ) : (
                        <div className="py-3 text-center text-[9px] font-mono text-slate-500 select-none">
                          NO COMPATIBLE REELS FOUND
                        </div>
                      )}
                    </div>
                  )}
                </form>
              </div>
            </div>
            
            {/* Drawer User Control Panel */}
            <div className="border-t border-white/[0.07] pt-6">
              {session?.user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-[#B58863] to-[#d4a87c] shadow-md">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={session.user.image || "/avatar-placeholder.png"}
                        alt={session.user.name || "User Avatar"}
                        className="w-10 h-10 rounded-full object-cover bg-slate-100"
                      />
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                    </div>
                    <div className="leading-tight">
                      <p className="text-xs font-bold text-slate-800">{session.user.name}</p>
                      <p className="text-[10px] font-mono text-slate-500">@{session.user.username}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 pt-2">
                    <Link
                      href="/profile"
                      className="block w-full text-center px-4 py-2.5 text-xs bg-white/5 border border-white/10 text-slate-300 rounded-xl hover:bg-white/10 transition-all font-bold"
                    >
                      Profile
                    </Link>
                    <form action={logoutAction}>
                      <button
                        type="submit"
                        className="block w-full text-center px-4 py-2.5 text-xs bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl hover:bg-red-500/20 transition-all font-bold cursor-pointer"
                      >
                        Sign Out
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col">
                  <Link
                    href="/login"
                    className="block w-full text-center px-4 py-2.5 text-xs bg-gradient-to-r from-[#B58863] to-[#d4a87c] text-[#0f1a1b] rounded-xl hover:opacity-90 transition-all font-bold font-mono tracking-wider"
                  >
                    Sign In
                  </Link>
                </div>
              )}
              
              {/* Monospaced Viewfinder metadata inside Drawer */}
              <div className="mt-8 flex justify-between text-[7px] font-mono text-slate-400 select-none">
                <span>SYS LOG: ONLINE</span>
                <span>24FPS SAFETY FILM</span>
              </div>
            </div>
            
          </div>
        </div>

      </div>
    </header>
  );
}
