
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Platform,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CourseCard } from '@/components/CourseCard';
import { StatCard } from '@/components/StatCard';
import { IconSymbol } from '@/components/IconSymbol';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useRounds } from '@/hooks/useRounds';
import { useRatingTrigger } from '@/hooks/useRatingTrigger';
import { colors } from '@/styles/commonStyles';

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { rounds, loading, refresh } = useRounds();
  const { pendingTriggers, checkSessionTriggers } = useRatingTrigger();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Check for session-based triggers on mount
    checkSessionTriggers();
  }, [checkSessionTriggers]);

  useEffect(() => {
    // Show rating flow if there are pending triggers
    if (pendingTriggers.length > 0 && !loading) {
      const trigger = pendingTriggers[0];
      setTimeout(() => {
        router.push({
          pathname: '/rating-flow',
          params: {
            courseId: trigger.courseId,
            courseName: trigger.courseName,
            courseLocation: rounds.find(r => r.courseId === trigger.courseId)?.courseLocation || '',
          },
        });
      }, 1000);
    }
  }, [pendingTriggers, loading, rounds, router]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const uniqueCourses = new Set(rounds.map(r => r.courseId)).size;
  const averageRating = rounds.length > 0
    ? Math.round(rounds.reduce((sum, r) => sum + r.rating, 0) / rounds.length)
    : 0;

  const sortedRounds = [...rounds].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (loading && rounds.length === 0) {
    return (
      <SafeAreaView 
        style={[styles.safeArea, { backgroundColor: theme.colors.background }]} 
        edges={['top']}
      >
        <View style={styles.loadingContainer}>
          <LoadingSpinner message="Loading your rounds..." />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView 
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]} 
      edges={['top']}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>FAIRWAY</Text>
          <Text style={[styles.subtitle, { color: theme.dark ? '#98989D' : '#666' }]}>
            Your Golf Journey
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <StatCard label="Rounds Played" value={rounds.length} icon="⛳" />
          <StatCard label="Courses" value={uniqueCourses} icon="🏌️" />
          <StatCard label="Avg Rating" value={averageRating} icon="⭐" />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Recent Rounds
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/modal')}
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            activeOpacity={0.8}
          >
            <IconSymbol
              ios_icon_name="plus"
              android_material_icon_name="add"
              size={24}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>

        {rounds.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>⛳</Text>
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
              No Rounds Yet
            </Text>
            <Text style={[styles.emptyText, { color: theme.dark ? '#98989D' : '#666' }]}>
              Start tracking your golf journey by logging your first round
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/modal')}
              style={[styles.primaryButton, { backgroundColor: colors.primary }]}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Log Your First Round</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.roundsList}>
            {sortedRounds.map((round, index) => (
              <CourseCard
                key={index}
                round={round}
                onPress={() => console.log('View round details:', round.id)}
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
    paddingTop: Platform.OS === 'android' ? 20 : 0,
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(87, 200, 161, 0.3)',
    elevation: 3,
  },
  roundsList: {
    paddingBottom: 20,
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
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    boxShadow: '0px 2px 8px rgba(87, 200, 161, 0.3)',
    elevation: 3,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
