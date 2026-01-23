
import { colors } from '@/styles/commonStyles';
import { useRounds } from '@/hooks/useRounds';
import * as ImagePicker from 'expo-image-picker';
import React, { useState, useEffect } from 'react';
import { RatingStorageService } from '@/utils/ratingStorage';
import { UserProfile } from '@/types/golf';
import { useSocial } from '@/hooks/useSocial';
import { useProfile } from '@/hooks/useProfile';
import { availableBadges } from '@/data/badges';
import { useTheme } from '@react-navigation/native';
import { IconSymbol } from '@/components/IconSymbol';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  Image,
} from 'react-native';
import { CourseRating } from '@/types/rating';
import { StatCard } from '@/components/StatCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { StorageService } from '@/utils/storage';

export default function ProfileScreen() {
  const router = useRouter();
  const { colors: themeColors } = useTheme();
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const { rounds } = useRounds();
  const { friends } = useSocial();
  const { signOut, user } = useSupabaseAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [ratedCourses, setRatedCourses] = useState<CourseRating[]>([]);

  useEffect(() => {
    if (profile) {
      setEditedProfile(profile);
      loadRatedCourses();
    }
  }, [profile]);

  useEffect(() => {
    loadRatedCourses();
  }, []);

  const loadRatedCourses = async () => {
    try {
      console.log('Loading rated courses for profile screen');
      const ratings = await RatingStorageService.getRatings();
      setRatedCourses(ratings);
    } catch (error) {
      console.error('Error loading rated courses:', error);
    }
  };

  const handlePickImage = async () => {
    console.log('User tapped to pick profile image');
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && editedProfile) {
      setEditedProfile({
        ...editedProfile,
        avatarUrl: result.assets[0].uri,
      });
    }
  };

  const handleSave = async () => {
    console.log('User tapped Save button on profile');
    if (!editedProfile) return;

    try {
      await updateProfile(editedProfile);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile');
    }
  };

  const handleLogout = async () => {
    console.log('User tapped Logout button');
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Signing out user');
              await signOut();
              await StorageService.clearAll();
              console.log('User signed out, navigating to login');
              router.replace('/login');
            } catch (error) {
              console.error('Error signing out:', error);
              Alert.alert('Error', 'Failed to sign out');
            }
          },
        },
      ]
    );
  };

  const handleSearchCourses = () => {
    console.log('User tapped Search Courses button');
    router.push('/modal');
  };

  const handleCoursesPlayed = () => {
    console.log('User tapped Courses Played');
    router.push('/user-courses');
  };

  const handleFollowers = () => {
    console.log('User tapped Followers');
    router.push('/user-followers');
  };

  const handleFollowing = () => {
    console.log('User tapped Following');
    router.push('/user-following');
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return colors.success;
    if (score >= 75) return colors.primary;
    if (score >= 60) return colors.warning;
    return colors.error;
  };

  if (profileLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: themeColors.text }]}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!profile || !editedProfile) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.errorText, { color: colors.error }]}>Unable to load profile</Text>
          <Text style={[styles.errorSubtext, { color: themeColors.text }]}>
            Please check your internet connection and try again
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={() => {
              console.log('User tapped retry button');
              router.replace('/login');
            }}
          >
            <Text style={styles.retryButtonText}>Sign Out and Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const displayName = editedProfile.displayName || editedProfile.username;
  const totalRounds = rounds.length;
  const totalCourses = ratedCourses.length;
  const averageScore = ratedCourses.length > 0
    ? Math.round(ratedCourses.reduce((sum, r) => sum + (r.finalScore || 0), 0) / ratedCourses.length)
    : 0;

  const topCourses = ratedCourses
    .sort((a, b) => (b.finalScore || 0) - (a.finalScore || 0))
    .slice(0, 3);

  const earnedBadges = availableBadges.filter(badge => {
    if (badge.id === 'first_round') return totalRounds >= 1;
    if (badge.id === 'five_courses') return totalCourses >= 5;
    if (badge.id === 'ten_courses') return totalCourses >= 10;
    if (badge.id === 'twenty_courses') return totalCourses >= 20;
    if (badge.id === 'fifty_courses') return totalCourses >= 50;
    return false;
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]} edges={['top']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={[styles.headerTitle, { color: themeColors.text }]}>Profile</Text>
            <View style={styles.headerButtons}>
              {isEditing ? (
                <React.Fragment>
                  <TouchableOpacity
                    onPress={() => {
                      setEditedProfile(profile);
                      setIsEditing(false);
                    }}
                    style={styles.headerButton}
                  >
                    <Text style={[styles.headerButtonText, { color: colors.error }]}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
                    <Text style={[styles.headerButtonText, { color: colors.primary }]}>Save</Text>
                  </TouchableOpacity>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.headerButton}>
                    <Text style={[styles.headerButtonText, { color: colors.primary }]}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleLogout} style={styles.headerButton}>
                    <IconSymbol
                      ios_icon_name="rectangle.portrait.and.arrow.right"
                      android_material_icon_name="logout"
                      size={24}
                      color={colors.error}
                    />
                  </TouchableOpacity>
                </React.Fragment>
              )}
            </View>
          </View>
        </View>

        <View style={[styles.profileCard, { backgroundColor: themeColors.card }]}>
          <TouchableOpacity
            onPress={isEditing ? handlePickImage : undefined}
            disabled={!isEditing}
            style={styles.avatarContainer}
          >
            {editedProfile.avatarUrl ? (
              <Image source={{ uri: editedProfile.avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primary }]}>
                <Text style={styles.avatarText}>{displayName.charAt(0).toUpperCase()}</Text>
              </View>
            )}
            {isEditing && (
              <View style={styles.editAvatarBadge}>
                <IconSymbol
                  ios_icon_name="camera.fill"
                  android_material_icon_name="camera"
                  size={16}
                  color="#FFFFFF"
                />
              </View>
            )}
          </TouchableOpacity>

          {isEditing ? (
            <React.Fragment>
              <TextInput
                style={[styles.input, { color: themeColors.text, borderColor: themeColors.border }]}
                value={editedProfile.displayName || ''}
                onChangeText={(text) => setEditedProfile({ ...editedProfile, displayName: text })}
                placeholder="Display Name"
                placeholderTextColor={themeColors.text + '80'}
              />
              <TextInput
                style={[styles.input, { color: themeColors.text, borderColor: themeColors.border }]}
                value={editedProfile.bio || ''}
                onChangeText={(text) => setEditedProfile({ ...editedProfile, bio: text })}
                placeholder="Bio"
                placeholderTextColor={themeColors.text + '80'}
                multiline
              />
              <TextInput
                style={[styles.input, { color: themeColors.text, borderColor: themeColors.border }]}
                value={editedProfile.handicap?.toString() || ''}
                onChangeText={(text) => setEditedProfile({ ...editedProfile, handicap: parseFloat(text) || undefined })}
                placeholder="Handicap"
                placeholderTextColor={themeColors.text + '80'}
                keyboardType="decimal-pad"
              />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Text style={[styles.displayName, { color: themeColors.text }]}>{displayName}</Text>
              <Text style={[styles.username, { color: themeColors.text }]}>@{editedProfile.username}</Text>
              {editedProfile.bio && (
                <Text style={[styles.bio, { color: themeColors.text }]}>{editedProfile.bio}</Text>
              )}
              {editedProfile.handicap !== undefined && (
                <View style={styles.handicapBadge}>
                  <Text style={styles.handicapText}>Handicap: {editedProfile.handicap}</Text>
                </View>
              )}
            </React.Fragment>
          )}

          <View style={styles.statsRow}>
            <TouchableOpacity style={styles.statItem} onPress={handleCoursesPlayed}>
              <Text style={[styles.statValue, { color: themeColors.text }]}>{totalCourses}</Text>
              <Text style={[styles.statLabel, { color: themeColors.text }]}>Courses</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statItem} onPress={handleFollowers}>
              <Text style={[styles.statValue, { color: themeColors.text }]}>{friends.length}</Text>
              <Text style={[styles.statLabel, { color: themeColors.text }]}>Followers</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statItem} onPress={handleFollowing}>
              <Text style={[styles.statValue, { color: themeColors.text }]}>{friends.length}</Text>
              <Text style={[styles.statLabel, { color: themeColors.text }]}>Following</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Statistics</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Total Rounds"
              value={totalRounds.toString()}
              icon="golf-course"
              color={colors.primary}
            />
            <StatCard
              title="Avg Rating"
              value={averageScore.toString()}
              icon="star"
              color={getScoreColor(averageScore)}
            />
          </View>
        </View>

        {topCourses.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Top Courses</Text>
            {topCourses.map((course, index) => (
              <View key={course.id} style={[styles.courseItem, { backgroundColor: themeColors.card }]}>
                <View style={styles.courseRank}>
                  <Text style={styles.courseRankText}>{index + 1}</Text>
                </View>
                <View style={styles.courseInfo}>
                  <Text style={[styles.courseName, { color: themeColors.text }]}>{course.courseName}</Text>
                  <Text style={[styles.courseLocation, { color: themeColors.text }]}>{course.courseLocation}</Text>
                </View>
                <View style={[styles.courseScore, { backgroundColor: getScoreColor(course.finalScore || 0) }]}>
                  <Text style={styles.courseScoreText}>{Math.round(course.finalScore || 0)}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {earnedBadges.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Badges</Text>
            <View style={styles.badgesGrid}>
              {earnedBadges.map((badge) => (
                <View key={badge.id} style={[styles.badgeItem, { backgroundColor: themeColors.card }]}>
                  <Text style={styles.badgeIcon}>{badge.icon}</Text>
                  <Text style={[styles.badgeName, { color: themeColors.text }]}>{badge.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[styles.searchButton, { backgroundColor: colors.primary }]}
          onPress={handleSearchCourses}
        >
          <IconSymbol
            ios_icon_name="magnifyingglass"
            android_material_icon_name="search"
            size={20}
            color="#FFFFFF"
          />
          <Text style={styles.searchButtonText}>Search Courses Worldwide</Text>
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 40,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 48 : 16,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  headerButton: {
    padding: 4,
  },
  headerButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  profileCard: {
    marginHorizontal: 20,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  avatarContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  editAvatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  displayName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    opacity: 0.6,
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
    opacity: 0.8,
  },
  handicapBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 16,
  },
  handicapText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.6,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  courseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 1,
  },
  courseRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  courseRankText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  courseInfo: {
    flex: 1,
  },
  courseName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  courseLocation: {
    fontSize: 14,
    opacity: 0.6,
  },
  courseScore: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  courseScoreText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeItem: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 1,
  },
  badgeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 100,
  },
});
