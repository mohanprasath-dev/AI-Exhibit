"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Upload, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HomeClient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [revealProgress, setRevealProgress] = useState(0);
  const [isFullyRevealed, setIsFullyRevealed] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const scratchDataRef = useRef<boolean[][]>([]);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const mouseTrackRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Initialize client-side
  useEffect(() => {
    setIsClient(true);
    // Check if already revealed in session
    const revealed = sessionStorage.getItem("heroRevealed");
    if (revealed === "true") {
      setIsFullyRevealed(true);
      setRevealProgress(100);
    }

    // Track cursor position for spotlight effect
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      // Update CSS custom properties for gradient effects
      document.documentElement.style.setProperty('--cursor-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--cursor-y', `${e.clientY}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Initialize scratch canvas
  useEffect(() => {
    if (!isClient || isFullyRevealed) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const updateCanvasSize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      // Initialize scratch tracking grid (10px cells)
      const cols = Math.ceil(rect.width / 10);
      const rows = Math.ceil(rect.height / 10);
      scratchDataRef.current = Array(rows)
        .fill(null)
        .map(() => Array(cols).fill(false));

      // Fill with monochrome overlay
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "rgba(8, 8, 12, 0.97)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, [isClient, isFullyRevealed]);

  // Scratch function
  const scratch = useCallback(
    (x: number, y: number) => {
      if (isFullyRevealed) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const rect = canvas.getBoundingClientRect();
      const canvasX = x - rect.left;
      const canvasY = y - rect.top;

      // Draw scratch with gradient
      const brushSize = 70;
      const gradient = ctx.createRadialGradient(
        canvasX,
        canvasY,
        0,
        canvasX,
        canvasY,
        brushSize
      );
      gradient.addColorStop(0, "rgba(0, 0, 0, 1)");
      gradient.addColorStop(0.5, "rgba(0, 0, 0, 0.8)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(canvasX, canvasY, brushSize, 0, Math.PI * 2);
      ctx.fill();

      // Draw line from last position for smooth scratching
      if (lastPosRef.current) {
        ctx.lineWidth = brushSize * 1.5;
        ctx.lineCap = "round";
        ctx.strokeStyle = "rgba(0, 0, 0, 1)";
        ctx.beginPath();
        ctx.moveTo(lastPosRef.current.x - rect.left, lastPosRef.current.y - rect.top);
        ctx.lineTo(canvasX, canvasY);
        ctx.stroke();
      }
      lastPosRef.current = { x, y };

      // Update scratch tracking
      const gridX = Math.floor(canvasX / 10);
      const gridY = Math.floor(canvasY / 10);
      const scratchData = scratchDataRef.current;

      // Mark cells in brush radius as scratched
      const cellRadius = Math.ceil(brushSize / 10);
      for (let dy = -cellRadius; dy <= cellRadius; dy++) {
        for (let dx = -cellRadius; dx <= cellRadius; dx++) {
          const ny = gridY + dy;
          const nx = gridX + dx;
          if (
            ny >= 0 &&
            ny < scratchData.length &&
            nx >= 0 &&
            nx < scratchData[0].length
          ) {
            scratchData[ny][nx] = true;
          }
        }
      }

      // Calculate progress
      let scratched = 0;
      let total = 0;
      for (const row of scratchData) {
        for (const cell of row) {
          total++;
          if (cell) scratched++;
        }
      }
      const progress = Math.round((scratched / total) * 100);
      setRevealProgress(progress);

      // Auto-reveal at 50%
      if (progress >= 50 && !isFullyRevealed) {
        setIsFullyRevealed(true);
        sessionStorage.setItem("heroRevealed", "true");
      }
    },
    [isFullyRevealed]
  );

  // Mouse/touch handlers - trigger on any movement
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      scratch(e.clientX, e.clientY);
    },
    [scratch]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      scratch(touch.clientX, touch.clientY);
    },
    [scratch]
  );

  const handleMouseLeave = useCallback(() => {
    lastPosRef.current = null;
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background effects (orbs/particles provided by global LiveBackground) */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Spotlight cursor effect */}
        <div className="absolute inset-0 pointer-events-none spotlight-container" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(139, 92, 246, 0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.4) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Scratch Canvas Overlay */}
      <AnimatePresence>
        {!isFullyRevealed && isClient && (
          <motion.canvas
            ref={canvasRef}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-20 cursor-crosshair"
            style={{ touchAction: "none" }}
          />
        )}
      </AnimatePresence>

      {/* Progress indicator */}
      {!isFullyRevealed && isClient && (
        <div className="absolute top-4 sm:top-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2">
          <div className="px-4 py-2 rounded-full bg-violet-950/80 backdrop-blur-xl border border-violet-700/50">
            <p className="text-violet-300 text-xs sm:text-sm font-mono">
              Scratch to reveal: {revealProgress}%
            </p>
          </div>
          <div className="w-36 sm:w-48 h-1 rounded-full bg-violet-800/30 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-violet-500 to-cyan-400"
              animate={{ width: `${revealProgress}%` }}
              transition={{ type: "spring", stiffness: 100 }}
            />
          </div>
        </div>
      )}

      {/* Hero Content */}
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-violet-900/30 backdrop-blur-xl border border-violet-600/40 mb-6 sm:mb-8"
          >
            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
            <span className="text-xs sm:text-sm text-violet-200">
              Celebrating AI Creativity
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-4 sm:mb-6"
          >
            <span className="bg-gradient-to-r from-violet-300 via-purple-200 to-cyan-300 bg-clip-text text-transparent">
              AI Exhibit
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-base sm:text-xl md:text-2xl text-violet-300/80 mb-8 sm:mb-10 max-w-2xl mx-auto px-4"
          >
            A digital showcase of AI-powered creativity.
            <br className="hidden sm:block" />
            Submit, vote, and discover amazing AI creations.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4"
          >
            <Link href="/gallery" className="w-full sm:w-auto">
              <Button size="lg" variant="premium" className="gap-2 group w-full sm:w-auto sm:min-w-[180px]">
                Explore Gallery
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/submit" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto sm:min-w-[180px]">
                <Upload className="w-5 h-5" />
                Submit Entry
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-6 h-10 rounded-full border-2 border-violet-600/50 flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-1.5 h-1.5 rounded-full bg-violet-400"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
