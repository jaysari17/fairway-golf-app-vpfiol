
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

  // Debounced search effect
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        performSearch(searchQuery);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const performSearch = async (query: string) => {
    setIsSearching(true);
    setShowResults(true);
    
    try {
      const results = await searchGolfCourses(query, 20);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCourseSelect = (course: GolfCourse) => {
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

  const hasApiKey = process.env.EXPO_PUBLIC_GOLF_COURSE_API_KEY;

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
            {hasApiKey 
              ? 'Search for any course or choose from popular options'
              : 'Choose from popular courses below'
            }
          </Text>
        </View>

        {hasApiKey && (
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
                placeholder="Search courses..."
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
                    setSearchQuery('');
                    setSearchResults([]);
                    setShowResults(false);
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
          </View>
        )}

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
                Searching courses...
              </Text>
            </View>
          ) : displayedCourses.length === 0 && showResults ? (
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
                Try a different search term
              </Text>
            </View>
          ) : (
            <View style={styles.courseGrid}>
              {displayedCourses.map((course, index) => (
                <TouchableOpacity
                  key={`${course.id}-${index}`}
                  style={[
                    styles.courseCard,
                    selectedCourse?.id === course.id && { 
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
                    <Text
                      style={[
                        styles.courseName,
                        { color: selectedCourse?.id === course.id ? '#FFFFFF' : theme.colors.text },
                      ]}
                      numberOfLines={2}
                    >
                      {course.name}
                    </Text>
                    <Text
                      style={[
                        styles.courseLocation,
                        { color: selectedCourse?.id === course.id ? '#FFFFFF' : theme.dark ? '#98989D' : '#666' },
                      ]}
                      numberOfLines={1}
                    >
                      {course.city}, {course.state}
                    </Text>
                    {course.holes && course.par && (
                      <Text
                        style={[
                          styles.courseDetails,
                          { color: selectedCourse?.id === course.id ? '#FFFFFF' : theme.dark ? '#98989D' : '#666' },
                        ]}
                      >
                        {course.holes} holes • Par {course.par}
                      </Text>
                    )}
                    {selectedCourse?.id === course.id && (
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
              ))}
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
  courseName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  courseLocation: {
    fontSize: 14,
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
