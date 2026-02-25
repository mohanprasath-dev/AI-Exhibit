"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Github,
  Twitter,
  Instagram,
  Mail,
  Heart,
} from "lucide-react";

const footerLinks = {
  explore: [
    { label: "Gallery", href: "/gallery" },
    { label: "Leaderboard", href: "/leaderboard" },
    { label: "Hall of Fame", href: "/hall-of-fame" },
    { label: "Submit Entry", href: "/submit" },
  ],
  categories: [
    { label: "AI Art", href: "/gallery?category=ai-art" },
    { label: "AI Music", href: "/gallery?category=ai-music" },
    { label: "AI Video", href: "/gallery?category=ai-video" },
    { label: "AI Text", href: "/gallery?category=ai-text" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Guidelines", href: "/guidelines" },
  ],
};

const socialLinks = [
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Mail, href: "mailto:hello@aiexhibit.com", label: "Email" },
];

export function Footer() {
  return (
    <footer className="relative mt-20 border-t border-violet-800/30 bg-[hsl(260,30%,3%)]/90 backdrop-blur-2xl">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(260,30%,2%)] via-[hsl(260,30%,3%)]/50 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-2">
              <Link href="/" className="flex items-center space-x-3 group mb-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-900/30 border border-violet-400/30"
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-transparent" />
                  <Sparkles className="w-5 h-5 text-white relative z-10" />
                </motion.div>
                <span className="text-xl font-bold bg-gradient-to-r from-violet-300 via-purple-200 to-cyan-300 bg-clip-text text-transparent">
                  AI Exhibit
                </span>
              </Link>
              <p className="text-violet-300/50 text-sm max-w-sm mb-6 leading-relaxed">
                A digital showcase of AI-powered creativity. Submit your AI-generated
                art, music, videos, and more to compete for the top spots.
              </p>
              {/* Social Links */}
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 rounded-xl bg-violet-900/40 border border-violet-700/30 flex items-center justify-center text-violet-400 hover:text-white hover:bg-violet-800/60 hover:border-violet-600/50 transition-all"
                      aria-label={social.label}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.a>
                  );
                })}
              </div>
            </div>

            {/* Links */}
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Explore</h3>
              <ul className="space-y-3">
                {footerLinks.explore.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-violet-300/50 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Categories</h3>
              <ul className="space-y-3">
                {footerLinks.categories.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-violet-300/50 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Legal</h3>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-violet-300/50 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-violet-800/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-violet-300/40 text-sm text-center sm:text-left">
            © {new Date().getFullYear()} AI Exhibit. All rights reserved.
          </p>
          <p className="text-violet-300/40 text-sm flex items-center gap-1">
            Made with{" "}
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            </motion.span>{" "}
            and AI
          </p>
        </div>
      </div>
    </footer>
  );
}
