import Link from "next/link";
import { auth } from "@/lib/auth";
import { logoutAction } from "@/app/actions/auth";

export default async function Navbar() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent hover:opacity-90 transition-opacity"
          >
            CINETRACK
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/movies"
              className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
            >
              Movies
            </Link>
            <Link
              href="/tv"
              className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
            >
              TV Shows
            </Link>
            <Link
              href="/search"
              className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
            >
              Search
            </Link>
          </nav>
        </div>

        {/* Global Search Bar Shortcut */}
        <div className="hidden sm:block flex-1 max-w-md mx-8">
          <form action="/search" method="GET" className="relative">
            <input
              type="text"
              name="q"
              placeholder="Search movies, TV shows..."
              className="w-full bg-zinc-900/60 border border-zinc-800 rounded-full py-1.5 pl-4 pr-10 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all duration-200"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21-21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.604 10.604Z" />
              </svg>
            </button>
          </form>
        </div>

        {/* User Actions / Auth Button */}
        <div className="flex items-center gap-4">
          <Link
            href="/search"
            className="sm:hidden text-zinc-400 hover:text-white p-2"
            aria-label="Search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21-21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.604 10.604Z" />
            </svg>
          </Link>

          {session?.user ? (
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-xs font-semibold bg-zinc-900 border border-zinc-800 text-zinc-200 px-3.5 py-1.5 rounded-full hover:bg-zinc-800 transition-all"
              >
                Dashboard
              </Link>
              <div className="group relative flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={session.user.image || "/avatar-placeholder.png"}
                  alt={session.user.name || "User Avatar"}
                  className="w-8 h-8 rounded-full border border-zinc-700 object-cover"
                />
                {/* Dropdown Menu (pure CSS hover dropdown) */}
                <div className="absolute right-0 top-8 mt-2 w-48 rounded-xl bg-zinc-900 border border-zinc-800 py-1 shadow-lg shadow-black/80 ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
                  <div className="px-4 py-2 border-b border-zinc-800/80">
                    <p className="text-xs font-semibold text-zinc-200 truncate">{session.user.name}</p>
                    <p className="text-[10px] text-zinc-500 truncate">@{session.user.username}</p>
                  </div>
                  <Link
                    href={`/user/${session.user.username}`}
                    className="block px-4 py-2 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  >
                    Stats Dashboard
                  </Link>
                  <form action={logoutAction} className="border-t border-zinc-800/80 mt-1">
                    <button
                      type="submit"
                      className="block w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-zinc-800 hover:text-red-300 cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-xs font-semibold text-zinc-300 hover:text-white px-3 py-1.5 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-2 rounded-full shadow-lg shadow-indigo-600/15 transition-all"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
