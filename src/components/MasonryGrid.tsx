"use client";

import Masonry from "react-masonry-css";
import { motion, AnimatePresence } from "framer-motion";
import { Entry } from "@/types";
import { EntryCard } from "@/components/EntryCard";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface MasonryGridProps {
  entries: Entry[];
  onEntryClick?: (entry: Entry) => void;
  onVote?: (entryId: string, newVotes: number) => void;
  loading?: boolean;
  className?: string;
}

const breakpointColumns = {
  default: 4,
  1536: 4,
  1280: 3,
  1024: 3,
  768: 2,
  640: 1,
};

export function MasonryGrid({
  entries,
  onEntryClick,
  onVote,
  loading = false,
  className,
}: MasonryGridProps) {
  if (loading) {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", className)}>
        {Array.from({ length: 8 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
          <span className="text-4xl">🎨</span>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No entries found</h3>
        <p className="text-gray-400 max-w-md">
          Try adjusting your filters or be the first to submit an entry in this category!
        </p>
      </motion.div>
    );
  }

  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className={cn("flex -ml-6 w-auto", className)}
      columnClassName="pl-6 bg-clip-padding"
    >
      <AnimatePresence mode="popLayout">
        {entries.map((entry, index) => (
          <motion.div
            key={entry.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className="mb-6"
          >
            <EntryCard
              entry={entry}
              onView={onEntryClick}
              onVote={onVote}
              priority={index < 4}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </Masonry>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white/5 border-2 border-white/10">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Skeleton className="w-6 h-6 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </div>
  );
}

// Alternative CSS Grid version for simpler layouts
export function GridLayout({
  entries,
  onEntryClick,
  onVote,
  loading = false,
  columns = 4,
  className,
}: MasonryGridProps & { columns?: number }) {
  if (loading) {
    return (
      <div
        className={cn(
          "grid gap-6",
          `grid-cols-1 md:grid-cols-2 lg:grid-cols-${Math.min(columns, 3)} xl:grid-cols-${columns}`,
          className
        )}
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid gap-6",
        "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className
      )}
    >
      <AnimatePresence mode="popLayout">
        {entries.map((entry, index) => (
          <motion.div
            key={entry.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
          >
            <EntryCard
              entry={entry}
              onView={onEntryClick}
              onVote={onVote}
              priority={index < 4}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
