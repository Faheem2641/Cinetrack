"use client";

import { useState } from "react";
import Link from "next/link";

interface TasteProfileItem {
  icon: string;
  name: string;
  percentage: number;
  color: string;
}

interface MediaItem {
  id: string;
  title: string;
  posterPath: string | null;
  releaseDate: string;
  mediaType: "movie" | "tv";
  voteAverage: number;
}

interface ReviewItem {
  id: string;
  tmdbId: string;
  mediaType: "movie" | "tv";
  title: string;
  posterPath: string | null;
  content: string;
  rating: number | null;
  createdAt: string;
}

interface UserProfileClientProps {
  isOwnProfile: boolean;
  user: {
    username: string;
    name: string;
    avatarUrl: string | null;
    bio: string | null;
    stats: {
      filmsCount: number;
      followingCount: number;
      followersCount: number;
    };
    tasteProfile: TasteProfileItem[];
    watched: MediaItem[];
    watchlist: MediaItem[];
    reviews: ReviewItem[];
  };
}

export default function UserProfileClient({ isOwnProfile, user }: UserProfileClientProps) {
  const [activeTab, setActiveTab] = useState<"Watched" | "Watchlist" | "Reviews">("Watched");
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(user.stats.followersCount);
  const [copied, setCopied] = useState(false);

  // 1. Cover Photo Theme States
  const [coverTheme, setCoverTheme] = useState<string>("mars");
  const [showCoverPicker, setShowCoverPicker] = useState<boolean>(false);

  const coverThemes = [
    { id: "mars", label: "Mars Dunes", class: "bg-[#103334]", img: "/profile_cover_mars.png" },
    { id: "teal", label: "Deep Teal", class: "bg-gradient-to-r from-[#103334] via-[#1e2e30] to-[#0f1a1b]", img: null },
    { id: "slate", label: "Slate Dusk", class: "bg-gradient-to-r from-[#3D4D55] via-[#1e2e30] to-[#0f1a1b]", img: null },
    { id: "sand", label: "Desert Sand", class: "bg-gradient-to-r from-[#B58863]/30 via-[#3D4D55] to-[#0f1a1b]", img: null },
    { id: "noir", label: "Noir Theater", class: "bg-gradient-to-r from-[#1e2e30] via-[#1A1A1C] to-[#0f1a1b]", img: null },
  ];

  const activeCover = coverThemes.find((t) => t.id === coverTheme) || coverThemes[0];

  // 2. Clickable Follower / Following Lists Modal States
  const [activeModal, setActiveModal] = useState<"followers" | "following" | null>(null);

  const mockFollowersList = [
    { name: "Christopher Nolan", username: "chrisnolan", bio: "Director of Inception, Interstellar, Oppenheimer." },
    { name: "Martin Scorsese", username: "marty", bio: "Cinema is a matter of what's in the frame..." },
    { name: "Quentin Tarantino", username: "quentin", bio: "Writer. Director. Film geek." },
    { name: "Greta Gerwig", username: "greta", bio: "Director of Lady Bird, Little Women, Barbie." }
  ];

  const mockFollowingList = [
    { name: "Denis Villeneuve", username: "denis", bio: "Director of Arrival, Blade Runner 2049, Dune." },
    { name: "Bong Joon Ho", username: "bong", bio: "Director of Parasite, Memories of Murder." },
    { name: "David Fincher", username: "fincher", bio: "Director of Se7en, Fight Club, The Social Network." },
    { name: "Stanley Kubrick", username: "kubrick", bio: "1928 - 1999. Filmmaker." }
  ];

  const activeList = activeModal === "followers" ? mockFollowersList : mockFollowingList;

  // 3. Favorite Showcase Selection
  const defaultFavorites = [
    { id: "27205", title: "Inception", posterPath: "/o062xtYJm5AdzfsEs4tFa47TuRL.jpg", voteAverage: 8.4 },
    { id: "157336", title: "Interstellar", posterPath: "/gEU2QvHOm52Yv0tprYhp3v2v1gY.jpg", voteAverage: 8.5 },
    { id: "155", title: "The Dark Knight", posterPath: "/qJ2tWGB2XclmAEc97aIsG24GEtY.jpg", voteAverage: 9.0 },
    { id: "603", title: "The Matrix", posterPath: "/f89U3wzqrjVnHwb9Y9OMhk0e2jC.jpg", voteAverage: 8.2 }
  ];
  const favoriteShowcaseItems = user.watched.length >= 4
    ? user.watched.slice(0, 4)
    : defaultFavorites;

  // 4. Rating Distribution Data Calculations
  const ratings = user.reviews.map((r) => r.rating).filter((r): r is number => r !== null);
  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  ratings.forEach((rating) => {
    const star = Math.round(rating);
    if (star >= 1 && star <= 5) {
      ratingCounts[star as 1 | 2 | 3 | 4 | 5] = (ratingCounts[star as 1 | 2 | 3 | 4 | 5] || 0) + 1;
    }
  });
  const defaultCounts = { 5: 142, 4: 78, 3: 20, 2: 5, 1: 2 };
  const finalCounts = ratings.length > 0 ? ratingCounts : defaultCounts;
  const maxCount = Math.max(...Object.values(finalCounts));
  const ratingBars = [5, 4, 3, 2, 1].map((stars) => {
    const count = finalCounts[stars as 1 | 2 | 3 | 4 | 5];
    return {
      stars,
      label: "★".repeat(stars),
      count,
      percentage: maxCount > 0 ? (count / maxCount) * 100 : 0,
    };
  });

  const handleFollowToggle = () => {
    if (isFollowing) {
      setIsFollowing(false);
      setFollowersCount((prev) => prev - 1);
    } else {
      setIsFollowing(true);
      setFollowersCount((prev) => prev + 1);
    }
  };

  const handleShareProfile = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      const shareUrl = `${window.location.origin}/user/${user.username}`;
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Reusable media card for inline use inside this component
  const ProfileMediaCard = ({ item }: { item: MediaItem }) => {
    const linkHref = item.mediaType === "movie" ? `/movies/${item.id}` : `/tv/${item.id}`;
    const posterUrl = item.posterPath
      ? `https://image.tmdb.org/t/p/w500${item.posterPath}`
      : "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=500&auto=format&fit=crop&q=60";
    return (
      <div className="group flex flex-col relative p-1.5 rounded-[22px] bg-[#103334]/40 border border-[#3D4D55]/30 hover:border-[#B58863]/30 hover:bg-[#1e2e30]/60 transition-all duration-500 hover:shadow-2xl hover:shadow-[#B58863]/10 hover:-translate-y-1.5 hover:scale-[1.02]">
        <Link
          href={linkHref}
          className="relative aspect-[2/3] w-full overflow-hidden rounded-[18px] bg-[#0f1a1b] border border-[#3D4D55]/20 shadow-inner"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={posterUrl}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          {/* Rating badge */}
          {item.voteAverage > 0 && (
            <span className="absolute bottom-2.5 right-2.5 text-[9px] font-black tracking-wide px-2.5 py-1 rounded-xl bg-[#0f1a1b]/75 backdrop-blur-md text-[#B58863] border border-[#3D4D55]/40 flex items-center gap-1 shadow">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-[#B58863]">
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
              </svg>
              {item.voteAverage.toFixed(1)}
            </span>
          )}
        </Link>
        <div className="mt-3 px-2.5 pb-2">
          <div className="flex items-center gap-2 mb-1.5">
            {item.mediaType === "movie" ? (
              <span className="bg-[#B58863]/10 text-[#B58863] border border-[#B58863]/20 rounded-full px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wider">Movie</span>
            ) : (
              <span className="bg-[#3D4D55]/30 text-[#A79E9C] border border-[#3D4D55]/40 rounded-full px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wider">Series</span>
            )}
            {item.releaseDate && (
              <span className="bg-[#1e2e30]/60 text-[#A79E9C] border border-[#3D4D55]/30 rounded-full px-2 py-0.5 text-[8px] font-extrabold tracking-wider">
                {item.releaseDate.split("-")[0]}
              </span>
            )}
          </div>
          <div className="relative group/title overflow-hidden pt-0.5">
            <Link
              href={linkHref}
              className="text-xs font-black text-[#D3C3B9] group-hover:bg-gradient-to-r group-hover:from-[#B58863] group-hover:via-[#d4a87c] group-hover:to-[#D3C3B9] group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 truncate block leading-normal pr-4 relative"
              title={item.title}
            >
              {item.title}
              <span className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-350 text-[10px] text-[#B58863] leading-none">→</span>
            </Link>
            <div className="h-[1.5px] w-0 group-hover:w-full bg-gradient-to-r from-[#B58863] via-[#d4a87c] to-[#D3C3B9] transition-all duration-500 mt-1 rounded-full" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-[#0f1a1b] text-[#D3C3B9] min-h-screen">
      {/* Cover Image Container */}
      <div className={`relative h-64 md:h-80 w-full overflow-hidden border-b border-[#3D4D55]/30 transition-all duration-500 ${activeCover.class}`}>
        {activeCover.img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={activeCover.img}
            alt="Profile Cover"
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <div className="w-full h-full opacity-70 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#B58863]/10 to-transparent" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1a1b] via-[#0f1a1b]/20 to-transparent" />

        {/* Cover Picker Trigger Button */}
        <button
          onClick={() => setShowCoverPicker(true)}
          className="absolute top-4 right-4 z-30 p-2 bg-[#0f1a1b]/70 hover:bg-[#103334] text-[#A79E9C] hover:text-[#D3C3B9] rounded-full backdrop-blur-sm border border-[#3D4D55]/50 transition-all cursor-pointer"
          title="Change Cover Theme"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
        </button>
      </div>

      {/* Main Profile Content Container */}
      <div className="max-w-4xl mx-auto px-4 pb-20 relative -mt-20 z-20">
        {/* Profile Card / Header Info */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5">
            {/* Avatar with gold ring */}
            <div className="relative p-1 rounded-full bg-gradient-to-tr from-[#B58863] to-[#d4a87c] shadow-xl shadow-[#B58863]/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.avatarUrl || "/profile_avatar.png"}
                alt={user.name}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover bg-[#103334] border-2 border-[#0f1a1b]"
              />
            </div>

            {/* User Title & Handle */}
            <div className="text-center sm:text-left pb-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#D3C3B9]">{user.name}</h1>
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#B58863] text-[#0f1a1b] shadow-md" title="Verified Member">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                    <path fillRule="evenodd" d="M16.403 12.652a3 3 0 0 0 0-5.304 3 3 0 0 0-3.75-3.751 3 3 0 0 0-5.305 0 3 3 0 0 0-3.751 3.75 3 3 0 0 0 0 5.305 3 3 0 0 0 3.75 3.751 3 3 0 0 0 5.305 0 3 3 0 0 0 3.751-3.75Zm-2.446-5.183a.75.75 0 0 0-1.06-1.06L9 10.384 7.606 8.99a.75.75 0 0 0-1.06 1.06l2 2a.75.75 0 0 0 1.06 0l4-4Z" clipRule="evenodd" />
                  </svg>
                </span>
              </div>
              <p className="text-[#A79E9C] text-sm mt-0.5">@{user.username}</p>

              {user.bio && (
                <p className="text-[#A79E9C] text-xs sm:text-sm mt-3.5 max-w-md leading-relaxed">
                  {user.bio}
                </p>
              )}
            </div>
          </div>

          {/* Follow / Edit Button Layout */}
          <div className="flex justify-center gap-3 shrink-0 sm:mb-2">
            {!isOwnProfile ? (
              <>
                <button
                  onClick={handleFollowToggle}
                  className={`px-6 py-2 rounded-full text-xs font-bold tracking-wide transition-all shadow-md ${
                    isFollowing
                      ? "bg-[#3D4D55]/60 hover:bg-[#3D4D55] text-[#D3C3B9] border border-[#3D4D55]/80"
                      : "bg-gradient-to-r from-[#B58863] to-[#d4a87c] hover:opacity-90 text-[#0f1a1b] shadow-[#B58863]/20"
                  }`}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
                <button className="px-6 py-2 bg-[#103334]/60 border border-[#3D4D55]/50 text-[#A79E9C] hover:text-[#D3C3B9] rounded-full text-xs font-bold tracking-wide hover:bg-[#1e2e30] transition-all">
                  Message
                </button>
              </>
            ) : (
              <Link
                href="/dashboard"
                className="px-6 py-2 bg-[#103334]/60 border border-[#3D4D55]/50 hover:border-[#3D4D55]/80 text-[#A79E9C] hover:text-[#D3C3B9] rounded-full text-xs font-bold tracking-wide transition-all"
              >
                Edit Profile
              </Link>
            )}
            <button
              onClick={handleShareProfile}
              className="p-2 bg-[#103334]/60 border border-[#3D4D55]/50 text-[#A79E9C] hover:text-[#D3C3B9] rounded-full hover:bg-[#1e2e30] transition-all relative group cursor-pointer"
              aria-label="Share profile"
            >
              {copied ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-emerald-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186 2.504-1.253m-2.504 3.439 2.504 1.253m0-4.692a2.25 2.25 0 1 1 0-3.328m0 3.328a2.25 2.25 0 0 1-2.504 1.253m2.504 2.186a2.25 2.25 0 1 0 0 3.328m0-3.328a2.25 2.25 0 0 0-2.504-1.253" />
                </svg>
              )}
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-[9px] font-bold bg-[#1e2e30] border border-[#3D4D55]/50 text-[#A79E9C] rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-30">
                {copied ? "Portfolio link copied!" : "Copy public portfolio link"}
              </span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        {(user.stats.filmsCount > 0 || user.stats.followingCount > 0 || followersCount > 0) && (
          <div className="flex justify-center sm:justify-start gap-8 py-4 border-y border-[#3D4D55]/30 mb-8 text-sm">
            {user.stats.filmsCount > 0 && (
              <div>
                <span className="font-extrabold text-[#D3C3B9] text-base mr-1.5">{user.stats.filmsCount}</span>
                <span className="text-[#A79E9C] font-medium">Films</span>
              </div>
            )}
            {user.stats.followingCount > 0 && (
              <button
                onClick={() => setActiveModal("following")}
                className="hover:opacity-80 transition-opacity text-left cursor-pointer focus:outline-none"
              >
                <span className="font-extrabold text-[#D3C3B9] text-base mr-1.5">{user.stats.followingCount}</span>
                <span className="text-[#A79E9C] font-medium">Following</span>
              </button>
            )}
            {followersCount > 0 && (
              <button
                onClick={() => setActiveModal("followers")}
                className="hover:opacity-80 transition-opacity text-left cursor-pointer focus:outline-none"
              >
                <span className="font-extrabold text-[#D3C3B9] text-base mr-1.5">{followersCount}</span>
                <span className="text-[#A79E9C] font-medium">Followers</span>
              </button>
            )}
          </div>
        )}

        {/* Tabs Bar */}
        <div className="flex border-b border-[#3D4D55]/30 mb-8 gap-6 sm:gap-8 justify-center sm:justify-start overflow-x-auto pb-px">
          {(["Watched", "Watchlist", "Reviews"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-xs sm:text-sm font-semibold tracking-wider transition-all relative cursor-pointer ${
                activeTab === tab
                  ? "text-[#D3C3B9]"
                  : "text-[#A79E9C] hover:text-[#D3C3B9]"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#B58863] to-[#d4a87c] rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Tabs Content Areas */}
        <div className="space-y-10">
          {activeTab === "Watched" && (
            <div className="space-y-12">
              {/* Taste Profile & Rating Distribution */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Taste Profile */}
                <div className="md:col-span-2 space-y-5 bg-[#103334]/40 border border-[#3D4D55]/30 p-5 rounded-2xl flex flex-col justify-between">
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.15em] text-[#A79E9C] mb-4">Taste Breakdown</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {user.tasteProfile.map((genre) => (
                        <div
                          key={genre.name}
                          className="bg-[#0f1a1b]/60 border border-[#3D4D55]/30 p-4 rounded-xl flex flex-col justify-between transition-all group relative hover:border-[#B58863]/20"
                        >
                          <div className="flex items-center justify-between text-xs font-extrabold tracking-wider text-[#D3C3B9] mb-4">
                            <span className="flex items-center gap-1.5">
                              <span>{genre.icon}</span>
                              <span>{genre.name}</span>
                            </span>
                            <span className="text-[#B58863]">{genre.percentage}%</span>
                          </div>
                          <div className="w-full bg-[#0f1a1b] h-1.5 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-[#B58863] to-[#d4a87c]"
                              style={{ width: `${genre.percentage}%` }}
                            />
                          </div>
                          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-[8px] bg-[#1e2e30] border border-[#3D4D55]/50 text-[#A79E9C] rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 font-bold uppercase tracking-wider">
                            {genre.percentage}% of logged films
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Rating Distribution */}
                <div className="bg-[#103334]/40 border border-[#3D4D55]/30 p-5 rounded-2xl">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.15em] text-[#A79E9C] mb-4">Rating Frequency</h3>
                  <div className="space-y-2.5">
                    {ratingBars.map((bar) => (
                      <div key={bar.stars} className="flex items-center gap-3 text-[10px] text-[#A79E9C]">
                        <span className="w-12 font-bold whitespace-nowrap text-[#B58863]/80 text-right">{bar.stars} ★</span>
                        <div className="flex-1 bg-[#0f1a1b] h-2 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#B58863] to-[#d4a87c] rounded-full" style={{ width: `${bar.percentage}%` }} />
                        </div>
                        <span className="w-8 text-right text-[#A79E9C] font-bold">{bar.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Favorite Cinema Showcase */}
              <div className="bg-[#103334]/40 border border-[#3D4D55]/30 p-5 rounded-2xl">
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A79E9C] mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B58863] animate-pulse" />
                  Favorite Cinema
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {favoriteShowcaseItems.map((item) => (
                    <ProfileMediaCard key={item.id} item={item as MediaItem} />
                  ))}
                </div>
              </div>

              {/* Recently Watched Section */}
              <div>
                <div className="flex items-center justify-between mb-5 group cursor-pointer">
                  <h2 className="text-lg font-bold tracking-tight text-[#D3C3B9] flex items-center gap-2">
                    Recently Watched
                  </h2>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-[#A79E9C] group-hover:text-[#D3C3B9] group-hover:translate-x-0.5 transition-all">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                </div>

                {user.watched.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                    {user.watched.map((item) => (
                      <ProfileMediaCard key={item.id} item={item} />
                    ))}
                  </div>
                ) : (
                  <p className="text-[#A79E9C] italic text-sm">No watched entries cataloged yet.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === "Watchlist" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {user.watchlist.length > 0 ? (
                user.watchlist.map((item) => (
                  <ProfileMediaCard key={item.id} item={item} />
                ))
              ) : (
                <p className="text-[#A79E9C] italic text-sm col-span-3">No movies or TV shows in watchlist yet.</p>
              )}
            </div>
          )}

          {activeTab === "Reviews" && (
            <div className="space-y-6">
              {user.reviews.length > 0 ? (
                user.reviews.map((rev) => (
                  <div key={rev.id} className="p-6 bg-[#103334]/40 border border-[#3D4D55]/30 rounded-2xl flex flex-col sm:flex-row gap-5 hover:border-[#3D4D55]/60 transition-all">
                    {rev.posterPath && (
                      <div className="w-[80px] shrink-0 mx-auto sm:mx-0 rounded-xl overflow-hidden border border-[#3D4D55]/30 aspect-[2/3] bg-[#0f1a1b] shadow-md">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`https://image.tmdb.org/t/p/w185${rev.posterPath}`}
                          alt={rev.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <Link
                          href={`/${rev.mediaType === "movie" ? "movies" : "tv"}/${rev.tmdbId}`}
                          className="text-sm font-black text-[#D3C3B9] hover:bg-gradient-to-r hover:from-[#B58863] hover:to-[#d4a87c] hover:bg-clip-text hover:text-transparent transition-all duration-300"
                        >
                          {rev.title}
                        </Link>
                        {rev.rating && (
                          <span className="text-[10px] font-bold text-[#B58863] bg-[#B58863]/10 border border-[#B58863]/20 px-2 py-0.5 rounded flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-2.5 h-2.5">
                              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                            </svg>
                            {rev.rating.toFixed(1)} / 5.0
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-[#A79E9C] leading-relaxed">{rev.content}</p>
                      <p className="text-[10px] text-[#3D4D55] mt-4">
                        Logged on {new Date(rev.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[#A79E9C] italic text-sm">No reviews posted yet.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Cover Picker Overlay Dialog */}
      {showCoverPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1e2e30] border border-[#3D4D55]/60 rounded-3xl p-6 w-full max-w-sm mx-4 shadow-2xl relative">
            <button
              onClick={() => setShowCoverPicker(false)}
              className="absolute top-4 right-4 text-[#A79E9C] hover:text-[#D3C3B9] cursor-pointer transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-xs font-black uppercase tracking-wider text-[#A79E9C] mb-4">Choose Cover Theme</h3>
            <div className="space-y-2.5">
              {coverThemes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => {
                    setCoverTheme(theme.id);
                    setShowCoverPicker(false);
                  }}
                  className={`w-full text-left p-3.5 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${
                    coverTheme === theme.id
                      ? "border-[#B58863] bg-[#B58863]/5 text-[#B58863] font-bold"
                      : "border-[#3D4D55]/40 bg-[#0f1a1b]/50 text-[#A79E9C] hover:border-[#3D4D55]/70 hover:bg-[#103334]/60"
                  }`}
                >
                  <span className="text-xs font-semibold">{theme.label}</span>
                  <div className={`w-14 h-7 rounded-lg border border-[#3D4D55]/40 overflow-hidden ${theme.class}`}>
                    {theme.img && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={theme.img} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Followers / Following Modal Dialog */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1e2e30] border border-[#3D4D55]/60 rounded-3xl p-6 w-full max-w-sm mx-4 shadow-2xl relative max-h-[75vh] flex flex-col">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-[#A79E9C] hover:text-[#D3C3B9] cursor-pointer transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-xs font-black uppercase tracking-wider text-[#A79E9C] mb-4 capitalize">
              {activeModal}
            </h3>
            <div className="overflow-y-auto divide-y divide-[#3D4D55]/30 pr-1 space-y-4">
              {activeList.map((userItem) => (
                <div key={userItem.username} className="flex items-center justify-between gap-4 pt-4 first:pt-0">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#103334] overflow-hidden shrink-0 border border-[#3D4D55]/40 flex items-center justify-center text-[#B58863] font-black text-xs uppercase shadow-inner">
                      {userItem.name.slice(0, 2)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#D3C3B9] flex items-center gap-1">
                        {userItem.name}
                        <span className="w-3.5 h-3.5 rounded-full bg-[#B58863] flex items-center justify-center text-[#0f1a1b] text-[8px] font-black leading-none">✓</span>
                      </h4>
                      <p className="text-[10px] text-[#A79E9C]">@{userItem.username}</p>
                      <p className="text-[10px] text-[#A79E9C]/70 mt-1 line-clamp-1 leading-relaxed">{userItem.bio}</p>
                    </div>
                  </div>
                  <button className="text-[9px] font-black uppercase tracking-wider px-3.5 py-1.5 bg-[#B58863]/10 hover:bg-[#B58863]/20 text-[#B58863] rounded-full transition-all border border-[#B58863]/20 cursor-pointer">
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
