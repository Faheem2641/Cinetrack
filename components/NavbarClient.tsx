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

  const navLinks = [
    { href: "/movies", label: "Movies" },
    { href: "/tv", label: "TV Shows" },
    { href: "/recommend", label: "Match Finder", highlight: true },
  ];

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 select-none pointer-events-none">
      {/* Floating Glassmorphic Container */}
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 rounded-2xl bg-[#0a1214]/85 backdrop-blur-xl border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.7),0_0_20px_rgba(181,136,99,0.12)] pointer-events-auto transition-all duration-300">
        
        {/* Left Segment: Brand Logo & Camera Viewfinder Frame */}
        <div className="flex items-center gap-6">
          <Link href="/" className="relative px-3 py-1 group flex items-center gap-2.5">
            {/* Viewfinder Corner Ticks */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#B58863] group-hover:border-[#d4a87c] transition-colors" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#B58863] group-hover:border-[#d4a87c] transition-colors" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#B58863] group-hover:border-[#d4a87c] transition-colors" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#B58863] group-hover:border-[#d4a87c] transition-colors" />

            <span className="text-sm sm:text-base font-black tracking-[0.25em] bg-gradient-to-r from-[#B58863] via-[#d4a87c] to-white bg-clip-text text-transparent group-hover:brightness-110 transition-all font-mono">
              CINETRACK
            </span>
          </Link>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1.5 border-l border-white/10 pl-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-1.5 ${
                    link.highlight
                      ? "text-[#FAF6E8] bg-[#B58863]/20 border border-[#B58863]/40 hover:bg-[#B58863]/30 hover:border-[#B58863] shadow-[0_0_12px_rgba(181,136,99,0.2)]"
                      : isActive
                      ? "text-white bg-white/10 border border-white/15"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.highlight && <span className="w-1.5 h-1.5 rounded-full bg-[#d4a87c] animate-pulse" />}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Segment: Search, REC Indicator & Profile/Auth */}
        <div className="hidden md:flex items-center gap-4">
          
          {/* Autocomplete Search Bar */}
          <form 
            action="/search" 
            method="GET" 
            className="relative flex items-center rounded-xl bg-white/5 border border-white/10 focus-within:border-[#B58863]/80 focus-within:bg-black/40 px-3.5 py-1.5 transition-all duration-300"
            onFocus={() => setShowSuggestions(searchQuery.trim().length >= 2)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          >
            <input
              type="text"
              name="q"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search catalog..."
              className="w-40 lg:w-56 bg-transparent text-xs text-white placeholder-white/40 focus:outline-none font-mono"
              required
              autoComplete="off"
            />
            <button type="submit" className="cursor-pointer text-white/50 hover:text-[#B58863] transition-colors pl-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.604 10.604Z" />
              </svg>
            </button>

            {/* Viewfinder Autocomplete Dropdown */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#0c1416]/98 backdrop-blur-2xl border border-[#3D4D55]/60 rounded-2xl p-2.5 shadow-2xl z-50 animate-search-dropdown flex flex-col gap-1 min-w-[260px]">
                <span className="block font-mono text-[7px] text-slate-500 uppercase tracking-widest pl-2 mb-1 select-none">
                  SEARCH MATCHES // LENS_INSPECT
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

          {/* Director REC Camera Tag */}
          <div className="hidden lg:flex items-center gap-1.5 font-mono text-[8px] tracking-widest text-red-500/90 bg-red-950/40 border border-red-500/30 px-2.5 py-1 rounded-full select-none shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-400 font-bold">REC</span>
          </div>

          {/* User Auth Profile Dropdown */}
          {session?.user ? (
            <div className="group relative flex items-center">
              <button className="flex items-center focus:outline-none cursor-pointer">
                <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-[#B58863] to-[#d4a87c] shadow-md shadow-[#B58863]/20 hover:scale-105 transition-transform duration-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={session.user.image || "/avatar-placeholder.png"}
                    alt={session.user.name || "User Avatar"}
                    className="w-8 h-8 rounded-full object-cover bg-slate-900"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0a1214] rounded-full" />
                </div>
              </button>
              
              <div className="absolute right-0 top-full mt-3.5 w-52 rounded-2xl bg-[#0c1416]/98 backdrop-blur-2xl border border-white/10 py-2.5 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform origin-top-right translate-y-1 group-hover:translate-y-0">
                <div className="px-4 py-2 border-b border-white/10 mb-1.5">
                  <p className="text-xs font-bold text-white truncate">{session.user.name}</p>
                  <p className="text-[9px] font-mono text-slate-400 truncate">@{session.user.username}</p>
                </div>
                <Link
                  href={`/user/${session.user.username}`}
                  className="block px-4 py-2 text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                >
                  My Profile
                </Link>
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                <form action={logoutAction} className="border-t border-white/10 mt-1.5 pt-1.5">
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
              className="text-xs font-bold bg-gradient-to-r from-[#B58863] to-[#d4a87c] text-[#0a1214] px-4 py-1.5 rounded-xl transition-all shadow-md shadow-[#B58863]/20 hover:opacity-90 font-mono tracking-wider"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Navigation Drawer Trigger */}
        <div className="flex md:hidden items-center gap-3">
          <input type="checkbox" id="mobile-menu-toggle" className="peer hidden" />
          
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm opacity-0 pointer-events-none peer-checked:opacity-100 peer-checked:pointer-events-auto transition-opacity duration-300 z-40 md:hidden" />
          
          <label
            htmlFor="mobile-menu-toggle"
            className="flex items-center justify-center p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </label>
          
          {/* Mobile Drawer Menu */}
          <div className="fixed top-0 right-0 bottom-0 w-72 bg-[#0a1214]/98 backdrop-blur-2xl border-l border-white/10 shadow-2xl translate-x-full peer-checked:translate-x-0 transition-transform duration-300 ease-in-out z-50 p-6 flex flex-col justify-between pointer-events-auto">
            <div className="space-y-6">
              
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <span className="font-mono text-[10px] text-[#B58863] tracking-widest uppercase font-bold">NAV CONSOLE</span>
                <label htmlFor="mobile-menu-toggle" className="cursor-pointer text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </label>
              </div>
              
              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-200 hover:text-[#FAF6E8] py-2 border-b border-white/5 transition-colors"
                  >
                    <span>{link.label}</span>
                    {link.highlight && <span className="text-[9px] text-[#B58863] font-mono">[MATCH]</span>}
                  </Link>
                ))}
              </nav>
              
              {/* Mobile Search Input */}
              <div className="pt-2">
                <form 
                  action="/search" 
                  method="GET" 
                  className="relative flex items-center bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 focus-within:border-[#B58863] transition-all"
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

                  {/* Autocomplete for Mobile */}
                  {showMobileSuggestions && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#0c1618] border border-white/10 rounded-xl p-2 shadow-2xl z-50 flex flex-col gap-1 w-full max-h-60 overflow-y-auto">
                      {mobileSuggestions.length > 0 ? (
                        mobileSuggestions.map((item) => (
                          <Link
                            key={item.id}
                            href={`/${item.mediaType === "movie" ? "movies" : "tv"}/${item.id}`}
                            onClick={() => {
                              setMobileQuery("");
                              setShowMobileSuggestions(false);
                            }}
                            className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-white/5 text-left"
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
            
            <div className="border-t border-white/10 pt-4">
              {session?.user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={session.user.image || "/avatar-placeholder.png"}
                      alt={session.user.name || "User Avatar"}
                      className="w-9 h-9 rounded-full object-cover bg-slate-900 border border-white/10"
                    />
                    <div className="leading-tight">
                      <p className="text-xs font-bold text-white">{session.user.name}</p>
                      <p className="text-[10px] font-mono text-slate-400">@{session.user.username}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 pt-1">
                    <Link
                      href={`/user/${session.user.username}`}
                      className="block w-full text-center px-4 py-2 text-xs bg-white/5 border border-white/10 text-slate-300 rounded-xl hover:bg-white/10 transition-all font-bold"
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/dashboard"
                      className="block w-full text-center px-4 py-2 text-xs bg-white/5 border border-white/10 text-slate-300 rounded-xl hover:bg-white/10 transition-all font-bold"
                    >
                      Dashboard
                    </Link>
                    <form action={logoutAction} className="pt-1">
                      <button
                        type="submit"
                        className="block w-full text-center px-4 py-2 text-xs bg-red-950/40 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-900/50 transition-all font-bold cursor-pointer"
                      >
                        Sign Out
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="block w-full text-center px-4 py-2.5 text-xs bg-gradient-to-r from-[#B58863] to-[#d4a87c] text-[#0a1214] rounded-xl font-bold font-mono tracking-wider"
                >
                  Sign In
                </Link>
              )}
            </div>
            
          </div>
        </div>

      </div>
    </header>
  );
}
