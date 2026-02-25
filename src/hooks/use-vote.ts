"use client";

import { useState, useCallback, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getStoredDeviceHash } from '@/lib/utils';

interface UseVoteOptions {
  entryId: string;
  initialVotes: number;
}

export function useVote({ entryId, initialVotes }: UseVoteOptions) {
  const [votes, setVotes] = useState(initialVotes);
  const [hasVoted, setHasVoted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  
  const supabase = createClient();
  const deviceHash = typeof window !== 'undefined' ? getStoredDeviceHash() : '';

  // Track online status
  useEffect(() => {
    if (typeof window === 'undefined') return;

    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Check if user has already voted
  useEffect(() => {
    if (!deviceHash || !entryId) return;

    const checkVote = async () => {
      try {
        const { data } = await supabase
          .from('votes')
          .select('id')
          .eq('entry_id', entryId)
          .eq('device_hash', deviceHash)
          .single();

        setHasVoted(!!data);
      } catch {
        // Silently fail - user can still vote
      }
    };

    checkVote();
  }, [entryId, deviceHash, supabase]);

  const vote = useCallback(async () => {
    if (hasVoted || isLoading) return;
    if (!isOnline) {
      setError("You're offline. Please check your connection.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entryId,
          deviceHash,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to vote');
      }

      setVotes(result.votes);
      setHasVoted(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to vote';
      setError(message);
      
      // Retry logic for network errors
      if (message.includes('fetch') || message.includes('network')) {
        setError("Network error. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [entryId, deviceHash, hasVoted, isLoading, isOnline]);

  return {
    votes,
    hasVoted,
    isLoading,
    error,
    isOnline,
    vote,
  };
}
