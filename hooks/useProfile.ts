
import { useState, useEffect, useCallback } from 'react';
import { UserProfile } from '@/types/golf';
import { StorageService } from '@/utils/storage';

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await StorageService.getProfile();
      setProfile(data);
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const updateProfile = useCallback(async (updatedProfile: UserProfile) => {
    try {
      await StorageService.saveProfile(updatedProfile);
      setProfile(updatedProfile);
    } catch (err) {
      console.error('Error updating profile:', err);
      throw new Error('Failed to update profile');
    }
  }, []);

  return {
    profile,
    loading,
    error,
    updateProfile,
    refresh: loadProfile,
  };
}
