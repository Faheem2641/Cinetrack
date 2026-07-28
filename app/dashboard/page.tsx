import { auth } from "@/lib/auth";
import { prisma, dbQuery } from "@/lib/prisma";
import { getMediaDetails } from "@/lib/tmdb";
import DashboardClient from "@/components/DashboardClient";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const userId = session.user.id;

  // Fetch user data from DB with retry handling
  const [watched, wishlist, favorites] = await dbQuery(() =>
    Promise.all([
      prisma.watchEntry.findMany({ where: { userId, isWatched: true } }),
      prisma.watchEntry.findMany({ where: { userId, isWishlist: true } }),
      prisma.watchEntry.findMany({ where: { userId, isFavorite: true } }),
    ])
  );

  // Compute rating distribution
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

  // Fetch genres & runtimes for watched items
  const detailRequests = watched.map((w) => getMediaDetails(w.tmdbId, w.mediaType as "movie" | "tv"));
  const watchedDetails = (await Promise.all(detailRequests)).filter((d) => d !== null);

  const totalRuntimeMinutes = watchedDetails.reduce((acc, d) => acc + (d?.runtime || 110), 0);
  const totalWatched = watchedDetails.length;

  const genreCounts: Record<string, number> = {};
  watchedDetails.forEach((details) => {
    const uniqueGenres = new Set(details?.genres || []);
    uniqueGenres.forEach((genre) => {
      genreCounts[genre] = (genreCounts[genre] || 0) + 1;
    });
  });

  const topGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const GENRE_ICONS: Record<string, string> = {
    "Science Fiction": "🚀",
    "Sci-Fi & Fantasy": "🚀",
    "Action": "⚡",
    "Action & Adventure": "⚡",
    "Drama": "🎭",
    "Comedy": "🍿",
    "Thriller": "🔪",
    "Horror": "😱",
    "Romance": "💖",
    "Animation": "🎨",
    "Adventure": "🤠",
    "Fantasy": "🔮",
    "Crime": "🕵️",
    "Mystery": "🕵️",
    "History": "📜",
    "War": "📜",
    "Music": "🎵",
    "Family": "👨‍👩‍👧",
    "Documentary": "📹",
  };

  const genreStats = topGenres.map(([name, count]) => ({
    name,
    count,
    percentage: totalWatched > 0 ? Math.min(100, Math.round((count / totalWatched) * 100)) : 0,
    icon: GENRE_ICONS[name] || "🎬",
  }));

  return (
    <DashboardClient
      user={{
        id: session.user.id,
        name: session.user.name || "Director",
        username: session.user.username || "user",
        image: session.user.image,
      }}
      watched={watched}
      wishlist={wishlist}
      favorites={favorites}
      genreStats={genreStats}
      ratingCounts={ratingCounts}
      averageRating={averageRating}
      totalRuntimeMinutes={totalRuntimeMinutes}
    />
  );
}
