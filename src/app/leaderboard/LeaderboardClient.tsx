"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Medal,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Crown,
  Star,
  ImageOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoryTabs, VoteButtonCompact, defaultCategories, FloatingOrb, EmptyState } from "@/components";
import { createClient } from "@/lib/supabase/client";
import { formatNumber, cn } from "@/lib/utils";
import type { Entry, LeaderboardEntry } from "@/types";

export default function LeaderboardClient() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  // Fetch leaderboard entries from Supabase
  useEffect(() => {
    async function fetchLeaderboard() {
      setIsLoading(true);
      setError(null);

      try {
        let query = supabase
          .from("entries")
          .select("*")
          .order("votes", { ascending: false })
          .limit(50);

        // Filter by category if not "all"
        if (activeCategory !== "all") {
          query = query.eq("category", activeCategory);
        }

        const { data, error: queryError } = await query;

        if (queryError) throw queryError;

        // Transform to LeaderboardEntry format with rank
        const leaderboardEntries: LeaderboardEntry[] = (data || []).map(
          (entry: Entry, index: number) => ({
            ...entry,
            rank: index + 1,
            previousRank: undefined, // Would need historical data to track
            rankChange: "same" as const,
          })
        );

        setEntries(leaderboardEntries);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        setError(err instanceof Error ? err.message : "Failed to load leaderboard");
      } finally {
        setIsLoading(false);
      }
    }

    fetchLeaderboard();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("leaderboard-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "entries",
        },
        () => {
          fetchLeaderboard();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeCategory, supabase]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg glow-pulse">
            <Crown className="w-6 h-6 text-white" />
          </div>
        );
      case 2:
        return (
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center shadow-lg shimmer-effect">
            <Medal className="w-6 h-6 text-white" />
          </div>
        );
      case 3:
        return (
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg shimmer-effect">
            <Medal className="w-6 h-6 text-white" />
          </div>
        );
      default:
        return (
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
            <span className="text-xl font-bold text-gray-400">#{rank}</span>
          </div>
        );
    }
  };

  const getRankChangeIcon = (change: LeaderboardEntry["rankChange"]) => {
    switch (change) {
      case "up":
        return (
          <span className="flex items-center gap-1 text-green-400 text-sm">
            <TrendingUp className="w-4 h-4" />
          </span>
        );
      case "down":
        return (
          <span className="flex items-center gap-1 text-red-400 text-sm">
            <TrendingDown className="w-4 h-4" />
          </span>
        );
      case "new":
        return (
          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 text-xs">
            NEW
          </Badge>
        );
      default:
        return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen py-8 relative overflow-hidden">
      {/* Background Effects */}
      <FloatingOrb size={350} color="neon-blue" className="top-40 -left-40 opacity-20" />
      <FloatingOrb size={300} color="neon-purple" delay={2} className="bottom-40 -right-40 opacity-20" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.1 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center mx-auto mb-6"
          >
            <Trophy className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Leaderboard
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            The most voted AI creations. Updated in real-time.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-10"
        >
          <CategoryTabs
            categories={defaultCategories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </motion.div>

        {/* Top 3 Podium (Desktop) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="hidden lg:grid grid-cols-3 gap-6 max-w-4xl mx-auto mb-12"
        >
          {/* Second Place */}
          <div className="flex flex-col items-center pt-12">
            {entries[1] && (
              <Link href={`/entry/${entries[1].id}`} className="group w-full">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="glass-tinted rounded-2xl p-6 text-center relative glow-card"
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center shadow-lg">
                      <span className="text-2xl font-bold text-white">2</span>
                    </div>
                  </div>
                  <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto mt-4 mb-4 ring-4 ring-gray-400/30">
                    <Image
                      src={entries[1].file_url}
                      alt={entries[1].title}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                    {entries[1].title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-2">
                    {entries[1].creator_name}
                  </p>
                  <div className="flex items-center justify-center gap-1 text-cyan-400 font-semibold">
                    <Star className="w-4 h-4" />
                    {formatNumber(entries[1].votes)}
                  </div>
                </motion.div>
              </Link>
            )}
          </div>

          {/* First Place */}
          <div className="flex flex-col items-center">
            {entries[0] && (
              <Link href={`/entry/${entries[0].id}`} className="group w-full">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="glass-premium rounded-2xl p-8 text-center relative border-2 border-cyan-500/30 glow-card animated-border"
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30"
                    >
                      <Crown className="w-8 h-8 text-white" />
                    </motion.div>
                  </div>
                  <div className="w-28 h-28 rounded-2xl overflow-hidden mx-auto mt-6 mb-4 ring-4 ring-cyan-400/30">
                    <Image
                      src={entries[0].file_url}
                      alt={entries[0].title}
                      width={112}
                      height={112}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-white text-lg group-hover:text-cyan-400 transition-colors line-clamp-1">
                    {entries[0].title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3">
                    {entries[0].creator_name}
                  </p>
                  <div className="flex items-center justify-center gap-1 text-cyan-400 font-bold text-lg">
                    <Star className="w-5 h-5" />
                    {formatNumber(entries[0].votes)}
                  </div>
                </motion.div>
              </Link>
            )}
          </div>

          {/* Third Place */}
          <div className="flex flex-col items-center pt-16">
            {entries[2] && (
              <Link href={`/entry/${entries[2].id}`} className="group w-full">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="glass rounded-2xl p-6 text-center relative"
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg">
                      <span className="text-2xl font-bold text-white">3</span>
                    </div>
                  </div>
                  <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto mt-4 mb-4 ring-4 ring-violet-500/30">
                    <Image
                      src={entries[2].file_url}
                      alt={entries[2].title}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                    {entries[2].title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-2">
                    {entries[2].creator_name}
                  </p>
                  <div className="flex items-center justify-center gap-1 text-cyan-400 font-semibold">
                    <Star className="w-4 h-4" />
                    {formatNumber(entries[2].votes)}
                  </div>
                </motion.div>
              </Link>
            )}
          </div>
        </motion.div>

        {/* Full List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <div className="glass rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-white/5 border-b border-white/10 text-gray-400 text-sm font-medium">
              <div className="col-span-1">Rank</div>
              <div className="col-span-5">Entry</div>
              <div className="col-span-2">Creator</div>
              <div className="col-span-2 text-center">Category</div>
              <div className="col-span-2 text-right">Votes</div>
            </div>

            {/* Entries */}
            <AnimatePresence mode="popLayout">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="px-6 py-4 border-b border-white/5">
                    <div className="flex items-center gap-4">
                      <Skeleton className="w-12 h-12 rounded-xl" />
                      <Skeleton className="w-16 h-16 rounded-xl" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                  </div>
                ))
              ) : entries.length === 0 ? (
                <div className="py-12">
                  <EmptyState
                    variant="gallery"
                    title="No entries yet"
                    description="Be the first to submit and claim the top spot!"
                    actionLabel="Submit Entry"
                    actionHref="/submit"
                  />
                </div>
              ) : (
                entries.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-white/5 transition-colors",
                      index < entries.length - 1 && "border-b border-white/5"
                    )}
                  >
                    {/* Rank */}
                    <div className="col-span-12 md:col-span-1 flex items-center gap-3 md:gap-0">
                      <div className="flex items-center gap-2">
                        {getRankIcon(entry.rank)}
                        <span className="md:hidden">{getRankChangeIcon(entry.rankChange)}</span>
                      </div>
                    </div>

                    {/* Entry Info */}
                    <Link
                      href={`/entry/${entry.id}`}
                      className="col-span-12 md:col-span-5 flex items-center gap-4 group"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                        <Image
                          src={entry.file_url}
                          alt={entry.title}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                          {entry.title}
                        </h3>
                        <p className="text-gray-400 text-sm line-clamp-1">
                          {entry.tool_used}
                        </p>
                      </div>
                    </Link>

                    {/* Creator */}
                    <div className="hidden md:block col-span-2">
                      <span className="text-gray-300">{entry.creator_name}</span>
                    </div>

                    {/* Category */}
                    <div className="hidden md:flex col-span-2 justify-center">
                      <Badge variant="secondary" className="text-xs">
                        {entry.category}
                      </Badge>
                    </div>

                    {/* Votes & Change */}
                    <div className="col-span-12 md:col-span-2 flex items-center justify-between md:justify-end gap-4">
                      <div className="flex items-center gap-2 md:hidden">
                        <span className="text-gray-400 text-sm">{entry.creator_name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {entry.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <VoteButtonCompact
                          entryId={entry.id}
                          initialVotes={entry.votes}
                        />
                        <span className="hidden md:block">
                          {getRankChangeIcon(entry.rankChange)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
