import Link from "next/link";
import { auth } from "@/lib/auth";
import { logoutAction } from "@/app/actions/auth";

export default async function Navbar() {
  const session = await auth();

  return (
    <header className="absolute top-0 left-0 right-0 z-50 w-full px-4 py-3 sm:px-6 lg:px-8 bg-transparent pointer-events-none">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6 rounded-full border border-[#3D4D55]/40 bg-[#103334]/70 backdrop-blur-lg shadow-xl shadow-black/60 pointer-events-auto transition-all duration-300 hover:border-[#B58863]/30 hover:bg-[#103334]/80">
        {/* Brand Logo (Left) */}
        <div className="flex items-center">
          <Link
            href="/"
            className="text-lg font-black tracking-widest bg-gradient-to-r from-[#B58863] via-[#d4a87c] to-[#D3C3B9] bg-clip-text text-transparent hover:opacity-90 transition-opacity"
          >
            CINETRACK
          </Link>
        </div>

        {/* Center Section: Search & Navigation Links (Desktop) */}
        <div className="hidden md:flex items-center gap-4 bg-[#0f1a1b]/60 border border-[#3D4D55]/40 rounded-full pl-5 pr-2 py-1 backdrop-blur-sm shadow-inner shadow-black/20 hover:border-[#3D4D55]/60 hover:bg-[#0f1a1b]/70 transition-all">
          <Link
            href="/movies"
            className="text-xs font-bold text-[#A79E9C] hover:text-[#D3C3B9] transition-colors"
          >
            Movies
          </Link>
          <span className="w-1 h-1 rounded-full bg-[#3D4D55]" />
          <Link
            href="/tv"
            className="text-xs font-bold text-[#A79E9C] hover:text-[#D3C3B9] transition-colors"
          >
            TV Shows
          </Link>
          <span className="w-1 h-1 rounded-full bg-[#3D4D55]" />
          <Link
            href="/recommend"
            className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#B58863] to-[#d4a87c] hover:opacity-80 transition-all"
          >
            ✦ Match Finder
          </Link>
          <span className="w-1 h-1 rounded-full bg-[#3D4D55]" />
          <Link
            href="/profile"
            className="text-xs font-bold text-[#A79E9C] hover:text-[#D3C3B9] transition-colors"
          >
            Profile
          </Link>
          <span className="w-px h-4 bg-[#3D4D55]/60" />
          {/* Sleek expanding search bar */}
          <form action="/search" method="GET" className="relative flex items-center bg-[#0f1a1b]/80 border border-[#3D4D55]/40 rounded-full px-3 py-1 focus-within:border-[#B58863]/50 focus-within:ring-1 focus-within:ring-[#B58863]/20 transition-all duration-300">
            <input
              type="text"
              name="q"
              placeholder="Search catalog..."
              className="w-28 bg-transparent text-xs text-[#D3C3B9] placeholder-[#A79E9C]/60 focus:outline-none focus:w-44 transition-all duration-300"
              required
            />
            <button type="submit" className="text-[#A79E9C] hover:text-[#B58863] cursor-pointer pl-1.5 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.604 10.604Z" />
              </svg>
            </button>
          </form>
        </div>

        {/* Right side: Auth/Profile (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          {session?.user ? (
            <div className="group relative flex items-center">
              <button className="flex items-center focus:outline-none cursor-pointer">
                {/* Profile Image with active glowing ring */}
                <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-[#B58863] to-[#d4a87c] shadow-md shadow-[#B58863]/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={session.user.image || "/avatar-placeholder.png"}
                    alt={session.user.name || "User Avatar"}
                    className="w-7 h-7 rounded-full object-cover bg-[#103334]"
                  />
                </div>
              </button>
              
              {/* CSS Hover Dropdown Menu */}
              <div className="absolute right-0 top-8 mt-2 w-48 rounded-xl bg-[#1e2e30] border border-[#3D4D55]/60 py-1.5 shadow-2xl shadow-black/90 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                <div className="px-4 py-2 border-b border-[#3D4D55]/40">
                  <p className="text-xs font-semibold text-[#D3C3B9] truncate">{session.user.name}</p>
                  <p className="text-[10px] text-[#A79E9C] truncate">@{session.user.username}</p>
                </div>
                <Link
                  href={`/user/${session.user.username}`}
                  className="block px-4 py-2 text-xs text-[#A79E9C] hover:bg-[#3D4D55]/30 hover:text-[#D3C3B9] transition-colors"
                >
                  My Profile
                </Link>
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 text-xs text-[#A79E9C] hover:bg-[#3D4D55]/30 hover:text-[#D3C3B9] transition-colors"
                >
                  Dashboard
                </Link>
                <form action={logoutAction} className="border-t border-[#3D4D55]/40 mt-1">
                  <button
                    type="submit"
                    className="block w-full text-left px-4 py-2 text-xs text-red-400/80 hover:bg-[#3D4D55]/30 hover:text-red-400 cursor-pointer transition-colors"
                  >
                    Sign Out
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-xs font-semibold text-[#A79E9C] hover:text-[#D3C3B9] px-3 py-1.5 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="text-xs font-semibold bg-gradient-to-r from-[#B58863] to-[#d4a87c] text-[#0f1a1b] px-4 py-1.5 rounded-full transition-all shadow-md shadow-[#B58863]/20 hover:shadow-[#B58863]/40 hover:opacity-90"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Layout (Visible only on smaller screens) */}
        <div className="flex md:hidden items-center gap-3">
          <Link
            href="/search"
            className="p-2 text-[#A79E9C] hover:text-[#D3C3B9] bg-[#0f1a1b]/60 border border-[#3D4D55]/40 rounded-full hover:bg-[#3D4D55]/30 transition-all cursor-pointer"
            aria-label="Search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.604 10.604Z" />
            </svg>
          </Link>
          
          {session?.user ? (
            <div className="group relative flex items-center">
              <button className="flex items-center focus:outline-none cursor-pointer">
                <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-[#B58863] to-[#d4a87c]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={session.user.image || "/avatar-placeholder.png"}
                    alt={session.user.name || "User Avatar"}
                    className="w-7 h-7 rounded-full object-cover bg-[#103334]"
                  />
                </div>
              </button>
              
              <div className="absolute right-0 top-8 mt-2 w-48 rounded-xl bg-[#1e2e30] border border-[#3D4D55]/60 py-1.5 shadow-2xl shadow-black/90 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                <div className="px-4 py-2 border-b border-[#3D4D55]/40">
                  <p className="text-xs font-semibold text-[#D3C3B9] truncate">{session.user.name}</p>
                  <p className="text-[10px] text-[#A79E9C] truncate">@{session.user.username}</p>
                </div>
                <Link
                  href="/movies"
                  className="block px-4 py-2 text-xs text-[#A79E9C] hover:bg-[#3D4D55]/30 hover:text-[#D3C3B9] transition-colors"
                >
                  Movies
                </Link>
                <Link
                  href="/tv"
                  className="block px-4 py-2 text-xs text-[#A79E9C] hover:bg-[#3D4D55]/30 hover:text-[#D3C3B9] transition-colors"
                >
                  TV Shows
                </Link>
                <Link
                  href={`/user/${session.user.username}`}
                  className="block px-4 py-2 text-xs text-[#A79E9C] hover:bg-[#3D4D55]/30 hover:text-[#D3C3B9] border-t border-[#3D4D55]/40 mt-1 transition-colors"
                >
                  My Profile
                </Link>
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 text-xs text-[#A79E9C] hover:bg-[#3D4D55]/30 hover:text-[#D3C3B9] transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/recommend"
                  className="block px-4 py-2 text-xs text-[#B58863] hover:bg-[#3D4D55]/30 hover:text-[#d4a87c] transition-colors"
                >
                  ✦ Match Finder
                </Link>
                <form action={logoutAction} className="border-t border-[#3D4D55]/40 mt-1">
                  <button
                    type="submit"
                    className="block w-full text-left px-4 py-2 text-xs text-red-400/80 hover:bg-[#3D4D55]/30 hover:text-red-400 cursor-pointer transition-colors"
                  >
                    Sign Out
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-xs font-semibold bg-gradient-to-r from-[#B58863] to-[#d4a87c] text-[#0f1a1b] px-3 py-1.5 rounded-full hover:opacity-90 transition-all"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
