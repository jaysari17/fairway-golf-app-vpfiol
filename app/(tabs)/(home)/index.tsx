
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { CourseCard } from '@/components/CourseCard';
import { colors } from '@/styles/commonStyles';
import { sampleCourses } from '@/data/sampleCourses';
import { useRounds } from '@/hooks/useRounds';
import { RatingStorageService } from '@/utils/ratingStorage';
import { GolfCourse } from '@/types/golf';

export default function DiscoverScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { rounds } = useRounds();
  const [searchQuery, setSearchQuery] = useState('');
  const [ratedCoursesCount, setRatedCoursesCount] = useState(0);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    loadRatingsCount();
  }, [rounds]);

  const loadRatingsCount = async () => {
    try {
      const ratings = await RatingStorageService.getRatings();
      const count = ratings.length;
      setRatedCoursesCount(count);
      setShowList(count >= 5);
      console.log('User has rated', count, 'courses. Minimum required: 5');
    } catch (error) {
      console.error('Error loading ratings count:', error);
    }
  };

  const filteredCourses = sampleCourses.filter(course =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const remainingCourses = 5 - ratedCoursesCount;

  if (!showList) {
    return (
      <SafeAreaView 
        style={[styles.safeArea, { backgroundColor: theme.colors.background }]} 
        edges={['top']}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Discover
          </Text>
        </View>

        <View style={styles.requirementContainer}>
          <View style={styles.requirementCard}>
            <Text style={styles.requirementEmoji}>⛳</Text>
            <Text style={[styles.requirementTitle, { color: theme.colors.text }]}>
              Rate More Courses
            </Text>
            <Text style={[styles.requirementText, { color: theme.dark ? '#9CA3AF' : '#6B7280' }]}>
              To unlock your personalized course list and see accurate rankings, you need to rate at least 5 courses.
            </Text>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      backgroundColor: colors.primary,
                      width: `${(ratedCoursesCount / 5) * 100}%`,
                    }
                  ]} 
                />
              </View>
              <Text style={[styles.progressText, { color: theme.colors.text }]}>
                {ratedCoursesCount} of 5 courses rated
              </Text>
            </View>

            <View style={styles.remainingBadge}>
              <Text style={[styles.remainingText, { color: colors.primary }]}>
                {remainingCourses} more {remainingCourses === 1 ? 'course' : 'courses'} to go!
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.rateButton, { backgroundColor: colors.primary }]}
              onPress={() => {
                console.log('User tapped Rate a Course button');
                router.push('/modal');
              }}
              activeOpacity={0.8}
            >
              <IconSymbol
                ios_icon_name="star.fill"
                android_material_icon_name="star"
                size={20}
                color="#FFFFFF"
              />
              <Text style={styles.rateButtonText}>Rate a Course</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.benefitsSection}>
            <Text style={[styles.benefitsTitle, { color: theme.colors.text }]}>
              Why 5 courses?
            </Text>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitEmoji}>📊</Text>
              <Text style={[styles.benefitText, { color: theme.dark ? '#9CA3AF' : '#6B7280' }]}>
                More accurate comparative rankings
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitEmoji}>🎯</Text>
              <Text style={[styles.benefitText, { color: theme.dark ? '#9CA3AF' : '#6B7280' }]}>
                Better personalized recommendations
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitEmoji}>🏆</Text>
              <Text style={[styles.benefitText, { color: theme.dark ? '#9CA3AF' : '#6B7280' }]}>
                Meaningful course comparisons
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView 
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]} 
      edges={['top']}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Discover
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={[
          styles.searchInputContainer,
          { 
            backgroundColor: theme.dark ? '#1A1A1A' : '#FAFAFA',
            borderColor: theme.colors.border,
          }
        ]}>
          <IconSymbol
            ios_icon_name="magnifyingglass"
            android_material_icon_name="search"
            size={20}
            color={theme.dark ? '#9CA3AF' : '#6B7280'}
          />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search courses..."
            placeholderTextColor={theme.dark ? '#9CA3AF' : '#6B7280'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statsCard}>
          <Text style={[styles.statsText, { color: theme.colors.text }]}>
            You&apos;ve rated {ratedCoursesCount} courses
          </Text>
          <TouchableOpacity
            onPress={() => {
              console.log('User tapped Rate Another button');
              router.push('/modal');
            }}
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            activeOpacity={0.8}
          >
            <IconSymbol
              ios_icon_name="plus"
              android_material_icon_name="add"
              size={16}
              color="#FFFFFF"
            />
            <Text style={styles.addButtonText}>Rate Another</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Popular Courses
        </Text>

        {filteredCourses.map((course, index) => (
          <CourseCard
            key={index}
            course={course}
            onPress={() => {
              console.log('User selected course:', course.name);
              Alert.alert(
                course.name,
                `${course.city}, ${course.state}\n\nWould you like to rate this course?`,
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Rate Course',
                    onPress: () => router.push('/modal'),
                  },
                ]
              );
            }}
          />
        ))}
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
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 20 : 8,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 1,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchInputContainer: {
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
  requirementContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  requirementCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.06)',
    elevation: 3,
    marginBottom: 32,
  },
  requirementEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  requirementTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
  },
  requirementText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 24,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  remainingBadge: {
    backgroundColor: colors.highlight,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 24,
  },
  remainingText: {
    fontSize: 16,
    fontWeight: '700',
  },
  rateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    boxShadow: '0px 2px 8px rgba(127, 229, 200, 0.3)',
    elevation: 3,
  },
  rateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  benefitsSection: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.04)',
    elevation: 2,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  benefitEmoji: {
    fontSize: 24,
  },
  benefitText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.04)',
    elevation: 2,
  },
  statsText: {
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
});
