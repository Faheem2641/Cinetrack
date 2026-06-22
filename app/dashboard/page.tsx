import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getMediaDetails } from "@/lib/tmdb";
import MediaCard from "@/components/MediaCard";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const userId = session.user.id;

  // 1. Fetch user data from DB
  const [watched, wishlist, favorites, recentLogs] = await Promise.all([
    prisma.watchEntry.findMany({ where: { userId, isWatched: true } }),
    prisma.watchEntry.findMany({ where: { userId, isWishlist: true } }),
    prisma.watchEntry.findMany({ where: { userId, isFavorite: true } }),
    prisma.watchEntry.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
  ]);

  // 2. Compute media counts
  const watchedMoviesCount = watched.filter((w) => w.mediaType === "movie").length;
  const watchedTVCount = watched.filter((w) => w.mediaType === "tv").length;

  // 3. Compute rating distribution
  const ratings = watched.map((w) => w.rating).filter((r): r is number => r !== null);
  const averageRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

  const ratingCounts: Record<string, number> = {
    "5.0": 0, "4.5": 0, "4.0": 0, "3.5": 0, "3.0": 0,
    "2.5": 0, "2.0": 0, "1.5": 0, "1.0": 0, "0.5": 0
  };
  ratings.forEach((r) => {
    const key = r.toFixed(1);
    if (ratingCounts[key] !== undefined) {
      ratingCounts[key]++;
    }
  });

  const maxRatingCount = Math.max(...Object.values(ratingCounts), 1);

  // 4. Fetch genres for watched items to calculate favorite genres
  const detailRequests = watched.map((w) => getMediaDetails(w.tmdbId, w.mediaType as "movie" | "tv"));
  const watchedDetails = (await Promise.all(detailRequests)).filter((d) => d !== null);

  const genreCounts: Record<string, number> = {};
  watchedDetails.forEach((details) => {
    details?.genres.forEach((genre) => {
      genreCounts[genre] = (genreCounts[genre] || 0) + 1;
    });
  });

  const topGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const maxGenreCount = Math.max(...topGenres.map((g) => g[1]), 1);

  // Transform WatchEntry db objects to MediaItem format for MediaCard
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapToMediaItem = (w: any) => ({
    id: w.tmdbId,
    title: w.title,
    overview: "",
    posterPath: w.posterPath,
    backdropPath: null,
    releaseDate: w.releaseDate || "",
    mediaType: w.mediaType as "movie" | "tv",
    voteAverage: w.rating || 0,
    voteCount: 0,
  });

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pt-28 pb-12 sm:px-6 lg:px-8 bg-[#0f1a1b]">
      {/* Profile Header banner */}
      <div className="flex flex-col sm:flex-row items-center gap-6 p-8 rounded-3xl bg-[#103334]/40 border border-[#3D4D55]/30 backdrop-blur-xl mb-12">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={session.user.image || "/avatar-placeholder.png"}
          alt={session.user.name || "User Avatar"}
          className="w-20 h-20 rounded-full border-2 border-[#B58863]/60 object-cover shadow-lg shadow-[#B58863]/10"
        />
        <div className="text-center sm:text-left flex-1">
          <h1 className="text-3xl font-extrabold text-[#D3C3B9]">{session.user.name}</h1>
          <p className="text-[#A79E9C] text-sm mt-1">@{session.user.username}</p>
          <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-4">
            <Link
              href={`/user/${session.user.username}`}
              className="text-xs font-semibold px-4 py-2 bg-gradient-to-r from-[#B58863] to-[#d4a87c] hover:opacity-90 text-[#0f1a1b] rounded-xl shadow-lg shadow-[#B58863]/10 active:scale-[0.98] transition-all"
            >
              View Public Portfolio
            </Link>
          </div>
        </div>
      </div>

      {/* Grid of Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-[#103334]/40 border border-[#3D4D55]/30 rounded-2xl p-6">
          <p className="text-xs font-bold text-[#A79E9C] uppercase tracking-wider">Watched Movies</p>
          <p className="text-3xl font-black text-[#D3C3B9] mt-2">{watchedMoviesCount}</p>
        </div>
        <div className="bg-[#103334]/40 border border-[#3D4D55]/30 rounded-2xl p-6">
          <p className="text-xs font-bold text-[#A79E9C] uppercase tracking-wider">Watched Series</p>
          <p className="text-3xl font-black text-[#D3C3B9] mt-2">{watchedTVCount}</p>
        </div>
        <div className="bg-[#103334]/40 border border-[#3D4D55]/30 rounded-2xl p-6">
          <p className="text-xs font-bold text-[#A79E9C] uppercase tracking-wider">Average Rating</p>
          <p className="text-3xl font-black text-[#B58863] mt-2">
            {averageRating > 0 ? averageRating.toFixed(1) : "0.0"} <span className="text-xs text-[#A79E9C]">/ 5.0</span>
          </p>
        </div>
        <div className="bg-[#103334]/40 border border-[#3D4D55]/30 rounded-2xl p-6">
          <p className="text-xs font-bold text-[#A79E9C] uppercase tracking-wider">Watch Later (Wishlist)</p>
          <p className="text-3xl font-black text-[#D3C3B9] mt-2">{wishlist.length}</p>
        </div>
      </div>

      {/* Charts / Visual Analytics grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Rating Distribution Bar Chart */}
        <div className="bg-[#103334]/30 border border-[#3D4D55]/25 p-6 rounded-2xl">
          <h2 className="text-base font-extrabold text-[#D3C3B9] mb-6 flex items-center gap-2">
            <span className="w-1.5 h-5 rounded bg-[#B58863]" />
            Rating Distribution
          </h2>
          <div className="space-y-3">
            {Object.entries(ratingCounts)
              .sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]))
              .map(([stars, count]) => {
                const percentage = (count / maxRatingCount) * 100;
                return (
                  <div key={stars} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[#A79E9C] w-8">{stars} ★</span>
                    <div className="flex-1 bg-[#0f1a1b] h-5 rounded-md overflow-hidden border border-[#3D4D55]/20 relative">
                      <div
                        className="bg-[#B58863] h-full rounded-r-md transition-all duration-500"
                        style={{ width: `${count > 0 ? Math.max(percentage, 3) : 0}%` }}
                      />
                    </div>
                    <span className="text-xs text-[#A79E9C] w-6 text-right font-semibold">{count}</span>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Favorite Genres Chart */}
        <div className="bg-[#103334]/30 border border-[#3D4D55]/25 p-6 rounded-2xl">
          <h2 className="text-base font-extrabold text-[#D3C3B9] mb-6 flex items-center gap-2">
            <span className="w-1.5 h-5 rounded bg-[#3D4D55]" />
            Top Genres
          </h2>
          {topGenres.length > 0 ? (
            <div className="space-y-4">
              {topGenres.map(([genre, count]) => {
                const percentage = (count / maxGenreCount) * 100;
                return (
                  <div key={genre} className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-[#D3C3B9]">{genre}</span>
                      <span className="text-[#A79E9C]">{count} titles</span>
                    </div>
                    <div className="w-full bg-[#0f1a1b] h-3 rounded-full overflow-hidden border border-[#3D4D55]/20">
                      <div
                        className="bg-[#3D4D55] h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-[#A79E9C] italic text-center py-10">
              Start adding ratings/logs to analyze your favorite genres.
            </p>
          )}
        </div>
      </div>

      {/* Media sections (Favorites, Wishlist, Recent Activity) */}
      <div className="space-y-16">
        {/* Favorites */}
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-[#D3C3B9] mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 rounded bg-[#B58863]" />
            My Favorites ({favorites.length})
          </h2>
          {favorites.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {favorites.map((item) => (
                <MediaCard key={`fav:${item.id}`} item={mapToMediaItem(item)} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#A79E9C] italic py-4">You haven&apos;t marked any favorites yet.</p>
          )}
        </div>

        {/* Wishlist */}
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-[#D3C3B9] mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 rounded bg-[#3D4D55]" />
            Wishlist / Watch Later ({wishlist.length})
          </h2>
          {wishlist.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {wishlist.map((item) => (
                <MediaCard key={`wish:${item.id}`} item={mapToMediaItem(item)} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#A79E9C] italic py-4">Your watchlist is currently empty.</p>
          )}
        </div>
      </div>
    </div>
  );
}
