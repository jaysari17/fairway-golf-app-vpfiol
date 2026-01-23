
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { supabase } from '@/utils/supabase';
import { useSocial } from '@/hooks/useSocial';

interface UserSearchResult {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  totalRounds: number;
  totalCourses: number;
  isFriend: boolean;
  hasPendingRequest: boolean;
}

// Helper to resolve image sources
function resolveImageSource(source: string | number | ImageSourcePropType | undefined): ImageSourcePropType {
  if (!source) return { uri: '' };
  if (typeof source === 'string') return { uri: source };
  return source as ImageSourcePropType;
}

export default function FindFriendsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { friends, friendRequests, sendFriendRequest, currentUserId } = useSocial();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    console.log('Find Friends screen loaded');
    loadSuggestedUsers();
  }, []);

  const loadSuggestedUsers = async () => {
    console.log('Loading suggested users');
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, username, display_name, avatar_url')
        .neq('user_id', currentUserId)
        .limit(20);

      if (error) {
        console.error('Error loading suggested users:', error);
        return;
      }

      const friendIds = new Set(friends.map(f => f.id));
      const pendingRequestUserIds = new Set(
        friendRequests
          .filter(r => r.status === 'pending')
          .map(r => r.fromUserId === currentUserId ? r.toUserId : r.fromUserId)
      );

      const users: UserSearchResult[] = (data || []).map(user => ({
        id: user.user_id,
        username: user.username,
        displayName: user.display_name || user.username,
        avatarUrl: user.avatar_url,
        totalRounds: 0,
        totalCourses: 0,
        isFriend: friendIds.has(user.user_id),
        hasPendingRequest: pendingRequestUserIds.has(user.user_id),
      }));

      console.log('Suggested users loaded:', users.length);
      setSearchResults(users);
    } catch (error) {
      console.error('Error loading suggested users:', error);
      Alert.alert('Error', 'Failed to load suggested users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    console.log('User searching for:', query);
    setSearchQuery(query);

    if (!query.trim()) {
      loadSuggestedUsers();
      return;
    }

    setSearching(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, username, display_name, avatar_url')
        .neq('user_id', currentUserId)
        .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
        .limit(20);

      if (error) {
        console.error('Error searching users:', error);
        return;
      }

      const friendIds = new Set(friends.map(f => f.id));
      const pendingRequestUserIds = new Set(
        friendRequests
          .filter(r => r.status === 'pending')
          .map(r => r.fromUserId === currentUserId ? r.toUserId : r.fromUserId)
      );

      const users: UserSearchResult[] = (data || []).map(user => ({
        id: user.user_id,
        username: user.username,
        displayName: user.display_name || user.username,
        avatarUrl: user.avatar_url,
        totalRounds: 0,
        totalCourses: 0,
        isFriend: friendIds.has(user.user_id),
        hasPendingRequest: pendingRequestUserIds.has(user.user_id),
      }));

      console.log('Search results:', users.length);
      setSearchResults(users);
    } catch (error) {
      console.error('Error searching users:', error);
      Alert.alert('Error', 'Failed to search users');
    } finally {
      setSearching(false);
    }
  };

  const handleSendFriendRequest = async (user: UserSearchResult) => {
    console.log('User sending friend request to:', user.username);
    try {
      await sendFriendRequest(user.id, user.username, user.displayName);
      Alert.alert('Success', `Friend request sent to ${user.displayName}`);
      
      // Update the local state to reflect the pending request
      setSearchResults(prev =>
        prev.map(u =>
          u.id === user.id ? { ...u, hasPendingRequest: true } : u
        )
      );
    } catch (error) {
      console.error('Error sending friend request:', error);
      Alert.alert('Error', 'Failed to send friend request');
    }
  };

  const renderUserCard = (user: UserSearchResult, index: number) => {
    const buttonText = user.isFriend
      ? 'Friends'
      : user.hasPendingRequest
      ? 'Pending'
      : 'Add Friend';
    const buttonDisabled = user.isFriend || user.hasPendingRequest;
    const buttonColor = user.isFriend
      ? theme.dark ? '#4B5563' : '#D1D5DB'
      : user.hasPendingRequest
      ? theme.dark ? '#4B5563' : '#D1D5DB'
      : colors.primary;

    return (
      <View
        key={index}
        style={[
          styles.userCard,
          {
            backgroundColor: theme.dark ? '#1F2937' : '#FFFFFF',
            borderColor: theme.dark ? '#374151' : '#E5E7EB',
          },
        ]}
      >
        <View style={styles.userInfo}>
          {user.avatarUrl ? (
            <Image
              source={resolveImageSource(user.avatarUrl)}
              style={styles.avatar}
            />
          ) : (
            <View
              style={[
                styles.avatarPlaceholder,
                { backgroundColor: colors.primary },
              ]}
            >
              <Text style={styles.avatarText}>
                {user.displayName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <View style={styles.userDetails}>
            <Text style={[styles.displayName, { color: theme.colors.text }]}>
              {user.displayName}
            </Text>
            <Text style={[styles.username, { color: theme.dark ? '#9CA3AF' : '#6B7280' }]}>
              @{user.username}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={[
            styles.addButton,
            { backgroundColor: buttonColor },
            buttonDisabled && styles.addButtonDisabled,
          ]}
          onPress={() => handleSendFriendRequest(user)}
          disabled={buttonDisabled}
          activeOpacity={0.7}
        >
          <Text style={styles.addButtonText}>{buttonText}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            console.log('User tapped back button');
            router.back();
          }}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <IconSymbol
            ios_icon_name="chevron.left"
            android_material_icon_name="arrow-back"
            size={24}
            color={theme.colors.text}
          />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Find Friends
        </Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.searchContainer}>
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: theme.dark ? '#1F2937' : '#F3F4F6',
              borderColor: theme.dark ? '#374151' : '#E5E7EB',
            },
          ]}
        >
          <IconSymbol
            ios_icon_name="magnifyingglass"
            android_material_icon_name="search"
            size={20}
            color={theme.dark ? '#9CA3AF' : '#6B7280'}
          />
          <TextInput
            style={[
              styles.searchInput,
              { color: theme.colors.text },
            ]}
            placeholder="Search by username or name"
            placeholderTextColor={theme.dark ? '#6B7280' : '#9CA3AF'}
            value={searchQuery}
            onChangeText={handleSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searching && (
            <ActivityIndicator size="small" color={colors.primary} />
          )}
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: theme.dark ? '#9CA3AF' : '#6B7280' }]}>
              Loading users...
            </Text>
          </View>
        ) : searchResults.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
              No Users Found
            </Text>
            <Text style={[styles.emptyText, { color: theme.dark ? '#9CA3AF' : '#6B7280' }]}>
              {searchQuery
                ? `No users found matching "${searchQuery}"`
                : 'No users available at the moment'}
            </Text>
          </View>
        ) : (
          <>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              {searchQuery ? 'Search Results' : 'Suggested Users'}
            </Text>
            {searchResults.map((user, index) => renderUserCard(user, index))}
          </>
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
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 20 : 8,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  placeholder: {
    width: 40,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    marginTop: 8,
  },
  userCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  userDetails: {
    flex: 1,
  },
  displayName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  username: {
    fontSize: 14,
  },
  addButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  addButtonDisabled: {
    opacity: 0.6,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
