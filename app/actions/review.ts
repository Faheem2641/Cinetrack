"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createReview(
  tmdbId: string,
  mediaType: "movie" | "tv",
  title: string,
  posterPath: string | null,
  content: string,
  rating: number | null
) {
  const session = await auth();
  if (!session?.user) {
    return { error: "You must be signed in to write a review." };
  }

  const userId = session.user.id;

  if (!content || content.trim().length === 0) {
    return { error: "Review content cannot be empty." };
  }

  try {
    // 1. Create the review
    await prisma.review.create({
      data: {
        userId,
        tmdbId,
        mediaType,
        title,
        posterPath,
        content: content.trim(),
        rating,
      },
    });

    // 2. Implicitly mark as watched
    const existingEntry = await prisma.watchEntry.findUnique({
      where: {
        userId_tmdbId_mediaType: {
          userId,
          tmdbId,
          mediaType,
        },
      },
    });

    if (existingEntry) {
      await prisma.watchEntry.update({
        where: { id: existingEntry.id },
        data: {
          isWatched: true,
          isWishlist: false,
          isCurrentlyWatching: false,
          rating: rating !== null ? rating : existingEntry.rating,
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
          isWatched: true,
          rating,
        },
      });
    }

    revalidatePath(`/${mediaType === "movie" ? "movies" : "tv"}/${tmdbId}`);
    revalidatePath(`/dashboard`);
    revalidatePath(`/user/${session.user.username}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to create review:", error);
    return { error: "Failed to save review. Please try again." };
  }
}
