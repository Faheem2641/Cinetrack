import Link from "next/link";
import { getPopularMedia, getTopRatedMedia, getPersonMovies, getPersonDetails } from "@/lib/tmdb";
import MediaCard from "@/components/MediaCard";
import { auth } from "@/lib/auth";
import { prisma, dbQuery } from "@/lib/prisma";
import HeroSpotlight from "@/components/HeroSpotlight";
import MediaCarousel from "@/components/MediaCarousel";
import FilmstripDivider from "@/components/FilmstripDivider";
import OpticalSoundtrackDivider from "@/components/OpticalSoundtrackDivider";



// Static mock reviews fallback in case SQLite DB is fresh/empty
const FALLBACK_REVIEWS = [
  {
    id: "fb-rev-1",
    title: "Interstellar",
    posterPath: "/gEU2QvHOm52Yv0tprYhp3v2v1gY.jpg",
    content: "Mankind was born on Earth, but it was never meant to die here. Zimmer's score is transcendental, and the visual execution of the wormhole and Gargantua is mind-blowing. An emotional sci-fi masterpiece that is best experienced on the biggest screen possible.",
    rating: 5.0,
    mediaType: "movie",
    tmdbId: "157336",
    user: {
      name: "Alice Vance",
      username: "alice",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
    }
  },
  {
    id: "fb-rev-2",
    title: "Inception",
    posterPath: "/o062xtYJm5AdzfsEs4tFa47TuRL.jpg",
    content: "Absolutely mind-bending! Christopher Nolan is a genius. The dream layers, the Hans Zimmer soundtrack, and the emotional core of Cobb trying to get back to his kids make this a timeless masterpiece.",
    rating: 4.5,
    mediaType: "movie",
    tmdbId: "27205",
    user: {
      name: "Bob Smith",
      username: "bob",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"
    }
  }
];

// Static mock lists fallback in case SQLite DB is fresh/empty
const FALLBACK_LISTS = [
  {
    id: "fb-list-1",
    name: "Nolan Masterpieces",
    description: "Ranking the mind-bending films of Christopher Nolan from best to absolute best.",
    user: { name: "Alice Vance", username: "alice" },
    items: [
      { posterPath: "/o062xtYJm5AdzfsEs4tFa47TuRL.jpg", title: "Inception", mediaType: "movie", tmdbId: "27205" },
      { posterPath: "/gEU2QvHOm52Yv0tprYhp3v2v1gY.jpg", title: "Interstellar", mediaType: "movie", tmdbId: "157336" },
      { posterPath: "/qJ2tWGB2XclmAEc97aIsG24GEtY.jpg", title: "The Dark Knight", mediaType: "movie", tmdbId: "155" }
    ]
  },
  {
    id: "fb-list-2",
    name: "Sci-Fi Nostalgia",
    description: "Atmospheric, retro-future television series and movies that define the aesthetic.",
    user: { name: "Bob Smith", username: "bob" },
    items: [
      { posterPath: "/49ySR4GfyvtaTY0qXn6c6bJ403B.jpg", title: "Stranger Things", mediaType: "tv", tmdbId: "66732" },
      { posterPath: "/f89U3wzqrjVnHwb9Y9OMhk0e2jC.jpg", title: "The Matrix", mediaType: "movie", tmdbId: "603" }
    ]
  }
];

export const revalidate = 3600; // Revalidate the page hourly to rotate the greats

// A large pool of legendary directors, actors, and actresses
const ALL_CINEMA_ICONS = [
  { id: 525,   role: "Director", label: "DIRECTOR" },    // Christopher Nolan
  { id: 1032,  role: "Director", label: "DIRECTOR" },    // Martin Scorsese
  { id: 488,   role: "Director", label: "DIRECTOR" },    // Steven Spielberg
  { id: 138,   role: "Director", label: "DIRECTOR" },    // Stanley Kubrick
  { id: 5655,  role: "Director", label: "DIRECTOR" },    // Quentin Tarantino
  { id: 10882, role: "Director", label: "DIRECTOR" },    // Ridley Scott
  { id: 6193,  role: "Actor",    label: "ACTOR" },       // Leonardo DiCaprio
  { id: 5064,  role: "Actress",  label: "ACTRESS" },     // Meryl Streep
  { id: 5292,  role: "Actor",    label: "ACTOR" },       // Denzel Washington
  { id: 3896,  role: "Actor",    label: "ACTOR" },       // Tom Hanks
  { id: 1158,  role: "Actor",    label: "ACTOR" },       // Al Pacino
  { id: 8891,  role: "Actress",  label: "ACTRESS" },     // Cate Blanchett
  { id: 287,   role: "Actor",    label: "ACTOR" },       // Brad Pitt
  { id: 1243,  role: "Actor",    label: "ACTOR" },       // Robert De Niro
];

// Determine a deterministic subset of 6 icons based on the current day of the year
function getCinemaIconsForToday() {
  const today = new Date();
  const start = new Date(today.getFullYear(), 0, 0);
  const diff = today.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  const selected: typeof ALL_CINEMA_ICONS = [];
  const poolSize = ALL_CINEMA_ICONS.length;

  for (let i = 0; i < 6; i++) {
    // Offset index based on day of year to rotate the pool
    const index = (dayOfYear + i * 2) % poolSize;
    selected.push(ALL_CINEMA_ICONS[index]);
  }

  // Deduplicate items just in case
  const unique = Array.from(new Set(selected.map((s) => s.id)))
    .map((id) => selected.find((s) => s.id === id)!);

  return unique.slice(0, 6);
}

export default async function Home() {
  const session = await auth();
  const cinemaIcons = getCinemaIconsForToday();


  // 1. Fetch TMDB lists
  const popularMovies = await getPopularMedia("movie");
  const popularTV = await getPopularMedia("tv");
  const topRatedMovies = await getTopRatedMedia("movie");
  const topRatedTV = await getTopRatedMedia("tv");

  // 2. Fetch Icons of Cinema data in parallel
  const iconsData = await Promise.all(
    cinemaIcons.map(async (icon) => {
      const [profile, films] = await Promise.all([
        getPersonDetails(icon.id),
        getPersonMovies(icon.id, 10),
      ]);
      return { ...icon, profile, films };
    })
  );

  // 3. Fetch database community content
  let dbReviews: any[] = [];
  let dbLists: any[] = [];

  try {
    dbReviews = await dbQuery(() =>
      prisma.review.findMany({
        take: 2,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { name: true, username: true, avatarUrl: true }
          }
        }
      })
    );

    dbLists = await dbQuery(() =>
      prisma.customList.findMany({
        take: 2,
        where: { isPublic: true },
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: { name: true, username: true }
          },
          items: {
            take: 3
          }
        }
      })
    );
  } catch (error) {
    // Quietly fallback to static reviews/lists if connection is transiently unreachable
  }

  // Gracefully fallback if databases are unseeded
  const reviews = (dbReviews.length > 0 ? dbReviews : FALLBACK_REVIEWS).slice(0, 2);
  const lists = (dbLists.length > 0 ? dbLists : FALLBACK_LISTS).slice(0, 2);

  return (
    <div className="relative flex flex-col flex-grow bg-[#0f1a1b] overflow-hidden">
      {/* Cinematic Celluloid Film Grain Overlay */}
      <div className="film-grain" />

      {/* 1. Cinematic Hero Spotlight Slider */}
      <HeroSpotlight items={popularMovies} />

      <FilmstripDivider
        bgClass="bg-[#122123]"
        aboveColor="text-[#0f1a1b]"
        belowColor="text-[#0a1214]"
        reelLabel="REEL_01 // INT. SPOTLIGHT"
      />

      {/* 2. Icons of Cinema – editorial 2-col grid */}
      <section className="relative bg-[#0a1214] py-24 z-10">
        <div className="mx-auto w-full max-w-[98%] px-2 sm:px-4 lg:px-6">

          {/* Section Header — minimal, left-aligned */}
          <div className="mb-16 flex items-end justify-between">
            <div>
              <p className="font-mono text-[9px] tracking-[0.3em] text-[#B58863]/70 uppercase mb-3">
                Icons of Cinema
              </p>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-none">
                The Greats.
              </h2>
            </div>
            <span className="hidden md:block font-mono text-[8px] tracking-widest text-white/10 uppercase select-none">
              live · tmdb
            </span>
          </div>

          {/* Majestic Portrait Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {iconsData.map((icon, idx) => {
              if (!icon.profile) return null;
              const profileImg = icon.profile.profilePath
                ? `https://image.tmdb.org/t/p/w780${icon.profile.profilePath}`
                : null;
              const today = new Date();
              const start = new Date(today.getFullYear(), 0, 0);
              const diff = today.getTime() - start.getTime();
              const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
              
              const offset = (dayOfYear + icon.id) % icon.films.length;
              const shuffledFilms = [...icon.films.slice(offset), ...icon.films.slice(0, offset)];
              const top5 = shuffledFilms.slice(0, 5); // show 5 masterpieces

              return (
                <div
                  key={icon.id}
                  className="group/icon relative w-full aspect-[3/4] sm:aspect-[2/3] bg-[#0a1214] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl hover:shadow-[0_0_50px_rgba(181,136,99,0.15)] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                >
                  {/* Full Background Portrait */}
                  {profileImg ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={profileImg}
                      alt={icon.profile.name}
                      className="absolute inset-0 w-full h-full object-cover object-center grayscale group-hover/icon:grayscale-0 group-hover/icon:scale-105 transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] opacity-70 group-hover/icon:opacity-100"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#080d0e]">
                      <span className="font-mono text-[10px] text-white/20 uppercase tracking-widest">No photo</span>
                    </div>
                  )}

                  {/* Base Gradient - Always visible for name legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#040809] via-[#040809]/40 to-transparent opacity-90 group-hover/icon:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-20 pointer-events-none">
                    <span className="font-mono text-[11px] font-black text-white/30 drop-shadow-md">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="font-mono text-[8px] tracking-[0.25em] text-[#B58863]/90 uppercase px-3 py-1.5 border border-[#B58863]/30 rounded-full bg-[#040809]/50 backdrop-blur-md shadow-lg">
                      {icon.label}
                    </span>
                  </div>

                  {/* Content Container (Slides up on hover) */}
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 flex flex-col justify-end z-20 translate-y-[140px] group-hover/icon:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]">
                    
                    {/* Name Block */}
                    <div className="mb-6">
                      <h3 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white leading-none drop-shadow-2xl group-hover/icon:text-[#d4a87c] transition-colors duration-300">
                        {icon.profile.name}
                      </h3>
                      {/* Minimal gold rule */}
                      <div className="mt-4 w-12 h-px bg-[#B58863]/40 group-hover/icon:w-full group-hover/icon:bg-[#B58863] transition-all duration-700 ease-in-out" />
                    </div>

                    {/* Masterpieces Reveal Panel */}
                    <div className="w-full flex flex-col gap-3 opacity-0 group-hover/icon:opacity-100 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] delay-100">
                      <span className="font-mono text-[9px] tracking-[0.15em] text-[#B58863] uppercase select-none flex items-center gap-2">
                        ✦ Iconic Works
                      </span>
                      
                      <div className="flex gap-2">
                        {top5.map((film) => {
                          const href = film.mediaType === "movie" ? `/movies/${film.id}` : `/tv/${film.id}`;
                          const poster = film.posterPath
                            ? `https://image.tmdb.org/t/p/w185${film.posterPath}`
                            : null;
                          return (
                            <Link
                              key={film.id}
                              href={href}
                              className="group/film relative flex-1 aspect-[2/3] rounded-md border border-white/10 shadow-lg bg-[#0c1416] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2 hover:border-[#B58863]/60 hover:shadow-[0_10px_20px_rgba(0,0,0,0.8)] overflow-hidden"
                              title={film.title}
                            >
                              {poster ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={poster}
                                  alt={film.title}
                                  className="w-full h-full object-cover group-hover/film:scale-110 group-hover/film:brightness-110 transition-all duration-500"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[8px] text-white/20">NO IMG</div>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <FilmstripDivider
        bgClass="bg-[#122123]"
        aboveColor="text-[#0a1214]"
        belowColor="text-[#0f1a1b]"
        reelLabel="REEL_02 // EXT. ARCHIVES"
      />

      {/* 3. Horizontal Carousel Rows (Trending Movies, Top Rated, TV, etc.) */}

      <section className="mx-auto w-full max-w-[98%] px-2 pt-16 pb-8 sm:px-4 lg:px-6 z-10 relative">


        <div className="flex items-center justify-between border-b border-[#3D4D55]/20 pb-4 mb-6">
          <h2 className="text-lg sm:text-2xl font-extrabold tracking-tight text-[#D3C3B9] flex items-center gap-2">
            <span className="w-1.5 h-6 rounded bg-[#B58863]" />
            Trending Movies
          </h2>
          <Link
            href="/movies"
            className="text-xs font-semibold text-[#B58863] hover:text-[#d4a87c] flex items-center gap-1 transition-colors"
          >
            View More
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-3.5 h-3.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        </div>

        <MediaCarousel>
          {popularMovies.map((item) => (
            <div key={`movie:${item.id}`} className="w-[140px] sm:w-[170px] md:w-[190px] flex-shrink-0">
              <MediaCard item={item} />
            </div>
          ))}
        </MediaCarousel>
      </section>

      <OpticalSoundtrackDivider
        quote="Cinema is a matter of what's in the frame and what's out."
        source="MARTIN SCORSESE"
      />

      {/* Top Rated Movies Row */}
      <section className="mx-auto w-full max-w-[98%] px-2 pt-8 pb-8 sm:px-4 lg:px-6 z-10 relative">

        <div className="flex items-center justify-between border-b border-[#3D4D55]/20 pb-4 mb-6">
          <h2 className="text-lg sm:text-2xl font-extrabold tracking-tight text-[#D3C3B9] flex items-center gap-2">
            <span className="w-1.5 h-6 rounded bg-[#d4a87c]" />
            Top Rated Movies
          </h2>
          <Link
            href="/movies"
            className="text-xs font-semibold text-[#B58863] hover:text-[#d4a87c] flex items-center gap-1 transition-colors"
          >
            View More
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-3.5 h-3.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        </div>

        <MediaCarousel>
          {topRatedMovies.map((item) => (
            <div key={`top-movie:${item.id}`} className="w-[140px] sm:w-[170px] md:w-[190px] flex-shrink-0">
              <MediaCard item={item} />
            </div>
          ))}
        </MediaCarousel>
      </section>

      <OpticalSoundtrackDivider
        quote="Three hours is not long for a movie. It's long for a bad movie."
        source="ROGER EBERT"
      />

      {/* Trending TV Series Row */}
      <section className="mx-auto w-full max-w-[98%] px-2 pt-8 pb-8 sm:px-4 lg:px-6 z-10 relative">

        <div className="flex items-center justify-between border-b border-[#3D4D55]/20 pb-4 mb-6">
          <h2 className="text-lg sm:text-2xl font-extrabold tracking-tight text-[#D3C3B9] flex items-center gap-2">
            <span className="w-1.5 h-6 rounded bg-[#A79E9C]" />
            Trending TV Shows
          </h2>
          <Link
            href="/tv"
            className="text-xs font-semibold text-[#B58863] hover:text-[#d4a87c] flex items-center gap-1 transition-colors"
          >
            View More
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-3.5 h-3.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        </div>

        <MediaCarousel>
          {popularTV.map((item) => (
            <div key={`tv:${item.id}`} className="w-[140px] sm:w-[170px] md:w-[190px] flex-shrink-0">
              <MediaCard item={item} />
            </div>
          ))}
        </MediaCarousel>
      </section>

      <OpticalSoundtrackDivider
        quote="Cinema is a mirror that can focus on things we'd rather not see."
        source="ALEJANDDO G. IÑÁRRITU"
      />

      {/* Top Rated TV Series Row */}
      <section className="mx-auto w-full max-w-[98%] px-2 pt-8 pb-16 sm:px-4 lg:px-6 z-10 relative">

        <div className="flex items-center justify-between border-b border-[#3D4D55]/20 pb-4 mb-6">
          <h2 className="text-lg sm:text-2xl font-extrabold tracking-tight text-[#D3C3B9] flex items-center gap-2">
            <span className="w-1.5 h-6 rounded bg-[#3D4D55]" />
            Top Rated TV Shows
          </h2>
          <Link
            href="/tv"
            className="text-xs font-semibold text-[#B58863] hover:text-[#d4a87c] flex items-center gap-1 transition-colors"
          >
            View More
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-3.5 h-3.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        </div>

        <MediaCarousel>
          {topRatedTV.map((item) => (
            <div key={`top-tv:${item.id}`} className="w-[140px] sm:w-[170px] md:w-[190px] flex-shrink-0">
              <MediaCard item={item} />
            </div>
          ))}
        </MediaCarousel>
      </section>

      <FilmstripDivider
        bgClass="bg-[#122123]"
        aboveColor="text-[#0f1a1b]"
        belowColor="text-[#0f1a1b]"
        reelLabel="REEL_06 // INT. RECOMMENDS"
      />

      {/* 4. Curated Match Finder CTA (Cinematic Visual highlight) */}
      <section className="mx-auto w-full max-w-[98%] px-2 py-16 sm:px-4 lg:px-6 z-10 relative">
        <div className="relative rounded-3xl md:rounded-[40px] overflow-hidden bg-gradient-to-br from-[#103334]/80 to-[#0f1a1b] border border-[#3D4D55]/30 p-8 sm:p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_70%_120%,rgba(181,136,99,0.15),rgba(255,255,255,0))]" />

          {/* Safe Area Inner Border */}
          <div className="absolute inset-4 md:inset-6 z-10 border border-[#B58863]/10 pointer-events-none rounded-2xl md:rounded-[28px]">
            {/* Viewfinder ticks */}
            <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-[#B58863]/30" />
            <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-[#B58863]/30" />
            <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-[#B58863]/30" />
            <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-[#B58863]/30" />
            
            {/* Console marker */}
            <span className="absolute bottom-2.5 right-4 font-mono text-[7px] tracking-widest text-[#B58863]/50 select-none uppercase hidden sm:inline">
              [SYS_UTL // MATCHMAKER_A.01]
            </span>
          </div>

          <div className="relative z-10 space-y-4 max-w-xl">
            <span className="text-[10px] font-mono tracking-[0.2em] text-[#B58863] block">
              Cinephile Matchmaker // tool_sys
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Can't decide what to watch tonight?
            </h2>
            
            {/* Script-Citation styled description */}
            <div className="border-l-2 border-[#B58863]/30 pl-4 py-0.5 space-y-1">
              <span className="block font-mono text-[7px] tracking-widest text-slate-500 uppercase select-none">
                [UTILITY LOG // MATCH_A]
              </span>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Try our advanced Match Finder. Choose your favorite movie, find your partner or friend's favorite, and get instant overlapping recommendations that both of you will love!
              </p>
            </div>
          </div>

          <div className="relative z-20 flex-shrink-0">
            <Link
              href="/recommend"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#B58863] to-[#d4a87c] hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] text-[#0f1a1b] font-mono font-bold px-8 py-4 rounded-xl shadow-lg shadow-[#B58863]/25 transition-all text-xs uppercase tracking-widest cursor-pointer border border-[#d4a87c]/30"
            >
              <span>✦ Launch Match Finder</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
