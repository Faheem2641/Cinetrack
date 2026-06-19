import Link from "next/link";
import { getPopularMedia } from "@/lib/tmdb";
import MediaCard from "@/components/MediaCard";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();
  const popularMovies = await getPopularMedia("movie");
  const popularTV = await getPopularMedia("tv");

  return (
    <div className="flex flex-col flex-grow bg-[#09090b]">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden border-b border-zinc-900 bg-gradient-to-b from-indigo-950/20 via-zinc-950 to-zinc-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
        
        {/* Glow circles */}
        <div className="absolute top-[20%] left-[10%] w-[350px] h-[350px] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[10%] w-[350px] h-[350px] rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl max-w-4xl mx-auto leading-none">
            Track your cinema journey.
            <span className="block mt-3 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Share your love for movies.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-zinc-400 leading-relaxed">
            Cinetrack is the ultimate portfolio for your movie and TV series logs. Search media, leave ratings &amp; reviews, create custom lists, and follow fellow cinephiles.
          </p>

          {/* Quick Search Input */}
          <div className="mx-auto mt-10 max-w-md">
            <form action="/search" method="GET" className="relative">
              <input
                type="text"
                name="q"
                placeholder="Search movies or TV shows..."
                className="w-full bg-zinc-900/80 border border-zinc-800 rounded-full py-4 pl-6 pr-12 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-2xl transition-all"
                required
              />
              <button
                type="submit"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-indigo-600 text-white rounded-full p-2.5 hover:bg-indigo-500 active:scale-95 transition-all cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21-21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.604 10.604Z"
                  />
                </svg>
              </button>
            </form>
          </div>

          <div className="mt-8 flex justify-center gap-4">
            {session ? (
              <Link
                href="/dashboard"
                className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all"
              >
                View Your Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 active:scale-[0.98] transition-all"
                >
                  Create Free Account
                </Link>
                <Link
                  href="/search"
                  className="rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white px-6 py-3 text-sm font-semibold hover:bg-zinc-800 transition-colors"
                >
                  Explore Trending
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Popular Movies Section */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-8">
          <h2 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <span className="w-1.5 h-6 rounded bg-blue-500" />
            Trending Movies
          </h2>
          <Link
            href="/search"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            View More
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-3.5 h-3.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {popularMovies.slice(0, 5).map((item) => (
            <MediaCard key={`movie:${item.id}`} item={item} />
          ))}
        </div>
      </section>

      {/* Features Showcase Section */}
      <section className="bg-zinc-950 py-16 border-y border-zinc-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Log. Review. Build custom lists.
            </h2>
            <p className="mt-4 text-sm text-zinc-400">
              Cinetrack gives you all the tools to document your movie habits in a beautiful, unified workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-zinc-900/30 border border-zinc-800/80 p-6 rounded-2xl">
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-zinc-200 mb-2">Watch Log &amp; Statuses</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Add titles to your Watched List, Currently Watching, Wishlist, or Favorites. Star rate movies with 0.5 increment accuracy.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-zinc-900/30 border border-zinc-800/80 p-6 rounded-2xl">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.75c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75A2.25 2.25 0 0 1 4.5 4.5h15a2.25 2.25 0 0 1 2.25 2.25V7.5H12Z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-zinc-200 mb-2">Write Reviews &amp; Socialize</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Write reviews to share your cinematic opinion. Let other users like and comment on your reviews, and follow profiles you enjoy.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-zinc-900/30 border border-zinc-800/80 p-6 rounded-2xl">
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-zinc-200 mb-2">Niche Custom Lists</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Organize film categories like "Cozy Winter Watch" or "Sci-Fi Mindbenders". Add custom items, rearrange them, and share them publicly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular TV Series Section */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-8">
          <h2 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <span className="w-1.5 h-6 rounded bg-red-500" />
            Trending TV Series
          </h2>
          <Link
            href="/search"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            View More
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-3.5 h-3.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {popularTV.slice(0, 5).map((item) => (
            <MediaCard key={`tv:${item.id}`} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
