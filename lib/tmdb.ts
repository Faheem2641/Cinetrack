// The Movie Database (TMDb) API integration layer

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export interface MediaItem {
  id: string;
  title: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string;
  mediaType: "movie" | "tv";
  voteAverage: number;
  voteCount: number;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profilePath: string | null;
}

export interface MediaDetails extends MediaItem {
  genres: string[];
  runtime: number; // in minutes
  tagline: string;
  cast: CastMember[];
  trailerUrl: string | null;
}

// ==========================================
// Static Mock Dataset for Offline/Fallback
// ==========================================
const MOCK_MEDIA: Record<string, Partial<MediaDetails>> = {
  // Movies
  "movie:27205": {
    id: "27205",
    title: "Inception",
    overview: "Cobb, a skilled thief who commits corporate espionage by infiltrating the sub-conscious of his targets, is offered a chance to regain his old life as a payment for a task considered to be impossible: \"inception\", the implantation of another person's idea into a target's subconscious.",
    posterPath: "/o062xtYJm5AdzfsEs4tFa47TuRL.jpg",
    backdropPath: "/s3TBrRGB1K7jY4P7cmdIBu5e33X.jpg",
    releaseDate: "2010-07-15",
    mediaType: "movie",
    voteAverage: 8.4,
    voteCount: 35000,
    genres: ["Action", "Science Fiction", "Adventure"],
    runtime: 148,
    tagline: "Your mind is the scene of the crime.",
    cast: [
      { id: 1, name: "Leonardo DiCaprio", character: "Dom Cobb", profilePath: "/wo2hJ1CY014J6vj5X18qbbN9cjo.jpg" },
      { id: 2, name: "Joseph Gordon-Levitt", character: "Arthur", profilePath: "/dhv9H9v19VoYS8u6w57rquILv6y.jpg" },
      { id: 3, name: "Elliot Page", character: "Ariadne", profilePath: "/5l5m2s8T7v7XW6Q8lCypw1yM5Xm.jpg" },
      { id: 4, name: "Tom Hardy", character: "Eames", profilePath: "/4RhG2J2XwI2b3kX5c62mX7w5X7k.jpg" },
    ],
    trailerUrl: "https://www.youtube.com/watch?v=YoHD9XEInc0",
  },
  "movie:157336": {
    id: "157336",
    title: "Interstellar",
    overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
    posterPath: "/gEU2QvHOm52Yv0tprYhp3v2v1gY.jpg",
    backdropPath: "/xJHokMbljvjADYUr5PzEEw9hxbg.jpg",
    releaseDate: "2014-11-05",
    mediaType: "movie",
    voteAverage: 8.4,
    voteCount: 32000,
    genres: ["Adventure", "Drama", "Science Fiction"],
    runtime: 169,
    tagline: "Mankind was born on Earth. It was never meant to die here.",
    cast: [
      { id: 1, name: "Matthew McConaughey", character: "Cooper", profilePath: "/elO12l9m6V4l2Vw6r5c4h5w5X7k.jpg" },
      { id: 2, name: "Anne Hathaway", character: "Brand", profilePath: "/a12hJ1CY014J6vj5X18qbbN9cjo.jpg" },
      { id: 3, name: "Jessica Chastain", character: "Murph", profilePath: "/vo2hJ1CY014J6vj5X18qbbN9cjo.jpg" },
      { id: 4, name: "Michael Caine", character: "Professor Brand", profilePath: "/dhv9H9v19VoYS8u6w57rquILv6y.jpg" },
    ],
    trailerUrl: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
  },
  "movie:155": {
    id: "155",
    title: "The Dark Knight",
    overview: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker.",
    posterPath: "/qJ2tWGB2XclmAEc97aIsG24GEtY.jpg",
    backdropPath: "/nMKdUUepfeGJ5wZm0w2n7IY5t22.jpg",
    releaseDate: "2008-07-16",
    mediaType: "movie",
    voteAverage: 8.5,
    voteCount: 31000,
    genres: ["Drama", "Action", "Crime", "Thriller"],
    runtime: 152,
    tagline: "Why So Serious?",
    cast: [
      { id: 1, name: "Christian Bale", character: "Bruce Wayne / Batman", profilePath: "/b72hJ1CY014J6vj5X18qbbN9cjo.jpg" },
      { id: 2, name: "Heath Ledger", character: "Joker", profilePath: "/1o2hJ1CY014J6vj5X18qbbN9cjo.jpg" },
      { id: 3, name: "Gary Oldman", character: "Jim Gordon", profilePath: "/dhv9H9v19VoYS8u6w57rquILv6y.jpg" },
      { id: 4, name: "Aaron Eckhart", character: "Harvey Dent", profilePath: "/5l5m2s8T7v7XW6Q8lCypw1yM5Xm.jpg" },
    ],
    trailerUrl: "https://www.youtube.com/watch?v=EXeTwQWrcwY",
  },
  "movie:603": {
    id: "603",
    title: "The Matrix",
    overview: "Set in the 22nd century, The Matrix tells the story of a computer hacker who joins a group of underground fighters who are fighting against the powerful computers who have ruled the earth.",
    posterPath: "/f89U3wzqrjVnHwb9Y9OMhk0e2jC.jpg",
    backdropPath: "/7uRbQIfrO7uwY6mrr66VuvHO7Ur.jpg",
    releaseDate: "1999-03-30",
    mediaType: "movie",
    voteAverage: 8.2,
    voteCount: 24000,
    genres: ["Action", "Science Fiction"],
    runtime: 136,
    tagline: "Welcome to the Real World.",
    cast: [
      { id: 1, name: "Keanu Reeves", character: "Neo", profilePath: "/wo2hJ1CY014J6vj5X18qbbN9cjo.jpg" },
      { id: 2, name: "Laurence Fishburne", character: "Morpheus", profilePath: "/dhv9H9v19VoYS8u6w57rquILv6y.jpg" },
      { id: 3, name: "Carrie-Anne Moss", character: "Trinity", profilePath: "/5l5m2s8T7v7XW6Q8lCypw1yM5Xm.jpg" },
      { id: 4, name: "Hugo Weaving", character: "Agent Smith", profilePath: "/4RhG2J2XwI2b3kX5c62mX7w5X7k.jpg" },
    ],
    trailerUrl: "https://www.youtube.com/watch?v=vKQi3bBA1y8",
  },
  // TV Shows
  "tv:66732": {
    id: "66732",
    title: "Stranger Things",
    overview: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
    posterPath: "/49ySR4GfyvtaTY0qXn6c6bJ403B.jpg",
    backdropPath: "/56v2KjU5ecISbg486r2KqpEvadj.jpg",
    releaseDate: "2016-07-15",
    mediaType: "tv",
    voteAverage: 8.6,
    voteCount: 16000,
    genres: ["Sci-Fi & Fantasy", "Drama", "Mystery"],
    runtime: 50,
    tagline: "One friendship can change everything.",
    cast: [
      { id: 1, name: "Millie Bobby Brown", character: "Eleven", profilePath: "/wo2hJ1CY014J6vj5X18qbbN9cjo.jpg" },
      { id: 2, name: "Finn Wolfhard", character: "Mike Wheeler", profilePath: "/dhv9H9v19VoYS8u6w57rquILv6y.jpg" },
      { id: 3, name: "Winona Ryder", character: "Joyce Byers", profilePath: "/5l5m2s8T7v7XW6Q8lCypw1yM5Xm.jpg" },
      { id: 4, name: "David Harbour", character: "Jim Hopper", profilePath: "/4RhG2J2XwI2b3kX5c62mX7w5X7k.jpg" },
    ],
    trailerUrl: "https://www.youtube.com/watch?v=b9EkMc79ZSU",
  },
  "tv:1396": {
    id: "1396",
    title: "Breaking Bad",
    overview: "Walter White, a New Mexico chemistry teacher, is diagnosed with Stage III cancer and given a prognosis of two years to live. To secure his family's financial future, he decides to enter the world of drug abuse and drug dealers.",
    posterPath: "/ztkUQn2C7Vvcc2q5uQ4nsa53N22.jpg",
    backdropPath: "/9fa9R80j5H9vJ8Q5O54jVp8T8s7.jpg",
    releaseDate: "2008-01-20",
    mediaType: "tv",
    voteAverage: 8.9,
    voteCount: 13000,
    genres: ["Drama", "Crime"],
    runtime: 49,
    tagline: "Change the Equation.",
    cast: [
      { id: 1, name: "Bryan Cranston", character: "Walter White", profilePath: "/wo2hJ1CY014J6vj5X18qbbN9cjo.jpg" },
      { id: 2, name: "Aaron Paul", character: "Jesse Pinkman", profilePath: "/dhv9H9v19VoYS8u6w57rquILv6y.jpg" },
      { id: 3, name: "Anna Gunn", character: "Skyler White", profilePath: "/5l5m2s8T7v7XW6Q8lCypw1yM5Xm.jpg" },
      { id: 4, name: "Bob Odenkirk", character: "Saul Goodman", profilePath: "/4RhG2J2XwI2b3kX5c62mX7w5X7k.jpg" },
    ],
    trailerUrl: "https://www.youtube.com/watch?v=HhesaQXLuRY",
  },
};

// Helpers to get mock search lists
function getMockMediaList(): MediaItem[] {
  return Object.values(MOCK_MEDIA).map((item) => ({
    id: item.id!,
    title: item.title!,
    overview: item.overview!,
    posterPath: item.posterPath ?? null,
    backdropPath: item.backdropPath ?? null,
    releaseDate: item.releaseDate!,
    mediaType: item.mediaType!,
    voteAverage: item.voteAverage!,
    voteCount: item.voteCount!,
  }));
}

// ==========================================
// API Handlers
// ==========================================

const getApiKey = () => {
  const token = process.env.TMDB_API_KEY;
  if (!token) return null;
  // Strip any literal surrounding double/single quotes and trim
  return token.replace(/^["']|["']$/g, "").trim();
};

const getHeaders = () => {
  const token = getApiKey();
  if (!token) return null;
  
  // Accept both JWT format and standard short v3 API keys
  if (token.startsWith("eyJ")) {
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json;charset=utf-8",
    };
  }
  return null;
};

const getUrl = (path: string, params: Record<string, string> = {}) => {
  const token = getApiKey();
  const url = new URL(`${TMDB_BASE_URL}${path}`);
  
  // If it's a standard short api key, append it as a query param
  if (token && !token.startsWith("eyJ")) {
    url.searchParams.append("api_key", token);
  }
  
  Object.entries(params).forEach(([key, val]) => {
    url.searchParams.append(key, val);
  });
  
  return url.toString();
};

export async function searchMedia(query: string): Promise<MediaItem[]> {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return [];

  const headers = getHeaders();
  const token = getApiKey();

  if (!token) {
    console.log(`[TMDb Wrapper] Offline Mode: Filtering mock data for "${cleanQuery}"`);
    const allMock = getMockMediaList();
    return allMock.filter((item) =>
      item.title.toLowerCase().includes(cleanQuery) ||
      item.overview.toLowerCase().includes(cleanQuery)
    );
  }

  try {
    const url = getUrl("/search/multi", { query: cleanQuery, include_adult: "false" });
    const res = await fetch(url, headers ? { headers, next: { revalidate: 3600 } } : { next: { revalidate: 3600 } });
    if (!res.ok) {
      console.warn(`TMDb search failed: ${res.status}`);
      return getMockMediaList().filter((item) =>
        item.title.toLowerCase().includes(cleanQuery)
      );
    }
    
    const data = await res.json();
    const results = data.results || [];
    
    return results
      .filter((item: any) => item.media_type === "movie" || item.media_type === "tv")
      .map((item: any) => ({
        id: String(item.id),
        title: item.title || item.name || "",
        overview: item.overview || "",
        posterPath: item.poster_path,
        backdropPath: item.backdrop_path,
        releaseDate: item.release_date || item.first_air_date || "",
        mediaType: item.media_type as "movie" | "tv",
        voteAverage: item.vote_average || 0,
        voteCount: item.vote_count || 0,
      }));
  } catch (error) {
    console.warn("TMDb wrapper search error:", error);
    // Fallback to mock on error
    return getMockMediaList().filter((item) =>
      item.title.toLowerCase().includes(cleanQuery)
    );
  }
}

export async function getMediaDetails(id: string, type: "movie" | "tv"): Promise<MediaDetails | null> {
  const key = `${type}:${id}`;
  const token = getApiKey();

  if (!token) {
    console.log(`[TMDb Wrapper] Offline Mode: Fetching mock details for "${key}"`);
    const mock = MOCK_MEDIA[key];
    return mock ? (mock as MediaDetails) : null;
  }

  try {
    const url = getUrl(`/${type}/${id}`, { append_to_response: "credits,videos" });
    const headers = getHeaders();
    const res = await fetch(url, headers ? { headers, next: { revalidate: 3600 } } : { next: { revalidate: 3600 } });
    if (!res.ok) {
      if (res.status === 404) return null;
      console.warn(`TMDb details failed: ${res.status}`);
      const mock = MOCK_MEDIA[key];
      if (mock) return mock as MediaDetails;
      return {
        id,
        title: `${type === "movie" ? "Movie" : "TV Show"} #${id}`,
        overview: "Details could not be loaded from TMDb. Please verify your TMDB_API_KEY environment variable.",
        posterPath: null,
        backdropPath: null,
        releaseDate: "",
        mediaType: type,
        voteAverage: 0,
        voteCount: 0,
        genres: ["Offline Fallback"],
        runtime: 120,
        tagline: "TMDB API Error Fallback",
        cast: [],
        trailerUrl: null,
      };
    }

    const data = await res.json();
    
    const cast = (data.credits?.cast || [])
      .slice(0, 10)
      .map((c: any) => ({
        id: c.id,
        name: c.name,
        character: c.character,
        profilePath: c.profile_path,
      }));

    // Find Youtube trailer key
    const videos = data.videos?.results || [];
    const trailerVideo = videos.find(
      (v: any) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
    ) || videos.find((v: any) => v.site === "YouTube");
    
    const trailerUrl = trailerVideo ? `https://www.youtube.com/watch?v=${trailerVideo.key}` : null;

    return {
      id: String(data.id),
      title: data.title || data.name || "",
      overview: data.overview || "",
      posterPath: data.poster_path,
      backdropPath: data.backdrop_path,
      releaseDate: data.release_date || data.first_air_date || "",
      mediaType: type,
      voteAverage: data.vote_average || 0,
      voteCount: data.vote_count || 0,
      genres: (data.genres || []).map((g: any) => g.name),
      runtime: data.runtime || (data.episode_run_time ? data.episode_run_time[0] : 0) || 0,
      tagline: data.tagline || "",
      cast,
      trailerUrl,
    };
  } catch (error) {
    console.warn(`TMDb wrapper getDetails error for ${key}:`, error);
    const mock = MOCK_MEDIA[key];
    if (mock) return mock as MediaDetails;
    
    // Fallback template so details view page doesn't throw 404/blank screen on credentials/network failure
    return {
      id,
      title: `${type === "movie" ? "Movie" : "TV Show"} #${id}`,
      overview: "Details could not be loaded from TMDb. Please verify your TMDB_API_KEY environment variable.",
      posterPath: null,
      backdropPath: null,
      releaseDate: "",
      mediaType: type,
      voteAverage: 0,
      voteCount: 0,
      genres: ["Offline Fallback"],
      runtime: 120,
      tagline: "TMDB API Error Fallback",
      cast: [],
      trailerUrl: null,
    };
  }
}

export async function getPopularMedia(type: "movie" | "tv"): Promise<MediaItem[]> {
  const token = getApiKey();

  if (!token) {
    console.log(`[TMDb Wrapper] Offline Mode: Fetching popular mock ${type}s`);
    return getMockMediaList().filter((item) => item.mediaType === type);
  }

  try {
    const url = getUrl(`/${type}/popular`);
    const headers = getHeaders();
    const res = await fetch(url, headers ? { headers, next: { revalidate: 86400 } } : { next: { revalidate: 86400 } });
    if (!res.ok) {
      console.warn(`TMDb popular failed: ${res.status}`);
      return getMockMediaList().filter((item) => item.mediaType === type);
    }

    const data = await res.json();
    const results = data.results || [];

    return results.slice(0, 10).map((item: any) => ({
      id: String(item.id),
      title: item.title || item.name || "",
      overview: item.overview || "",
      posterPath: item.poster_path,
      backdropPath: item.backdrop_path,
      releaseDate: item.release_date || item.first_air_date || "",
      mediaType: type,
      voteAverage: item.vote_average || 0,
      voteCount: item.vote_count || 0,
    }));
  } catch (error) {
    console.warn(`TMDb wrapper getPopular error for ${type}:`, error);
    return getMockMediaList().filter((item) => item.mediaType === type);
  }
}
