import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export const dynamic = 'force-dynamic';

// Admin email list - should match the one in entries route
const ADMIN_EMAILS = [
  process.env.ADMIN_EMAIL || "admin@aiexhibit.com",
];

async function isAdmin(request: NextRequest): Promise<boolean> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user || !user.email) {
    return false;
  }
  
  return ADMIN_EMAILS.includes(user.email);
}

export async function GET(request: NextRequest) {
  try {
    if (!(await isAdmin(request))) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const supabase = createAdminClient();
    
    // Get total entries count
    const { count: totalEntries } = await supabase
      .from("entries")
      .select("*", { count: "exact", head: true });
    
    // Get total votes count
    const { count: totalVotes } = await supabase
      .from("votes")
      .select("*", { count: "exact", head: true });
    
    // Get entries by category
    const { data: categoryData } = await supabase
      .from("entries")
      .select("category");
    
    const categoryCounts: Record<string, number> = {};
    categoryData?.forEach(entry => {
      categoryCounts[entry.category] = (categoryCounts[entry.category] || 0) + 1;
    });
    
    // Get featured entries count
    const { count: featuredCount } = await supabase
      .from("entries")
      .select("*", { count: "exact", head: true })
      .eq("is_featured", true);
    
    // Get winners count
    const { count: winnersCount } = await supabase
      .from("entries")
      .select("*", { count: "exact", head: true })
      .eq("is_winner", true);
    
    // Get recent submissions (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { count: recentSubmissions } = await supabase
      .from("entries")
      .select("*", { count: "exact", head: true })
      .gte("created_at", sevenDaysAgo.toISOString());
    
    // Get top entries by votes
    const { data: topEntries } = await supabase
      .from("entries")
      .select("id, title, creator_name, votes, category")
      .order("votes", { ascending: false })
      .limit(5);

    return NextResponse.json({
      success: true,
      stats: {
        totalEntries: totalEntries || 0,
        totalVotes: totalVotes || 0,
        featuredCount: featuredCount || 0,
        winnersCount: winnersCount || 0,
        recentSubmissions: recentSubmissions || 0,
        categoryCounts,
        topEntries: topEntries || [],
      },
    });
  } catch (error) {
    console.error("Admin stats API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
