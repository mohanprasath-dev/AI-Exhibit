import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, ImageIcon, Trophy, Upload, Users, Star, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/server";
import { formatNumber } from "@/lib/utils";
import type { Entry } from "@/types";
import HomeClient from "./HomeClient";

// Fetch real stats from database
async function getStats() {
  try {
    const supabase = createClient();
    
    // Get counts
    const [entriesResult, votesResult, creatorsResult] = await Promise.all([
      supabase.from("entries").select("*", { count: "exact", head: true }),
      supabase.from("votes").select("*", { count: "exact", head: true }),
      supabase.from("entries").select("creator_name"),
    ]);

    const uniqueCreators = new Set(
      (creatorsResult.data as { creator_name: string }[] | null)?.map((e) => e.creator_name) || []
    ).size;

    return {
      submissions: entriesResult.count || 0,
      votes: votesResult.count || 0,
      creators: uniqueCreators || 0,
      categories: 6,
    };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return { submissions: 0, votes: 0, creators: 0, categories: 6 };
  }
}

// Fetch featured entries from database
async function getFeaturedEntries(): Promise<Entry[]> {
  try {
    const supabase = createClient();
    
    // Try to get featured entries first
    let { data, error } = await supabase
      .from("entries")
      .select("*")
      .eq("is_featured", true)
      .order("votes", { ascending: false })
      .limit(8);

    if (error) throw error;
    
    // If no featured entries, get top voted entries
    if (!data || data.length === 0) {
      const result = await supabase
        .from("entries")
        .select("*")
        .order("votes", { ascending: false })
        .limit(8);
      
      data = result.data;
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching featured entries:", error);
    return [];
  }
}

// Skeleton for stats
function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="glass rounded-2xl p-6 text-center">
          <Skeleton className="w-12 h-12 rounded-xl mx-auto mb-4" />
          <Skeleton className="h-10 w-20 mx-auto mb-2" />
          <Skeleton className="h-4 w-16 mx-auto" />
        </div>
      ))}
    </div>
  );
}

// Skeleton for entries
function EntriesSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="glass rounded-2xl overflow-hidden">
          <Skeleton className="aspect-square" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Stats Section Component
async function StatsSection() {
  const stats = await getStats();

  const statsData = [
    { label: "Submissions", value: stats.submissions, icon: ImageIcon, gradient: "from-cyan-500/20 to-blue-500/20" },
    { label: "Total Votes", value: stats.votes, icon: Star, gradient: "from-blue-500/20 to-violet-500/20" },
    { label: "Creators", value: stats.creators, icon: Users, gradient: "from-violet-500/20 to-purple-500/20" },
    { label: "Categories", value: stats.categories, icon: Trophy, gradient: "from-emerald-500/20 to-cyan-500/20" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {statsData.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="glass rounded-2xl p-6 text-center group cursor-default hover:scale-105 hover:-translate-y-1 transition-all duration-200"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-cyan-500/20 transition-shadow`}>
              <Icon className="w-6 h-6 text-cyan-400" />
            </div>
            <p className="text-3xl md:text-4xl font-bold text-white mb-1">
              {formatNumber(stat.value)}
            </p>
            <p className="text-gray-400 text-sm">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
}

// Empty State Component
function EmptyEntriesState() {
  return (
    <div className="glass rounded-2xl p-12 text-center max-w-md mx-auto">
      <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6">
        <ImageOff className="w-10 h-10 text-gray-500" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">No Entries Yet</h3>
      <p className="text-gray-400 mb-6">
        Be the first to showcase your AI creation!
      </p>
      <Link href="/submit">
        <Button className="gap-2">
          <Sparkles className="w-4 h-4" />
          Submit Your Entry
        </Button>
      </Link>
    </div>
  );
}

// Entry Card Component (Server Side)
function EntryCard({ entry }: { entry: Entry }) {
  return (
    <Link href={`/entry/${entry.id}`} className="group block">
      <div className="glass rounded-2xl overflow-hidden hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={entry.file_url}
            alt={entry.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white text-sm font-medium truncate">{entry.creator_name}</span>
            <span className="flex items-center gap-1 text-white text-sm">
              <Star className="w-4 h-4 fill-cyan-400 text-cyan-400" />
              {formatNumber(entry.votes)}
            </span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-white truncate group-hover:text-cyan-400 transition-colors">
            {entry.title}
          </h3>
          <p className="text-gray-400 text-sm truncate">{entry.tool_used}</p>
        </div>
      </div>
    </Link>
  );
}

// Featured Entries Section
async function FeaturedEntriesSection() {
  const entries = await getFeaturedEntries();

  if (entries.length === 0) {
    return <EmptyEntriesState />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {entries.map((entry) => (
        <EntryCard key={entry.id} entry={entry} />
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero Section - Client Component for animations */}
      <HomeClient />

      {/* Stats Section */}
      <section className="py-16 relative z-10">
        <div className="container mx-auto px-4">
          <Suspense fallback={<StatsSkeleton />}>
            <StatsSection />
          </Suspense>
        </div>
      </section>

      {/* Featured Entries Section */}
      <section className="py-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Featured Creations
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Discover the most popular AI-generated works from our community
            </p>
          </div>

          {/* Entries Grid */}
          <Suspense fallback={<EntriesSkeleton />}>
            <FeaturedEntriesSection />
          </Suspense>

          {/* View All Button */}
          <div className="text-center mt-12">
            <Link href="/gallery">
              <Button size="lg" variant="outline" className="gap-2 group">
                View All Entries
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <div className="relative rounded-3xl overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-violet-500/20" />
            <div className="absolute inset-0 backdrop-blur-3xl" />
            
            {/* Content */}
            <div className="relative p-8 md:p-16 text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-8">
                <Upload className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Ready to Showcase Your AI Creation?
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of creators sharing their AI-generated masterpieces.
                Submit your entry today and compete for the top spots!
              </p>
              
              <Link href="/submit">
                <Button size="xl" className="gap-2 group">
                  Submit Your Entry
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
