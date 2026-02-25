"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  color: string;
}

export function LiveBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isClient, setIsClient] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);

    // Generate particles
    const colors = [
      "rgba(139, 92, 246, 0.6)",   // violet
      "rgba(168, 85, 247, 0.5)",   // purple
      "rgba(6, 182, 212, 0.5)",    // cyan
      "rgba(34, 211, 238, 0.4)",   // light cyan
      "rgba(192, 132, 252, 0.5)",  // light purple
    ];

    const newParticles: Particle[] = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 20 + 15,
      opacity: Math.random() * 0.5 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    setParticles(newParticles);

    // Update scroll position for parallax
    const handleScroll = () => {
      document.documentElement.style.setProperty(
        "--scroll-y",
        `${window.scrollY}px`
      );
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isClient) return null;

  return (
    <div ref={containerRef} className="live-bg">
      {/* Animated mesh gradient */}
      <div className="live-bg-mesh" />

      {/* Aurora effect */}
      <div className="live-bg-aurora" />

      {/* Twinkling stars */}
      <div className="live-bg-stars" />

      {/* Floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            width: particle.size,
            height: particle.size,
            background: particle.color,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
          }}
          initial={{ y: "100vh", opacity: 0 }}
          animate={{
            y: "-10vh",
            opacity: [0, particle.opacity, particle.opacity, 0],
          }}
          transition={{
            duration: particle.speed,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: "linear",
          }}
        />
      ))}

      {/* Large floating orbs */}
      <motion.div
        className="absolute w-[350px] h-[350px] rounded-full opacity-15"
        style={{
          background:
            "radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)",
          filter: "blur(50px)",
          left: "10%",
          top: "20%",
        }}
        animate={{
          x: [0, 50, 0, -50, 0],
          y: [0, -30, 0, 30, 0],
          scale: [1, 1.1, 1, 0.95, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-[280px] h-[280px] rounded-full opacity-12"
        style={{
          background:
            "radial-gradient(circle, rgba(6, 182, 212, 0.5) 0%, transparent 70%)",
          filter: "blur(40px)",
          right: "15%",
          bottom: "30%",
        }}
        animate={{
          x: [0, -40, 0, 40, 0],
          y: [0, 40, 0, -40, 0],
          scale: [1, 0.95, 1, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5,
        }}
      />

      <motion.div
        className="absolute w-[250px] h-[250px] rounded-full opacity-8"
        style={{
          background:
            "radial-gradient(circle, rgba(168, 85, 247, 0.5) 0%, transparent 70%)",
          filter: "blur(35px)",
          left: "50%",
          top: "60%",
        }}
        animate={{
          x: [0, 30, 0, -30, 0],
          y: [0, -20, 0, 20, 0],
          scale: [1, 1.05, 1, 1.08, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 10,
        }}
      />
    </div>
  );
}
