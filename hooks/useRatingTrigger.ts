
import { useState, useEffect, useCallback } from 'react';
import { RatingTrigger } from '@/types/rating';
import { RatingStorageService } from '@/utils/ratingStorage';
import { StorageService } from '@/utils/storage';

export function useRatingTrigger() {
  const [pendingTriggers, setPendingTriggers] = useState<RatingTrigger[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPendingTriggers = useCallback(async () => {
    try {
      setLoading(true);
      const triggers = await RatingStorageService.getPendingTriggers();
      setPendingTriggers(triggers);
    } catch (error) {
      console.error('Error loading pending triggers:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPendingTriggers();
  }, [loadPendingTriggers]);

  const triggerRatingAfterLog = useCallback(async (
    courseId: string,
    courseName: string,
    roundId: string
  ) => {
    try {
      // Check if course already has a rating
      const existingRating = await RatingStorageService.getRatingForCourse(courseId);
      if (existingRating) {
        console.log('Course already rated, skipping trigger');
        return;
      }

      const trigger: RatingTrigger = {
        courseId,
        courseName,
        roundId,
        triggerType: 'after_log',
        triggeredAt: new Date(),
        completed: false,
      };

      await RatingStorageService.addTrigger(trigger);
      await loadPendingTriggers();
    } catch (error) {
      console.error('Error triggering rating after log:', error);
    }
  }, [loadPendingTriggers]);

  const checkSessionTriggers = useCallback(async () => {
    try {
      const lastSession = await RatingStorageService.getLastSession();
      const now = new Date();
      
      // Update current session
      await RatingStorageService.updateLastSession();
      
      // If this is a new session (more than 1 hour since last)
      if (!lastSession || (now.getTime() - lastSession.getTime()) > 3600000) {
        // Check for rounds logged in previous session that need rating
        const rounds = await StorageService.getRounds();
        const ratings = await RatingStorageService.getRatings();
        
        for (const round of rounds) {
          const hasRating = ratings.some(r => r.courseId === round.courseId);
          if (!hasRating) {
            const trigger: RatingTrigger = {
              courseId: round.courseId,
              courseName: round.courseName,
              roundId: round.id,
              triggerType: 'next_session',
              triggeredAt: now,
              completed: false,
            };
            await RatingStorageService.addTrigger(trigger);
          }
        }
        
        await loadPendingTriggers();
      }
    } catch (error) {
      console.error('Error checking session triggers:', error);
    }
  }, [loadPendingTriggers]);

  const completeTrigger = useCallback(async (courseId: string) => {
    try {
      await RatingStorageService.completeTrigger(courseId);
      await loadPendingTriggers();
    } catch (error) {
      console.error('Error completing trigger:', error);
    }
  }, [loadPendingTriggers]);

  return {
    pendingTriggers,
    loading,
    triggerRatingAfterLog,
    checkSessionTriggers,
    completeTrigger,
    refresh: loadPendingTriggers,
  };
}
