"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ExternalLink,
  Calendar,
  Wand2,
  MessageSquare,
  User,
  Share2,
  Copy,
  CheckCheck,
} from "lucide-react";
import { Entry } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VoteButton } from "@/components/VoteButton";
import { formatDate, cn } from "@/lib/utils";
import { useState } from "react";

interface LightboxModalProps {
  entry: Entry | null;
  isOpen: boolean;
  onClose: () => void;
  onVote?: (entryId: string, newVotes: number) => void;
}

export function LightboxModal({
  entry,
  isOpen,
  onClose,
  onVote,
}: LightboxModalProps) {
  const [copied, setCopied] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleCopyLink = async () => {
    if (!entry) return;
    const url = `${window.location.origin}/entry/${entry.id}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!entry) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
          onClick={onClose}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-3xl glass-premium shadow-2xl glow-pulse"
          >
            {/* Close button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>

            <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">
              {/* Media Section */}
              <div className="relative lg:w-3/5 bg-black/50 flex items-center justify-center min-h-[300px] lg:min-h-[500px]">
                {entry.file_type === "image" ? (
                  <Image
                    src={entry.file_url}
                    alt={entry.title}
                    fill
                    className="object-contain"
                    priority
                  />
                ) : entry.file_type === "video" ? (
                  <video
                    src={entry.file_url}
                    controls
                    className="max-w-full max-h-full"
                    autoPlay
                  />
                ) : entry.file_type === "audio" ? (
                  <div className="w-full p-8">
                    <div className="bg-gradient-to-br from-violet-900/30 to-purple-900/30 rounded-2xl p-8 flex flex-col items-center justify-center">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center mb-6">
                        <span className="text-5xl">🎵</span>
                      </div>
                      <audio src={entry.file_url} controls className="w-full max-w-md" />
                    </div>
                  </div>
                ) : (
                  <iframe
                    src={entry.file_url}
                    className="w-full h-full min-h-[400px] border-0"
                    title={entry.title}
                  />
                )}
              </div>

              {/* Info Section */}
              <div className="lg:w-2/5 p-6 lg:p-8 overflow-y-auto">
                <div className="space-y-6">
                  {/* Header */}
                  <div>
                    <div className="flex items-start gap-3 mb-3">
                      <Badge variant="neon">{entry.category}</Badge>
                      {entry.is_featured && <Badge>Featured</Badge>}
                      {entry.is_winner && (
                        <Badge className="bg-violet-700/50 text-violet-300 border-violet-600/50">
                          🏆 Winner
                        </Badge>
                      )}
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                      {entry.title}
                    </h2>
                    <p className="text-violet-300/50">{entry.description}</p>
                  </div>

                  {/* Creator Info */}
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-violet-950/50">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center text-white font-bold text-lg">
                      {entry.creator_name[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-white">{entry.creator_name}</p>
                      <p className="text-sm text-violet-300/50">
                        {formatDate(entry.created_at)}
                      </p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Wand2 className="w-5 h-5 text-violet-300/50 mt-0.5" />
                      <div>
                        <p className="text-sm text-violet-300/50">AI Tool Used</p>
                        <p className="text-white font-medium">{entry.tool_used}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MessageSquare className="w-5 h-5 text-violet-300/50 mt-0.5" />
                      <div>
                        <p className="text-sm text-violet-300/50">Prompt</p>
                        <p className="text-white text-sm leading-relaxed bg-white/5 p-3 rounded-xl mt-1">
                          {entry.prompt}
                        </p>
                      </div>
                    </div>

                    {entry.share_link && (
                      <div className="flex items-start gap-3">
                        <ExternalLink className="w-5 h-5 text-violet-300/50 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm text-violet-300/50">Original Share Link</p>
                          <a
                            href={entry.share_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-violet-300/50 hover:text-violet-300 transition-colors text-sm break-all"
                          >
                            {entry.share_link}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
                    <VoteButton
                      entryId={entry.id}
                      initialVotes={entry.votes}
                      onVote={onVote}
                      size="lg"
                    />

                    <div className="flex gap-2">
                      <Button
                        variant="glass"
                        className="flex-1 gap-2"
                        onClick={handleCopyLink}
                      >
                        {copied ? (
                          <>
                            <CheckCheck className="w-4 h-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy Link
                          </>
                        )}
                      </Button>
                      {entry.share_link && (
                        <Button variant="glass" className="gap-2" asChild>
                          <a
                            href={entry.share_link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="w-4 h-4" />
                            View Original
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
