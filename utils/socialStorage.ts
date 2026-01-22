
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Friend, FriendRequest, FeedEvent, Notification, PrivacySettings } from '@/types/social';

// TODO: Backend Integration - This file uses AsyncStorage for local social data
// Once backend is ready, replace these methods with API calls from utils/api.ts
// Social features require real backend for multi-user functionality

const SOCIAL_STORAGE_KEYS = {
  FRIENDS: '@fairway_friends',
  FRIEND_REQUESTS: '@fairway_friend_requests',
  FEED_EVENTS: '@fairway_feed_events',
  NOTIFICATIONS: '@fairway_notifications',
  PRIVACY_SETTINGS: '@fairway_privacy_settings',
  CURRENT_USER_ID: '@fairway_current_user_id',
};

export const SocialStorageService = {
  // Current User
  async getCurrentUserId(): Promise<string> {
    try {
      // TODO: Backend Integration - Get from auth context after login
      // This should come from JWT token or API response
      let userId = await AsyncStorage.getItem(SOCIAL_STORAGE_KEYS.CURRENT_USER_ID);
      if (!userId) {
        userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await AsyncStorage.setItem(SOCIAL_STORAGE_KEYS.CURRENT_USER_ID, userId);
        console.log('Generated temporary user ID:', userId);
      }
      return userId;
    } catch (error) {
      console.error('Error getting current user ID:', error);
      return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
  },

  // Friends
  async getFriends(): Promise<Friend[]> {
    try {
      // TODO: Backend Integration - GET /api/social/following/:userId
      // Friends are users you follow who also follow you back
      const data = await AsyncStorage.getItem(SOCIAL_STORAGE_KEYS.FRIENDS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting friends:', error);
      return [];
    }
  },

  async saveFriend(friend: Friend): Promise<void> {
    try {
      // TODO: Backend Integration - POST /api/social/follow/:userId
      // Backend will handle mutual follow relationships
      const friends = await this.getFriends();
      const existingIndex = friends.findIndex(f => f.id === friend.id);
      if (existingIndex >= 0) {
        friends[existingIndex] = friend;
      } else {
        friends.push(friend);
      }
      await AsyncStorage.setItem(SOCIAL_STORAGE_KEYS.FRIENDS, JSON.stringify(friends));
      console.log('Friend saved locally:', friend.username);
    } catch (error) {
      console.error('Error saving friend:', error);
      throw error;
    }
  },

  async removeFriend(friendId: string): Promise<void> {
    try {
      // TODO: Backend Integration - DELETE /api/social/unfollow/:userId
      const friends = await this.getFriends();
      const filtered = friends.filter(f => f.id !== friendId);
      await AsyncStorage.setItem(SOCIAL_STORAGE_KEYS.FRIENDS, JSON.stringify(filtered));
      console.log('Friend removed locally:', friendId);
    } catch (error) {
      console.error('Error removing friend:', error);
      throw error;
    }
  },

  // Friend Requests
  async getFriendRequests(): Promise<FriendRequest[]> {
    try {
      // TODO: Backend Integration - GET /api/social/friend-requests
      // Returns both incoming and outgoing requests
      const data = await AsyncStorage.getItem(SOCIAL_STORAGE_KEYS.FRIEND_REQUESTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting friend requests:', error);
      return [];
    }
  },

  async saveFriendRequest(request: FriendRequest): Promise<void> {
    try {
      // TODO: Backend Integration - POST /api/social/friend-request/:userId
      const requests = await this.getFriendRequests();
      const existingIndex = requests.findIndex(r => r.id === request.id);
      if (existingIndex >= 0) {
        requests[existingIndex] = request;
      } else {
        requests.push(request);
      }
      await AsyncStorage.setItem(SOCIAL_STORAGE_KEYS.FRIEND_REQUESTS, JSON.stringify(requests));
      console.log('Friend request saved locally:', request.id);
    } catch (error) {
      console.error('Error saving friend request:', error);
      throw error;
    }
  },

  async removeFriendRequest(requestId: string): Promise<void> {
    try {
      // TODO: Backend Integration - DELETE /api/social/friend-request/:requestId
      const requests = await this.getFriendRequests();
      const filtered = requests.filter(r => r.id !== requestId);
      await AsyncStorage.setItem(SOCIAL_STORAGE_KEYS.FRIEND_REQUESTS, JSON.stringify(filtered));
      console.log('Friend request removed locally:', requestId);
    } catch (error) {
      console.error('Error removing friend request:', error);
      throw error;
    }
  },

  // Feed Events
  async getFeedEvents(): Promise<FeedEvent[]> {
    try {
      // TODO: Backend Integration - GET /api/social/feed
      // Returns feed events from followed users and self
      const data = await AsyncStorage.getItem(SOCIAL_STORAGE_KEYS.FEED_EVENTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting feed events:', error);
      return [];
    }
  },

  async saveFeedEvent(event: FeedEvent): Promise<void> {
    try {
      // TODO: Backend Integration - POST /api/social/feed
      // Backend will broadcast to followers' feeds
      const events = await this.getFeedEvents();
      events.unshift(event); // Add to beginning
      // Keep only last 100 events
      const trimmed = events.slice(0, 100);
      await AsyncStorage.setItem(SOCIAL_STORAGE_KEYS.FEED_EVENTS, JSON.stringify(trimmed));
      console.log('Feed event saved locally:', event.type);
    } catch (error) {
      console.error('Error saving feed event:', error);
      throw error;
    }
  },

  async updateFeedEvent(eventId: string, updatedEvent: FeedEvent): Promise<void> {
    try {
      // TODO: Backend Integration - Likes: POST /api/social/feed/:eventId/like
      // TODO: Backend Integration - Comments: POST /api/social/feed/:eventId/comment
      const events = await this.getFeedEvents();
      const index = events.findIndex(e => e.id === eventId);
      if (index !== -1) {
        events[index] = updatedEvent;
        await AsyncStorage.setItem(SOCIAL_STORAGE_KEYS.FEED_EVENTS, JSON.stringify(events));
        console.log('Feed event updated locally:', eventId);
      }
    } catch (error) {
      console.error('Error updating feed event:', error);
      throw error;
    }
  },

  // Notifications
  async getNotifications(): Promise<Notification[]> {
    try {
      // TODO: Backend Integration - GET /api/notifications
      const data = await AsyncStorage.getItem(SOCIAL_STORAGE_KEYS.NOTIFICATIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting notifications:', error);
      return [];
    }
  },

  async saveNotification(notification: Notification): Promise<void> {
    try {
      // TODO: Backend Integration - Notifications created automatically by backend
      // When someone follows, likes, comments, etc.
      const notifications = await this.getNotifications();
      notifications.unshift(notification);
      // Keep only last 50 notifications
      const trimmed = notifications.slice(0, 50);
      await AsyncStorage.setItem(SOCIAL_STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(trimmed));
      console.log('Notification saved locally:', notification.type);
    } catch (error) {
      console.error('Error saving notification:', error);
      throw error;
    }
  },

  async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      // TODO: Backend Integration - PUT /api/notifications/:notificationId/read
      const notifications = await this.getNotifications();
      const notification = notifications.find(n => n.id === notificationId);
      if (notification) {
        notification.read = true;
        await AsyncStorage.setItem(SOCIAL_STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
        console.log('Notification marked read:', notificationId);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  async markAllNotificationsAsRead(): Promise<void> {
    try {
      // TODO: Backend Integration - PUT /api/notifications/read-all
      const notifications = await this.getNotifications();
      notifications.forEach(n => n.read = true);
      await AsyncStorage.setItem(SOCIAL_STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
      console.log('All notifications marked read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  // Privacy Settings
  async getPrivacySettings(): Promise<PrivacySettings> {
    try {
      // TODO: Backend Integration - GET /api/privacy
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
      // TODO: Backend Integration - PUT /api/privacy
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
      await AsyncStorage.multiRemove([
        SOCIAL_STORAGE_KEYS.FRIENDS,
        SOCIAL_STORAGE_KEYS.FRIEND_REQUESTS,
        SOCIAL_STORAGE_KEYS.FEED_EVENTS,
        SOCIAL_STORAGE_KEYS.NOTIFICATIONS,
        SOCIAL_STORAGE_KEYS.PRIVACY_SETTINGS,
      ]);
      console.log('All social data cleared locally');
    } catch (error) {
      console.error('Error clearing social data:', error);
      throw error;
    }
  },
};
