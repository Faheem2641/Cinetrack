import { auth } from "@/lib/auth";
import { prisma, dbQuery } from "@/lib/prisma";
import { getMediaDetails } from "@/lib/tmdb";
import UserProfileClient from "@/components/UserProfileClient";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  // Fetch authenticated user data from database with retry handling
  const dbUser = await dbQuery(() =>
    prisma.user.findUnique({
      where: { id: userId },
    })
  );

  if (!dbUser) {
    redirect("/login");
  }

  const [watchedEntries, wishlistEntries] = await dbQuery(() =>
    Promise.all([
      prisma.watchEntry.findMany({ where: { userId, isWatched: true } }),
      prisma.watchEntry.findMany({ where: { userId, isWishlist: true } }),
    ])
  );

  // Compute metrics
  const filmsCount = watchedEntries.length;

  // Compute dynamic taste profile (genres) across ALL watched entries
  const detailRequests = watchedEntries.map((w) => getMediaDetails(w.tmdbId, w.mediaType as "movie" | "tv"));
  const watchedDetails = (await Promise.all(detailRequests)).filter((d) => d !== null);

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
    .slice(0, 3);

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

  const colors = ["bg-gradient-to-r from-[#B58863] to-[#d4a87c]", "bg-[#3D4D55]", "bg-[#A79E9C]/60"];

  const tasteProfile = topGenres.map(([name, count], index) => ({
    icon: GENRE_ICONS[name] || "🎬",
    name,
    percentage: totalWatched > 0 ? Math.min(100, Math.round((count / totalWatched) * 100)) : 0,
    color: colors[index] || "bg-[#3D4D55]",
  }));

  const finalTasteProfile = tasteProfile;

  // Map database elements to Client component structure
  const mappedWatched = watchedEntries.map((w) => ({
    id: w.tmdbId,
    title: w.title,
    posterPath: w.posterPath,
    releaseDate: w.releaseDate || "",
    mediaType: w.mediaType as "movie" | "tv",
    voteAverage: w.rating ? w.rating * 2.0 : 0.0, // rating is 0.5-5.0 in db, convert to 0-10 scale
  }));

  const mappedWatchlist = wishlistEntries.map((w) => ({
    id: w.tmdbId,
    title: w.title,
    posterPath: w.posterPath,
    releaseDate: w.releaseDate || "",
    mediaType: w.mediaType as "movie" | "tv",
    voteAverage: w.rating ? w.rating * 2.0 : 0.0,
  }));

  const finalUser = {
    username: dbUser.username,
    name: dbUser.name || dbUser.username,
    avatarUrl: dbUser.avatarUrl,
    bio: dbUser.bio,
    stats: {
      filmsCount,
      followingCount: 0,
      followersCount: 0,
    },
    tasteProfile: finalTasteProfile,
    watched: mappedWatched,
    watchlist: mappedWatchlist,
    reviews: [],
    posts: [],
  };

  return (
    <main className="pt-20 bg-[#0f1a1b] min-h-screen">
      <UserProfileClient isOwnProfile={true} user={finalUser} />
    </main>
  );
}
