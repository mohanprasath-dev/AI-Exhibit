import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { LeaderboardEntry, Entry } from "@/types";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "50");

    const supabase = createClient();

    // Build query
    let query = supabase
      .from("entries")
      .select("*")
      .order("votes", { ascending: false })
      .limit(Math.min(limit, 100));

    if (category && category !== "all") {
      query = query.eq("category", category);
    }

    const { data: entries, error } = await query;

    if (error) {
      console.error("Error fetching leaderboard:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch leaderboard" },
        { status: 500 }
      );
    }

    // Add rank information
    const leaderboardEntries: LeaderboardEntry[] = ((entries as Entry[]) || []).map(
      (entry: Entry, index: number) => ({
        ...entry,
        rank: index + 1,
        previousRank: undefined, // Would come from a historical table
        rankChange: "same" as const, // Would be calculated from historical data
      })
    );

    return NextResponse.json({
      success: true,
      data: leaderboardEntries,
    });
  } catch (error) {
    console.error("Leaderboard API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
