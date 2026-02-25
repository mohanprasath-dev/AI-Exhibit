"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "neon";
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors",
          {
            "bg-violet-900/50 text-violet-200 border border-violet-600/40": variant === "default",
            "bg-white/5 text-gray-400 border border-white/10": variant === "secondary",
            "border border-violet-600/40 text-violet-300 bg-transparent": variant === "outline",
            "bg-gradient-to-r from-violet-800/50 to-purple-700/50 text-violet-200 border border-violet-500/40":
              variant === "neon",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

export { Badge };
