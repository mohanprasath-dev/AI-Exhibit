import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { submitEntrySchema } from "@/lib/validations";
import type { GalleryFilters, PaginatedResponse, Entry } from "@/types";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const filters: GalleryFilters = {
      category: searchParams.get("category") || undefined,
      search: searchParams.get("search") || undefined,
      sortBy: (searchParams.get("sortBy") as GalleryFilters["sortBy"]) || "created_at",
      sortOrder: (searchParams.get("sortOrder") as GalleryFilters["sortOrder"]) || "desc",
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "20"),
    };

    const supabase = createClient();
    
    // Build query
    let query = supabase
      .from("entries")
      .select("*", { count: "exact" });

    // Apply category filter
    if (filters.category && filters.category !== "all") {
      query = query.eq("category", filters.category);
    }

    // Apply search filter
    if (filters.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,creator_name.ilike.%${filters.search}%,tool_used.ilike.%${filters.search}%`
      );
    }

    // Apply sorting
    const sortColumn = filters.sortBy || "created_at";
    const ascending = filters.sortOrder === "asc";
    query = query.order(sortColumn, { ascending });

    // Apply pagination
    const page = filters.page || 1;
    const limit = Math.min(filters.limit || 20, 50); // Max 50 per page
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error("Error fetching entries:", error);
      return NextResponse.json(
        { success: false, error: "Failed to fetch entries" },
        { status: 500 }
      );
    }

    const response: PaginatedResponse<Entry> = {
      data: data || [],
      total: count || 0,
      page,
      limit,
      hasMore: (count || 0) > page * limit,
    };

    return NextResponse.json({ success: true, ...response });
  } catch (error) {
    console.error("Entries API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const supabaseAuth = createClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();
    
    // User authentication is optional - entries can be submitted by guests
    // but if logged in, we'll link the entry to the user
    const userId = user?.id || null;
    
    const formData = await request.formData();
    
    // Extract form fields
    const data = {
      title: formData.get("title") as string,
      category: formData.get("category") as string,
      prompt: formData.get("prompt") as string,
      tool_used: formData.get("tool_used") as string,
      share_link: formData.get("share_link") as string || "",
      description: formData.get("description") as string,
      creator_name: formData.get("creator_name") as string,
      creator_email: formData.get("creator_email") as string,
      creator_social: formData.get("creator_social") as string || undefined,
    };

    // Get the file
    const file = formData.get("file") as File | null;

    // Validate data (without file for schema validation)
    const validationResult = submitEntrySchema.safeParse({
      ...data,
      file: file ? {
        name: file.name,
        size: file.size,
        type: file.type,
      } : null,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid submission data",
          details: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    if (!file) {
      return NextResponse.json(
        { success: false, error: "File is required" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Upload file to Supabase Storage
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `entries/${fileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("uploads")
      .upload(filePath, arrayBuffer, {
        contentType: file.type,
        cacheControl: "3600",
      });

    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      return NextResponse.json(
        { success: false, error: "Failed to upload file" },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("uploads")
      .getPublicUrl(filePath);

    // Determine file type
    const fileType = file.type.startsWith("image/")
      ? "image"
      : file.type.startsWith("video/")
      ? "video"
      : file.type.startsWith("audio/")
      ? "audio"
      : "website";

    // Insert entry into database
    const { data: entry, error: insertError } = await supabase
      .from("entries")
      .insert({
        title: data.title,
        category: data.category,
        file_url: urlData.publicUrl,
        file_type: fileType,
        prompt: data.prompt,
        tool_used: data.tool_used,
        share_link: data.share_link || null,
        description: data.description,
        creator_name: data.creator_name,
        creator_email: data.creator_email,
        user_id: userId,
        votes: 0,
        is_featured: false,
        is_winner: false,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting entry:", JSON.stringify(insertError, null, 2));
      // Try to delete uploaded file if entry insert fails
      await supabase.storage.from("uploads").remove([filePath]);
      return NextResponse.json(
        { success: false, error: `Failed to create entry: ${insertError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Entry submitted successfully",
      data: entry,
    });
  } catch (error) {
    console.error("Submit API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
