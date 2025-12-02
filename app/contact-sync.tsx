
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/styles/commonStyles';
import { ContactSyncService, ContactMatch } from '@/utils/contactSync';
import { StorageService } from '@/utils/storage';
import { IconSymbol } from '@/components/IconSymbol';

export default function ContactSyncScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<ContactMatch[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [syncing, setSyncing] = useState(false);

  const handleSyncContacts = async () => {
    try {
      setLoading(true);
      const foundMatches = await ContactSyncService.syncContactsAndFindFriends();
      setMatches(foundMatches);
      
      if (foundMatches.length === 0) {
        Alert.alert(
          'No Matches Found',
          'We couldn&apos;t find any of your contacts on FAIRWAY yet. You can always add friends later!',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error syncing contacts:', error);
      Alert.alert('Error', 'Failed to sync contacts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserSelection = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const handleAddFriends = async () => {
    if (selectedUsers.size === 0) {
      handleSkip();
      return;
    }

    try {
      setSyncing(true);
      
      for (const userId of selectedUsers) {
        const match = matches.find(m => m.userId === userId);
        if (match) {
          await ContactSyncService.sendFriendRequest(
            match.userId,
            match.username,
            match.displayName,
            match.avatar
          );
        }
      }

      // Update profile to mark contacts as synced
      const profile = await StorageService.getProfile();
      if (profile) {
        await StorageService.saveProfile({
          ...profile,
          contactsSynced: true,
        });
      }

      Alert.alert(
        'Friend Requests Sent!',
        `You&apos;ve sent ${selectedUsers.size} friend request${selectedUsers.size > 1 ? 's' : ''}. They&apos;ll be notified!`,
        [
          {
            text: 'OK',
            onPress: handleComplete,
          },
        ]
      );
    } catch (error) {
      console.error('Error adding friends:', error);
      Alert.alert('Error', 'Failed to send friend requests. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  const handleSkip = async () => {
    const profile = await StorageService.getProfile();
    if (profile) {
      await StorageService.saveProfile({
        ...profile,
        contactsSynced: true,
      });
    }
    handleComplete();
  };

  const handleComplete = async () => {
    await StorageService.setOnboardingComplete();
    router.replace('/(tabs)/(social)/');
  };

  return (
    <LinearGradient
      colors={[colors.primary, colors.secondary]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Text style={styles.title}>Find Your Friends</Text>
          <Text style={styles.subtitle}>
            Connect with friends who are already on FAIRWAY
          </Text>
        </View>

        {matches.length === 0 && !loading ? (
          <View style={styles.emptyState}>
            <IconSymbol
              ios_icon_name="person.2.fill"
              android_material_icon_name="people"
              size={80}
              color="#FFFFFF"
            />
            <Text style={styles.emptyTitle}>Connect Your Contacts</Text>
            <Text style={styles.emptyDescription}>
              We&apos;ll check your contacts to see if any of your friends are already using FAIRWAY
            </Text>

            <TouchableOpacity
              onPress={handleSyncContacts}
              style={styles.syncButton}
              activeOpacity={0.8}
            >
              <IconSymbol
                ios_icon_name="person.crop.circle.badge.plus"
                android_material_icon_name="person_add"
                size={24}
                color={colors.primary}
              />
              <Text style={styles.syncButtonText}>Sync Contacts</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSkip}
              style={styles.skipButton}
              activeOpacity={0.8}
            >
              <Text style={styles.skipButtonText}>Skip for Now</Text>
            </TouchableOpacity>
          </View>
        ) : loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.loadingText}>Searching for friends...</Text>
          </View>
        ) : (
          <>
            <ScrollView
              style={styles.matchesList}
              contentContainerStyle={styles.matchesContent}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.matchesHeader}>
                Found {matches.length} friend{matches.length !== 1 ? 's' : ''} on FAIRWAY
              </Text>

              {matches.map((match) => (
                <TouchableOpacity
                  key={match.userId}
                  style={styles.matchCard}
                  onPress={() => toggleUserSelection(match.userId)}
                  activeOpacity={0.8}
                >
                  <View style={styles.matchInfo}>
                    {match.avatar ? (
                      <Image source={{ uri: match.avatar }} style={styles.avatar} />
                    ) : (
                      <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarText}>
                          {match.displayName.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                    )}
                    <View style={styles.matchDetails}>
                      <Text style={styles.matchName}>{match.displayName}</Text>
                      <Text style={styles.matchUsername}>@{match.username}</Text>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.checkbox,
                      selectedUsers.has(match.userId) && styles.checkboxSelected,
                    ]}
                  >
                    {selectedUsers.has(match.userId) && (
                      <IconSymbol
                        ios_icon_name="checkmark"
                        android_material_icon_name="check"
                        size={18}
                        color="#FFFFFF"
                      />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.footer}>
              <TouchableOpacity
                onPress={handleAddFriends}
                style={[styles.addButton, syncing && styles.buttonDisabled]}
                activeOpacity={0.8}
                disabled={syncing}
              >
                <Text style={styles.addButtonText}>
                  {syncing
                    ? 'Sending Requests...'
                    : selectedUsers.size > 0
                    ? `Add ${selectedUsers.size} Friend${selectedUsers.size > 1 ? 's' : ''}`
                    : 'Continue Without Adding'}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    lineHeight: 22,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  syncButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    elevation: 4,
  },
  syncButtonText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '700',
  },
  skipButton: {
    marginTop: 20,
    paddingVertical: 12,
  },
  skipButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 16,
  },
  matchesList: {
    flex: 1,
  },
  matchesContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  matchesHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  matchCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  matchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  matchDetails: {
    flex: 1,
  },
  matchName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  matchUsername: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    paddingTop: 12,
  },
  addButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  addButtonText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '700',
  },
});
