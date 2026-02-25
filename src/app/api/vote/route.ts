import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { voteSchema } from "@/lib/validations";
import { headers } from "next/headers";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validationResult = voteSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request data",
          details: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { entryId, deviceHash } = validationResult.data;

    // Get client IP address
    const headersList = await headers();
    const forwardedFor = headersList.get("x-forwarded-for");
    const realIp = headersList.get("x-real-ip");
    const ipAddress = forwardedFor?.split(",")[0] || realIp || "unknown";

    const supabase = createClient();

    // Check if user has already voted (using device hash)
    const { data: existingVote, error: checkError } = await supabase
      .from("votes")
      .select("id")
      .eq("entry_id", entryId)
      .eq("device_hash", deviceHash)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 = no rows returned (expected if no vote exists)
      console.error("Error checking existing vote:", checkError);
      return NextResponse.json(
        { success: false, error: "Failed to check vote status" },
        { status: 500 }
      );
    }

    if (existingVote) {
      return NextResponse.json(
        { success: false, error: "You have already voted for this entry" },
        { status: 409 }
      );
    }

    // Also check IP-based voting (additional protection)
    const { data: ipVote, error: ipCheckError } = await supabase
      .from("votes")
      .select("id")
      .eq("entry_id", entryId)
      .eq("ip_address", ipAddress)
      .single();

    if (ipCheckError && ipCheckError.code !== "PGRST116") {
      console.error("Error checking IP vote:", ipCheckError);
    }

    if (ipVote) {
      return NextResponse.json(
        { success: false, error: "Vote already recorded from this network" },
        { status: 409 }
      );
    }

    // Insert the vote
    const { error: insertError } = await supabase.from("votes").insert({
      entry_id: entryId,
      device_hash: deviceHash,
      ip_address: ipAddress,
    });

    if (insertError) {
      console.error("Error inserting vote:", insertError);
      return NextResponse.json(
        { success: false, error: "Failed to record vote" },
        { status: 500 }
      );
    }

    // Increment the vote count on the entry
    const { data: updatedEntry, error: updateError } = await supabase
      .rpc("increment_votes", { entry_id: entryId });

    if (updateError) {
      console.error("Error updating vote count:", updateError);
      // Vote was recorded, but count wasn't updated - not a critical failure
    }

    return NextResponse.json({
      success: true,
      message: "Vote recorded successfully",
      data: { votes: updatedEntry?.votes || null },
    });
  } catch (error) {
    console.error("Vote API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const entryId = searchParams.get("entryId");
    const deviceHash = searchParams.get("deviceHash");

    if (!entryId || !deviceHash) {
      return NextResponse.json(
        { success: false, error: "Missing entryId or deviceHash" },
        { status: 400 }
      );
    }

    const supabase = createClient();

    const { data: existingVote, error } = await supabase
      .from("votes")
      .select("id")
      .eq("entry_id", entryId)
      .eq("device_hash", deviceHash)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error checking vote status:", error);
      return NextResponse.json(
        { success: false, error: "Failed to check vote status" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      hasVoted: !!existingVote,
    });
  } catch (error) {
    console.error("Vote check API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
