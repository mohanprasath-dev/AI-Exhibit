import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Entry ID is required" },
        { status: 400 }
      );
    }

    const supabase = createClient();

    const { data: entry, error } = await supabase
      .from("entries")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { success: false, error: "Entry not found" },
          { status: 404 }
        );
      }
      console.error("Error fetching entry:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch entry" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: entry,
    });
  } catch (error) {
    console.error("Entry API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
