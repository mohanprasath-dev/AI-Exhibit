"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Eye, ExternalLink, Play, Music, Code } from "lucide-react";
import { Entry } from "@/types";
import { Badge } from "@/components/ui/badge";
import { VoteButton } from "@/components/VoteButton";
import { cn, formatNumber, formatRelativeTime, getCategoryGradient } from "@/lib/utils";

interface EntryCardProps {
  entry: Entry;
  onView?: (entry: Entry) => void;
  onVote?: (entryId: string, newVotes: number) => void;
  showVoteButton?: boolean;
  className?: string;
  priority?: boolean;
}

export function EntryCard({
  entry,
  onView,
  onVote,
  showVoteButton = true,
  className,
  priority = false,
}: EntryCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    onView?.(entry);
  };

  // 3D tilt effect on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  const getMediaIcon = () => {
    switch (entry.file_type) {
      case "video":
        return <Play className="w-8 h-8" />;
      case "audio":
        return <Music className="w-8 h-8" />;
      case "website":
        return <Code className="w-8 h-8" />;
      default:
        return null;
    }
  };

  const gradientClass = getCategoryGradient(entry.category);

  return (
    <motion.div
      ref={cardRef}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.25 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => {
        setIsHovered(false);
        handleMouseLeave();
      }}
      onMouseMove={handleMouseMove}
      style={{
        rotateX: rotation.x,
        rotateY: rotation.y,
        transformStyle: 'preserve-3d' as any,
      }}
      className={cn(
        "group relative rounded-2xl overflow-hidden cursor-pointer card-3d glow-card",
        "bg-violet-950/60 backdrop-blur-xl border border-violet-700/80",
        "hover:border-violet-500/80",
        "transition-all duration-200",
        className
      )}
      onClick={handleClick}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {!imageError && entry.file_url ? (
          <Image
            src={entry.file_url}
            alt={entry.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className={cn(
            "absolute inset-0 bg-gradient-to-br flex items-center justify-center text-white/50",
            gradientClass
          )}>
            {getMediaIcon() || (
              <span className="text-4xl font-bold">{entry.title[0]}</span>
            )}
          </div>
        )}

        {/* Overlay on hover */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
        />

        {/* Media type indicator */}
        {entry.file_type !== "image" && (
          <div className="absolute top-3 left-3 z-10">
            <div className="w-10 h-10 rounded-xl bg-black/50 backdrop-blur-sm flex items-center justify-center text-white">
              {getMediaIcon()}
            </div>
          </div>
        )}

        {/* Featured badge */}
        {entry.is_featured && (
          <div className="absolute top-3 right-3 z-10">
            <Badge variant="neon">Featured</Badge>
          </div>
        )}

        {/* Winner badge */}
        {entry.is_winner && (
          <div className="absolute top-3 right-3 z-10">
            <Badge variant="neon" className="bg-violet-700/50 border-violet-600/50">
              🏆 Winner
            </Badge>
          </div>
        )}

        {/* Quick actions on hover */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
              className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <Eye className="w-5 h-5" />
            </motion.button>
            {entry.share_link && (
              <motion.a
                href={entry.share_link}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
                className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
              </motion.a>
            )}
          </div>
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <Heart className="w-4 h-4" />
            <span>{formatNumber(entry.votes)}</span>
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-white line-clamp-1 group-hover:text-violet-200 transition-colors">
            {entry.title}
          </h3>
          <Badge variant="secondary" className="flex-shrink-0 text-xs">
            {entry.tool_used}
          </Badge>
        </div>

        <p className="text-violet-300/50 text-sm line-clamp-2 mb-3">
          {entry.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center text-xs text-white font-medium">
              {entry.creator_name[0].toUpperCase()}
            </div>
            <span className="text-violet-300/50 text-sm">{entry.creator_name}</span>
          </div>
          <span className="text-violet-300/50 text-xs">
            {formatRelativeTime(entry.created_at)}
          </span>
        </div>

        {showVoteButton && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <VoteButton
              entryId={entry.id}
              initialVotes={entry.votes}
              onVote={onVote}
              size="sm"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
