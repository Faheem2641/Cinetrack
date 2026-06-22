import Link from "next/link";
import { getPopularMedia, getTopRatedMedia } from "@/lib/tmdb";
import MediaCard from "@/components/MediaCard";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();
  const popularMovies = await getPopularMedia("movie");
  const popularTV = await getPopularMedia("tv");
  const topRatedMovies = await getTopRatedMedia("movie");
  const topRatedTV = await getTopRatedMedia("tv");

  return (
    <div className="flex flex-col flex-grow bg-[#0f1a1b]">
      {/* Hero Section */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-32 overflow-hidden border-b border-[#3D4D55]/20 bg-gradient-to-b from-[#103334] via-[#0f1a1b] to-[#0f1a1b]">
        {/* Radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(181,136,99,0.10),rgba(255,255,255,0))]" />
        
        {/* Glow circles */}
        <div className="absolute top-[20%] left-[10%] w-[350px] h-[350px] rounded-full bg-[#B58863]/5 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[10%] w-[350px] h-[350px] rounded-full bg-[#103334]/60 blur-[100px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-[#D3C3B9] sm:text-6xl max-w-4xl mx-auto leading-none">
            Track your cinema journey.
            <span className="block mt-3 bg-gradient-to-r from-[#B58863] via-[#d4a87c] to-[#D3C3B9] bg-clip-text text-transparent">
              Share your love for movies.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-[#A79E9C] leading-relaxed">
            Cinetrack is the ultimate portfolio for your movie and TV series logs. Search media, leave ratings &amp; reviews, create custom lists, and follow fellow cinephiles.
          </p>

          {/* Quick Search Input */}
          <div className="mx-auto mt-10 max-w-md">
            <form action="/search" method="GET" className="relative">
              <input
                type="text"
                name="q"
                placeholder="Search movies or TV shows..."
                className="w-full bg-[#103334]/80 border border-[#3D4D55]/60 rounded-full py-4 pl-6 pr-12 text-sm text-[#D3C3B9] placeholder-[#A79E9C]/60 focus:outline-none focus:border-[#B58863]/60 focus:ring-1 focus:ring-[#B58863]/30 shadow-2xl transition-all"
                required
              />
              <button
                type="submit"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-[#B58863] text-[#0f1a1b] rounded-full p-2.5 hover:bg-[#d4a87c] active:scale-95 transition-all cursor-pointer shadow-lg shadow-[#B58863]/20"
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
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.604 10.604Z"
                  />
                </svg>
              </button>
            </form>
          </div>

          <div className="mt-8 flex justify-center gap-4">
            {session ? (
              <Link
                href="/dashboard"
                className="rounded-full bg-gradient-to-r from-[#B58863] to-[#d4a87c] hover:opacity-90 px-6 py-3 text-sm font-semibold text-[#0f1a1b] shadow-lg shadow-[#B58863]/20 active:scale-[0.98] transition-all"
              >
                View Your Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="rounded-full bg-gradient-to-r from-[#B58863] to-[#d4a87c] hover:opacity-90 px-6 py-3 text-sm font-semibold text-[#0f1a1b] shadow-lg shadow-[#B58863]/20 active:scale-[0.98] transition-all"
                >
                  Create Free Account
                </Link>
                <Link
                  href="/search"
                  className="rounded-full bg-[#103334] border border-[#3D4D55]/60 text-[#A79E9C] hover:text-[#D3C3B9] px-6 py-3 text-sm font-semibold hover:bg-[#1e2e30] transition-colors"
                >
                  Explore Trending
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Showcase Section */}
      <section className="bg-[#0f1a1b] py-16 border-y border-[#3D4D55]/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl font-extrabold tracking-tight text-[#D3C3B9] sm:text-3xl">
              Log. Review. Build custom lists.
            </h2>
            <p className="mt-4 text-sm text-[#A79E9C]">
              Cinetrack gives you all the tools to document your movie habits in a beautiful, unified workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-[#103334]/40 border border-[#3D4D55]/30 p-6 rounded-2xl hover:border-[#B58863]/20 hover:bg-[#103334]/60 transition-all duration-300">
              <div className="h-10 w-10 rounded-xl bg-[#B58863]/10 border border-[#B58863]/20 flex items-center justify-center text-[#B58863] mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-[#D3C3B9] mb-2">Watch Log &amp; Statuses</h3>
              <p className="text-xs text-[#A79E9C] leading-relaxed">
                Add titles to your Watched List, Currently Watching, Wishlist, or Favorites. Star rate movies with 0.5 increment accuracy.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#103334]/40 border border-[#3D4D55]/30 p-6 rounded-2xl hover:border-[#B58863]/20 hover:bg-[#103334]/60 transition-all duration-300">
              <div className="h-10 w-10 rounded-xl bg-[#3D4D55]/40 border border-[#3D4D55]/50 flex items-center justify-center text-[#A79E9C] mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.75c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75A2.25 2.25 0 0 1 4.5 4.5h15a2.25 2.25 0 0 1 2.25 2.25V7.5H12Z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-[#D3C3B9] mb-2">Write Reviews &amp; Socialize</h3>
              <p className="text-xs text-[#A79E9C] leading-relaxed">
                Write reviews to share your cinematic opinion. Let other users like and comment on your reviews, and follow profiles you enjoy.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#103334]/40 border border-[#3D4D55]/30 p-6 rounded-2xl hover:border-[#B58863]/20 hover:bg-[#103334]/60 transition-all duration-300">
              <div className="h-10 w-10 rounded-xl bg-[#1e2e30] border border-[#3D4D55]/50 flex items-center justify-center text-[#D3C3B9]/70 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-[#D3C3B9] mb-2">Niche Custom Lists</h3>
              <p className="text-xs text-[#A79E9C] leading-relaxed">
                Organize film categories like &quot;Cozy Winter Watch&quot; or &quot;Sci-Fi Mindbenders&quot;. Add custom items, rearrange them, and share them publicly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Movies Section */}
      <section className="mx-auto w-full max-w-7xl px-4 pt-16 pb-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between border-b border-[#3D4D55]/20 pb-4 mb-8">
          <h2 className="text-2xl font-extrabold tracking-tight text-[#D3C3B9] flex items-center gap-2">
            <span className="w-1.5 h-6 rounded bg-[#B58863]" />
            Trending Movies
          </h2>
          <Link
            href="/movies"
            className="text-xs font-semibold text-[#B58863] hover:text-[#d4a87c] flex items-center gap-1 transition-colors"
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
          {popularMovies.slice(0, 10).map((item) => (
            <MediaCard key={`movie:${item.id}`} item={item} />
          ))}
        </div>
      </section>

      {/* Top Rated Movies Section */}
      <section className="mx-auto w-full max-w-7xl px-4 pt-8 pb-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between border-b border-[#3D4D55]/20 pb-4 mb-8">
          <h2 className="text-2xl font-extrabold tracking-tight text-[#D3C3B9] flex items-center gap-2">
            <span className="w-1.5 h-6 rounded bg-[#d4a87c]" />
            Top Rated Movies
          </h2>
          <Link
            href="/movies"
            className="text-xs font-semibold text-[#B58863] hover:text-[#d4a87c] flex items-center gap-1 transition-colors"
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
          {topRatedMovies.slice(0, 10).map((item) => (
            <MediaCard key={`top-movie:${item.id}`} item={item} />
          ))}
        </div>
      </section>

      {/* Popular TV Series Section */}
      <section className="mx-auto w-full max-w-7xl px-4 pt-8 pb-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between border-b border-[#3D4D55]/20 pb-4 mb-8">
          <h2 className="text-2xl font-extrabold tracking-tight text-[#D3C3B9] flex items-center gap-2">
            <span className="w-1.5 h-6 rounded bg-[#A79E9C]" />
            Trending TV Series
          </h2>
          <Link
            href="/tv"
            className="text-xs font-semibold text-[#B58863] hover:text-[#d4a87c] flex items-center gap-1 transition-colors"
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
          {popularTV.slice(0, 10).map((item) => (
            <MediaCard key={`tv:${item.id}`} item={item} />
          ))}
        </div>
      </section>

      {/* Top Rated TV Series Section */}
      <section className="mx-auto w-full max-w-7xl px-4 pt-8 pb-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between border-b border-[#3D4D55]/20 pb-4 mb-8">
          <h2 className="text-2xl font-extrabold tracking-tight text-[#D3C3B9] flex items-center gap-2">
            <span className="w-1.5 h-6 rounded bg-[#3D4D55]" />
            Top Rated TV Series
          </h2>
          <Link
            href="/tv"
            className="text-xs font-semibold text-[#B58863] hover:text-[#d4a87c] flex items-center gap-1 transition-colors"
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
          {topRatedTV.slice(0, 10).map((item) => (
            <MediaCard key={`top-tv:${item.id}`} item={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
