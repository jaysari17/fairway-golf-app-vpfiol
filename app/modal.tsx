
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  TextInput,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { sampleCourses } from '@/data/sampleCourses';
import { searchGolfCourses } from '@/utils/golfCourseApi';
import { GolfCourse } from '@/types/golf';
import * as Haptics from 'expo-haptics';

export default function SelectCourseModal() {
  const theme = useTheme();
  const router = useRouter();
  const [selectedCourse, setSelectedCourse] = useState<GolfCourse | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GolfCourse[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Debounced search effect
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        performSearch(searchQuery);
      } else {
        setSearchResults([]);
        setShowResults(false);
        setHasSearched(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const performSearch = async (query: string) => {
    console.log('User searching for golf courses:', query);
    setIsSearching(true);
    setShowResults(true);
    setHasSearched(true);
    
    try {
      const results = await searchGolfCourses(query, 50);
      console.log('Search results received:', results.length, 'courses');
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCourseSelect = (course: GolfCourse) => {
    console.log('User selected course:', course.name, course.location);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCourse(course);
    Keyboard.dismiss();
  };

  const handleContinue = async () => {
    if (!selectedCourse) {
      Alert.alert('Error', 'Please select a course');
      return;
    }

    try {
      console.log('User continuing to rating flow with course:', selectedCourse.name);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Navigate directly to rating flow
      router.back();
      setTimeout(() => {
        router.push({
          pathname: '/rating-flow',
          params: {
            courseId: selectedCourse.id,
            courseName: selectedCourse.name,
            courseLocation: selectedCourse.location,
          },
        });
      }, 300);
    } catch (error) {
      console.error('Error selecting course:', error);
      Alert.alert('Error', 'Failed to select course. Please try again.');
    }
  };

  const displayedCourses = showResults && searchQuery.trim().length >= 2
    ? searchResults
    : sampleCourses;

  const showingApiResults = showResults && searchQuery.trim().length >= 2 && searchResults.length > 0;
  const showingSampleCourses = !showResults || searchQuery.trim().length < 2;

  return (
    <SafeAreaView 
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
      edges={['bottom']}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Select a Course
          </Text>
          <Text style={[styles.subtitle, { color: theme.dark ? '#98989D' : '#666' }]}>
            Search for any course worldwide or choose from popular options
          </Text>
        </View>

        <View style={styles.searchContainer}>
          <View style={[
            styles.searchInputContainer,
            { 
              backgroundColor: theme.dark ? '#1C1C1E' : '#F2F2F7',
              borderColor: theme.colors.border,
            }
          ]}>
            <IconSymbol
              ios_icon_name="magnifyingglass"
              android_material_icon_name="search"
              size={20}
              color={theme.dark ? '#98989D' : '#666'}
            />
            <TextInput
              style={[styles.searchInput, { color: theme.colors.text }]}
              placeholder="Search courses worldwide..."
              placeholderTextColor={theme.dark ? '#98989D' : '#666'}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  console.log('User cleared search');
                  setSearchQuery('');
                  setSearchResults([]);
                  setShowResults(false);
                  setHasSearched(false);
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <IconSymbol
                  ios_icon_name="xmark.circle.fill"
                  android_material_icon_name="cancel"
                  size={20}
                  color={theme.dark ? '#98989D' : '#666'}
                />
              </TouchableOpacity>
            )}
          </View>
          
          {showingApiResults && (
            <View style={styles.resultsBadge}>
              <IconSymbol
                ios_icon_name="globe"
                android_material_icon_name="public"
                size={16}
                color={colors.primary}
              />
              <Text style={[styles.resultsBadgeText, { color: colors.primary }]}>
                Showing {searchResults.length} real courses from worldwide database
              </Text>
            </View>
          )}
          
          {showingSampleCourses && (
            <View style={styles.resultsBadge}>
              <IconSymbol
                ios_icon_name="star.fill"
                android_material_icon_name="star"
                size={16}
                color={theme.dark ? '#98989D' : '#666'}
              />
              <Text style={[styles.resultsBadgeText, { color: theme.dark ? '#98989D' : '#666' }]}>
                Popular courses (search to find more worldwide)
              </Text>
            </View>
          )}
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {isSearching ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.loadingText, { color: theme.dark ? '#98989D' : '#666' }]}>
                Searching golf courses worldwide...
              </Text>
            </View>
          ) : displayedCourses.length === 0 && hasSearched ? (
            <View style={styles.emptyContainer}>
              <IconSymbol
                ios_icon_name="magnifyingglass"
                android_material_icon_name="search"
                size={48}
                color={theme.dark ? '#98989D' : '#666'}
              />
              <Text style={[styles.emptyText, { color: theme.colors.text }]}>
                No courses found
              </Text>
              <Text style={[styles.emptySubtext, { color: theme.dark ? '#98989D' : '#666' }]}>
                Try searching by course name, city, or state
              </Text>
              <Text style={[styles.emptyHint, { color: theme.dark ? '#98989D' : '#666' }]}>
                Examples: &quot;Pebble Beach&quot;, &quot;Augusta&quot;, &quot;St Andrews&quot;
              </Text>
              <TouchableOpacity
                style={[styles.sampleCoursesButton, { backgroundColor: colors.primary }]}
                onPress={() => {
                  setSearchQuery('');
                  setShowResults(false);
                  setHasSearched(false);
                }}
              >
                <Text style={styles.sampleCoursesButtonText}>
                  View Popular Courses
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.courseGrid}>
              {displayedCourses.map((course, index) => {
                const isApiCourse = course.id.startsWith('api-');
                const isSelected = selectedCourse?.id === course.id;
                
                return (
                  <TouchableOpacity
                    key={`${course.id}-${index}`}
                    style={[
                      styles.courseCard,
                      isSelected && { 
                        backgroundColor: colors.primary,
                        borderColor: colors.primary,
                      },
                      { 
                        backgroundColor: theme.colors.card,
                        borderColor: theme.colors.border,
                      },
                    ]}
                    onPress={() => handleCourseSelect(course)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.courseCardContent}>
                      {isApiCourse && (
                        <View style={styles.apiBadge}>
                          <IconSymbol
                            ios_icon_name="globe"
                            android_material_icon_name="public"
                            size={12}
                            color={isSelected ? '#FFFFFF' : colors.primary}
                          />
                          <Text style={[
                            styles.apiBadgeText,
                            { color: isSelected ? '#FFFFFF' : colors.primary }
                          ]}>
                            Real Course
                          </Text>
                        </View>
                      )}
                      <Text
                        style={[
                          styles.courseName,
                          { color: isSelected ? '#FFFFFF' : theme.colors.text },
                        ]}
                        numberOfLines={2}
                      >
                        {course.name}
                      </Text>
                      <Text
                        style={[
                          styles.courseLocation,
                          { color: isSelected ? '#FFFFFF' : theme.dark ? '#98989D' : '#666' },
                        ]}
                        numberOfLines={1}
                      >
                        {course.city}, {course.state}
                      </Text>
                      {course.country && course.country !== 'USA' && (
                        <Text
                          style={[
                            styles.courseCountry,
                            { color: isSelected ? '#FFFFFF' : theme.dark ? '#98989D' : '#666' },
                          ]}
                        >
                          {course.country}
                        </Text>
                      )}
                      {course.holes && course.par && (
                        <Text
                          style={[
                            styles.courseDetails,
                            { color: isSelected ? '#FFFFFF' : theme.dark ? '#98989D' : '#666' },
                          ]}
                        >
                          {course.holes} holes • Par {course.par}
                        </Text>
                      )}
                      {isSelected && (
                        <View style={styles.checkmark}>
                          <IconSymbol
                            ios_icon_name="checkmark.circle.fill"
                            android_material_icon_name="check-circle"
                            size={24}
                            color="#FFFFFF"
                          />
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.continueButton, 
              { backgroundColor: colors.primary },
              !selectedCourse && styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!selectedCourse}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>
              Continue to Rating
            </Text>
            <IconSymbol
              ios_icon_name="arrow.right"
              android_material_icon_name="arrow-forward"
              size={20}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>
      </View>
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
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
  resultsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 4,
  },
  resultsBadgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  courseGrid: {
    gap: 12,
  },
  courseCard: {
    borderRadius: 16,
    borderWidth: 2,
    padding: 20,
    minHeight: 100,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  courseCardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  apiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  apiBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  courseName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  courseLocation: {
    fontSize: 14,
    marginBottom: 4,
  },
  courseCountry: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  courseDetails: {
    fontSize: 12,
    marginTop: 4,
  },
  checkmark: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 16,
    textAlign: 'center',
  },
  emptyHint: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 8,
  },
  sampleCoursesButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  sampleCoursesButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 18,
    borderRadius: 16,
    boxShadow: '0px 4px 16px rgba(87, 200, 161, 0.4)',
    elevation: 4,
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
