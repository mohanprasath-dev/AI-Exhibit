"use client";

import Link from "next/link";
import { LucideIcon, ImageOff, FolderOpen, Search, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EmptyStateVariant = "default" | "gallery" | "search" | "inbox";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  variant?: EmptyStateVariant;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

const variantConfig: Record<EmptyStateVariant, { icon: LucideIcon; title: string; description: string }> = {
  default: {
    icon: FolderOpen,
    title: "Nothing here yet",
    description: "There's nothing to display at the moment.",
  },
  gallery: {
    icon: ImageOff,
    title: "No entries found",
    description: "Be the first to showcase your AI creation!",
  },
  search: {
    icon: Search,
    title: "No results found",
    description: "Try adjusting your search or filter to find what you're looking for.",
  },
  inbox: {
    icon: Inbox,
    title: "All caught up!",
    description: "You have no new notifications.",
  },
};

export function EmptyState({
  title,
  description,
  icon,
  variant = "default",
  actionLabel,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) {
  const config = variantConfig[variant];
  const Icon = icon || config.icon;
  const displayTitle = title || config.title;
  const displayDescription = description || config.description;

  const ActionButton = () => {
    if (!actionLabel) return null;

    const button = (
      <Button 
        onClick={onAction}
        className="mt-6"
      >
        {actionLabel}
      </Button>
    );

    if (actionHref) {
      return <Link href={actionHref}>{button}</Link>;
    }

    return button;
  };

  return (
    <div
      className={cn(
        "glass rounded-2xl p-12 text-center max-w-md mx-auto",
        className
      )}
    >
      <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6">
        <Icon className="w-10 h-10 text-gray-500" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{displayTitle}</h3>
      <p className="text-gray-400">{displayDescription}</p>
      <ActionButton />
    </div>
  );
}

export default EmptyState;
