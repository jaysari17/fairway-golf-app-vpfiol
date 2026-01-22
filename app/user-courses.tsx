
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { RatingStorageService } from '@/utils/ratingStorage';
import { CourseRating } from '@/types/rating';

export default function UserCoursesScreen() {
  const theme = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const userId = params.userId as string;
  const userName = params.userName as string;
  
  const [courses, setCourses] = useState<CourseRating[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserCourses();
  }, [userId]);

  const loadUserCourses = async () => {
    try {
      console.log('Loading courses for user:', userId || 'current user');
      setLoading(true);
      
      // TODO: Backend Integration - GET /api/users/:userId/courses
      // Returns: [{ courseId, courseName, courseLocation, finalScore, playCount, lastPlayed }]
      // For now, load from local storage (current user only)
      const ratings = await RatingStorageService.getRatings();
      const sortedCourses = ratings.sort((a, b) => b.finalScore - a.finalScore);
      setCourses(sortedCourses);
    } catch (error) {
      console.error('Error loading user courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return colors.primary;
    if (score >= 75) return '#10B981';
    if (score >= 60) return '#F59E0B';
    if (score >= 40) return '#F97316';
    return '#EF4444';
  };

  const displayName = userName || 'User';
  const headerTitle = `${displayName}'s Courses`;

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
                Loading courses...
              </Text>
            </View>
          ) : courses.length === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol
                ios_icon_name="star"
                android_material_icon_name="star"
                size={64}
                color={theme.dark ? '#9CA3AF' : '#6B7280'}
              />
              <Text style={[styles.emptyStateTitle, { color: theme.colors.text }]}>
                No Courses Yet
              </Text>
              <Text style={[styles.emptyStateText, { color: theme.dark ? '#9CA3AF' : '#6B7280' }]}>
                This user hasn&apos;t rated any courses yet
              </Text>
            </View>
          ) : (
            <View style={styles.coursesList}>
              <Text style={[styles.coursesCount, { color: theme.dark ? '#9CA3AF' : '#6B7280' }]}>
                {courses.length} {courses.length === 1 ? 'course' : 'courses'} played
              </Text>
              {courses.map((course, index) => {
                const rankNumber = index + 1;
                const scoreColor = getScoreColor(course.finalScore);
                const playCountText = `Played ${course.playCount} ${course.playCount === 1 ? 'time' : 'times'}`;
                
                return (
                  <View
                    key={course.courseId}
                    style={[
                      styles.courseCard,
                      {
                        backgroundColor: theme.colors.card,
                        borderColor: theme.colors.border,
                      },
                    ]}
                  >
                    <View style={styles.courseRank}>
                      <Text style={[styles.courseRankText, { color: theme.colors.text }]}>
                        #{rankNumber}
                      </Text>
                    </View>
                    <View style={styles.courseInfo}>
                      <Text style={[styles.courseName, { color: theme.colors.text }]}>
                        {course.courseName}
                      </Text>
                      <Text style={[styles.courseLocation, { color: theme.dark ? '#9CA3AF' : '#6B7280' }]}>
                        {course.courseLocation}
                      </Text>
                      <Text style={[styles.coursePlayCount, { color: theme.dark ? '#9CA3AF' : '#6B7280' }]}>
                        {playCountText}
                      </Text>
                    </View>
                    <View style={styles.courseScore}>
                      <Text style={[styles.courseScoreText, { color: scoreColor }]}>
                        {course.finalScore}
                      </Text>
                    </View>
                  </View>
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
  coursesList: {
    gap: 12,
  },
  coursesCount: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  courseCard: {
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
});
