import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPopularMedia, getTopRatedMedia } from "@/lib/tmdb";
import RecommendClient from "@/components/RecommendClient";
import type { MediaItem } from "@/lib/tmdb";

export const metadata = {
  title: "Match Finder | Cinetrack",
  description:
    "Get intelligent movie and TV show recommendations tailored to your taste. Pick genres, and we'll suggest titles you haven't seen yet.",
};

export default async function RecommendPage() {
  const session = await auth();
  const userId = session?.user?.id ?? null;

  // Fetch the user's watch history so we can exclude already-seen titles
  let watchedIds: Set<string> = new Set();
  if (userId) {
    const entries = await prisma.watchEntry.findMany({
      where: { userId, isWatched: true },
      select: { tmdbId: true, mediaType: true },
    });
    entries.forEach((e) => watchedIds.add(`${e.mediaType}:${e.tmdbId}`));
  }

  // Pre-load a broad catalog (popular + top-rated for movies and TV)
  // The client component will do genre-based filtering from this pool
  const [popularMovies, popularTV, topMovies, topTV] = await Promise.all([
    getPopularMedia("movie"),
    getPopularMedia("tv"),
    getTopRatedMedia("movie"),
    getTopRatedMedia("tv"),
  ]);

  // Merge and de-duplicate
  const allMedia = dedup([...popularMovies, ...popularTV, ...topMovies, ...topTV]);

  return (
    <RecommendClient
      inventory={allMedia}
      watchedIds={Array.from(watchedIds)}
      isLoggedIn={!!userId}
    />
  );
}

function dedup(items: MediaItem[]): MediaItem[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = `${item.mediaType}:${item.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
