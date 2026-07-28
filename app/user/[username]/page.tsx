import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getMediaDetails } from "@/lib/tmdb";
import { auth } from "@/lib/auth";
import UserProfileClient from "@/components/UserProfileClient";

export const revalidate = 0;

interface PublicProfilePageProps {
  params: Promise<{ username: string }>;
}

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
  const resolvedParams = await params;
  const username = resolvedParams.username.toLowerCase();
  const session = await auth();

  // Find user by username with follower relationships
  const profileUser = await prisma.user.findUnique({
    where: { username },
    include: {
      followers: true,
      following: true,
    },
  });

  if (!profileUser) {
    notFound();
  }

  const userId = profileUser.id;
  const isOwnProfile = session?.user?.id === userId;

  // Fetch user entries
  const [watched, wishlist, reviews] = await Promise.all([
    prisma.watchEntry.findMany({ where: { userId, isWatched: true } }),
    prisma.watchEntry.findMany({ where: { userId, isWishlist: true } }),
    prisma.review.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  // Compute metrics
  const filmsCount = watched.length;
  const followersCount = profileUser.followers.length;
  const followingCount = profileUser.following.length;

  // Compute dynamic taste profile (genres) across ALL watched entries
  const detailRequests = watched.map((w) => getMediaDetails(w.tmdbId, w.mediaType as "movie" | "tv"));
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
  const mappedWatched = watched.map((w) => ({
    id: w.tmdbId,
    title: w.title,
    posterPath: w.posterPath,
    releaseDate: w.releaseDate || "",
    mediaType: w.mediaType as "movie" | "tv",
    voteAverage: w.rating ? w.rating * 2.0 : 0.0,
  }));

  const mappedWatchlist = wishlist.map((w) => ({
    id: w.tmdbId,
    title: w.title,
    posterPath: w.posterPath,
    releaseDate: w.releaseDate || "",
    mediaType: w.mediaType as "movie" | "tv",
    voteAverage: w.rating ? w.rating * 2.0 : 0.0,
  }));

  const mappedReviews = reviews.map((r) => ({
    id: r.id,
    tmdbId: r.tmdbId,
    mediaType: r.mediaType as "movie" | "tv",
    title: r.title,
    posterPath: r.posterPath,
    content: r.content,
    rating: r.rating,
    createdAt: r.createdAt.toISOString(),
  }));

  const mappedPosts = reviews.slice(0, 3).map((r, index) => ({
    id: `db-post-${r.id}`,
    content: `Just reviewed ${r.title}: "${r.content.slice(0, 100)}${r.content.length > 100 ? "..." : ""}"`,
    createdAt: `${index + 1} day${index > 0 ? "s" : ""} ago`,
    likesCount: 0,
    commentsCount: 0,
  }));

  const finalUser = {
    username: profileUser.username,
    name: profileUser.name || profileUser.username,
    avatarUrl: profileUser.avatarUrl,
    bio: profileUser.bio,
    stats: {
      filmsCount,
      followingCount,
      followersCount,
    },
    tasteProfile: finalTasteProfile,
    watched: mappedWatched,
    watchlist: mappedWatchlist,
    reviews: mappedReviews,
    posts: mappedPosts,
  };

  return (
    <main className="pt-20 bg-[#0f1a1b] min-h-screen">
      <UserProfileClient isOwnProfile={isOwnProfile} user={finalUser} />
    </main>
  );
}
