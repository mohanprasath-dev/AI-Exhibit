import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Entry } from "@/types";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const supabase = createClient();

    // Build query for winners
    let query = supabase
      .from("entries")
      .select(`
        *,
        category_details:categories!entries_category_fkey(*)
      `)
      .eq("is_winner", true)
      .order("created_at", { ascending: false });

    if (category && category !== "all") {
      query = query.eq("category", category);
    }

    const { data: winners, error } = await query;

    if (error) {
      console.error("Error fetching hall of fame:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch hall of fame" },
        { status: 500 }
      );
    }

    // Add award information
    const hallOfFameEntries = ((winners as (Entry & { category_details: { name: string } })[]) || []).map((entry) => ({
      ...entry,
      award_title: `Category Head - ${entry.category_details?.name || entry.category}`,
      award_date: new Date(entry.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
    }));

    return NextResponse.json({
      success: true,
      data: hallOfFameEntries,
    });
  } catch (error) {
    console.error("Hall of Fame API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
