"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Loader2, WifiOff } from "lucide-react";
import { useVote } from "@/hooks/use-vote";
import { useToast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { cn, formatNumber } from "@/lib/utils";

interface VoteButtonProps {
  entryId: string;
  initialVotes: number;
  onVote?: (entryId: string, newVotes: number) => void;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "ghost";
  showCount?: boolean;
  className?: string;
}

export function VoteButton({
  entryId,
  initialVotes,
  onVote,
  size = "md",
  variant = "default",
  showCount = true,
  className,
}: VoteButtonProps) {
  const { votes, hasVoted, isLoading, error, vote, isOnline } = useVote({
    entryId,
    initialVotes,
  });
  
  // Get toast context - may be undefined if used outside provider
  let toast: ReturnType<typeof useToast> | null = null;
  try {
    toast = useToast();
  } catch {
    // Toast provider not available, will silently fail
  }

  // Show toast on successful vote
  useEffect(() => {
    if (hasVoted && toast) {
      toast.success("Thanks for voting! 🎉");
    }
  }, [hasVoted]);
  
  // Show toast on error
  useEffect(() => {
    if (error && toast) {
      toast.error(error);
    }
  }, [error]);

  const handleVote = async () => {
    if (!isOnline) {
      toast?.warning("You're offline. Please check your connection.");
      return;
    }
    await vote();
    onVote?.(entryId, votes + 1);
  };

  const sizeClasses = {
    sm: "h-9 px-3 text-sm gap-1.5",
    md: "h-11 px-4 text-base gap-2",
    lg: "h-14 px-6 text-lg gap-3",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <motion.div whileTap={{ scale: 0.95 }}>
      <Button
        onClick={handleVote}
        disabled={hasVoted || isLoading || !isOnline}
        variant={hasVoted ? "outline" : variant === "outline" ? "outline" : "default"}
        className={cn(
          "relative overflow-hidden rounded-xl font-semibold transition-all duration-200",
          sizeClasses[size],
          hasVoted && "border-violet-500/50 text-violet-300 bg-violet-950/50",
          !hasVoted && variant === "default" && "bg-gradient-to-r from-violet-600 via-purple-500 to-violet-600 text-white hover:shadow-lg hover:shadow-black/30",
          !isOnline && "opacity-50 cursor-not-allowed",
          className
        )}
        aria-label={hasVoted ? "Already voted" : isOnline ? "Vote for this entry" : "Offline - cannot vote"}
      >
        {/* Offline indicator */}
        {!isOnline && (
          <WifiOff className={cn("text-violet-400", iconSizes[size])} />
        )}
        
        {/* Animated heart */}
        {isOnline && (
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
              >
                <Loader2 className={cn("animate-spin", iconSizes[size])} />
              </motion.div>
            ) : (
              <motion.div
                key="heart"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="relative"
              >
                <Heart
                  className={cn(
                    iconSizes[size],
                    hasVoted && "fill-violet-300 text-violet-300"
                  )}
                />
                {/* Burst effect on vote */}
                {hasVoted && (
                  <motion.div
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 rounded-full bg-violet-400/50"
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Vote count */}
        {showCount && (
          <AnimatePresence mode="wait">
            <motion.span
              key={votes}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="tabular-nums"
            >
              {formatNumber(votes)}
            </motion.span>
          </AnimatePresence>
        )}

        {/* Voted text */}
        {hasVoted && (
          <span className="text-xs ml-1">Voted</span>
        )}

        {/* Ripple effect */}
        <motion.div
          className="absolute inset-0 bg-white/20 rounded-xl pointer-events-none"
          initial={{ scale: 0, opacity: 0.5 }}
          whileTap={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      </Button>
    </motion.div>
  );
}

// Compact vote button for leaderboard
export function VoteButtonCompact({
  entryId,
  initialVotes,
  onVote,
}: {
  entryId: string;
  initialVotes: number;
  onVote?: (entryId: string, newVotes: number) => void;
}) {
  const { votes, hasVoted, isLoading, vote } = useVote({
    entryId,
    initialVotes,
  });

  const handleVote = async () => {
    await vote();
    onVote?.(entryId, votes + 1);
  };

  return (
    <motion.button
      onClick={handleVote}
      disabled={hasVoted || isLoading}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors",
        hasVoted
          ? "bg-cyan-500/20 text-cyan-400"
          : "bg-white/10 text-violet-300/50 hover:bg-white/20 hover:text-white"
      )}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Heart className={cn("w-4 h-4", hasVoted && "fill-cyan-400")} />
      )}
      <span className="text-sm font-medium tabular-nums">{formatNumber(votes)}</span>
    </motion.button>
  );
}
