
import { SupabaseStorageService } from './supabaseStorage';
import { Round, UserProfile, Badge } from '@/types/golf';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage service that uses Supabase for data persistence
// Falls back to AsyncStorage for onboarding state and local caching

const STORAGE_KEYS = {
  ONBOARDING_COMPLETE: '@fairway_onboarding_complete',
};

export const StorageService = {
  // Rounds - Use Supabase
  async getRounds(userId?: string): Promise<Round[]> {
    try {
      console.log('Fetching rounds from Supabase');
      return await SupabaseStorageService.getRounds(userId);
    } catch (error) {
      console.error('Error getting rounds:', error);
      return [];
    }
  },

  async saveRound(round: Round): Promise<void> {
    try {
      console.log('Saving round to Supabase:', round.id);
      await SupabaseStorageService.saveRound(round);
    } catch (error) {
      console.error('Error saving round:', error);
      throw error;
    }
  },

  async updateRound(roundId: string, updatedRound: Round): Promise<void> {
    try {
      console.log('Updating round in Supabase:', roundId);
      await SupabaseStorageService.updateRound(roundId, updatedRound);
    } catch (error) {
      console.error('Error updating round:', error);
      throw error;
    }
  },

  async deleteRound(roundId: string): Promise<void> {
    try {
      console.log('Deleting round from Supabase:', roundId);
      await SupabaseStorageService.deleteRound(roundId);
    } catch (error) {
      console.error('Error deleting round:', error);
      throw error;
    }
  },

  // Profile - Use Supabase
  async getProfile(userId?: string): Promise<UserProfile | null> {
    try {
      console.log('Fetching profile from Supabase');
      return await SupabaseStorageService.getProfile(userId);
    } catch (error) {
      console.error('Error getting profile:', error);
      return null;
    }
  },

  async saveProfile(profile: UserProfile): Promise<void> {
    try {
      console.log('Saving profile to Supabase:', profile.username);
      await SupabaseStorageService.saveProfile(profile);
    } catch (error) {
      console.error('Error saving profile:', error);
      throw error;
    }
  },

  // Badges - Use Supabase
  async getBadges(userId?: string): Promise<Badge[]> {
    try {
      console.log('Fetching badges from Supabase');
      return await SupabaseStorageService.getBadges(userId);
    } catch (error) {
      console.error('Error getting badges:', error);
      return [];
    }
  },

  async saveBadges(badges: Badge[]): Promise<void> {
    try {
      console.log('Saving badges to Supabase, count:', badges.length);
      // Save each badge individually
      for (const badge of badges) {
        await SupabaseStorageService.awardBadge(badge);
      }
    } catch (error) {
      console.error('Error saving badges:', error);
      throw error;
    }
  },

  // Onboarding - Keep in AsyncStorage (local only)
  async isOnboardingComplete(): Promise<boolean> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE);
      return data === 'true';
    } catch (error) {
      console.error('Error checking onboarding:', error);
      return false;
    }
  },

  async setOnboardingComplete(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, 'true');
      console.log('Onboarding marked complete');
    } catch (error) {
      console.error('Error setting onboarding complete:', error);
      throw error;
    }
  },

  // Authentication Token - Handled by Supabase Auth
  async getAuthToken(): Promise<string | null> {
    console.log('Auth tokens are managed by Supabase Auth');
    return null;
  },

  async setAuthToken(token: string): Promise<void> {
    console.log('Auth tokens are managed by Supabase Auth');
  },

  async clearAuthToken(): Promise<void> {
    console.log('Auth tokens are managed by Supabase Auth');
  },

  // Clear all data (for testing/reset)
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.ONBOARDING_COMPLETE);
      console.log('Local storage cleared (Supabase data remains)');
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  },
};
