
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Round, UserProfile, Badge } from '@/types/golf';

const STORAGE_KEYS = {
  ROUNDS: '@fairway_rounds',
  PROFILE: '@fairway_profile',
  BADGES: '@fairway_badges',
  ONBOARDING_COMPLETE: '@fairway_onboarding_complete',
};

export const StorageService = {
  // Rounds
  async getRounds(): Promise<Round[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.ROUNDS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting rounds:', error);
      return [];
    }
  },

  async saveRound(round: Round): Promise<void> {
    try {
      const rounds = await this.getRounds();
      rounds.push(round);
      await AsyncStorage.setItem(STORAGE_KEYS.ROUNDS, JSON.stringify(rounds));
    } catch (error) {
      console.error('Error saving round:', error);
      throw error;
    }
  },

  async updateRound(roundId: string, updatedRound: Round): Promise<void> {
    try {
      const rounds = await this.getRounds();
      const index = rounds.findIndex(r => r.id === roundId);
      if (index !== -1) {
        rounds[index] = updatedRound;
        await AsyncStorage.setItem(STORAGE_KEYS.ROUNDS, JSON.stringify(rounds));
      }
    } catch (error) {
      console.error('Error updating round:', error);
      throw error;
    }
  },

  async deleteRound(roundId: string): Promise<void> {
    try {
      const rounds = await this.getRounds();
      const filtered = rounds.filter(r => r.id !== roundId);
      await AsyncStorage.setItem(STORAGE_KEYS.ROUNDS, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting round:', error);
      throw error;
    }
  },

  // Profile
  async getProfile(): Promise<UserProfile | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PROFILE);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting profile:', error);
      return null;
    }
  },

  async saveProfile(profile: UserProfile): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (error) {
      console.error('Error saving profile:', error);
      throw error;
    }
  },

  // Badges
  async getBadges(): Promise<Badge[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.BADGES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting badges:', error);
      return [];
    }
  },

  async saveBadges(badges: Badge[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(badges));
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
    } catch (error) {
      console.error('Error setting onboarding complete:', error);
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
      ]);
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  },
};
