
import { useState, useEffect, useCallback } from 'react';
import { Round } from '@/types/golf';
import { StorageService } from '@/utils/storage';

export function useRounds() {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRounds = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await StorageService.getRounds();
      setRounds(data);
    } catch (err) {
      console.error('Error loading rounds:', err);
      setError('Failed to load rounds');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRounds();
  }, [loadRounds]);

  const addRound = useCallback(async (round: Round) => {
    try {
      await StorageService.saveRound(round);
      await loadRounds();
    } catch (err) {
      console.error('Error adding round:', err);
      throw new Error('Failed to add round');
    }
  }, [loadRounds]);

  const updateRound = useCallback(async (roundId: string, updatedRound: Round) => {
    try {
      await StorageService.updateRound(roundId, updatedRound);
      await loadRounds();
    } catch (err) {
      console.error('Error updating round:', err);
      throw new Error('Failed to update round');
    }
  }, [loadRounds]);

  const deleteRound = useCallback(async (roundId: string) => {
    try {
      await StorageService.deleteRound(roundId);
      await loadRounds();
    } catch (err) {
      console.error('Error deleting round:', err);
      throw new Error('Failed to delete round');
    }
  }, [loadRounds]);

  return {
    rounds,
    loading,
    error,
    addRound,
    updateRound,
    deleteRound,
    refresh: loadRounds,
  };
}
