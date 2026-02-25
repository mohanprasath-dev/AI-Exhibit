"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles, Trophy, Image, Upload, Award, LogIn, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { UserMenu, AuthModal } from "@/components/auth";

const navLinks = [
  { href: "/", label: "Home", icon: Sparkles },
  { href: "/gallery", label: "Gallery", icon: Image },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/hall-of-fame", label: "Hall of Fame", icon: Award },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const pathname = usePathname();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "glass-premium border-b border-violet-800/40 shadow-2xl shadow-violet-900/20"
            : "bg-transparent"
        )}
      >
        {/* Animated gradient border on scroll */}
        <div className={cn(
          "absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent transition-opacity duration-300",
          scrolled ? "opacity-100" : "opacity-0"
        )} />

        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group relative z-10">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-violet-600 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-900/40 border border-violet-400/30 overflow-hidden"
              >
                {/* Chrome shine effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-transparent" />
                <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent" />
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white relative z-10" />

                {/* Hover glow */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-cyan-400/30 to-fuchsia-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
              </motion.div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-violet-300 via-purple-200 to-cyan-300 bg-clip-text text-transparent">
                  AI Exhibit
                </span>
                <span className="text-[10px] text-violet-400 tracking-widest uppercase hidden sm:block">
                  Creative AI Gallery
                </span>
              </div>
            </Link>

            {/* Desktop Navigation - Center */}
            <div className="hidden lg:flex items-center">
              <div className="flex items-center glass-premium rounded-2xl p-1.5">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;

                  return (
                    <Link key={link.href} href={link.href}>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                          "relative px-4 xl:px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-200",
                          isActive
                            ? "text-white"
                            : "text-violet-300/70 hover:text-white"
                        )}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeNav"
                            className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-800/60 to-violet-900/60 border border-violet-600/30 shadow-lg shadow-black/20"
                            transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                          />
                        )}
                        <Icon className="w-4 h-4 relative z-10" />
                        <span className="relative z-10 font-medium text-sm">{link.label}</span>
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* CTA Button & Auth - Right */}
            <div className="hidden lg:flex items-center gap-3">
              {isLoading ? (
                <div className="w-10 h-10 rounded-xl bg-violet-900/50 animate-pulse" />
              ) : user ? (
                <>
                  <Link href="/submit">
                    <Button size="lg" variant="premium" className="gap-2 group">
                      <Upload className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span className="hidden xl:inline">Submit Entry</span>
                      <span className="xl:hidden">Submit</span>
                    </Button>
                  </Link>
                  <UserMenu />
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    className="gap-2 text-violet-300/70 hover:text-white"
                    onClick={() => setShowAuthModal(true)}
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="hidden xl:inline">Sign In</span>
                  </Button>
                  <Link href="/submit">
                    <Button size="lg" variant="premium" className="gap-2 group">
                      <Upload className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span className="hidden xl:inline">Submit Entry</span>
                      <span className="xl:hidden">Submit</span>
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                "lg:hidden p-2.5 rounded-xl transition-all duration-200 relative z-10",
                isOpen
                  ? "bg-violet-900/80 text-white"
                  : "bg-violet-950/50 backdrop-blur-sm border border-violet-800/40 text-violet-300 hover:text-white hover:bg-violet-900/60"
              )}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Mobile Menu Panel */}
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-[hsl(260,30%,4%)]/95 backdrop-blur-2xl z-50 lg:hidden border-l border-violet-800/40 shadow-2xl shadow-black/50 overflow-y-auto"
            >
              {/* Mobile menu header */}
                <div className="sticky top-0 flex items-center justify-between p-4 sm:p-6 border-b border-violet-800/40 bg-[hsl(260,30%,4%)]/90 backdrop-blur-xl">
                <span className="text-lg font-semibold text-white">Menu</span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl bg-violet-900/60 text-violet-300 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Mobile menu content */}
              <div className="p-4 sm:p-6 space-y-2">
                {navLinks.map((link, index) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;

                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 + 0.1 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center justify-between px-4 py-4 rounded-xl transition-all duration-200",
                          isActive
                            ? "bg-gradient-to-r from-violet-900/60 to-violet-900/30 text-white border border-violet-700/40"
                            : "text-violet-300/70 hover:bg-violet-900/40 hover:text-white"
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center",
                            isActive
                              ? "bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-black/20 text-white"
                              : "bg-violet-900/50"
                          )}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="font-medium text-base">{link.label}</span>
                        </div>
                        <ChevronRight className={cn(
                          "w-5 h-5 transition-transform",
                          isActive ? "text-violet-400" : "text-violet-600"
                        )} />
                      </Link>
                    </motion.div>
                  );
                })}

                {/* Divider */}
                <div className="py-4">
                  <div className="h-px bg-gradient-to-r from-transparent via-violet-700/40 to-transparent" />
                </div>

                {/* Auth section */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.05 + 0.15 }}
                  className="space-y-3"
                >
                  {user ? (
                    <Link href="/submit" onClick={() => setIsOpen(false)}>
                      <Button className="w-full gap-2 h-12" size="lg" variant="premium">
                        <Upload className="w-5 h-5" />
                        Submit Entry
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        className="w-full gap-2 h-12"
                        size="lg"
                        onClick={() => {
                          setIsOpen(false);
                          setTimeout(() => setShowAuthModal(true), 200);
                        }}
                      >
                        <LogIn className="w-5 h-5" />
                        Sign In
                      </Button>
                      <Link href="/submit" onClick={() => setIsOpen(false)}>
                        <Button className="w-full gap-2 h-12" size="lg" variant="premium">
                          <Upload className="w-5 h-5" />
                          Submit Entry
                        </Button>
                      </Link>
                    </>
                  )}
                </motion.div>
              </div>

              {/* Bottom brand */}
              <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-violet-800/30 bg-[hsl(260,30%,4%)]/50">
                <div className="flex items-center gap-3 opacity-50">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-800 to-purple-900 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-violet-400" />
                  </div>
                  <span className="text-sm text-violet-400/60">AI Exhibit © 2026</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}
