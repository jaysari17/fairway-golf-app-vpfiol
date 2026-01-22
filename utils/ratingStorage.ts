
import { SupabaseStorageService } from './supabaseStorage';
import { CourseRating, RatingTrigger } from '@/types/rating';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Rating storage service that uses Supabase for ratings
// AsyncStorage for local triggers and session tracking

const STORAGE_KEYS = {
  RATING_TRIGGERS: '@fairway_rating_triggers',
  LAST_SESSION: '@fairway_last_session',
  APP_REVIEW_REQUESTED: '@fairway_app_review_requested',
};

export const RatingStorageService = {
  // Ratings - Use Supabase
  async getRatings(userId?: string): Promise<CourseRating[]> {
    try {
      console.log('Fetching ratings from Supabase');
      return await SupabaseStorageService.getRatings(userId);
    } catch (error) {
      console.error('Error getting ratings:', error);
      return [];
    }
  },

  async saveRating(rating: CourseRating): Promise<void> {
    try {
      console.log('Saving rating to Supabase:', rating.courseName);
      await SupabaseStorageService.saveRating(rating);
    } catch (error) {
      console.error('Error saving rating:', error);
      throw error;
    }
  },

  async getRatingForCourse(courseId: string, userId?: string): Promise<CourseRating | null> {
    try {
      console.log('Fetching rating for course from Supabase:', courseId);
      const ratings = await SupabaseStorageService.getRatings(userId);
      return ratings.find(r => r.courseId === courseId) || null;
    } catch (error) {
      console.error('Error getting rating for course:', error);
      return null;
    }
  },

  // Rating Triggers - Keep in AsyncStorage (local UX feature)
  async getTriggers(): Promise<RatingTrigger[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.RATING_TRIGGERS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting triggers:', error);
      return [];
    }
  },

  async addTrigger(trigger: RatingTrigger): Promise<void> {
    try {
      const triggers = await this.getTriggers();
      triggers.push(trigger);
      await AsyncStorage.setItem(STORAGE_KEYS.RATING_TRIGGERS, JSON.stringify(triggers));
      console.log('Rating trigger added:', trigger.courseName);
    } catch (error) {
      console.error('Error adding trigger:', error);
      throw error;
    }
  },

  async getPendingTriggers(): Promise<RatingTrigger[]> {
    try {
      const triggers = await this.getTriggers();
      return triggers.filter(t => !t.completed);
    } catch (error) {
      console.error('Error getting pending triggers:', error);
      return [];
    }
  },

  async completeTrigger(courseId: string): Promise<void> {
    try {
      const triggers = await this.getTriggers();
      const updatedTriggers = triggers.map(t => 
        t.courseId === courseId && !t.completed 
          ? { ...t, completed: true }
          : t
      );
      await AsyncStorage.setItem(STORAGE_KEYS.RATING_TRIGGERS, JSON.stringify(updatedTriggers));
      console.log('Rating trigger completed for course:', courseId);
    } catch (error) {
      console.error('Error completing trigger:', error);
      throw error;
    }
  },

  // Session tracking - Keep in AsyncStorage
  async getLastSession(): Promise<Date | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SESSION);
      return data ? new Date(data) : null;
    } catch (error) {
      console.error('Error getting last session:', error);
      return null;
    }
  },

  async updateLastSession(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_SESSION, new Date().toISOString());
    } catch (error) {
      console.error('Error updating last session:', error);
      throw error;
    }
  },

  // App Review Tracking - Keep in AsyncStorage
  async hasRequestedAppReview(): Promise<boolean> {
    try {
      const requested = await AsyncStorage.getItem(STORAGE_KEYS.APP_REVIEW_REQUESTED);
      return requested === 'true';
    } catch (error) {
      console.error('Error checking if review requested:', error);
      return false;
    }
  },

  async markAppReviewRequested(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.APP_REVIEW_REQUESTED, 'true');
      console.log('App review marked as requested');
    } catch (error) {
      console.error('Error marking app review requested:', error);
      throw error;
    }
  },
};
