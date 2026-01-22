
import React, { useState, useEffect } from 'react';
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
import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { UserProfile } from '@/types/golf';
import { useProfile } from '@/hooks/useProfile';
import { useRounds } from '@/hooks/useRounds';
import { useSocial } from '@/hooks/useSocial';
import { StatCard } from '@/components/StatCard';
import { availableBadges } from '@/data/badges';
import { RatingStorageService } from '@/utils/ratingStorage';
import { CourseRating } from '@/types/rating';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { profile, updateProfile } = useProfile();
  const { rounds } = useRounds();
  const { friends } = useSocial();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [ratedCourses, setRatedCourses] = useState<CourseRating[]>([]);

  useEffect(() => {
    if (profile) {
      setEditedProfile(profile);
    }
  }, [profile]);

  useEffect(() => {
    loadRatedCourses();
  }, []);

  const loadRatedCourses = async () => {
    try {
      const ratings = await RatingStorageService.getRatings();
      console.log('Loaded rated courses:', ratings.length);
      setRatedCourses(ratings);
    } catch (error) {
      console.error('Error loading rated courses:', error);
    }
  };

  const handlePickImage = async () => {
    try {
      console.log('User tapped to change profile picture');
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Please allow access to your photo library to change your profile picture.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        console.log('User selected new profile picture');
        setEditedProfile(prev => prev ? { ...prev, avatar: result.assets[0].uri } : null);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleSave = async () => {
    if (!editedProfile) return;

    try {
      console.log('User saving profile changes');
      await updateProfile(editedProfile);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const handleSearchCourses = () => {
    console.log('User tapped Search Courses button from profile');
    router.push('/modal');
  };

  if (!profile || !editedProfile) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]} edges={['top']}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const totalRounds = rounds.length;
  const uniqueCourses = new Set(rounds.map(r => r.courseId)).size;
  const earnedBadges = availableBadges.filter(badge => {
    if (badge.id === 'first-round') return totalRounds >= 1;
    if (badge.id === 'five-rounds') return totalRounds >= 5;
    if (badge.id === 'ten-rounds') return totalRounds >= 10;
    if (badge.id === 'course-explorer') return uniqueCourses >= 5;
    return false;
  });

  const getScoreColor = (score: number) => {
    if (score >= 90) return colors.primary;
    if (score >= 75) return '#10B981';
    if (score >= 60) return '#F59E0B';
    if (score >= 40) return '#F97316';
    return '#EF4444';
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]} edges={['top']}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={[styles.title, { color: theme.colors.text }]}>Profile</Text>
            {!isEditing ? (
              <TouchableOpacity
                onPress={() => {
                  console.log('User tapped Edit Profile button');
                  setIsEditing(true);
                }}
                style={styles.editButton}
              >
                <IconSymbol
                  ios_icon_name="pencil"
                  android_material_icon_name="edit"
                  size={20}
                  color={colors.primary}
                />
                <Text style={[styles.editButtonText, { color: colors.primary }]}>Edit</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.editActions}>
                <TouchableOpacity
                  onPress={() => {
                    console.log('User cancelled profile edit');
                    setIsEditing(false);
                    setEditedProfile(profile);
                  }}
                  style={styles.cancelButton}
                >
                  <Text style={[styles.cancelButtonText, { color: theme.dark ? '#9CA3AF' : '#6B7280' }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSave}
                  style={[styles.saveButton, { backgroundColor: colors.primary }]}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        <View style={styles.profileCard}>
          <TouchableOpacity
            onPress={isEditing ? handlePickImage : undefined}
            disabled={!isEditing}
            activeOpacity={isEditing ? 0.7 : 1}
          >
            <View style={styles.avatarContainer}>
              {editedProfile.avatar ? (
                <Image source={{ uri: editedProfile.avatar }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primary }]}>
                  <Text style={styles.avatarText}>
                    {editedProfile.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              {isEditing && (
                <View style={styles.avatarEditOverlay}>
                  <IconSymbol
                    ios_icon_name="camera.fill"
                    android_material_icon_name="camera"
                    size={24}
                    color="#FFFFFF"
                  />
                </View>
              )}
            </View>
          </TouchableOpacity>

          {isEditing ? (
            <View style={styles.editForm}>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Name</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.dark ? '#1A1A1A' : '#FAFAFA',
                      color: theme.colors.text,
                      borderColor: theme.colors.border,
                    },
                  ]}
                  value={editedProfile.name}
                  onChangeText={(text) => setEditedProfile({ ...editedProfile, name: text })}
                  placeholder="Your name"
                  placeholderTextColor={theme.dark ? '#9CA3AF' : '#6B7280'}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Username</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.dark ? '#1A1A1A' : '#FAFAFA',
                      color: theme.colors.text,
                      borderColor: theme.colors.border,
                    },
                  ]}
                  value={editedProfile.username}
                  onChangeText={(text) => setEditedProfile({ ...editedProfile, username: text })}
                  placeholder="@username"
                  placeholderTextColor={theme.dark ? '#9CA3AF' : '#6B7280'}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Bio</Text>
                <TextInput
                  style={[
                    styles.input,
                    styles.bioInput,
                    {
                      backgroundColor: theme.dark ? '#1A1A1A' : '#FAFAFA',
                      color: theme.colors.text,
                      borderColor: theme.colors.border,
                    },
                  ]}
                  value={editedProfile.bio}
                  onChangeText={(text) => setEditedProfile({ ...editedProfile, bio: text })}
                  placeholder="Tell us about your golf journey..."
                  placeholderTextColor={theme.dark ? '#9CA3AF' : '#6B7280'}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                  Handicap (optional)
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.dark ? '#1A1A1A' : '#FAFAFA',
                      color: theme.colors.text,
                      borderColor: theme.colors.border,
                    },
                  ]}
                  value={editedProfile.handicap?.toString() || ''}
                  onChangeText={(text) => {
                    const handicap = text ? parseFloat(text) : undefined;
                    setEditedProfile({ ...editedProfile, handicap });
                  }}
                  placeholder="e.g., 12.5"
                  placeholderTextColor={theme.dark ? '#9CA3AF' : '#6B7280'}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>
          ) : (
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: theme.colors.text }]}>
                {profile.name}
              </Text>
              <Text style={[styles.profileUsername, { color: theme.dark ? '#9CA3AF' : '#6B7280' }]}>
                @{profile.username}
              </Text>
              {profile.bio && (
                <Text style={[styles.profileBio, { color: theme.colors.text }]}>
                  {profile.bio}
                </Text>
              )}
              {profile.handicap !== undefined && (
                <View style={styles.handicapBadge}>
                  <Text style={[styles.handicapText, { color: colors.primary }]}>
                    Handicap: {profile.handicap}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        <View style={styles.statsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Stats</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Rounds"
              value={totalRounds.toString()}
              icon="golf-course"
              color={colors.primary}
            />
            <StatCard
              title="Courses"
              value={uniqueCourses.toString()}
              icon="location-on"
              color="#10B981"
            />
            <StatCard
              title="Friends"
              value={friends.length.toString()}
              icon="group"
              color="#F59E0B"
            />
          </View>
        </View>

        <View style={styles.coursesSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>My Courses</Text>
            <TouchableOpacity
              onPress={handleSearchCourses}
              style={[styles.searchButton, { backgroundColor: colors.primary }]}
            >
              <IconSymbol
                ios_icon_name="magnifyingglass"
                android_material_icon_name="search"
                size={16}
                color="#FFFFFF"
              />
              <Text style={styles.searchButtonText}>Search</Text>
            </TouchableOpacity>
          </View>

          {ratedCourses.length === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol
                ios_icon_name="star"
                android_material_icon_name="star"
                size={48}
                color={theme.dark ? '#9CA3AF' : '#6B7280'}
              />
              <Text style={[styles.emptyStateText, { color: theme.colors.text }]}>
                No courses rated yet
              </Text>
              <Text style={[styles.emptyStateSubtext, { color: theme.dark ? '#9CA3AF' : '#6B7280' }]}>
                Search and rate courses to build your list
              </Text>
              <TouchableOpacity
                onPress={handleSearchCourses}
                style={[styles.emptyStateButton, { backgroundColor: colors.primary }]}
              >
                <Text style={styles.emptyStateButtonText}>Rate Your First Course</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.coursesList}>
              {ratedCourses
                .sort((a, b) => b.finalScore - a.finalScore)
                .map((rating, index) => (
                  <View
                    key={rating.courseId}
                    style={[
                      styles.courseItem,
                      {
                        backgroundColor: theme.colors.card,
                        borderColor: theme.colors.border,
                      },
                    ]}
                  >
                    <View style={styles.courseRank}>
                      <Text style={[styles.courseRankText, { color: theme.colors.text }]}>
                        #{index + 1}
                      </Text>
                    </View>
                    <View style={styles.courseInfo}>
                      <Text style={[styles.courseName, { color: theme.colors.text }]}>
                        {rating.courseName}
                      </Text>
                      <Text style={[styles.courseLocation, { color: theme.dark ? '#9CA3AF' : '#6B7280' }]}>
                        {rating.courseLocation}
                      </Text>
                      <Text style={[styles.coursePlayCount, { color: theme.dark ? '#9CA3AF' : '#6B7280' }]}>
                        Played {rating.playCount} {rating.playCount === 1 ? 'time' : 'times'}
                      </Text>
                    </View>
                    <View style={styles.courseScore}>
                      <Text
                        style={[
                          styles.courseScoreText,
                          { color: getScoreColor(rating.finalScore) },
                        ]}
                      >
                        {rating.finalScore}
                      </Text>
                    </View>
                  </View>
                ))}
            </View>
          )}
        </View>

        {earnedBadges.length > 0 && (
          <View style={styles.badgesSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Badges</Text>
            <View style={styles.badgesGrid}>
              {earnedBadges.map((badge) => (
                <View
                  key={badge.id}
                  style={[
                    styles.badgeCard,
                    {
                      backgroundColor: theme.colors.card,
                      borderColor: theme.colors.border,
                    },
                  ]}
                >
                  <Text style={styles.badgeEmoji}>{badge.emoji}</Text>
                  <Text style={[styles.badgeName, { color: theme.colors.text }]}>
                    {badge.name}
                  </Text>
                  <Text style={[styles.badgeDescription, { color: theme.dark ? '#9CA3AF' : '#6B7280' }]}>
                    {badge.description}
                  </Text>
                </View>
              ))}
            </View>
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
    paddingBottom: 120,
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
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 20 : 8,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 1,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  profileCard: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
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
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: '700',
  },
  avatarEditOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  profileInfo: {
    alignItems: 'center',
    gap: 8,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '800',
  },
  profileUsername: {
    fontSize: 16,
  },
  profileBio: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  handicapBadge: {
    backgroundColor: colors.highlight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 12,
  },
  handicapText: {
    fontSize: 14,
    fontWeight: '700',
  },
  editForm: {
    width: '100%',
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
  },
  bioInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  statsSection: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  coursesSection: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 15,
    textAlign: 'center',
  },
  emptyStateButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 16,
  },
  emptyStateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  coursesList: {
    gap: 12,
  },
  courseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  courseRank: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.highlight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  courseRankText: {
    fontSize: 16,
    fontWeight: '800',
  },
  courseInfo: {
    flex: 1,
    gap: 4,
  },
  courseName: {
    fontSize: 16,
    fontWeight: '700',
  },
  courseLocation: {
    fontSize: 14,
  },
  coursePlayCount: {
    fontSize: 12,
  },
  courseScore: {
    alignItems: 'center',
  },
  courseScoreText: {
    fontSize: 24,
    fontWeight: '800',
  },
  badgesSection: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
  },
  badgeEmoji: {
    fontSize: 40,
  },
  badgeName: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  badgeDescription: {
    fontSize: 12,
    textAlign: 'center',
  },
});
