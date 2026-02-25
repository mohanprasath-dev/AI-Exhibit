"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { 
  User, 
  LogOut, 
  Upload, 
  Trophy, 
  ChevronDown,
  Settings,
  Shield
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface UserMenuProps {
  className?: string;
}

export function UserMenu({ className }: UserMenuProps) {
  const { user, signOut, isLoading, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div className="w-10 h-10 rounded-full bg-violet-900/50 animate-pulse" />
    );
  }

  if (!user) {
    return null;
  }

  const userAvatar = user.user_metadata?.avatar_url;
  const userName = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
  const userEmail = user.email;

  const menuItems = [
    { 
      icon: Upload, 
      label: "Submit Entry", 
      href: "/submit",
      color: "text-violet-300" 
    },
    { 
      icon: Trophy, 
      label: "Leaderboard", 
      href: "/leaderboard",
      color: "text-blue-400" 
    },
    ...(isAdmin ? [{ 
      icon: Shield, 
      label: "Admin Panel", 
      href: "/admin",
      color: "text-red-400" 
    }] : []),
    { 
      icon: Settings, 
      label: "Settings", 
      href: "/settings",
      color: "text-gray-400" 
    },
  ];

  return (
    <div ref={menuRef} className={cn("relative", className)}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 rounded-full bg-violet-900/50 hover:bg-violet-800/80 border border-violet-500/30 transition-colors"
      >
        {userAvatar ? (
          <Image
            src={userAvatar}
            alt={userName}
            width={36}
            height={36}
            className="rounded-full"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center text-white font-medium">
            {userName[0].toUpperCase()}
          </div>
        )}
        <ChevronDown 
          className={cn(
            "w-4 h-4 text-violet-300 mr-1 transition-transform duration-200",
            isOpen && "rotate-180"
          )} 
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-64 origin-top-right"
          >
            <div className="bg-violet-950/95 backdrop-blur-xl border border-violet-500/20 rounded-2xl shadow-xl overflow-hidden">
              {/* User Info */}
              <div className="p-4 border-b border-violet-500/20">
                <div className="flex items-center gap-3">
                  {userAvatar ? (
                    <Image
                      src={userAvatar}
                      alt={userName}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center text-white font-bold text-lg">
                      {userName[0].toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">{userName}</p>
                    <p className="text-sm text-violet-300/70 truncate">{userEmail}</p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                {menuItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                  >
                    <motion.div
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-violet-300 hover:text-white hover:bg-violet-800/60 transition-colors"
                    >
                      <item.icon className={cn("w-5 h-5", item.color)} />
                      <span>{item.label}</span>
                    </motion.div>
                  </Link>
                ))}
              </div>

              {/* Sign Out */}
              <div className="p-2 border-t border-violet-500/20">
                <motion.button
                  whileHover={{ x: 4 }}
                  onClick={() => {
                    setIsOpen(false);
                    signOut();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
