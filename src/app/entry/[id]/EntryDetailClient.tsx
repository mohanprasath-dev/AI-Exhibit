"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  Wand2,
  MessageSquare,
  Share2,
  Copy,
  CheckCheck,
  Twitter,
  Facebook,
  Linkedin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VoteButton, EntryCard, FloatingOrb } from "@/components";
import { formatDate, cn } from "@/lib/utils";
import type { Entry } from "@/types";

interface EntryDetailClientProps {
  entry: Entry;
  relatedEntries: Entry[];
}

export default function EntryDetailClient({
  entry,
  relatedEntries,
}: EntryDetailClientProps) {
  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleCopyLink = async () => {
    const url = window.location.href;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = `Check out "${entry.title}" on AI Exhibit`;

  const socialLinks = [
    {
      name: "Twitter",
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "Facebook",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`,
    },
  ];

  return (
    <div className="min-h-screen py-8 relative overflow-hidden">
      {/* Background Effects */}
      <FloatingOrb size={400} color="neon-blue" className="top-20 -left-40 opacity-30" />
      <FloatingOrb size={300} color="neon-purple" delay={2} className="bottom-40 -right-20 opacity-30" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link href="/gallery">
            <Button variant="ghost" className="gap-2 text-gray-400 hover:text-white">
              <ArrowLeft className="w-4 h-4" />
              Back to Gallery
            </Button>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            {/* Media Display */}
            <div className="relative rounded-3xl overflow-hidden bg-black/50 mb-8">
              {entry.file_type === "image" && !imageError ? (
                <div className="relative aspect-video">
                  <Image
                    src={entry.file_url}
                    alt={entry.title}
                    fill
                    className="object-contain"
                    priority
                    onError={() => setImageError(true)}
                  />
                </div>
              ) : entry.file_type === "video" ? (
                <video
                  src={entry.file_url}
                  controls
                  className="w-full aspect-video"
                  poster={entry.file_url + "?poster=true"}
                />
              ) : entry.file_type === "audio" ? (
                <div className="aspect-video bg-gradient-to-br from-violet-700/30 to-violet-800/30 flex flex-col items-center justify-center p-8">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-32 h-32 rounded-full bg-gradient-to-br from-violet-600 to-violet-700 flex items-center justify-center mb-8"
                  >
                    <span className="text-6xl">🎵</span>
                  </motion.div>
                  <audio src={entry.file_url} controls className="w-full max-w-lg" />
                </div>
              ) : (
                <iframe
                  src={entry.file_url}
                  className="w-full aspect-video border-0"
                  title={entry.title}
                  sandbox="allow-scripts allow-same-origin"
                />
              )}

              {/* Badges overlay */}
              <div className="absolute top-4 left-4 flex gap-2">
                {entry.is_featured && <Badge variant="neon">Featured</Badge>}
                {entry.is_winner && (
                  <Badge className="bg-violet-700/50 text-violet-300 border-violet-600/50">
                    🏆 Winner
                  </Badge>
                )}
              </div>
            </div>

            {/* Title and Votes (Mobile) */}
            <div className="lg:hidden mb-8">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="neon">{entry.category}</Badge>
                <Badge variant="secondary">{entry.tool_used}</Badge>
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">{entry.title}</h1>
              <VoteButton
                entryId={entry.id}
                initialVotes={entry.votes}
                size="lg"
              />
            </div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-2xl p-6 mb-8"
            >
              <h2 className="text-lg font-semibold text-white mb-3">Description</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {entry.description}
              </p>
            </motion.div>

            {/* Prompt */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-6 mb-8"
            >
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-5 h-5 text-violet-300/50" />
                <h2 className="text-lg font-semibold text-white">Prompt Used</h2>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap font-mono text-sm">
                  {entry.prompt}
                </p>
              </div>
            </motion.div>

            {/* Share Link */}
            {entry.share_link && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass rounded-2xl p-6 mb-8"
              >
                <div className="flex items-center gap-2 mb-3">
                  <ExternalLink className="w-5 h-5 text-violet-300/50" />
                  <h2 className="text-lg font-semibold text-white">Original Source</h2>
                </div>
                <a
                  href={entry.share_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-violet-300/50 hover:text-violet-300 transition-colors"
                >
                  {entry.share_link}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </motion.div>
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            {/* Title and Votes (Desktop) */}
            <div className="hidden lg:block mb-8">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="neon">{entry.category}</Badge>
                <Badge variant="secondary">{entry.tool_used}</Badge>
              </div>
              <h1 className="text-3xl font-bold text-white mb-6">{entry.title}</h1>
              <VoteButton
                entryId={entry.id}
                initialVotes={entry.votes}
                size="lg"
              />
            </div>

            {/* Creator Info */}
            <div className="glass rounded-2xl p-6 mb-6">
              <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-4">
                Created By
              </h3>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-violet-700 flex items-center justify-center text-white font-bold text-xl">
                  {entry.creator_name[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-white text-lg">
                    {entry.creator_name}
                  </p>
                  <p className="text-gray-400 text-sm flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(entry.created_at)}
                  </p>
                </div>
              </div>
              {entry.creator_social && (
                <a
                  href={entry.creator_social}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-violet-300/50 hover:text-violet-300 transition-colors text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Profile
                </a>
              )}
            </div>

            {/* AI Tool Info */}
            <div className="glass rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Wand2 className="w-5 h-5 text-violet-300/50" />
                <h3 className="text-sm text-gray-400 uppercase tracking-wider">
                  AI Tool Used
                </h3>
              </div>
              <p className="text-white font-semibold text-lg">{entry.tool_used}</p>
            </div>

            {/* Share */}
            <div className="glass rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Share2 className="w-5 h-5 text-violet-300/50" />
                <h3 className="text-sm text-gray-400 uppercase tracking-wider">
                  Share
                </h3>
              </div>
              
              <Button
                onClick={handleCopyLink}
                variant="glass"
                className="w-full gap-2 mb-4"
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

              <div className="flex justify-center gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                      aria-label={`Share on ${social.name}`}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Entries */}
        {relatedEntries.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <h2 className="text-2xl font-bold text-white mb-8">
              More in {entry.category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedEntries.map((relatedEntry, index) => (
                <motion.div
                  key={relatedEntry.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <EntryCard
                    entry={relatedEntry}
                    onView={() => (window.location.href = `/entry/${relatedEntry.id}`)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
