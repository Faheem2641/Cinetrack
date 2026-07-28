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

  // Compute dynamic taste profile (genres)
  const detailRequests = watched.slice(0, 10).map((w) => getMediaDetails(w.tmdbId, w.mediaType as "movie" | "tv"));
  const watchedDetails = (await Promise.all(detailRequests)).filter((d) => d !== null);

  const genreCounts: Record<string, number> = {};
  let totalGenreHits = 0;
  watchedDetails.forEach((details) => {
    details?.genres.forEach((genre) => {
      genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      totalGenreHits++;
    });
  });

  const topGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const colors = ["bg-gradient-to-r from-[#B58863] to-[#d4a87c]", "bg-[#3D4D55]", "bg-[#A79E9C]/60"];
  const icons = ["🚀", "🎭", "🍿"];

  const tasteProfile = topGenres.map(([name, count], index) => ({
    icon: icons[index] || "🎬",
    name,
    percentage: totalGenreHits > 0 ? Math.round((count / totalGenreHits) * 100) : 0,
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
