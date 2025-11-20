
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { FeedEvent } from '@/types/social';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';

interface FeedEventCardProps {
  event: FeedEvent;
  currentUserId: string;
  onLike: (eventId: string) => void;
  onComment: (eventId: string) => void;
}

export function FeedEventCard({ event, currentUserId, onLike, onComment }: FeedEventCardProps) {
  const theme = useTheme();
  const hasLiked = event.likes?.includes(currentUserId) || false;

  const getEventIcon = () => {
    switch (event.type) {
      case 'round_logged': return '⛳';
      case 'course_rated': return '⭐';
      case 'list_updated': return '📊';
      case 'personal_best': return '🏆';
      case 'mutual_course': return '🤝';
      case 'live_round': return '🔴';
      case 'photo_posted': return '📸';
      default: return '⛳';
    }
  };

  const getEventText = () => {
    switch (event.type) {
      case 'round_logged':
        return `logged a round at ${event.courseName}`;
      case 'course_rated':
        return `rated ${event.courseName} ${event.rating}/10`;
      case 'list_updated':
        return `updated their course rankings`;
      case 'personal_best':
        return `shot a personal best at ${event.courseName}!`;
      case 'mutual_course':
        return `played ${event.courseName} - a course you've also played!`;
      case 'live_round':
        return `is playing at ${event.courseName} right now`;
      case 'photo_posted':
        return `posted a photo from ${event.courseName}`;
      default:
        return 'had some golf activity';
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={styles.avatarText}>
            {event.displayName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.headerInfo}>
          <View style={styles.headerTop}>
            <Text style={[styles.displayName, { color: theme.colors.text }]}>
              {event.displayName}
            </Text>
            <Text style={styles.eventIcon}>{getEventIcon()}</Text>
          </View>
          <Text style={[styles.eventText, { color: theme.dark ? '#98989D' : '#666' }]}>
            {getEventText()}
          </Text>
          <Text style={[styles.timestamp, { color: theme.dark ? '#666' : '#999' }]}>
            {formatTimestamp(event.timestamp)}
          </Text>
        </View>
      </View>

      {event.photo && (
        <Image source={{ uri: event.photo }} style={styles.photo} />
      )}

      {event.comment && (
        <Text style={[styles.comment, { color: theme.colors.text }]}>
          {event.comment}
        </Text>
      )}

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onLike(event.id)}
          activeOpacity={0.7}
        >
          <IconSymbol
            ios_icon_name={hasLiked ? 'heart.fill' : 'heart'}
            android_material_icon_name={hasLiked ? 'favorite' : 'favorite_border'}
            size={20}
            color={hasLiked ? colors.primary : theme.dark ? '#98989D' : '#666'}
          />
          {event.likes && event.likes.length > 0 && (
            <Text style={[styles.actionText, { color: theme.dark ? '#98989D' : '#666' }]}>
              {event.likes.length}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onComment(event.id)}
          activeOpacity={0.7}
        >
          <IconSymbol
            ios_icon_name="bubble.left"
            android_material_icon_name="chat_bubble_outline"
            size={20}
            color={theme.dark ? '#98989D' : '#666'}
          />
          {event.comments && event.comments.length > 0 && (
            <Text style={[styles.actionText, { color: theme.dark ? '#98989D' : '#666' }]}>
              {event.comments.length}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          activeOpacity={0.7}
        >
          <IconSymbol
            ios_icon_name="paperplane"
            android_material_icon_name="send"
            size={20}
            color={theme.dark ? '#98989D' : '#666'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerInfo: {
    flex: 1,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  displayName: {
    fontSize: 16,
    fontWeight: '700',
  },
  eventIcon: {
    fontSize: 16,
  },
  eventText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  comment: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 24,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
