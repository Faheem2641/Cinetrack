import { notFound } from "next/navigation";
import { getMediaDetails } from "@/lib/tmdb";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import TrackingButtons from "@/components/TrackingButtons";
import ReviewForm from "@/components/ReviewForm";


interface TVShowDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function TVShowDetailPage({ params }: TVShowDetailPageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const show = await getMediaDetails(id, "tv");
  if (!show) {
    notFound();
  }

  const session = await auth();
  
  // Look up if user has logged this TV show
  let watchEntry = null;
  if (session?.user) {
    watchEntry = await prisma.watchEntry.findUnique({
      where: {
        userId_tmdbId_mediaType: {
          userId: session.user.id,
          tmdbId: id,
          mediaType: "tv",
        },
      },
    });
  }

  // Look up public reviews for this TV show
  const reviews = await prisma.review.findMany({
    where: {
      tmdbId: id,
      mediaType: "tv",
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

  const backdropUrl = show.backdropPath
    ? `https://image.tmdb.org/t/p/original${show.backdropPath}`
    : "";

  const posterUrl = show.posterPath
    ? `https://image.tmdb.org/t/p/w500${show.posterPath}`
    : `https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=500&auto=format&fit=crop&q=60`;

  // Parse trailer ID if exists
  let trailerEmbedId = null;
  if (show.trailerUrl) {
    const urlObj = new URL(show.trailerUrl);
    trailerEmbedId = urlObj.searchParams.get("v");
  }

  return (
    <div className="bg-[#0f1a1b] text-[#D3C3B9] flex-1 flex flex-col relative pb-20">
      {/* Hero Backdrop Banner */}
      {backdropUrl && (
        <div className="absolute top-0 left-0 right-0 h-[45vh] md:h-[60vh] overflow-hidden pointer-events-none select-none z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={backdropUrl}
            alt={show.title}
            className="w-full h-full object-cover opacity-20 filter blur-xs"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1a1b] via-[#0f1a1b]/80 to-transparent" />
        </div>
      )}

      {/* Main Details Section */}
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 pt-20 md:pt-36">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Poster & Activity Actions (Sidebar) */}
          <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
            <div className="rounded-2xl overflow-hidden border border-[#3D4D55]/40 shadow-2xl bg-[#0f1a1b] aspect-[2/3] relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={posterUrl}
                alt={show.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            {/* TMDb Score Card */}
            <div className="p-4 rounded-2xl bg-[#103334]/40 border border-[#3D4D55]/30 backdrop-blur-md flex items-center justify-between">
              <span className="text-xs font-bold text-[#A79E9C]">TMDb Score</span>
              <div className="flex items-center gap-1.5 bg-[#B58863]/10 border border-[#B58863]/20 px-3 py-1 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-[#B58863]">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-black text-[#B58863]">{show.voteAverage.toFixed(1)}</span>
              </div>
            </div>

            {/* Tracking Panel */}
            <div className="p-5 rounded-2xl bg-[#103334]/40 border border-[#3D4D55]/30 backdrop-blur-md flex flex-col gap-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-[#A79E9C] border-b border-[#3D4D55]/30 pb-2">Your Activity</h3>
              {session ? (
                <TrackingButtons
                  tmdbId={id}
                  mediaType="tv"
                  title={show.title}
                  posterPath={show.posterPath}
                  releaseDate={show.releaseDate}
                  initialWatchEntry={watchEntry}
                />
              ) : (
                <Link
                  href="/login"
                  className="text-xs font-semibold text-center py-2.5 rounded-xl bg-[#B58863]/10 border border-[#B58863]/20 text-[#B58863] hover:bg-[#B58863]/20 transition-all cursor-pointer"
                >
                  Sign in to track TV show
                </Link>
              )}
            </div>
          </div>

          {/* Right Column: Title, Overview, Cast, Trailer */}
          <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-8">
            {/* Header Content */}
            <div>
              <div className="flex flex-wrap items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest text-[#A79E9C] mb-3">
                <span className="bg-[#3D4D55]/30 border border-[#3D4D55]/40 px-2 py-0.5 rounded-full">{show.releaseDate.split("-")[0]}</span>
                <span>•</span>
                <span className="bg-[#3D4D55]/30 border border-[#3D4D55]/40 px-2 py-0.5 rounded-full">{show.runtime} Min / Episode</span>
                <span>•</span>
                <span className="bg-[#3D4D55]/30 text-[#A79E9C] border border-[#3D4D55]/50 px-2.5 py-0.5 rounded-full">
                  TV Show
                </span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#D3C3B9] via-[#D3C3B9] to-[#A79E9C] mb-3 leading-tight">
                {show.title}
              </h1>

              {show.tagline && (
                <p className="text-[#A79E9C] italic text-sm sm:text-base border-l-2 border-[#B58863]/40 pl-3.5 mb-5 py-0.5">
                  &quot;{show.tagline}&quot;
                </p>
              )}

              <div className="h-0.5 w-16 bg-gradient-to-r from-[#B58863] to-[#D3C3B9] rounded-full mb-6" />

              {/* Genres Tag Cloud */}
              {show.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {show.genres.map((genre) => (
                    <span
                      key={genre}
                      className="text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-[#103334]/60 border border-[#3D4D55]/40 text-[#A79E9C] backdrop-blur-sm hover:border-[#B58863]/30 hover:text-[#D3C3B9] transition-colors"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Overview Section */}
            <div className="p-6 rounded-2xl bg-[#103334]/30 border border-[#3D4D55]/25 backdrop-blur-xs">
              <h2 className="text-sm font-black uppercase tracking-widest text-[#A79E9C] mb-3.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B58863]" />
                Overview
              </h2>
              <p className="text-sm text-[#D3C3B9] leading-relaxed font-medium">
                {show.overview}
              </p>
            </div>

            {/* Cast Section */}
            {show.cast.length > 0 && (
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-[#A79E9C] mb-5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3D4D55]" />
                  Principal Cast
                </h2>
                <div className="flex gap-4 overflow-x-auto pb-4">
                  {show.cast.map((actor) => {
                    const profileUrl = actor.profilePath
                      ? `https://image.tmdb.org/t/p/w185${actor.profilePath}`
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(actor.name)}&background=103334&color=A79E9C&size=128&bold=true`;
                    return (
                      <a
                        key={actor.id}
                        href={`https://www.google.com/search?q=${encodeURIComponent(actor.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-[110px] shrink-0 flex flex-col text-center group cursor-pointer"
                      >
                        <div className="w-[85px] h-[85px] rounded-full overflow-hidden border border-[#3D4D55]/40 group-hover:border-[#B58863]/40 mx-auto bg-[#103334] aspect-square shadow transition-all duration-300 group-hover:scale-105">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={profileUrl} alt={actor.name} className="w-full h-full object-cover" />
                        </div>
                        <p className="text-[11px] font-extrabold text-[#D3C3B9] mt-2.5 line-clamp-1 group-hover:text-white transition-colors">{actor.name}</p>
                        <p className="text-[9px] text-[#A79E9C] font-medium line-clamp-1 mt-0.5">{actor.character}</p>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Video Trailer Section */}
            {trailerEmbedId && (
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-[#A79E9C] mb-5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B58863]" />
                  Watch Trailer
                </h2>
                <div className="aspect-video w-full max-w-3xl rounded-2xl overflow-hidden border border-[#3D4D55]/30 bg-[#0f1a1b] shadow-2xl">
                  <iframe
                    src={`https://www.youtube.com/embed/${trailerEmbedId}`}
                    title={`${show.title} Trailer`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Reviews Section */}
            <div className="max-w-3xl">
              <h2 className="text-sm font-black uppercase tracking-widest text-[#A79E9C] mb-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3D4D55]" />
                Reviews ({reviews.length})
              </h2>

              {session?.user && (
                <div className="mb-8">
                  <ReviewForm
                    tmdbId={id}
                    mediaType="tv"
                    title={show.title}
                    posterPath={show.posterPath}
                    initialRating={watchEntry?.rating}
                  />
                </div>
              )}

              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="p-5 bg-[#103334]/30 border border-[#3D4D55]/25 rounded-2xl hover:border-[#3D4D55]/50 transition-all duration-300">
                      <div className="flex items-center gap-3 mb-3.5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={rev.user.avatarUrl || "/avatar-placeholder.png"}
                          alt={rev.user.name || rev.user.username}
                          className="w-9 h-9 rounded-full border border-[#3D4D55]/40 object-cover"
                        />
                        <div>
                          <p className="text-xs font-black text-[#D3C3B9]">{rev.user.name}</p>
                          <p className="text-[10px] text-[#A79E9C] font-semibold">@{rev.user.username}</p>
                        </div>
                        {rev.rating && (
                          <span className="ml-auto text-[10px] font-black text-[#B58863] bg-[#B58863]/10 border border-[#B58863]/20 px-2 py-0.5 rounded-lg flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                            </svg>
                            {rev.rating.toFixed(1)} / 5.0
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-[#D3C3B9] leading-relaxed whitespace-pre-wrap font-medium">{rev.content}</p>
                      <p className="text-[9px] text-[#A79E9C] mt-3 font-semibold">
                        Posted on {new Date(rev.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs sm:text-sm text-[#A79E9C] italic py-6 pl-1">No reviews written for this TV show yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
