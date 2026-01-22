
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Round, UserProfile, Badge } from '@/types/golf';

// TODO: Backend Integration - This file uses AsyncStorage for local data persistence
// Once backend is ready, replace these methods with API calls from utils/api.ts
// Keep AsyncStorage as a cache layer for offline support

const STORAGE_KEYS = {
  ROUNDS: '@fairway_rounds',
  PROFILE: '@fairway_profile',
  BADGES: '@fairway_badges',
  ONBOARDING_COMPLETE: '@fairway_onboarding_complete',
  AUTH_TOKEN: '@fairway_auth_token',
};

export const StorageService = {
  // Rounds
  async getRounds(): Promise<Round[]> {
    try {
      // TODO: Backend Integration - GET /api/rounds
      // Replace with: apiClient.getRounds()
      const data = await AsyncStorage.getItem(STORAGE_KEYS.ROUNDS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting rounds:', error);
      return [];
    }
  },

  async saveRound(round: Round): Promise<void> {
    try {
      // TODO: Backend Integration - POST /api/rounds
      // Replace with: apiClient.createRound(round)
      const rounds = await this.getRounds();
      rounds.push(round);
      await AsyncStorage.setItem(STORAGE_KEYS.ROUNDS, JSON.stringify(rounds));
      console.log('Round saved locally:', round.id);
    } catch (error) {
      console.error('Error saving round:', error);
      throw error;
    }
  },

  async updateRound(roundId: string, updatedRound: Round): Promise<void> {
    try {
      // TODO: Backend Integration - PUT /api/rounds/:roundId
      // Replace with: apiClient.updateRound(roundId, updatedRound)
      const rounds = await this.getRounds();
      const index = rounds.findIndex(r => r.id === roundId);
      if (index !== -1) {
        rounds[index] = updatedRound;
        await AsyncStorage.setItem(STORAGE_KEYS.ROUNDS, JSON.stringify(rounds));
        console.log('Round updated locally:', roundId);
      }
    } catch (error) {
      console.error('Error updating round:', error);
      throw error;
    }
  },

  async deleteRound(roundId: string): Promise<void> {
    try {
      // TODO: Backend Integration - DELETE /api/rounds/:roundId
      // Replace with: apiClient.deleteRound(roundId)
      const rounds = await this.getRounds();
      const filtered = rounds.filter(r => r.id !== roundId);
      await AsyncStorage.setItem(STORAGE_KEYS.ROUNDS, JSON.stringify(filtered));
      console.log('Round deleted locally:', roundId);
    } catch (error) {
      console.error('Error deleting round:', error);
      throw error;
    }
  },

  // Profile
  async getProfile(): Promise<UserProfile | null> {
    try {
      // TODO: Backend Integration - GET /api/auth/me
      // Replace with: apiClient.getMe()
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PROFILE);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting profile:', error);
      return null;
    }
  },

  async saveProfile(profile: UserProfile): Promise<void> {
    try {
      // TODO: Backend Integration - PUT /api/users/profile
      // Replace with: apiClient.updateProfile(profile)
      await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
      console.log('Profile saved locally:', profile.username);
    } catch (error) {
      console.error('Error saving profile:', error);
      throw error;
    }
  },

  // Badges
  async getBadges(): Promise<Badge[]> {
    try {
      // TODO: Backend Integration - GET /api/badges
      // Replace with: apiClient.getBadges()
      const data = await AsyncStorage.getItem(STORAGE_KEYS.BADGES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting badges:', error);
      return [];
    }
  },

  async saveBadges(badges: Badge[]): Promise<void> {
    try {
      // TODO: Backend Integration - Handled by backend automatically
      // Badges are awarded server-side via POST /api/badges/check
      await AsyncStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(badges));
      console.log('Badges saved locally, count:', badges.length);
    } catch (error) {
      console.error('Error saving badges:', error);
      throw error;
    }
  },

  // Onboarding
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

  // Authentication Token
  async getAuthToken(): Promise<string | null> {
    try {
      // TODO: Backend Integration - Store JWT token from login/register
      return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  },

  async setAuthToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
      console.log('Auth token stored');
    } catch (error) {
      console.error('Error setting auth token:', error);
      throw error;
    }
  },

  async clearAuthToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      console.log('Auth token cleared');
    } catch (error) {
      console.error('Error clearing auth token:', error);
      throw error;
    }
  },

  // Clear all data (for testing/reset)
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.ROUNDS,
        STORAGE_KEYS.PROFILE,
        STORAGE_KEYS.BADGES,
        STORAGE_KEYS.ONBOARDING_COMPLETE,
        STORAGE_KEYS.AUTH_TOKEN,
      ]);
      console.log('All local storage cleared');
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  },
};
