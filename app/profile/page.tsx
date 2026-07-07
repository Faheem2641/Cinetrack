import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getMediaDetails } from "@/lib/tmdb";
import UserProfileClient from "@/components/UserProfileClient";

export const revalidate = 0;

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ mockOwner?: string }>;
}) {
  const resolvedParams = await searchParams;
  const mockOwner = resolvedParams.mockOwner === "true";
  const session = await auth();

  // 1. Fallback Mock User Data (Alfikri Djati Mock Profile)
  const mockUser = {
    username: "alfikridjati",
    name: "Alfikri Djati",
    avatarUrl: "/profile_avatar.png",
    bio: "Filmmaker, critic, and traveler. Finding beauty in the details of the frame.",
    stats: {
      filmsCount: 247,
      followingCount: 38,
      followersCount: 112,
    },
    tasteProfile: [
      { icon: "🚀", name: "Sci-Fi", percentage: 82, color: "bg-red-600 shadow-red-500/20" },
      { icon: "🎭", name: "Drama", percentage: 31, color: "bg-blue-600 shadow-blue-500/20" },
      { icon: "🍿", name: "Comedy", percentage: 12, color: "bg-amber-600 shadow-amber-500/20" },
    ],
    watched: [
      {
        id: "76600",
        title: "Avatar: The Way of Water",
        posterPath: "/628Dep61rQbi2tXJHQ65q3g6TA5.jpg",
        releaseDate: "2022-12-14",
        mediaType: "movie" as const,
        voteAverage: 9.2,
      },
      {
        id: "27205",
        title: "Inception",
        posterPath: "/o062xtYJm5AdzfsEs4tFa47TuRL.jpg",
        releaseDate: "2010-07-15",
        mediaType: "movie" as const,
        voteAverage: 8.4,
      },
      {
        id: "4607",
        title: "Lost",
        posterPath: "/wOS5fRSpX5zVd287n95G0tL3ZkZ.jpg",
        releaseDate: "2004-09-22",
        mediaType: "tv" as const,
        voteAverage: 7.9,
      },
      {
        id: "157336",
        title: "Interstellar",
        posterPath: "/gEU2QvHOm52Yv0tprYhp3v2v1gY.jpg",
        releaseDate: "2014-11-05",
        mediaType: "movie" as const,
        voteAverage: 8.5,
      },
      {
        id: "155",
        title: "The Dark Knight",
        posterPath: "/qJ2tWGB2XclmAEc97aIsG24GEtY.jpg",
        releaseDate: "2008-07-16",
        mediaType: "movie" as const,
        voteAverage: 9.0,
      },
      {
        id: "66732",
        title: "Stranger Things",
        posterPath: "/49ySR4GfyvtaTY0qXn6c6bJ403B.jpg",
        releaseDate: "2016-07-15",
        mediaType: "tv" as const,
        voteAverage: 8.6,
      },
    ],
    watchlist: [
      {
        id: "823464",
        title: "Dune: Part Two",
        posterPath: "/8uO0gUM8wNqQL5eZIr2Z4n6zypb.jpg",
        releaseDate: "2024-02-27",
        mediaType: "movie" as const,
        voteAverage: 8.3,
      },
      {
        id: "872585",
        title: "Oppenheimer",
        posterPath: "/8Gxv2jgaarwQd4lo5n0q151vzbU.jpg",
        releaseDate: "2023-07-19",
        mediaType: "movie" as const,
        voteAverage: 8.1,
      },
      {
        id: "335984",
        title: "Blade Runner 2049",
        posterPath: "/gacQA1sTV96bgq2491w2309fOEZ.jpg",
        releaseDate: "2017-10-04",
        mediaType: "movie" as const,
        voteAverage: 7.5,
      },
    ],
    posts: [
      {
        id: "p1",
        content: "Cinema is a matter of what's in the frame and what's out. Just finished compiling my Top 50 sci-fi films of the decade!",
        createdAt: "2 days ago",
        likesCount: 42,
        commentsCount: 7,
      },
      {
        id: "p2",
        content: "Avatar: The Way of Water remains one of the most stunning theatrical experiences of recent times. Jim Cameron knows how to construct pure spectacle.",
        createdAt: "1 week ago",
        likesCount: 29,
        commentsCount: 3,
      },
      {
        id: "p3",
        content: "Rewatching the Lost pilot. Absolutely timeless television pacing. Still holds up perfectly.",
        createdAt: "3 weeks ago",
        likesCount: 18,
        commentsCount: 2,
      },
    ],
    reviews: [
      {
        id: "r1",
        tmdbId: "27205",
        mediaType: "movie" as const,
        title: "Inception",
        posterPath: "/o062xtYJm5AdzfsEs4tFa47TuRL.jpg",
        content: "A masterclass in original sci-fi storytelling. Nolan builds a complex multi-layered heist that remains emotionally grounded throughout. The editing and sound design are simply breathtaking.",
        rating: 5.0,
        createdAt: "2026-06-10T12:00:00.000Z",
      },
      {
        id: "r2",
        tmdbId: "157336",
        mediaType: "movie" as const,
        title: "Interstellar",
        posterPath: "/gEU2QvHOm52Yv0tprYhp3v2v1gY.jpg",
        content: "An ambitious, visually stunning space odyssey with an incredible emotional heart. The relationship between Cooper and Murph anchors the sweeping sci-fi concepts beautifully.",
        rating: 4.5,
        createdAt: "2026-05-24T12:00:00.000Z",
      },
    ],
  };

  if (!session?.user?.id) {
    // If guest / offline, render the mock profile page
    return (
      <main className="pt-20 bg-[#0f1a1b] min-h-screen">
        {mockOwner && (
          <div className="bg-[#B58863]/10 border-b border-[#B58863]/30 py-2.5 px-4 text-center text-xs font-mono text-[#d4a87c] select-none flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B58863] animate-pulse" />
            <span>✦ DATABASE OFFLINE: PREVIEWING MOCK ACCOUNT AS OWNER</span>
          </div>
        )}
        <UserProfileClient isOwnProfile={mockOwner} user={mockUser} />
      </main>
    );
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
    return (
      <main className="pt-20 bg-[#0f1a1b] min-h-screen">
        <UserProfileClient isOwnProfile={false} user={mockUser} />
      </main>
    );
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

  // Default fallback for taste profile if user has no watches logged
  const finalTasteProfile = tasteProfile.length > 0 ? tasteProfile : mockUser.tasteProfile;

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
    watched: mappedWatched.length > 0 ? mappedWatched : mockUser.watched,
    watchlist: mappedWatchlist.length > 0 ? mappedWatchlist : mockUser.watchlist,
    reviews: mappedReviews.length > 0 ? mappedReviews : mockUser.reviews,
    posts: mappedPosts.length > 0 ? mappedPosts : mockUser.posts,
  };

  return (
    <main className="pt-20 bg-[#0f1a1b] min-h-screen">
      <UserProfileClient isOwnProfile={true} user={finalUser} />
    </main>
  );
}
