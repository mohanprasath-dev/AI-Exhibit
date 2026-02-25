"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MasonryGrid, CategoryTabs, LightboxModal, defaultCategories } from "@/components";
import { useEntries } from "@/hooks/use-entries";
import { debounce } from "@/lib/utils";
import type { Entry } from "@/types";

export default function GalleryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initialCategory = searchParams.get("category") || "all";
  const initialSearch = searchParams.get("search") || "";
  
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  
  const {
    entries,
    total,
    isLoading,
    filters,
    updateFilters,
    hasMore,
  } = useEntries({
    initialFilters: {
      category: initialCategory !== "all" ? initialCategory : undefined,
      search: initialSearch || undefined,
      sortBy: "created_at",
      sortOrder: "desc",
      limit: 24,
    },
  });

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      updateFilters({ search: query || undefined, page: 1 });
      
      // Update URL
      const params = new URLSearchParams(searchParams.toString());
      if (query) {
        params.set("search", query);
      } else {
        params.delete("search");
      }
      router.push(`/gallery?${params.toString()}`, { scroll: false });
    }, 300),
    [updateFilters, searchParams, router]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const handleCategoryChange = (category: string) => {
    updateFilters({
      category: category !== "all" ? category : undefined,
      page: 1,
    });
    
    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    if (category !== "all") {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    router.push(`/gallery?${params.toString()}`, { scroll: false });
  };

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split("-") as [
      "votes" | "created_at" | "title",
      "asc" | "desc"
    ];
    updateFilters({ sortBy, sortOrder });
  };

  const handleEntryClick = (entry: Entry) => {
    setSelectedEntry(entry);
    setIsLightboxOpen(true);
  };

  const handleLoadMore = () => {
    const nextPage = (filters.page || 1) + 1;
    updateFilters({ page: nextPage });
  };

  const clearFilters = () => {
    setSearchQuery("");
    updateFilters({
      category: undefined,
      search: undefined,
      sortBy: "created_at",
      sortOrder: "desc",
      page: 1,
    });
    router.push("/gallery", { scroll: false });
  };

  const hasActiveFilters = filters.category || filters.search;

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Gallery
          </h1>
          <p className="text-violet-300/50 max-w-2xl mx-auto">
            Explore AI-generated creations from our talented community.
            Filter by category, search, and vote for your favorites.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-violet-300/50" />
              <Input
                placeholder="Search entries..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-12 h-12"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    debouncedSearch("");
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-violet-300/50 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="flex gap-3">
              <Select
                defaultValue="created_at-desc"
                onValueChange={handleSortChange}
              >
                <SelectTrigger className="w-[180px] h-12">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at-desc">Newest First</SelectItem>
                  <SelectItem value="created_at-asc">Oldest First</SelectItem>
                  <SelectItem value="votes-desc">Most Voted</SelectItem>
                  <SelectItem value="votes-asc">Least Voted</SelectItem>
                  <SelectItem value="title-asc">A-Z</SelectItem>
                  <SelectItem value="title-desc">Z-A</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant={showFilters ? "default" : "outline"}
                className="h-12 gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
              </Button>
            </div>
          </div>

          {/* Category Tabs */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="glass rounded-2xl p-4 mb-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <CategoryTabs
                      categories={defaultCategories}
                      activeCategory={filters.category || "all"}
                      onCategoryChange={handleCategoryChange}
                    />
                    
                    {hasActiveFilters && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-violet-300/50 hover:text-white"
                      >
                        Clear all filters
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results count */}
          <div className="flex items-center justify-between">
            <p className="text-violet-300/50 text-sm">
              {isLoading ? (
                "Loading..."
              ) : (
                <>
                  Showing <span className="text-white">{entries.length}</span> of{" "}
                  <span className="text-white">{total}</span> entries
                </>
              )}
            </p>
            
            {hasActiveFilters && !showFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-violet-300/50 hover:text-white gap-1"
              >
                <X className="w-3 h-3" />
                Clear filters
              </Button>
            )}
          </div>
        </motion.div>

        {/* Gallery Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <MasonryGrid
            entries={entries}
            onEntryClick={handleEntryClick}
            loading={isLoading && entries.length === 0}
          />
        </motion.div>

        {/* Load More */}
        {hasMore && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-12"
          >
            <Button
              onClick={handleLoadMore}
              variant="outline"
              size="lg"
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Load More"
              )}
            </Button>
          </motion.div>
        )}

        {/* Loading indicator */}
        {isLoading && entries.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <Loader2 className="w-8 h-8 animate-spin text-violet-300/50 mx-auto" />
          </motion.div>
        )}
      </div>

      {/* Lightbox Modal */}
      <LightboxModal
        entry={selectedEntry}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
      />
    </div>
  );
}
