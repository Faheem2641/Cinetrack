import { notFound } from "next/navigation";
import { getMediaDetails } from "@/lib/tmdb";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import TrackingButtons from "@/components/TrackingButtons";
import ReviewForm from "@/components/ReviewForm";


interface MovieDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function MovieDetailPage({ params }: MovieDetailPageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const movie = await getMediaDetails(id, "movie");
  if (!movie) {
    notFound();
  }

  const session = await auth();
  
  // Look up if user has logged this movie
  let watchEntry = null;
  if (session?.user) {
    watchEntry = await prisma.watchEntry.findUnique({
      where: {
        userId_tmdbId_mediaType: {
          userId: session.user.id,
          tmdbId: id,
          mediaType: "movie",
        },
      },
    });
  }

  // Look up public reviews for this movie
  const reviews = await prisma.review.findMany({
    where: {
      tmdbId: id,
      mediaType: "movie",
    },
    include: {
      user: {
        select: {
          username: true,
          name: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const backdropUrl = movie.backdropPath
    ? `https://image.tmdb.org/t/p/original${movie.backdropPath}`
    : "";

  const posterUrl = movie.posterPath
    ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
    : `https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=500&auto=format&fit=crop&q=60`;

  // Parse trailer ID if exists
  let trailerEmbedId = null;
  if (movie.trailerUrl) {
    const urlObj = new URL(movie.trailerUrl);
    trailerEmbedId = urlObj.searchParams.get("v");
  }

  return (
    <div className="bg-[#09090b] text-zinc-100 flex-1 flex flex-col relative pb-20">
      {/* Hero Backdrop Banner */}
      {backdropUrl && (
        <div className="absolute top-0 left-0 right-0 h-[45vh] md:h-[60vh] overflow-hidden pointer-events-none select-none z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={backdropUrl}
            alt={movie.title}
            className="w-full h-full object-cover opacity-20 filter blur-xs"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/80 to-transparent" />
        </div>
      )}

      {/* Main Details Section */}
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 pt-20 md:pt-36">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Poster Column */}
          <div className="w-full max-w-[280px] mx-auto md:mx-0 shrink-0">
            <div className="rounded-2xl overflow-hidden border border-zinc-800/80 shadow-2xl bg-zinc-950 aspect-[2/3]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={posterUrl} alt={movie.title} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Details Content Column */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>{movie.releaseDate.split("-")[0]}</span>
              <span>•</span>
              <span>{movie.runtime} Min</span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
                Movie
              </span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl mb-2">
              {movie.title}
            </h1>
            {movie.tagline && (
              <p className="text-zinc-400 italic text-sm md:text-base mb-6">"{movie.tagline}"</p>
            )}

            {/* Quick Ratings & User Logs controls placeholder */}
            <div className="flex flex-wrap items-center gap-4 py-4 px-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-md mb-8">
              <div className="flex items-center gap-2 pr-4 border-r border-zinc-800/80">
                <span className="text-sm font-semibold text-zinc-400">TMDb:</span>
                <span className="text-base font-extrabold text-white flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-amber-500">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                  </svg>
                  {movie.voteAverage.toFixed(1)}
                </span>
              </div>

              {/* Status Action Buttons (Task 5) */}
              <div className="flex items-center gap-2 flex-wrap text-zinc-300 w-full">
                {session ? (
                  <TrackingButtons
                    tmdbId={id}
                    mediaType="movie"
                    title={movie.title}
                    posterPath={movie.posterPath}
                    releaseDate={movie.releaseDate}
                    initialWatchEntry={watchEntry}
                  />
                ) : (
                  <Link href="/login" className="text-xs font-semibold text-indigo-400 hover:underline">
                    Sign in to track, rate &amp; review this movie
                  </Link>
                )}
              </div>
            </div>

            {/* Overview */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-white mb-3">Overview</h2>
              <p className="text-sm text-zinc-300 leading-relaxed max-w-3xl">{movie.overview}</p>
            </div>

            {/* Genres */}
            {movie.genres.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                  Genres
                </h3>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre}
                      className="text-xs px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cast Section */}
        {movie.cast.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-extrabold tracking-tight text-white mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 rounded bg-indigo-500" />
              Principal Cast
            </h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
              {movie.cast.map((actor) => {
                const profileUrl = actor.profilePath
                  ? `https://image.tmdb.org/t/p/w185${actor.profilePath}`
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(actor.name)}&background=18181b&color=a1a1aa&size=128&bold=true`;
                return (
                  <div key={actor.id} className="w-[120px] shrink-0 flex flex-col text-center">
                    <div className="w-[100px] h-[100px] rounded-full overflow-hidden border border-zinc-800/80 mx-auto bg-zinc-900 aspect-square">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={profileUrl} alt={actor.name} className="w-full h-full object-cover" />
                    </div>
                    <p className="text-xs font-bold text-zinc-200 mt-3 line-clamp-1">{actor.name}</p>
                    <p className="text-[10px] text-zinc-500 line-clamp-1 mt-0.5">{actor.character}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Video Trailer Section */}
        {trailerEmbedId && (
          <div className="mt-16">
            <h2 className="text-xl font-extrabold tracking-tight text-white mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 rounded bg-red-500" />
              Watch Trailer
            </h2>
            <div className="aspect-video w-full max-w-4xl mx-auto rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-2xl">
              <iframe
                src={`https://www.youtube.com/embed/${trailerEmbedId}`}
                title={`${movie.title} Trailer`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Reviews Section */}
        <div className="mt-16 max-w-4xl">
          <h2 className="text-xl font-extrabold tracking-tight text-white mb-6 flex items-center gap-2">
            <span className="w-1.5 h-6 rounded bg-blue-500" />
            Reviews ({reviews.length})
          </h2>

          {session?.user && (
            <div className="mb-10">
              <ReviewForm
                tmdbId={id}
                mediaType="movie"
                title={movie.title}
                posterPath={movie.posterPath}
                initialRating={watchEntry?.rating}
              />
            </div>
          )}

          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-6 bg-zinc-900/30 border border-zinc-800/80 rounded-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={rev.user.avatarUrl || "/avatar-placeholder.png"}
                      alt={rev.user.name || rev.user.username}
                      className="w-10 h-10 rounded-full border border-zinc-800 object-cover"
                    />
                    <div>
                      <p className="text-sm font-bold text-zinc-200">{rev.user.name}</p>
                      <p className="text-xs text-zinc-500">@{rev.user.username}</p>
                    </div>
                    {rev.rating && (
                      <span className="ml-auto text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                        </svg>
                        {rev.rating.toFixed(1)} / 5.0
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{rev.content}</p>
                  <p className="text-[10px] text-zinc-500 mt-4">
                    Posted on {new Date(rev.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500 italic py-6">No reviews written for this movie yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
