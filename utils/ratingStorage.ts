
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CourseRating, RatingTrigger } from '@/types/rating';

const STORAGE_KEYS = {
  RATINGS: '@fairway_ratings',
  RATING_TRIGGERS: '@fairway_rating_triggers',
  LAST_SESSION: '@fairway_last_session',
};

export const RatingStorageService = {
  // Ratings
  async getRatings(): Promise<CourseRating[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.RATINGS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting ratings:', error);
      return [];
    }
  },

  async saveRating(rating: CourseRating): Promise<void> {
    try {
      const ratings = await this.getRatings();
      const existingIndex = ratings.findIndex(r => r.courseId === rating.courseId);
      
      if (existingIndex !== -1) {
        ratings[existingIndex] = rating;
      } else {
        ratings.push(rating);
      }
      
      await AsyncStorage.setItem(STORAGE_KEYS.RATINGS, JSON.stringify(ratings));
    } catch (error) {
      console.error('Error saving rating:', error);
      throw error;
    }
  },

  async getRatingForCourse(courseId: string): Promise<CourseRating | null> {
    try {
      const ratings = await this.getRatings();
      return ratings.find(r => r.courseId === courseId) || null;
    } catch (error) {
      console.error('Error getting rating for course:', error);
      return null;
    }
  },

  // Rating Triggers
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
    } catch (error) {
      console.error('Error completing trigger:', error);
      throw error;
    }
  },

  // Session tracking
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
};
