import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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

  // 2. Fetch authenticated user data from database
  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      followers: true,
      following: true,
    },
  });

  if (!dbUser) {
    redirect("/login");
  }

  const [watchedEntries, wishlistEntries, reviews] = await Promise.all([
    prisma.watchEntry.findMany({ where: { userId, isWatched: true } }),
    prisma.watchEntry.findMany({ where: { userId, isWishlist: true } }),
    prisma.review.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  // Compute metrics
  const filmsCount = watchedEntries.length;
  const followersCount = dbUser.followers.length;
  const followingCount = dbUser.following.length;

  // Compute dynamic taste profile (genres)
  const detailRequests = watchedEntries.slice(0, 10).map((w) => getMediaDetails(w.tmdbId, w.mediaType as "movie" | "tv"));
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

  // Create default posts for active user based on their reviews or fallbacks
  const mappedPosts = reviews.slice(0, 3).map((r, index) => ({
    id: `db-post-${r.id}`,
    content: `Just reviewed ${r.title}: "${r.content.slice(0, 100)}${r.content.length > 100 ? "..." : ""}"`,
    createdAt: `${index + 1} day${index > 0 ? "s" : ""} ago`,
    likesCount: Math.floor(Math.random() * 20),
    commentsCount: Math.floor(Math.random() * 5),
  }));

  const finalUser = {
    username: dbUser.username,
    name: dbUser.name || dbUser.username,
    avatarUrl: dbUser.avatarUrl,
    bio: dbUser.bio,
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
      <UserProfileClient isOwnProfile={true} user={finalUser} />
    </main>
  );
}
