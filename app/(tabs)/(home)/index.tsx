
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { CourseCard } from '@/components/CourseCard';
import { useRounds } from '@/hooks/useRounds';
import { colors } from '@/styles/commonStyles';
import { sampleCourses } from '@/data/sampleCourses';
import { GolfCourse } from '@/types/golf';

export default function DiscoverScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { rounds } = useRounds();
  const [searchQuery, setSearchQuery] = useState('');

  const playedCourseIds = new Set(rounds.map(r => r.courseId));
  
  const filteredCourses = sampleCourses.filter(course => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      course.name.toLowerCase().includes(query) ||
      course.city.toLowerCase().includes(query) ||
      course.state.toLowerCase().includes(query)
    );
  });

  const recommendedCourses = filteredCourses.filter(c => !playedCourseIds.has(c.id));
  const playedCourses = filteredCourses.filter(c => playedCourseIds.has(c.id));

  return (
    <SafeAreaView 
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]} 
      edges={['top']}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Discover</Text>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.push('/modal')}
          activeOpacity={0.7}
        >
          <IconSymbol
            ios_icon_name="plus.circle.fill"
            android_material_icon_name="add-circle"
            size={28}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: theme.colors.card }]}>
          <IconSymbol
            ios_icon_name="magnifyingglass"
            android_material_icon_name="search"
            size={20}
            color={theme.dark ? '#666' : '#999'}
          />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search courses..."
            placeholderTextColor={theme.dark ? '#666' : '#999'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <IconSymbol
                ios_icon_name="xmark.circle.fill"
                android_material_icon_name="cancel"
                size={20}
                color={theme.dark ? '#666' : '#999'}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {recommendedCourses.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Recommended for You
            </Text>
            {recommendedCourses.map((course, index) => (
              <CourseCard
                key={index}
                course={course}
                onPress={() => {
                  console.log('Course pressed:', course.name);
                }}
              />
            ))}
          </View>
        )}

        {playedCourses.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Courses You&apos;ve Played
            </Text>
            {playedCourses.map((course, index) => {
              const courseRounds = rounds.filter(r => r.courseId === course.id);
              const avgRating = courseRounds.length > 0
                ? Math.round(courseRounds.reduce((sum, r) => sum + r.rating, 0) / courseRounds.length)
                : 0;
              
              return (
                <CourseCard
                  key={index}
                  course={course}
                  played={true}
                  playCount={courseRounds.length}
                  rating={avgRating}
                  onPress={() => {
                    console.log('Course pressed:', course.name);
                  }}
                />
              );
            })}
          </View>
        )}

        {filteredCourses.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
              No courses found
            </Text>
            <Text style={[styles.emptyText, { color: theme.dark ? '#98989D' : '#666' }]}>
              Try adjusting your search
            </Text>
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
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 1,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    paddingHorizontal: 20,
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
  },
});
