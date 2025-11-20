
import { useState, useEffect, useCallback } from 'react';
import { Friend, FriendRequest, FeedEvent, Notification } from '@/types/social';
import { SocialStorageService } from '@/utils/socialStorage';

export function useSocial() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [feedEvents, setFeedEvents] = useState<FeedEvent[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>('');

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [userId, friendsData, requestsData, eventsData, notificationsData] = await Promise.all([
        SocialStorageService.getCurrentUserId(),
        SocialStorageService.getFriends(),
        SocialStorageService.getFriendRequests(),
        SocialStorageService.getFeedEvents(),
        SocialStorageService.getNotifications(),
      ]);
      setCurrentUserId(userId);
      setFriends(friendsData);
      setFriendRequests(requestsData);
      setFeedEvents(eventsData);
      setNotifications(notificationsData);
    } catch (error) {
      console.error('Error loading social data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const refresh = useCallback(async () => {
    await loadData();
  }, [loadData]);

  const sendFriendRequest = useCallback(async (toUserId: string, toUsername: string, toDisplayName: string) => {
    try {
      const request: FriendRequest = {
        id: `request_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        fromUserId: currentUserId,
        fromUsername: 'You',
        fromDisplayName: 'You',
        toUserId,
        status: 'pending',
        createdAt: new Date(),
      };
      await SocialStorageService.saveFriendRequest(request);
      await refresh();
    } catch (error) {
      console.error('Error sending friend request:', error);
      throw error;
    }
  }, [currentUserId, refresh]);

  const acceptFriendRequest = useCallback(async (requestId: string) => {
    try {
      const request = friendRequests.find(r => r.id === requestId);
      if (!request) return;

      const friend: Friend = {
        id: request.fromUserId,
        username: request.fromUsername,
        displayName: request.fromDisplayName,
        avatar: request.fromAvatar,
        totalRounds: 0,
        totalCourses: 0,
        status: 'accepted',
        requestedBy: request.fromUserId,
        requestedAt: request.createdAt,
        acceptedAt: new Date(),
      };

      await SocialStorageService.saveFriend(friend);
      
      const updatedRequest = { ...request, status: 'accepted' as const, respondedAt: new Date() };
      await SocialStorageService.saveFriendRequest(updatedRequest);

      const notification: Notification = {
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'friend_accepted',
        fromUserId: currentUserId,
        fromUsername: 'You',
        fromDisplayName: 'You',
        message: 'accepted your friend request',
        timestamp: new Date(),
        read: false,
      };
      await SocialStorageService.saveNotification(notification);

      await refresh();
    } catch (error) {
      console.error('Error accepting friend request:', error);
      throw error;
    }
  }, [friendRequests, currentUserId, refresh]);

  const declineFriendRequest = useCallback(async (requestId: string) => {
    try {
      const request = friendRequests.find(r => r.id === requestId);
      if (!request) return;

      const updatedRequest = { ...request, status: 'declined' as const, respondedAt: new Date() };
      await SocialStorageService.saveFriendRequest(updatedRequest);
      await refresh();
    } catch (error) {
      console.error('Error declining friend request:', error);
      throw error;
    }
  }, [friendRequests, refresh]);

  const removeFriend = useCallback(async (friendId: string) => {
    try {
      await SocialStorageService.removeFriend(friendId);
      await refresh();
    } catch (error) {
      console.error('Error removing friend:', error);
      throw error;
    }
  }, [refresh]);

  const likeFeedEvent = useCallback(async (eventId: string) => {
    try {
      const event = feedEvents.find(e => e.id === eventId);
      if (!event) return;

      const likes = event.likes || [];
      const hasLiked = likes.includes(currentUserId);

      const updatedEvent = {
        ...event,
        likes: hasLiked 
          ? likes.filter(id => id !== currentUserId)
          : [...likes, currentUserId],
      };

      await SocialStorageService.updateFeedEvent(eventId, updatedEvent);
      await refresh();
    } catch (error) {
      console.error('Error liking feed event:', error);
      throw error;
    }
  }, [feedEvents, currentUserId, refresh]);

  const markNotificationAsRead = useCallback(async (notificationId: string) => {
    try {
      await SocialStorageService.markNotificationAsRead(notificationId);
      await refresh();
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }, [refresh]);

  const markAllNotificationsAsRead = useCallback(async () => {
    try {
      await SocialStorageService.markAllNotificationsAsRead();
      await refresh();
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }, [refresh]);

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;
  const pendingRequestsCount = friendRequests.filter(r => r.status === 'pending' && r.toUserId === currentUserId).length;

  return {
    friends,
    friendRequests,
    feedEvents,
    notifications,
    loading,
    currentUserId,
    unreadNotificationsCount,
    pendingRequestsCount,
    refresh,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    removeFriend,
    likeFeedEvent,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  };
}
