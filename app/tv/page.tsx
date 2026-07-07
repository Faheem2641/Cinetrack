import { getPopularMedia } from "@/lib/tmdb";
import MediaCard from "@/components/MediaCard";
import FilmstripDivider from "@/components/FilmstripDivider";

export default async function TVShowsPage() {
  const shows = await getPopularMedia("tv");

  return (
    <div className="w-full bg-[#0f1a1b] text-[#D3C3B9] flex-1 flex flex-col">
      {/* Spacer to clear fixed navbar */}
      <div className="h-20 w-full" />

      {/* Filmstrip transition section border */}
      <FilmstripDivider
        bgClass="bg-[#122123]"
        aboveColor="text-[#0f1a1b]"
        belowColor="text-[#0f1a1b]"
        reelLabel="REEL_05 // DISCOVER TV SHOWS"
      />

      <div className="mx-auto w-full max-w-7xl px-4 pt-12 pb-12 sm:px-6 lg:px-8 flex-1">
        <div className="border-b border-[#3D4D55]/20 pb-6 mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#D3C3B9] flex items-center gap-3">
            <span className="w-1.5 h-8 rounded bg-[#A79E9C]" />
            Popular TV Series
          </h1>
          <p className="text-sm text-[#A79E9C] mt-2">
            Discover the most watched and trending television series in the community today.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {shows.map((item) => (
            <MediaCard key={`tv:${item.id}`} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
