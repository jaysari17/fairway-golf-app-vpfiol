
import { SupabaseStorageService } from './supabaseStorage';
import { Friend, FriendRequest, FeedEvent, Notification, PrivacySettings } from '@/types/social';
import { supabase } from './supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Social storage service that uses Supabase for all social features
// AsyncStorage only for privacy settings (local preference)

const SOCIAL_STORAGE_KEYS = {
  PRIVACY_SETTINGS: '@fairway_privacy_settings',
};

export const SocialStorageService = {
  // Current User - Use Supabase Auth
  async getCurrentUserId(): Promise<string> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No authenticated user');
        return '';
      }
      return user.id;
    } catch (error) {
      console.error('Error getting current user ID:', error);
      return '';
    }
  },

  // Friends - Use Supabase (followers/following)
  async getFriends(): Promise<Friend[]> {
    try {
      console.log('Fetching friends from Supabase');
      const userId = await this.getCurrentUserId();
      if (!userId) return [];

      // Get users who follow you AND you follow back (mutual follows = friends)
      const { data: following, error: followingError } = await supabase
        .from('followers')
        .select(`
          following_id,
          profiles:following_id (user_id, username, display_name, avatar_url)
        `)
        .eq('follower_id', userId);

      if (followingError) {
        console.error('Error fetching following:', followingError);
        return [];
      }

      const { data: followers, error: followersError } = await supabase
        .from('followers')
        .select('follower_id')
        .eq('following_id', userId);

      if (followersError) {
        console.error('Error fetching followers:', followersError);
        return [];
      }

      const followerIds = new Set(followers?.map(f => f.follower_id) || []);
      
      // Filter to only mutual follows
      const friends = following
        ?.filter(f => followerIds.has(f.following_id))
        .map(f => ({
          id: f.profiles.user_id,
          username: f.profiles.username,
          displayName: f.profiles.display_name,
          avatar: f.profiles.avatar_url,
          mutualFriends: 0, // TODO: Calculate mutual friends
        })) || [];

      console.log('Friends fetched from Supabase:', friends.length);
      return friends;
    } catch (error) {
      console.error('Error getting friends:', error);
      return [];
    }
  },

  async saveFriend(friend: Friend): Promise<void> {
    try {
      console.log('Following user in Supabase:', friend.username);
      await SupabaseStorageService.followUser(friend.id);
    } catch (error) {
      console.error('Error saving friend:', error);
      throw error;
    }
  },

  async removeFriend(friendId: string): Promise<void> {
    try {
      console.log('Unfollowing user in Supabase:', friendId);
      await SupabaseStorageService.unfollowUser(friendId);
    } catch (error) {
      console.error('Error removing friend:', error);
      throw error;
    }
  },

  // Friend Requests - Use Supabase
  async getFriendRequests(): Promise<FriendRequest[]> {
    try {
      console.log('Fetching friend requests from Supabase');
      const userId = await this.getCurrentUserId();
      if (!userId) return [];

      const { data, error } = await supabase
        .from('friend_requests')
        .select(`
          *,
          from_profile:from_user_id (username, display_name, avatar_url),
          to_profile:to_user_id (username, display_name, avatar_url)
        `)
        .or(`from_user_id.eq.${userId},to_user_id.eq.${userId}`)
        .eq('status', 'pending');

      if (error) {
        console.error('Error fetching friend requests:', error);
        return [];
      }

      const requests = data?.map(r => ({
        id: r.id,
        fromUserId: r.from_user_id,
        toUserId: r.to_user_id,
        fromUsername: r.from_profile.username,
        fromDisplayName: r.from_profile.display_name,
        fromAvatar: r.from_profile.avatar_url,
        status: r.status as 'pending' | 'accepted' | 'rejected',
        createdAt: new Date(r.created_at),
      })) || [];

      console.log('Friend requests fetched from Supabase:', requests.length);
      return requests;
    } catch (error) {
      console.error('Error getting friend requests:', error);
      return [];
    }
  },

  async saveFriendRequest(request: FriendRequest): Promise<void> {
    try {
      console.log('Saving friend request to Supabase');
      const { error } = await supabase
        .from('friend_requests')
        .insert({
          from_user_id: request.fromUserId,
          to_user_id: request.toUserId,
          status: request.status,
        });

      if (error) throw error;
      console.log('Friend request saved to Supabase');
    } catch (error) {
      console.error('Error saving friend request:', error);
      throw error;
    }
  },

  async removeFriendRequest(requestId: string): Promise<void> {
    try {
      console.log('Removing friend request from Supabase:', requestId);
      const { error } = await supabase
        .from('friend_requests')
        .delete()
        .eq('id', requestId);

      if (error) throw error;
      console.log('Friend request removed from Supabase');
    } catch (error) {
      console.error('Error removing friend request:', error);
      throw error;
    }
  },

  // Feed Events - Use Supabase
  async getFeedEvents(): Promise<FeedEvent[]> {
    try {
      console.log('Fetching feed events from Supabase');
      return await SupabaseStorageService.getFeedEvents();
    } catch (error) {
      console.error('Error getting feed events:', error);
      return [];
    }
  },

  async saveFeedEvent(event: FeedEvent): Promise<void> {
    try {
      console.log('Saving feed event to Supabase:', event.type);
      await SupabaseStorageService.createFeedEvent(event);
    } catch (error) {
      console.error('Error saving feed event:', error);
      throw error;
    }
  },

  async updateFeedEvent(eventId: string, updatedEvent: FeedEvent): Promise<void> {
    try {
      console.log('Updating feed event in Supabase:', eventId);
      // For likes, use the increment function
      if (updatedEvent.likes && updatedEvent.likes.length > 0) {
        await SupabaseStorageService.likeFeedEvent(eventId);
      }
    } catch (error) {
      console.error('Error updating feed event:', error);
      throw error;
    }
  },

  // Notifications - TODO: Implement with Supabase
  async getNotifications(): Promise<Notification[]> {
    try {
      console.log('Notifications not yet implemented in Supabase');
      return [];
    } catch (error) {
      console.error('Error getting notifications:', error);
      return [];
    }
  },

  async saveNotification(notification: Notification): Promise<void> {
    console.log('Notifications not yet implemented in Supabase');
  },

  async markNotificationAsRead(notificationId: string): Promise<void> {
    console.log('Notifications not yet implemented in Supabase');
  },

  async markAllNotificationsAsRead(): Promise<void> {
    console.log('Notifications not yet implemented in Supabase');
  },

  // Privacy Settings - Keep in AsyncStorage (local preference)
  async getPrivacySettings(): Promise<PrivacySettings> {
    try {
      const data = await AsyncStorage.getItem(SOCIAL_STORAGE_KEYS.PRIVACY_SETTINGS);
      return data ? JSON.parse(data) : {
        accountVisibility: 'friends',
        showHandicap: true,
        showCourseMap: true,
        showRankingList: true,
        showRecentActivity: true,
        mutedFriends: [],
      };
    } catch (error) {
      console.error('Error getting privacy settings:', error);
      return {
        accountVisibility: 'friends',
        showHandicap: true,
        showCourseMap: true,
        showRankingList: true,
        showRecentActivity: true,
        mutedFriends: [],
      };
    }
  },

  async savePrivacySettings(settings: PrivacySettings): Promise<void> {
    try {
      await AsyncStorage.setItem(SOCIAL_STORAGE_KEYS.PRIVACY_SETTINGS, JSON.stringify(settings));
      console.log('Privacy settings saved locally');
    } catch (error) {
      console.error('Error saving privacy settings:', error);
      throw error;
    }
  },

  // Clear all social data
  async clearAllSocialData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(SOCIAL_STORAGE_KEYS.PRIVACY_SETTINGS);
      console.log('Local social data cleared (Supabase data remains)');
    } catch (error) {
      console.error('Error clearing social data:', error);
      throw error;
    }
  },
};
