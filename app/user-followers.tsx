
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';

interface Follower {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  handicap?: number;
  totalRounds: number;
  totalCourses: number;
}

export default function UserFollowersScreen() {
  const theme = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const userId = params.userId as string;
  const userName = params.userName as string;
  
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFollowers();
  }, [userId]);

  const loadFollowers = async () => {
    try {
      console.log('Loading followers for user:', userId || 'current user');
      setLoading(true);
      
      // TODO: Backend Integration - GET /api/users/:userId/followers
      // Returns: [{ id, username, displayName, avatar, handicap, totalRounds, totalCourses }]
      // For now, show empty state
      setFollowers([]);
    } catch (error) {
      console.error('Error loading followers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserPress = (followerId: string, followerName: string) => {
    console.log('User tapped on follower:', followerName);
    // TODO: Navigate to user profile
    // router.push(`/user-profile?userId=${followerId}`);
  };

  const displayName = userName || 'User';
  const headerTitle = `${displayName}'s Followers`;

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: headerTitle,
          headerBackTitle: 'Back',
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTintColor: theme.colors.text,
        }}
      />
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
        edges={['bottom']}
      >
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.loadingText, { color: theme.colors.text }]}>
                Loading followers...
              </Text>
            </View>
          ) : followers.length === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol
                ios_icon_name="person"
                android_material_icon_name="person"
                size={64}
                color={theme.dark ? '#9CA3AF' : '#6B7280'}
              />
              <Text style={[styles.emptyStateTitle, { color: theme.colors.text }]}>
                No Followers Yet
              </Text>
              <Text style={[styles.emptyStateText, { color: theme.dark ? '#9CA3AF' : '#6B7280' }]}>
                This user doesn&apos;t have any followers yet
              </Text>
            </View>
          ) : (
            <View style={styles.followersList}>
              {followers.map((follower) => {
                const handicapText = follower.handicap !== undefined ? `Handicap: ${follower.handicap}` : '';
                const statsText = `${follower.totalRounds} rounds • ${follower.totalCourses} courses`;
                
                return (
                  <TouchableOpacity
                    key={follower.id}
                    style={[
                      styles.followerCard,
                      {
                        backgroundColor: theme.colors.card,
                        borderColor: theme.colors.border,
                      },
                    ]}
                    onPress={() => handleUserPress(follower.id, follower.displayName)}
                  >
                    {follower.avatar ? (
                      <Image source={{ uri: follower.avatar }} style={styles.avatar} />
                    ) : (
                      <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primary }]}>
                        <Text style={styles.avatarText}>
                          {follower.displayName.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                    )}
                    <View style={styles.followerInfo}>
                      <Text style={[styles.followerName, { color: theme.colors.text }]}>
                        {follower.displayName}
                      </Text>
                      <Text style={[styles.followerUsername, { color: theme.dark ? '#9CA3AF' : '#6B7280' }]}>
                        @{follower.username}
                      </Text>
                      {handicapText && (
                        <Text style={[styles.followerHandicap, { color: colors.primary }]}>
                          {handicapText}
                        </Text>
                      )}
                      <Text style={[styles.followerStats, { color: theme.dark ? '#9CA3AF' : '#6B7280' }]}>
                        {statsText}
                      </Text>
                    </View>
                    <IconSymbol
                      ios_icon_name="chevron.right"
                      android_material_icon_name="arrow-forward"
                      size={20}
                      color={theme.dark ? '#9CA3AF' : '#6B7280'}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
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
    padding: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 100,
    gap: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
  },
  followersList: {
    gap: 12,
  },
  followerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },
  followerInfo: {
    flex: 1,
    gap: 4,
  },
  followerName: {
    fontSize: 16,
    fontWeight: '700',
  },
  followerUsername: {
    fontSize: 14,
  },
  followerHandicap: {
    fontSize: 13,
    fontWeight: '600',
  },
  followerStats: {
    fontSize: 12,
  },
});
