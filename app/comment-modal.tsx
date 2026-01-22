
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { SocialStorageService } from '@/utils/socialStorage';
import { StorageService } from '@/utils/storage';
import { FeedEvent, FeedComment } from '@/types/social';
import * as Haptics from 'expo-haptics';

export default function CommentModal() {
  const theme = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const eventId = params.eventId as string;
  
  const [event, setEvent] = useState<FeedEvent | null>(null);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvent();
  }, [eventId]);

  const loadEvent = async () => {
    try {
      console.log('Loading event for comments:', eventId);
      const events = await SocialStorageService.getFeedEvents();
      const foundEvent = events.find(e => e.id === eventId);
      setEvent(foundEvent || null);
    } catch (error) {
      console.error('Error loading event:', error);
      Alert.alert('Error', 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handlePostComment = async () => {
    if (!commentText.trim() || !event) {
      return;
    }

    try {
      console.log('User posting comment:', commentText);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      const currentUserId = await SocialStorageService.getCurrentUserId();
      const profile = await StorageService.getProfile();
      
      const newComment: FeedComment = {
        id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: currentUserId,
        username: profile?.username || 'You',
        displayName: profile?.displayName || profile?.username || 'You',
        userAvatar: profile?.avatar,
        text: commentText.trim(),
        timestamp: new Date(),
      };
      
      const updatedEvent: FeedEvent = {
        ...event,
        comments: [...(event.comments || []), newComment],
      };
      
      await SocialStorageService.updateFeedEvent(eventId, updatedEvent);
      
      setCommentText('');
      await loadEvent();
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Error posting comment:', error);
      Alert.alert('Error', 'Failed to post comment');
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) {
      return 'Just now';
    }
    if (minutes < 60) {
      const minutesText = `${minutes}m ago`;
      return minutesText;
    }
    if (hours < 24) {
      const hoursText = `${hours}h ago`;
      return hoursText;
    }
    if (days < 7) {
      const daysText = `${days}d ago`;
      return daysText;
    }
    return new Date(date).toLocaleDateString();
  };

  if (loading || !event) {
    return (
      <SafeAreaView 
        style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
        edges={['top']}
      >
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            Loading comments...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const comments = event.comments || [];

  return (
    <SafeAreaView 
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <IconSymbol
              ios_icon_name="chevron.left"
              android_material_icon_name="arrow-back"
              size={28}
              color={theme.colors.text}
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            Comments
          </Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.eventSummary}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>
              {event.displayName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.eventInfo}>
            <Text style={[styles.displayName, { color: theme.colors.text }]}>
              {event.displayName}
            </Text>
            <Text style={[styles.eventText, { color: theme.dark ? '#9CA3AF' : '#6B7280' }]}>
              {event.type === 'course_rated' && event.courseName}
            </Text>
          </View>
        </View>

        <ScrollView
          style={styles.commentsContainer}
          contentContainerStyle={styles.commentsContent}
          showsVerticalScrollIndicator={false}
        >
          {comments.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>💬</Text>
              <Text style={[styles.emptyText, { color: theme.colors.text }]}>
                No comments yet
              </Text>
              <Text style={[styles.emptySubtext, { color: theme.dark ? '#9CA3AF' : '#6B7280' }]}>
                Be the first to comment!
              </Text>
            </View>
          ) : (
            comments.map((comment, index) => (
              <View key={index} style={styles.commentItem}>
                <View style={[styles.commentAvatar, { backgroundColor: colors.primary }]}>
                  <Text style={styles.commentAvatarText}>
                    {comment.displayName.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.commentContent}>
                  <View style={styles.commentHeader}>
                    <Text style={[styles.commentDisplayName, { color: theme.colors.text }]}>
                      {comment.displayName}
                    </Text>
                    <Text style={[styles.commentTimestamp, { color: theme.dark ? '#6B7280' : '#9CA3AF' }]}>
                      {formatTimestamp(comment.timestamp)}
                    </Text>
                  </View>
                  <Text style={[styles.commentText, { color: theme.colors.text }]}>
                    {comment.text}
                  </Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        <View style={[styles.inputContainer, { backgroundColor: theme.colors.card, borderTopColor: theme.colors.border }]}>
          <TextInput
            style={[styles.input, { color: theme.colors.text, backgroundColor: theme.dark ? '#2D2D2D' : '#F3F4F6' }]}
            placeholder="Add a comment..."
            placeholderTextColor={theme.dark ? '#9CA3AF' : '#6B7280'}
            value={commentText}
            onChangeText={setCommentText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              { backgroundColor: commentText.trim() ? colors.primary : theme.colors.border },
            ]}
            onPress={handlePostComment}
            disabled={!commentText.trim()}
            activeOpacity={0.7}
          >
            <IconSymbol
              ios_icon_name="paperplane.fill"
              android_material_icon_name="send"
              size={20}
              color={commentText.trim() ? '#FFFFFF' : theme.dark ? '#6B7280' : '#9CA3AF'}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  eventSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  eventInfo: {
    flex: 1,
  },
  displayName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  eventText: {
    fontSize: 14,
  },
  commentsContainer: {
    flex: 1,
  },
  commentsContent: {
    paddingVertical: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
  },
  commentItem: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  commentAvatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  commentDisplayName: {
    fontSize: 14,
    fontWeight: '700',
  },
  commentTimestamp: {
    fontSize: 12,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    gap: 12,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
