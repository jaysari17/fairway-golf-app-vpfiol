
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import { IconSymbol } from '@/components/IconSymbol';
import { StatCard } from '@/components/StatCard';
import { useProfile } from '@/hooks/useProfile';
import { useRounds } from '@/hooks/useRounds';
import { UserProfile } from '@/types/golf';
import { colors } from '@/styles/commonStyles';
import { availableBadges } from '@/data/badges';

export default function ProfileScreen() {
  const theme = useTheme();
  const { profile, updateProfile } = useProfile();
  const { rounds } = useRounds();
  
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [handicap, setHandicap] = useState('');

  useEffect(() => {
    if (profile) {
      setUsername(profile.username);
      setBio(profile.bio || '');
      setHandicap(profile.handicap?.toString() || '');
    } else {
      setUsername('Golf Enthusiast');
      setBio('');
      setHandicap('');
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      const uniqueCourses = new Set(rounds.map(r => r.courseId)).size;
      const updatedProfile: UserProfile = {
        username: username.trim() || 'Golf Enthusiast',
        bio: bio.trim() || undefined,
        handicap: handicap ? parseFloat(handicap) : undefined,
        totalRounds: rounds.length,
        totalCourses: uniqueCourses,
      };
      await updateProfile(updatedProfile);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const uniqueCourses = new Set(rounds.map(r => r.courseId)).size;
  const averageRating = rounds.length > 0
    ? Math.round(rounds.reduce((sum, r) => sum + r.rating, 0) / rounds.length)
    : 0;

  const earnedBadges = availableBadges.filter(badge => {
    if (badge.id === 'first-round') return rounds.length >= 1;
    if (badge.id === 'explorer') return uniqueCourses >= 10;
    if (badge.id === 'semi-pro') return rounds.length >= 50;
    return false;
  });

  return (
    <SafeAreaView 
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]} 
      edges={['top']}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={[styles.avatarContainer, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>
              {username.charAt(0).toUpperCase()}
            </Text>
          </View>

          {isEditing ? (
            <View style={styles.editContainer}>
              <TextInput
                style={[
                  styles.nameInput,
                  { 
                    backgroundColor: theme.colors.card,
                    borderColor: theme.colors.border,
                    color: theme.colors.text 
                  }
                ]}
                value={username}
                onChangeText={setUsername}
                placeholder="Your name"
                placeholderTextColor={theme.dark ? '#666' : '#999'}
              />
              <TextInput
                style={[
                  styles.bioInput,
                  { 
                    backgroundColor: theme.colors.card,
                    borderColor: theme.colors.border,
                    color: theme.colors.text 
                  }
                ]}
                value={bio}
                onChangeText={setBio}
                placeholder="Tell us about your golf journey..."
                placeholderTextColor={theme.dark ? '#666' : '#999'}
                multiline
                numberOfLines={3}
              />
              <TextInput
                style={[
                  styles.handicapInput,
                  { 
                    backgroundColor: theme.colors.card,
                    borderColor: theme.colors.border,
                    color: theme.colors.text 
                  }
                ]}
                value={handicap}
                onChangeText={setHandicap}
                placeholder="Handicap (optional)"
                placeholderTextColor={theme.dark ? '#666' : '#999'}
                keyboardType="decimal-pad"
              />
              <View style={styles.editButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton, { borderColor: theme.colors.border }]}
                  onPress={() => setIsEditing(false)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.cancelButtonText, { color: theme.colors.text }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.saveButton, { backgroundColor: colors.primary }]}
                  onPress={handleSave}
                  activeOpacity={0.7}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.profileInfo}>
              <Text style={[styles.name, { color: theme.colors.text }]}>{username}</Text>
              {bio && (
                <Text style={[styles.bio, { color: theme.dark ? '#98989D' : '#666' }]}>
                  {bio}
                </Text>
              )}
              {handicap && (
                <View style={styles.handicapBadge}>
                  <Text style={[styles.handicapText, { color: theme.colors.text }]}>
                    Handicap: {handicap}
                  </Text>
                </View>
              )}
              <TouchableOpacity
                style={[styles.editButton, { backgroundColor: theme.colors.card }]}
                onPress={() => setIsEditing(true)}
                activeOpacity={0.7}
              >
                <IconSymbol
                  ios_icon_name="pencil"
                  android_material_icon_name="edit"
                  size={16}
                  color={colors.primary}
                />
                <Text style={[styles.editButtonText, { color: colors.primary }]}>
                  Edit Profile
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.statsSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Statistics</Text>
          <View style={styles.statsGrid}>
            <StatCard label="Total Rounds" value={rounds.length} icon="⛳" />
            <StatCard label="Courses Played" value={uniqueCourses} icon="🏌️" />
          </View>
          <View style={styles.statsGrid}>
            <StatCard label="Avg Rating" value={averageRating} icon="⭐" />
            <StatCard label="Badges Earned" value={earnedBadges.length} icon="🏆" />
          </View>
        </View>

        <View style={styles.badgesSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Badges</Text>
          <View style={styles.badgesGrid}>
            {availableBadges.map((badge, index) => {
              const isEarned = earnedBadges.some(b => b.id === badge.id);
              return (
                <View
                  key={index}
                  style={[
                    styles.badgeCard,
                    { backgroundColor: theme.colors.card },
                    !isEarned && styles.badgeCardLocked
                  ]}
                >
                  <Text style={[styles.badgeIcon, !isEarned && styles.badgeIconLocked]}>
                    {badge.icon}
                  </Text>
                  <Text 
                    style={[
                      styles.badgeName, 
                      { color: theme.colors.text },
                      !isEarned && styles.badgeTextLocked
                    ]}
                    numberOfLines={1}
                  >
                    {badge.name}
                  </Text>
                  <Text 
                    style={[
                      styles.badgeDescription, 
                      { color: theme.dark ? '#98989D' : '#666' },
                      !isEarned && styles.badgeTextLocked
                    ]}
                    numberOfLines={2}
                  >
                    {badge.description}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
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
    paddingTop: Platform.OS === 'android' ? 20 : 0,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  profileInfo: {
    alignItems: 'center',
    width: '100%',
  },
  name: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  bio: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 12,
  },
  handicapBadge: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(87, 200, 161, 0.15)',
    marginBottom: 16,
  },
  handicapText: {
    fontSize: 14,
    fontWeight: '600',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 8,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  editContainer: {
    width: '100%',
    gap: 12,
  },
  nameInput: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  bioInput: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  handicapInput: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
    textAlign: 'center',
  },
  editButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    boxShadow: '0px 2px 8px rgba(87, 200, 161, 0.3)',
    elevation: 3,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  badgesSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeCard: {
    width: '48%',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  badgeCardLocked: {
    opacity: 0.4,
  },
  badgeIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  badgeIconLocked: {
    opacity: 0.5,
  },
  badgeName: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  badgeDescription: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  badgeTextLocked: {
    opacity: 0.6,
  },
});
