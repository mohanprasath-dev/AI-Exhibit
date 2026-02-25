import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

// Admin email list - add admin emails here
const ADMIN_EMAILS = [
  process.env.ADMIN_EMAIL || "admin@aiexhibit.com",
  // Add more admin emails as needed
];

async function isAdmin(request: NextRequest): Promise<{ isAdmin: boolean; user: { id: string; email: string } | null }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user || !user.email) {
    return { isAdmin: false, user: null };
  }
  
  const isAdminUser = ADMIN_EMAILS.includes(user.email);
  return { 
    isAdmin: isAdminUser, 
    user: { id: user.id, email: user.email } 
  };
}

// GET - Fetch all entries for admin management
export async function GET(request: NextRequest) {
  try {
    const { isAdmin: isAdminUser, user } = await isAdmin(request);
    
    if (!isAdminUser) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    
    const offset = (page - 1) * limit;
    
    const supabase = createAdminClient();
    
    let query = supabase
      .from("entries")
      .select("*", { count: "exact" });
    
    if (search) {
      query = query.or(`title.ilike.%${search}%,creator_name.ilike.%${search}%,creator_email.ilike.%${search}%`);
    }
    
    if (category && category !== "all") {
      query = query.eq("category", category);
    }
    
    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Admin entries fetch error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch entries" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      total: count || 0,
      page,
      limit,
      hasMore: (count || 0) > page * limit,
    });
  } catch (error) {
    console.error("Admin entries API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete specific entries or all entries
export async function DELETE(request: NextRequest) {
  try {
    const { isAdmin: isAdminUser, user } = await isAdmin(request);
    
    if (!isAdminUser) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { entryIds, deleteAll } = body as { entryIds?: string[]; deleteAll?: boolean };
    
    const supabase = createAdminClient();
    
    if (deleteAll) {
      // First, get all file URLs to delete from storage
      const { data: entries } = await supabase
        .from("entries")
        .select("id, file_url");
      
      if (entries && entries.length > 0) {
        // Extract file paths from URLs
        const filePaths = entries
          .map(entry => {
            try {
              const url = new URL(entry.file_url);
              const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/uploads\/(.+)/);
              return pathMatch ? pathMatch[1] : null;
            } catch {
              return null;
            }
          })
          .filter(Boolean) as string[];
        
        // Delete files from storage
        if (filePaths.length > 0) {
          await supabase.storage.from("uploads").remove(filePaths);
        }
        
        // Delete all votes first (foreign key constraint)
        await supabase.from("votes").delete().neq("id", "00000000-0000-0000-0000-000000000000");
        
        // Delete all entries
        const { error } = await supabase
          .from("entries")
          .delete()
          .neq("id", "00000000-0000-0000-0000-000000000000");
        
        if (error) {
          console.error("Delete all entries error:", error);
          return NextResponse.json(
            { success: false, error: "Failed to delete all entries" },
            { status: 500 }
          );
        }
        
        console.log(`Admin ${user?.email} deleted all entries (${entries.length} total)`);
        
        return NextResponse.json({
          success: true,
          message: `Successfully deleted all ${entries.length} entries`,
          deletedCount: entries.length,
        });
      }
      
      return NextResponse.json({
        success: true,
        message: "No entries to delete",
        deletedCount: 0,
      });
    }
    
    if (entryIds && entryIds.length > 0) {
      // Get file URLs for selected entries
      const { data: entries } = await supabase
        .from("entries")
        .select("id, file_url")
        .in("id", entryIds);
      
      if (entries && entries.length > 0) {
        // Extract file paths from URLs
        const filePaths = entries
          .map(entry => {
            try {
              const url = new URL(entry.file_url);
              const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/uploads\/(.+)/);
              return pathMatch ? pathMatch[1] : null;
            } catch {
              return null;
            }
          })
          .filter(Boolean) as string[];
        
        // Delete files from storage
        if (filePaths.length > 0) {
          await supabase.storage.from("uploads").remove(filePaths);
        }
        
        // Delete votes for these entries
        await supabase.from("votes").delete().in("entry_id", entryIds);
        
        // Delete entries
        const { error } = await supabase
          .from("entries")
          .delete()
          .in("id", entryIds);
        
        if (error) {
          console.error("Delete entries error:", error);
          return NextResponse.json(
            { success: false, error: "Failed to delete entries" },
            { status: 500 }
          );
        }
        
        console.log(`Admin ${user?.email} deleted ${entryIds.length} entries`);
        
        return NextResponse.json({
          success: true,
          message: `Successfully deleted ${entryIds.length} entries`,
          deletedCount: entryIds.length,
        });
      }
    }
    
    return NextResponse.json(
      { success: false, error: "No entries specified for deletion" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Admin delete API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
