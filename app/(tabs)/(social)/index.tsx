
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Platform,
  Alert,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { FeedEventCard } from '@/components/social/FeedEventCard';
import { FriendRequestCard } from '@/components/social/FriendRequestCard';
import { useSocial } from '@/hooks/useSocial';
import { useRounds } from '@/hooks/useRounds';
import { colors } from '@/styles/commonStyles';
import { SocialStorageService } from '@/utils/socialStorage';
import { FeedEvent } from '@/types/social';

export default function SocialFeedScreen() {
  const theme = useTheme();
  const router = useRouter();
  const {
    friends,
    friendRequests,
    feedEvents,
    loading,
    currentUserId,
    pendingRequestsCount,
    refresh,
    acceptFriendRequest,
    declineFriendRequest,
    likeFeedEvent,
  } = useSocial();
  const { rounds } = useRounds();
  const [refreshing, setRefreshing] = useState(false);

  // Generate sample feed events from user's rounds for demo
  useEffect(() => {
    const generateSampleFeed = async () => {
      if (feedEvents.length === 0 && rounds.length > 0) {
        const sampleEvents: FeedEvent[] = rounds.slice(0, 5).map((round, index) => ({
          id: `event_${Date.now()}_${index}`,
          userId: currentUserId,
          username: 'You',
          displayName: 'You',
          type: 'round_logged' as const,
          timestamp: new Date(round.date),
          courseId: round.courseId,
          courseName: round.courseName,
          courseLocation: round.courseLocation,
          rating: round.rating,
          score: round.score,
          likes: [],
          comments: [],
        }));

        for (const event of sampleEvents) {
          await SocialStorageService.saveFeedEvent(event);
        }
        await refresh();
      }
    };

    if (!loading) {
      generateSampleFeed();
    }
  }, [loading, rounds, feedEvents.length, currentUserId, refresh]);

  const onRefresh = async () => {
    console.log('User refreshing social feed');
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const handleComment = (eventId: string) => {
    console.log('User tapped comment button for event:', eventId);
    router.push({
      pathname: '/comment-modal',
      params: { eventId },
    });
  };

  const pendingRequests = friendRequests.filter(
    r => r.status === 'pending' && r.toUserId === currentUserId
  );

  // Sort feed by timestamp (most recent first)
  const sortedFeed = [...feedEvents].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  if (loading) {
    return (
      <SafeAreaView 
        style={[styles.safeArea, { backgroundColor: theme.colors.background }]} 
        edges={['top']}
      >
        <View style={styles.loadingContainer}>
          <LoadingSpinner message="Loading feed..." />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView 
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]} 
      edges={['top']}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>FAIRWAY</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => Alert.alert('Coming Soon', 'Search feature will be available soon!')}
            activeOpacity={0.7}
          >
            <IconSymbol
              ios_icon_name="magnifyingglass"
              android_material_icon_name="search"
              size={24}
              color={theme.colors.text}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => Alert.alert('Coming Soon', 'Notifications will be available soon!')}
            activeOpacity={0.7}
          >
            <IconSymbol
              ios_icon_name="bell"
              android_material_icon_name="notifications"
              size={24}
              color={theme.colors.text}
            />
            {pendingRequestsCount > 0 && (
              <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                <Text style={styles.badgeText}>{pendingRequestsCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {pendingRequests.length > 0 && (
          <View style={styles.requestsSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Friend Requests
            </Text>
            {pendingRequests.map((request, index) => (
              <FriendRequestCard
                key={index}
                request={request}
                onAccept={acceptFriendRequest}
                onDecline={declineFriendRequest}
              />
            ))}
          </View>
        )}

        {friends.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>👥</Text>
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
              Connect with Friends
            </Text>
            <Text style={[styles.emptyText, { color: theme.dark ? '#9CA3AF' : '#6B7280' }]}>
              Add friends to see their golf activity, compare courses, and share your journey
            </Text>
            <TouchableOpacity
              onPress={() => {
                console.log('User tapped Find Friends button');
                router.push('/find-friends');
              }}
              style={[styles.primaryButton, { backgroundColor: colors.primary }]}
              activeOpacity={0.8}
            >
              <IconSymbol
                ios_icon_name="person.badge.plus"
                android_material_icon_name="person_add"
                size={20}
                color="#FFFFFF"
              />
              <Text style={styles.primaryButtonText}>Find Friends</Text>
            </TouchableOpacity>
          </View>
        ) : sortedFeed.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>⛳</Text>
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
              No Activity Yet
            </Text>
            <Text style={[styles.emptyText, { color: theme.dark ? '#9CA3AF' : '#6B7280' }]}>
              Your friends haven&apos;t logged any rounds yet. Be the first to share your golf activity!
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/modal')}
              style={[styles.primaryButton, { backgroundColor: colors.primary }]}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Log a Round</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.feedSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Recent Activity
            </Text>
            {sortedFeed.map((event, index) => (
              <FeedEventCard
                key={index}
                event={event}
                currentUserId={currentUserId}
                onLike={likeFeedEvent}
                onComment={handleComment}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 8,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 20 : 8,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  requestsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  feedSection: {
    marginBottom: 24,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    boxShadow: '0px 2px 8px rgba(127, 229, 200, 0.3)',
    elevation: 3,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
