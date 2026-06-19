const { PrismaClient } = require("@prisma/client");
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
const crypto = require("crypto");

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

async function main() {
  console.log("Seeding database...");

  // Clean up existing data in order of dependency
  await prisma.follow.deleteMany({});
  await prisma.customListItem.deleteMany({});
  await prisma.customList.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.reviewLike.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.watchEntry.deleteMany({});
  await prisma.user.deleteMany({});

  const passwordHash = hashPassword("password123");

  // Create Users
  const alice = await prisma.user.create({
    data: {
      username: "alice",
      email: "alice@example.com",
      passwordHash,
      name: "Alice Vance",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      bio: "Movie lover, Nolan fan, part-time critic.",
    },
  });

  const bob = await prisma.user.create({
    data: {
      username: "bob",
      email: "bob@example.com",
      passwordHash,
      name: "Bob Smith",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
      bio: "TV shows are my life. Let's discuss spoilers.",
    },
  });

  const charlie = await prisma.user.create({
    data: {
      username: "charlie",
      email: "charlie@example.com",
      passwordHash,
      name: "Charlie Brown",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
      bio: "Just looking for good recommendations.",
    },
  });

  console.log("Users created successfully!");

  // Create Watch Entries
  await prisma.watchEntry.createMany({
    data: [
      {
        userId: alice.id,
        tmdbId: "27205",
        mediaType: "movie",
        title: "Inception",
        posterPath: "/o062xtYJm5AdzfsEs4tFa47TuRL.jpg",
        releaseDate: "2010-07-15",
        isWatched: true,
        isFavorite: true,
        rating: 5.0,
      },
      {
        userId: alice.id,
        tmdbId: "157336",
        mediaType: "movie",
        title: "Interstellar",
        posterPath: "/gEU2QvHOm52Yv0tprYhp3v2v1gY.jpg",
        releaseDate: "2014-11-05",
        isWatched: true,
        rating: 4.5,
      },
      {
        userId: alice.id,
        tmdbId: "155",
        mediaType: "movie",
        title: "The Dark Knight",
        posterPath: "/qJ2tWGB2XclmAEc97aIsG24GEtY.jpg",
        releaseDate: "2008-07-16",
        isWishlist: true,
      },
      {
        userId: alice.id,
        tmdbId: "66732",
        mediaType: "tv",
        title: "Stranger Things",
        posterPath: "/49ySR4GfyvtaTY0qXn6c6bJ403B.jpg",
        releaseDate: "2016-07-15",
        isCurrentlyWatching: true,
      },
      {
        userId: bob.id,
        tmdbId: "27205",
        mediaType: "movie",
        title: "Inception",
        posterPath: "/o062xtYJm5AdzfsEs4tFa47TuRL.jpg",
        releaseDate: "2010-07-15",
        isWatched: true,
        rating: 4.0,
      },
    ],
  });

  // Create a Review for Inception by Alice
  const inceptionReview = await prisma.review.create({
    data: {
      userId: alice.id,
      tmdbId: "27205",
      mediaType: "movie",
      title: "Inception",
      posterPath: "/o062xtYJm5AdzfsEs4tFa47TuRL.jpg",
      content: "Absolutely mind-bending! Christopher Nolan is a genius. The dream layers, the Hans Zimmer soundtrack, and the emotional core of Cobb trying to get back to his kids make this a timeless masterpiece.",
      rating: 5.0,
    },
  });

  // Bob likes the review
  await prisma.reviewLike.create({
    data: {
      userId: bob.id,
      reviewId: inceptionReview.id,
    },
  });

  // Bob comments on the review
  await prisma.comment.create({
    data: {
      userId: bob.id,
      reviewId: inceptionReview.id,
      content: "Completely agree about Hans Zimmer! The track 'Time' still gives me chills every single time.",
    },
  });

  // Create Custom List
  const nolanList = await prisma.customList.create({
    data: {
      userId: alice.id,
      name: "Nolan Masterpieces",
      description: "Ranking the films of Christopher Nolan from best to absolute best.",
      isPublic: true,
    },
  });

  await prisma.customListItem.createMany({
    data: [
      {
        listId: nolanList.id,
        tmdbId: "27205",
        mediaType: "movie",
        title: "Inception",
        posterPath: "/o062xtYJm5AdzfsEs4tFa47TuRL.jpg",
      },
      {
        listId: nolanList.id,
        tmdbId: "157336",
        mediaType: "movie",
        title: "Interstellar",
        posterPath: "/gEU2QvHOm52Yv0tprYhp3v2v1gY.jpg",
      },
      {
        listId: nolanList.id,
        tmdbId: "155",
        mediaType: "movie",
        title: "The Dark Knight",
        posterPath: "/qJ2tWGB2XclmAEc97aIsG24GEtY.jpg",
      },
    ],
  });

  // Set up follows
  await prisma.follow.create({
    data: {
      followerId: alice.id,
      followingId: bob.id,
    },
  });

  await prisma.follow.create({
    data: {
      followerId: bob.id,
      followingId: alice.id,
    },
  });

  console.log("Seeding database complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
