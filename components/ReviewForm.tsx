"use client";

import { useState, useTransition } from "react";
import { createReview } from "@/app/actions/review";

interface ReviewFormProps {
  tmdbId: string;
  mediaType: "movie" | "tv";
  title: string;
  posterPath: string | null;
  initialRating?: number | null;
}

export default function ReviewForm({
  tmdbId,
  mediaType,
  title,
  posterPath,
  initialRating = 0,
}: ReviewFormProps) {
  const [content, setContent] = useState("");
  const [rating, setRating] = useState<string>(initialRating ? String(initialRating) : "");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!content.trim()) {
      setError("Please write a review before submitting.");
      return;
    }

    startTransition(async () => {
      const parsedRating = rating ? parseFloat(rating) : null;
      const res = await createReview(tmdbId, mediaType, title, posterPath, content, parsedRating);
      
      if (res?.error) {
        setError(res.error);
      } else {
        setSuccess(true);
        setContent("");
      }
    });
  };

  return (
    <div className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md">
      <h3 className="text-lg font-bold text-zinc-100 mb-4">Share Your Review</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg">
            Review posted successfully!
          </div>
        )}

        <div>
          <label htmlFor="review-content" className="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">
            Review Content
          </label>
          <textarea
            id="review-content"
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your review here. What did you think of the cinematography, acting, story, or pacing?"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
            maxLength={1000}
            required
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 justify-between">
          <div className="flex items-center gap-2">
            <label htmlFor="review-rating" className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Rating:
            </label>
            <select
              id="review-rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
            >
              <option value="">No Rating</option>
              <option value="5">★★★★★ (5.0)</option>
              <option value="4.5">★★★★½ (4.5)</option>
              <option value="4">★★★★☆ (4.0)</option>
              <option value="3.5">★★★½☆ (3.5)</option>
              <option value="3">★★★☆☆ (3.0)</option>
              <option value="2.5">★★½☆☆ (2.5)</option>
              <option value="2">★★☆☆☆ (2.0)</option>
              <option value="1.5">★½☆☆☆ (1.5)</option>
              <option value="1">★☆☆☆☆ (1.0)</option>
              <option value="0.5">½☆☆☆☆ (0.5)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-indigo-600/10 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {isPending ? "Posting..." : "Post Review"}
          </button>
        </div>
      </form>
    </div>
  );
}
