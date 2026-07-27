import Link from "next/link";
import { getPopularMedia, getTopRatedMedia, getPersonMovies, getPersonDetails } from "@/lib/tmdb";
import MediaCard from "@/components/MediaCard";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
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
    dbReviews = await prisma.review.findMany({
      take: 2,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { name: true, username: true, avatarUrl: true }
        }
      }
    });

    dbLists = await prisma.customList.findMany({
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
    });
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

          {/* 2-column editorial grid with gaps and rounded cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {iconsData.map((icon, idx) => {
              if (!icon.profile) return null;
              const profileImg = icon.profile.profilePath
                ? `https://image.tmdb.org/t/p/h632${icon.profile.profilePath}`
                : null;
              const top5 = icon.films.slice(0, 5);

              return (
                <div
                  key={icon.id}
                  className="group/icon relative bg-[#0a1214]/80 border border-white/10 rounded-3xl hover:border-[#B58863]/40 transition-all duration-300 p-0 overflow-hidden shadow-2xl hover:shadow-[0_0_40px_rgba(181,136,99,0.15)]"
                >
                  <div className="flex h-full min-h-[240px]">

                    {/* Left — tall portrait */}
                    <div className="relative w-[140px] sm:w-[180px] flex-shrink-0 overflow-hidden bg-[#080e0f]">
                      {profileImg ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={profileImg}
                          alt={icon.profile.name}
                          className="absolute inset-0 w-full h-full object-cover object-top grayscale group-hover/icon:grayscale-0 transition-all duration-500 opacity-80 group-hover/icon:opacity-100"
                          loading="lazy"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-end p-3">
                          <span className="font-mono text-[8px] text-white/20 uppercase tracking-widest">No photo</span>
                        </div>
                      )}
                      {/* Bottom gradient over portrait */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a1214] group-hover/icon:to-[#0d1618] transition-colors duration-300" />
                      {/* Index watermark on portrait */}
                      <span className="absolute top-3 left-3 font-mono text-[9px] font-black text-white/20 select-none">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Right — name + horizontal film slides */}
                    <div className="flex-grow flex flex-col justify-between p-3.5 sm:p-5">

                      {/* Name block */}
                      <div>
                        <span className="font-mono text-[7px] tracking-[0.25em] text-[#B58863]/60 uppercase block mb-2">
                          {icon.label}
                        </span>
                        <h3 className="text-base sm:text-lg font-black tracking-tight text-white leading-tight group-hover/icon:text-[#d4a87c] transition-colors duration-300">
                          {icon.profile.name}
                        </h3>
                        {/* Minimal gold rule */}
                        <div className="mt-3 w-8 h-px bg-[#B58863]/40 group-hover/icon:w-16 group-hover/icon:bg-[#B58863] transition-all duration-400" />
                      </div>

                      {/* Overlapping Masterpiece Posters Track */}
                      {top5.length > 0 && (
                        <div className="flex flex-col gap-2">
                          <span className="font-mono text-[6px] tracking-widest text-[#B58863]/50 uppercase select-none">
                            ✦ Masterpieces
                          </span>
                          
                          {/* Flex track sits directly in the card panel (static spacing to prevent layout shifts) */}
                          <div className="flex -space-x-6 w-full pl-2">
                            {top5.map((film, fi) => {
                              const href = film.mediaType === "movie" ? `/movies/${film.id}` : `/tv/${film.id}`;
                              const poster = film.posterPath
                                ? `https://image.tmdb.org/t/p/w185${film.posterPath}`
                                : null;
                              return (
                                <Link
                                  key={film.id}
                                  href={href}
                                  className="group/film relative w-[72px] sm:w-[90px] md:w-[104px] aspect-[2/3] rounded-md border border-white/10 shadow-md bg-[#0c1416] transition-[transform,opacity,border-color] duration-200 ease-out hover:z-30 hover:-translate-y-2.5 hover:scale-[1.08] hover:border-[#B58863]/60 flex-shrink-0 opacity-65 hover:opacity-100"
                                  title={`${film.title} (${film.releaseDate?.split("-")[0] ?? ""})`}
                                >
                                  {poster ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                      src={poster}
                                      alt={film.title}
                                      className="w-full h-full object-cover rounded-lg"
                                      loading="lazy"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[6px] text-white/20">NO IMG</div>
                                  )}
                                  
                                  {/* Slide Title tooltip strip inside the poster itself */}
                                  <div className="absolute inset-x-0 bottom-0 bg-black/90 py-1 px-1 text-center opacity-0 group-hover/film:opacity-100 transition-opacity duration-200 rounded-b-lg">
                                    <span className="block text-[5px] sm:text-[6px] text-[#FAF6E8] font-black truncate leading-none">
                                      {film.title}
                                    </span>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      )}


                      {/* Bottom meta */}
                      <div className="mt-5 flex items-center justify-between">
                        <span className="font-mono text-[7px] tracking-widest text-white/10 uppercase select-none">
                          {icon.films.length} credits
                        </span>
                        <div className="w-3 h-3 border border-[#B58863]/20 rotate-45 group-hover/icon:border-[#B58863]/60 transition-colors duration-300" />
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
