import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EntryDetailClient from "./EntryDetailClient";
import type { Entry } from "@/types";

export const dynamic = 'force-dynamic';

interface EntryPageProps {
  params: { id: string };
}

export async function generateMetadata({
  params,
}: EntryPageProps): Promise<Metadata> {
  const supabase = createClient();
  const { data: entry } = await supabase
    .from("entries")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!entry) {
    return {
      title: "Entry Not Found",
    };
  }

  return {
    title: entry.title,
    description: entry.description,
    openGraph: {
      title: entry.title,
      description: entry.description,
      images: entry.file_type === "image" ? [entry.file_url] : undefined,
    },
  };
}

async function getEntry(id: string): Promise<Entry | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("entries")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return null;
    }

    return data as Entry;
  } catch {
    return null;
  }
}

async function getRelatedEntries(
  category: string,
  excludeId: string
): Promise<Entry[]> {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("entries")
      .select("*")
      .eq("category", category)
      .neq("id", excludeId)
      .order("votes", { ascending: false })
      .limit(4);

    return (data as Entry[]) || [];
  } catch {
    return [];
  }
}

export default async function EntryPage({ params }: EntryPageProps) {
  const entry = await getEntry(params.id);

  if (!entry) {
    notFound();
  }

  const relatedEntries = await getRelatedEntries(entry.category, entry.id);

  return <EntryDetailClient entry={entry} relatedEntries={relatedEntries} />;
}
