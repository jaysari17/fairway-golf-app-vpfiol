
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

interface Following {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  handicap?: number;
  totalRounds: number;
  totalCourses: number;
}

export default function UserFollowingScreen() {
  const theme = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const userId = params.userId as string;
  const userName = params.userName as string;
  
  const [following, setFollowing] = useState<Following[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFollowing();
  }, [userId]);

  const loadFollowing = async () => {
    try {
      console.log('Loading following for user:', userId || 'current user');
      setLoading(true);
      
      // TODO: Backend Integration - GET /api/users/:userId/following
      // Returns: [{ id, username, displayName, avatar, handicap, totalRounds, totalCourses }]
      // For now, show empty state
      setFollowing([]);
    } catch (error) {
      console.error('Error loading following:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserPress = (followingId: string, followingName: string) => {
    console.log('User tapped on following user:', followingName);
    // TODO: Navigate to user profile
    // router.push(`/user-profile?userId=${followingId}`);
  };

  const displayName = userName || 'User';
  const headerTitle = `${displayName}'s Following`;

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
                Loading following...
              </Text>
            </View>
          ) : following.length === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol
                ios_icon_name="person"
                android_material_icon_name="person"
                size={64}
                color={theme.dark ? '#9CA3AF' : '#6B7280'}
              />
              <Text style={[styles.emptyStateTitle, { color: theme.colors.text }]}>
                Not Following Anyone Yet
              </Text>
              <Text style={[styles.emptyStateText, { color: theme.dark ? '#9CA3AF' : '#6B7280' }]}>
                This user isn&apos;t following anyone yet
              </Text>
            </View>
          ) : (
            <View style={styles.followingList}>
              {following.map((user) => {
                const handicapText = user.handicap !== undefined ? `Handicap: ${user.handicap}` : '';
                const statsText = `${user.totalRounds} rounds • ${user.totalCourses} courses`;
                
                return (
                  <TouchableOpacity
                    key={user.id}
                    style={[
                      styles.followingCard,
                      {
                        backgroundColor: theme.colors.card,
                        borderColor: theme.colors.border,
                      },
                    ]}
                    onPress={() => handleUserPress(user.id, user.displayName)}
                  >
                    {user.avatar ? (
                      <Image source={{ uri: user.avatar }} style={styles.avatar} />
                    ) : (
                      <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primary }]}>
                        <Text style={styles.avatarText}>
                          {user.displayName.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                    )}
                    <View style={styles.followingInfo}>
                      <Text style={[styles.followingName, { color: theme.colors.text }]}>
                        {user.displayName}
                      </Text>
                      <Text style={[styles.followingUsername, { color: theme.dark ? '#9CA3AF' : '#6B7280' }]}>
                        @{user.username}
                      </Text>
                      {handicapText && (
                        <Text style={[styles.followingHandicap, { color: colors.primary }]}>
                          {handicapText}
                        </Text>
                      )}
                      <Text style={[styles.followingStats, { color: theme.dark ? '#9CA3AF' : '#6B7280' }]}>
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
  followingList: {
    gap: 12,
  },
  followingCard: {
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
  followingInfo: {
    flex: 1,
    gap: 4,
  },
  followingName: {
    fontSize: 16,
    fontWeight: '700',
  },
  followingUsername: {
    fontSize: 14,
  },
  followingHandicap: {
    fontSize: 13,
    fontWeight: '600',
  },
  followingStats: {
    fontSize: 12,
  },
});
