import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createClient();

    const { data: categories, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching categories:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch categories" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Categories API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
