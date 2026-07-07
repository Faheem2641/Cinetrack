import { NextResponse } from "next/server";
import { searchMedia } from "@/lib/tmdb";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  if (!query.trim()) {
    return NextResponse.json([]);
  }

  try {
    const results = await searchMedia(query);
    // Return top 6 suggestion candidates
    return NextResponse.json(results.slice(0, 6));
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
