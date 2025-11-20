
import * as StoreReview from 'expo-store-review';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  APP_REVIEW_REQUESTED: '@fairway_app_review_requested',
  APP_REVIEW_COUNT: '@fairway_app_review_count',
  LAST_REVIEW_REQUEST: '@fairway_last_review_request',
};

export class AppStoreReviewService {
  /**
   * Request app store review following best practices
   * - Only after meaningful interactions (completing ratings)
   * - Maximum 3 times per year
   * - At least 30 days between requests
   */
  static async requestReview(): Promise<void> {
    try {
      // Check if review is available on this platform
      const isAvailable = await StoreReview.isAvailableAsync();
      if (!isAvailable) {
        console.log('Store review not available on this platform');
        return;
      }

      // Check if we should show the review prompt
      const shouldShow = await this.shouldShowReviewPrompt();
      if (!shouldShow) {
        console.log('Review prompt conditions not met');
        return;
      }

      // Request the review
      await StoreReview.requestReview();
      
      // Update tracking
      await this.markReviewRequested();
      
      console.log('App store review requested successfully');
    } catch (error) {
      console.error('Error requesting app store review:', error);
      // Don't throw - we don't want to interrupt user flow
    }
  }

  /**
   * Check if we should show the review prompt based on:
   * - Not requested more than 3 times
   * - At least 30 days since last request
   * - User has completed meaningful actions
   */
  private static async shouldShowReviewPrompt(): Promise<boolean> {
    try {
      // Check request count
      const count = await this.getReviewRequestCount();
      if (count >= 3) {
        console.log('Maximum review requests reached (3)');
        return false;
      }

      // Check time since last request
      const lastRequest = await this.getLastReviewRequest();
      if (lastRequest) {
        const daysSinceLastRequest = (Date.now() - lastRequest.getTime()) / (1000 * 60 * 60 * 24);
        if (daysSinceLastRequest < 30) {
          console.log(`Only ${Math.floor(daysSinceLastRequest)} days since last request`);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Error checking review prompt conditions:', error);
      return false;
    }
  }

  /**
   * Mark that we've requested a review
   */
  private static async markReviewRequested(): Promise<void> {
    try {
      // Increment count
      const count = await this.getReviewRequestCount();
      await AsyncStorage.setItem(STORAGE_KEYS.APP_REVIEW_COUNT, String(count + 1));
      
      // Update last request time
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_REVIEW_REQUEST, new Date().toISOString());
      
      // Mark as requested (legacy flag)
      await AsyncStorage.setItem(STORAGE_KEYS.APP_REVIEW_REQUESTED, 'true');
    } catch (error) {
      console.error('Error marking review requested:', error);
    }
  }

  /**
   * Get the number of times we've requested a review
   */
  private static async getReviewRequestCount(): Promise<number> {
    try {
      const count = await AsyncStorage.getItem(STORAGE_KEYS.APP_REVIEW_COUNT);
      return count ? parseInt(count, 10) : 0;
    } catch (error) {
      console.error('Error getting review request count:', error);
      return 0;
    }
  }

  /**
   * Get the date of the last review request
   */
  private static async getLastReviewRequest(): Promise<Date | null> {
    try {
      const date = await AsyncStorage.getItem(STORAGE_KEYS.LAST_REVIEW_REQUEST);
      return date ? new Date(date) : null;
    } catch (error) {
      console.error('Error getting last review request:', error);
      return null;
    }
  }

  /**
   * Check if we've ever requested a review (legacy method)
   */
  static async hasRequestedAppReview(): Promise<boolean> {
    try {
      const requested = await AsyncStorage.getItem(STORAGE_KEYS.APP_REVIEW_REQUESTED);
      return requested === 'true';
    } catch (error) {
      console.error('Error checking if review requested:', error);
      return false;
    }
  }

  /**
   * Reset review tracking (for testing)
   */
  static async resetReviewTracking(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.APP_REVIEW_REQUESTED);
      await AsyncStorage.removeItem(STORAGE_KEYS.APP_REVIEW_COUNT);
      await AsyncStorage.removeItem(STORAGE_KEYS.LAST_REVIEW_REQUEST);
      console.log('Review tracking reset');
    } catch (error) {
      console.error('Error resetting review tracking:', error);
    }
  }
}
