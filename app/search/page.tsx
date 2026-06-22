import { searchMedia, getPopularMedia } from "@/lib/tmdb";
import MediaCard from "@/components/MediaCard";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || "";

  // Fetch search results if query is present, otherwise get popular recommendations
  const results = query ? await searchMedia(query) : [];
  const popularMovies = !query ? await getPopularMedia("movie") : [];
  const popularTV = !query ? await getPopularMedia("tv") : [];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pt-28 pb-8 sm:px-6 lg:px-8 flex-1 flex flex-col">
      {/* Search Header Form */}
      <div className="max-w-2xl mx-auto w-full text-center mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#D3C3B9] sm:text-4xl mb-4">
          Discover Cinema
        </h1>
        <p className="text-[#A79E9C] text-sm mb-6">
          Search thousands of movies and TV series, read reviews, and build your lists.
        </p>

        <form action="/search" method="GET" className="relative max-w-lg mx-auto">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search by title, series, or keywords..."
            className="w-full bg-[#103334]/60 border border-[#3D4D55]/50 rounded-2xl py-3.5 pl-5 pr-12 text-sm text-[#D3C3B9] placeholder-[#A79E9C]/60 focus:outline-none focus:border-[#B58863]/60 focus:ring-1 focus:ring-[#B58863]/20 shadow-xl transition-all"
            required
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#B58863] text-[#0f1a1b] rounded-xl p-2 hover:bg-[#d4a87c] active:scale-95 transition-all cursor-pointer"
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

      {/* Results Content */}
      <div className="flex-1">
        {query ? (
          <div>
            <div className="flex items-center justify-between border-b border-[#3D4D55]/20 pb-4 mb-6">
              <h2 className="text-lg font-bold text-[#D3C3B9]">
                Search Results for <span className="text-[#B58863]">&quot;{query}&quot;</span>
              </h2>
              <span className="text-xs text-[#A79E9C] font-medium">
                {results.length} results found
              </span>
            </div>

            {results.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {results.map((item) => (
                  <MediaCard key={`${item.mediaType}:${item.id}`} item={item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border border-dashed border-[#3D4D55]/30 rounded-2xl bg-[#103334]/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-12 h-12 text-[#3D4D55] mx-auto mb-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.302m0 0A9.75 9.75 0 1 1 12.016 21a9.75 9.75 0 0 1-8.832-5.682m8.832 5.682c.097 0 .195-.01.293-.03a9.75 9.75 0 0 1 8.832-5.682a9.75 9.75 0 0 1-8.832 5.682m-8.832-5.682c-.097 0-.195.01-.293.03"
                  />
                </svg>
                <h3 className="text-[#D3C3B9] font-semibold mb-1">No matches found</h3>
                <p className="text-[#A79E9C] text-xs max-w-xs mx-auto">
                  Double check spelling, try broader keywords, or search our recommendations below.
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Landing/Popular Recommendations when there is no query */
          <div className="space-y-12">
            {/* Popular Movies */}
            {popularMovies.length > 0 && (
              <div>
                <h2 className="text-xl font-extrabold tracking-tight text-[#D3C3B9] mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-6 rounded bg-[#B58863]" />
                  Popular Movies
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {popularMovies.map((item) => (
                    <MediaCard key={`movie:${item.id}`} item={item} />
                  ))}
                </div>
              </div>
            )}

            {/* Popular TV Shows */}
            {popularTV.length > 0 && (
              <div>
                <h2 className="text-xl font-extrabold tracking-tight text-[#D3C3B9] mb-6 flex items-center gap-2">
                  <span className="w-1.5 h-6 rounded bg-[#A79E9C]" />
                  Trending TV Shows
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {popularTV.map((item) => (
                    <MediaCard key={`tv:${item.id}`} item={item} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
