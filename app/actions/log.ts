"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function toggleWatchStatus(
  tmdbId: string,
  mediaType: "movie" | "tv",
  title: string,
  posterPath: string | null,
  releaseDate: string | null,
  field: "isWatched" | "isWishlist" | "isCurrentlyWatching" | "isFavorite"
) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  const existing = await prisma.watchEntry.findUnique({
    where: {
      userId_tmdbId_mediaType: {
        userId,
        tmdbId,
        mediaType,
      },
    },
  });

  if (existing) {
    const currentValue = existing[field];
    const updateData: any = {
      [field]: !currentValue,
    };

    // If marking as watched, remove from wishlist/currently watching
    if (field === "isWatched" && !currentValue) {
      updateData.isWishlist = false;
      updateData.isCurrentlyWatching = false;
    }
    // If marking as wishlist or currently watching, remove from watched
    if ((field === "isWishlist" || field === "isCurrentlyWatching") && !currentValue) {
      updateData.isWatched = false;
    }

    await prisma.watchEntry.update({
      where: { id: existing.id },
      data: updateData,
    });
  } else {
    const createData: any = {
      userId,
      tmdbId,
      mediaType,
      title,
      posterPath,
      releaseDate,
      isWatched: field === "isWatched",
      isWishlist: field === "isWishlist",
      isCurrentlyWatching: field === "isCurrentlyWatching",
      isFavorite: field === "isFavorite",
    };
    await prisma.watchEntry.create({
      data: createData,
    });
  }

  revalidatePath(`/${mediaType === "movie" ? "movies" : "tv"}/${tmdbId}`);
  revalidatePath(`/dashboard`);
  revalidatePath(`/user/${session.user.username}`);
}

export async function updateMediaRating(
  tmdbId: string,
  mediaType: "movie" | "tv",
  title: string,
  posterPath: string | null,
  releaseDate: string | null,
  rating: number | null // null or 0.5 to 5.0
) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  const existing = await prisma.watchEntry.findUnique({
    where: {
      userId_tmdbId_mediaType: {
        userId,
        tmdbId,
        mediaType,
      },
    },
  });

  if (existing) {
    await prisma.watchEntry.update({
      where: { id: existing.id },
      data: {
        rating,
        // Rating implicitly marks it as watched, removes from wishlist
        isWatched: rating !== null ? true : existing.isWatched,
        isWishlist: rating !== null ? false : existing.isWishlist,
        isCurrentlyWatching: rating !== null ? false : existing.isCurrentlyWatching,
      },
    });
  } else {
    await prisma.watchEntry.create({
      data: {
        userId,
        tmdbId,
        mediaType,
        title,
        posterPath,
        releaseDate,
        rating,
        isWatched: rating !== null,
      },
    });
  }

  revalidatePath(`/${mediaType === "movie" ? "movies" : "tv"}/${tmdbId}`);
  revalidatePath(`/dashboard`);
  revalidatePath(`/user/${session.user.username}`);
}
