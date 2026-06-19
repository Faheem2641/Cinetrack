import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getMediaDetails } from "@/lib/tmdb";
import MediaCard from "@/components/MediaCard";
import Link from "next/link";

interface PublicProfilePageProps {
  params: Promise<{ username: string }>;
}

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
  const resolvedParams = await params;
  const username = resolvedParams.username.toLowerCase();

  // Find user by username
  const profileUser = await prisma.user.findUnique({
    where: { username },
  });

  if (!profileUser) {
    notFound();
  }

  const userId = profileUser.id;

  // Fetch public user logs
  const [watched, favorites, reviews] = await Promise.all([
    prisma.watchEntry.findMany({ where: { userId, isWatched: true } }),
    prisma.watchEntry.findMany({ where: { userId, isFavorite: true } }),
    prisma.review.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  // Compute metrics
  const watchedMoviesCount = watched.filter((w) => w.mediaType === "movie").length;
  const watchedTVCount = watched.filter((w) => w.mediaType === "tv").length;

  const ratings = watched.map((w) => w.rating).filter((r): r is number => r !== null);
  const averageRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

  // Compute favorite genres
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
    .slice(0, 3);

  // Map helper
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
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 bg-[#09090b]">
      {/* Profile Info Header */}
      <div className="flex flex-col md:flex-row items-center gap-8 p-8 rounded-3xl bg-zinc-900/30 border border-zinc-800/80 backdrop-blur-xl mb-12">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={profileUser.avatarUrl || "/avatar-placeholder.png"}
          alt={profileUser.name || profileUser.username}
          className="w-24 h-24 rounded-full border-2 border-indigo-500 object-cover shadow-2xl"
        />
        <div className="text-center md:text-left flex-grow">
          <h1 className="text-3xl font-extrabold text-white">{profileUser.name || profileUser.username}</h1>
          <p className="text-zinc-500 text-sm mt-1">@{profileUser.username}</p>
          {profileUser.bio && (
            <p className="text-zinc-300 text-sm mt-4 max-w-xl leading-relaxed mx-auto md:mx-0">
              {profileUser.bio}
            </p>
          )}
        </div>

        {/* Share profile section */}
        <div className="shrink-0 flex flex-col gap-2">
          {/* Share Button (Standard browser copy) */}
          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                alert("Profile link copied to clipboard!");
              }
            }}
            className="text-xs font-semibold px-4 py-2.5 bg-zinc-800 border border-zinc-700 text-zinc-200 hover:text-white rounded-xl hover:bg-zinc-700 cursor-pointer flex items-center gap-2"
            id="share-btn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186 2.504-1.253m-2.504 3.439 2.504 1.253m0-4.692a2.25 2.25 0 1 1 0-3.328m0 3.328a2.25 2.25 0 0 1-2.504 1.253m2.504 2.186a2.25 2.25 0 1 0 0 3.328m0-3.328a2.25 2.25 0 0 0-2.504-1.253" />
            </svg>
            Copy Shareable Link
          </button>
        </div>
      </div>

      {/* Grid of Profile Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-5 text-center">
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Movies Logged</p>
          <p className="text-2xl font-black text-white mt-2">{watchedMoviesCount}</p>
        </div>
        <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-5 text-center">
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Series Logged</p>
          <p className="text-2xl font-black text-white mt-2">{watchedTVCount}</p>
        </div>
        <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-5 text-center">
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Average Rating</p>
          <p className="text-2xl font-black text-amber-400 mt-2">
            {averageRating > 0 ? averageRating.toFixed(1) : "0.0"} <span className="text-[10px] text-zinc-500">/ 5.0</span>
          </p>
        </div>
        <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-5 text-center">
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Top Genre</p>
          <p className="text-base font-black text-zinc-100 mt-2.5 truncate">
            {topGenres.length > 0 ? topGenres[0][0] : "N/A"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Favorites and Reviews column (large, span 2) */}
        <div className="lg:col-span-2 space-y-12">
          {/* Favorites */}
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-white mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 rounded bg-rose-500" />
              Favorite Cinema
            </h2>
            {favorites.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {favorites.slice(0, 6).map((item) => (
                  <MediaCard key={`fav:${item.id}`} item={mapToMediaItem(item)} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-500 italic py-4">No favorites added yet.</p>
            )}
          </div>

          {/* User Reviews */}
          <div>
            <h2 className="text-xl font-extrabold tracking-tight text-white mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 rounded bg-blue-500" />
              Reviews by {profileUser.name || profileUser.username}
            </h2>
            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-6 bg-zinc-900/30 border border-zinc-800/80 rounded-2xl flex flex-col md:flex-row gap-6">
                    {rev.posterPath && (
                      <div className="w-[100px] shrink-0 mx-auto md:mx-0 rounded-lg overflow-hidden border border-zinc-800/60 aspect-[2/3] bg-zinc-950">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`https://image.tmdb.org/t/p/w185${rev.posterPath}`}
                          alt={rev.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <Link href={`/${rev.mediaType === "movie" ? "movies" : "tv"}/${rev.tmdbId}`} className="text-base font-bold text-white hover:text-indigo-400 transition-colors">
                          {rev.title}
                        </Link>
                        {rev.rating && (
                          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                            </svg>
                            {rev.rating.toFixed(1)} / 5.0
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{rev.content}</p>
                      <p className="text-[10px] text-zinc-500 mt-4">
                        Logged on {new Date(rev.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-500 italic py-4">No reviews written yet.</p>
            )}
          </div>
        </div>

        {/* Sidebar info (genres / lists overview) */}
        <div className="space-y-8">
          {/* Favorite Genres Card */}
          <div className="bg-zinc-900/30 border border-zinc-800/80 p-6 rounded-2xl">
            <h3 className="text-sm font-extrabold text-white mb-4">Favorite Genres</h3>
            {topGenres.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {topGenres.map(([genre, count]) => (
                  <span
                    key={genre}
                    className="text-xs px-3.5 py-1.5 rounded-full bg-zinc-950 border border-zinc-800 text-zinc-200"
                  >
                    {genre} ({count})
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-500 italic">No genres logged yet.</p>
            )}
          </div>

          {/* Recently Logged Activity list */}
          <div className="bg-zinc-900/30 border border-zinc-800/80 p-6 rounded-2xl">
            <h3 className="text-sm font-extrabold text-white mb-4">Recent Watch Activity</h3>
            {watched.length > 0 ? (
              <ul className="space-y-3.5">
                {watched.slice(0, 5).map((item) => (
                  <li key={item.id} className="flex items-center gap-3 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                    <Link href={`/${item.mediaType === "movie" ? "movies" : "tv"}/${item.tmdbId}`} className="text-zinc-200 hover:text-indigo-400 font-semibold truncate hover:underline">
                      {item.title}
                    </Link>
                    <span className="text-zinc-500 text-[10px] ml-auto shrink-0 uppercase tracking-wide">
                      {item.mediaType}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-zinc-500 italic">No watches logged yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
