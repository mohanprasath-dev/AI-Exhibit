"use client";

import { motion } from "framer-motion";
import { Category } from "@/types";
import { cn } from "@/lib/utils";

interface CategoryTabsProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  className?: string;
}

export function CategoryTabs({
  categories,
  activeCategory,
  onCategoryChange,
  className,
}: CategoryTabsProps) {
  const allCategory: Category = {
    id: "all",
    name: "All",
    slug: "all",
    icon: "✨",
    description: "All categories",
    color: "from-violet-500 to-purple-400",
    created_at: "",
  };

  const allCategories = [allCategory, ...categories];

  return (
    <div className={cn("w-full overflow-x-auto scrollbar-hide", className)}>
      <div className="flex gap-2 p-1.5 min-w-max bg-violet-950/50 backdrop-blur-xl rounded-2xl border border-violet-800/60">
        {allCategories.map((category) => {
          const isActive = activeCategory === category.slug;

          return (
            <motion.button
              key={category.id}
              onClick={() => onCategoryChange(category.slug)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "relative px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all duration-200 whitespace-nowrap",
                isActive
                  ? "text-white"
                  : "text-violet-300/70 hover:text-white"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-700/80 to-purple-800/80 border border-violet-600/50"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                />
              )}
              <span className="relative z-10 text-lg">{category.icon}</span>
              <span className="relative z-10 font-medium text-sm">{category.name}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// Static categories for use when no database connection
export const defaultCategories: Category[] = [
  {
    id: "1",
    name: "AI Art",
    slug: "ai-art",
    icon: "🎨",
    description: "AI-generated images and artwork",
    color: "from-violet-500 to-purple-600",
    created_at: "",
  },
  {
    id: "2",
    name: "AI Music",
    slug: "ai-music",
    icon: "🎵",
    description: "AI-composed music and audio",
    color: "from-purple-600 to-violet-700",
    created_at: "",
  },
  {
    id: "3",
    name: "AI Video",
    slug: "ai-video",
    icon: "🎬",
    description: "AI-generated videos and animations",
    color: "from-violet-500 to-purple-700",
    created_at: "",
  },
  {
    id: "4",
    name: "AI Text",
    slug: "ai-text",
    icon: "✍️",
    description: "AI-written stories, poems, and content",
    color: "from-violet-400 to-purple-600",
    created_at: "",
  },
  {
    id: "5",
    name: "AI Code",
    slug: "ai-code",
    icon: "💻",
    description: "AI-generated code and applications",
    color: "from-purple-600 to-violet-800",
    created_at: "",
  },
  {
    id: "6",
    name: "AI 3D",
    slug: "ai-3d",
    icon: "🎮",
    description: "AI-generated 3D models and scenes",
    color: "from-violet-500 to-purple-700",
    created_at: "",
  },
];
