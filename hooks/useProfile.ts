
import { useState, useEffect, useCallback } from 'react';
import { UserProfile } from '@/types/golf';
import { StorageService } from '@/utils/storage';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useSupabaseAuth();

  const loadProfile = useCallback(async () => {
    try {
      console.log('useProfile: Starting to load profile');
      setLoading(true);
      setError(null);
      
      if (!user) {
        console.log('useProfile: No authenticated user, skipping profile load');
        setProfile(null);
        setLoading(false);
        return;
      }
      
      console.log('useProfile: Fetching profile for user:', user.id);
      const data = await StorageService.getProfile();
      
      if (!data) {
        console.log('useProfile: No profile found, creating default profile');
        // Create a default profile if none exists
        const defaultProfile: UserProfile = {
          username: user.email?.split('@')[0] || 'user',
          displayName: user.email?.split('@')[0] || 'User',
          email: user.email || '',
          phoneNumber: '',
          totalRounds: 0,
          totalCourses: 0,
          contactsSynced: false,
        };
        
        // Save the default profile
        await StorageService.saveProfile(defaultProfile);
        setProfile(defaultProfile);
        console.log('useProfile: Default profile created and saved');
      } else {
        console.log('useProfile: Profile loaded successfully');
        setProfile(data);
      }
    } catch (err) {
      console.error('useProfile: Error loading profile:', err);
      setError('Failed to load profile');
      
      // Even on error, try to set a minimal profile so the app doesn't get stuck
      if (user) {
        const fallbackProfile: UserProfile = {
          username: user.email?.split('@')[0] || 'user',
          displayName: user.email?.split('@')[0] || 'User',
          email: user.email || '',
          phoneNumber: '',
          totalRounds: 0,
          totalCourses: 0,
          contactsSynced: false,
        };
        setProfile(fallbackProfile);
        console.log('useProfile: Set fallback profile due to error');
      }
    } finally {
      setLoading(false);
      console.log('useProfile: Profile loading complete');
    }
  }, [user]);

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
