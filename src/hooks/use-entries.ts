"use client";

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Entry, GalleryFilters, PaginatedResponse } from '@/types';

interface UseEntriesOptions {
  initialFilters?: GalleryFilters;
}

export function useEntries(options: UseEntriesOptions = {}) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<GalleryFilters>(options.initialFilters || {});
  
  const supabase = createClient();

  const fetchEntries = useCallback(async (newFilters?: GalleryFilters) => {
    const currentFilters = newFilters || filters;
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('entries')
        .select('*', { count: 'exact' });

      // Apply filters
      if (currentFilters.category && currentFilters.category !== 'all') {
        query = query.eq('category', currentFilters.category);
      }

      if (currentFilters.search) {
        query = query.or(
          `title.ilike.%${currentFilters.search}%,description.ilike.%${currentFilters.search}%,creator_name.ilike.%${currentFilters.search}%`
        );
      }

      // Apply sorting
      const sortBy = currentFilters.sortBy || 'created_at';
      const sortOrder = currentFilters.sortOrder || 'desc';
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });

      // Apply pagination
      const page = currentFilters.page || 1;
      const limit = currentFilters.limit || 12;
      const start = (page - 1) * limit;
      query = query.range(start, start + limit - 1);

      const { data, error: queryError, count } = await query;

      if (queryError) throw queryError;

      setEntries(data || []);
      setTotal(count || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch entries');
    } finally {
      setIsLoading(false);
    }
  }, [filters, supabase]);

  const updateFilters = useCallback((newFilters: Partial<GalleryFilters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    fetchEntries(updated);
  }, [filters, fetchEntries]);

  const refresh = useCallback(() => {
    fetchEntries();
  }, [fetchEntries]);

  useEffect(() => {
    fetchEntries();
  }, []);

  // Subscribe to realtime updates
  useEffect(() => {
    const channel = supabase
      .channel('entries-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'entries',
        },
        () => {
          fetchEntries();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, fetchEntries]);

  return {
    entries,
    total,
    isLoading,
    error,
    filters,
    updateFilters,
    refresh,
    hasMore: entries.length < total,
  };
}
