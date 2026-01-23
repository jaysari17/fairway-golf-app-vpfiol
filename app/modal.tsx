
import { colors } from '@/styles/commonStyles';
import { useTheme } from '@react-navigation/native';
import { searchGolfCourses, testGolfCourseApi } from '@/utils/golfCourseApi';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GolfCourse } from '@/types/golf';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
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
import React, { useState, useEffect } from 'react';
import { sampleCourses } from '@/data/sampleCourses';

export default function SelectCourseModal() {
  const router = useRouter();
  const { colors: themeColors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GolfCourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<GolfCourse | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);

  useEffect(() => {
    console.log('Search query changed:', searchQuery);
    console.log('Search query length:', searchQuery.length);
    
    if (searchQuery.length >= 2) {
      const timeoutId = setTimeout(() => {
        console.log('User searching for golf courses:', searchQuery);
        performSearch(searchQuery, true);
      }, 500);
      return () => {
        clearTimeout(timeoutId);
      };
    } else if (searchQuery.length === 0) {
      console.log('User cleared search');
      setSearchResults([]);
      setHasSearched(false);
      setOffset(0);
      setHasMore(false);
      setIsRateLimited(false);
    }
  }, [searchQuery]);

  const performSearch = async (query: string, isNewSearch: boolean) => {
    console.log('Is new search:', isNewSearch);
    const currentOffset = isNewSearch ? 0 : offset;
    
    if (isNewSearch) {
      setIsSearching(true);
      setSearchResults([]);
      setOffset(0);
      setHasMore(false);
      setIsRateLimited(false);
    } else {
      setIsLoadingMore(true);
    }

    console.log('Calling searchGolfCourses API with query:', query, 'offset:', currentOffset);

    try {
      const result = await searchGolfCourses(query, 100, currentOffset);
      
      console.log('Search results received:', result.count, 'courses');
      
      if (result.rateLimited) {
        console.log('API is rate-limited, showing sample data');
        setIsRateLimited(true);
      }

      if (result.success) {
        if (isNewSearch) {
          setSearchResults(result.courses);
        } else {
          setSearchResults((prev) => [...prev, ...result.courses]);
        }
        
        setHasMore(result.count === 100 && result.total > currentOffset + result.count);
        setOffset(currentOffset + result.count);
        setHasSearched(true);
      } else {
        console.error('Search failed:', result.error);
        if (isNewSearch) {
          setSearchResults([]);
        }
        setHasSearched(true);
      }
    } catch (error) {
      console.error('Search error:', error);
      if (isNewSearch) {
        setSearchResults([]);
      }
      setHasSearched(true);
    } finally {
      console.log('Search completed');
      setIsSearching(false);
      setIsLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore && searchQuery.length >= 2) {
      console.log('User loading more results');
      performSearch(searchQuery, false);
    }
  };

  const handleCourseSelect = (course: GolfCourse) => {
    console.log('User selected course:', course.name);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedCourse(course);
  };

  const handleContinue = () => {
    if (!selectedCourse) {
      console.log('No course selected, showing alert');
      Alert.alert('No Course Selected', 'Please select a golf course to continue.');
      return;
    }

    console.log('User continuing with selected course:', selectedCourse.name);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    router.push({
      pathname: '/rating-flow',
      params: {
        courseId: selectedCourse.id,
        courseName: selectedCourse.name,
        courseLocation: selectedCourse.location,
      },
    });
  };

  const handleTestApi = async () => {
    console.log('User testing API');
    const result = await testGolfCourseApi();
    Alert.alert(
      result.success ? 'API Test Successful' : 'API Test Failed',
      result.message
    );
  };

  const searchQueryDisplay = searchQuery;
  const hasResults = searchResults.length > 0;
  const showNoResults = hasSearched && !hasResults && !isSearching;
  const showRateLimitBanner = isRateLimited;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            console.log('User closing modal');
            router.back();
          }}
          style={styles.closeButton}
        >
          <IconSymbol
            ios_icon_name="xmark"
            android_material_icon_name="close"
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
        <Text style={[styles.title, { color: themeColors.text }]}>Select a Course</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.searchContainer}>
        <IconSymbol
          ios_icon_name="magnifyingglass"
          android_material_icon_name="search"
          size={20}
          color={colors.textSecondary}
        />
        <TextInput
          style={[styles.searchInput, { color: themeColors.text }]}
          placeholder="Search for a golf course..."
          placeholderTextColor={colors.textSecondary}
          value={searchQueryDisplay}
          onChangeText={setSearchQuery}
          autoFocus
          returnKeyType="search"
          onSubmitEditing={() => {
            if (searchQuery.length >= 2) {
              Keyboard.dismiss();
            }
          }}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              console.log('User clearing search');
              setSearchQuery('');
            }}
          >
            <IconSymbol
              ios_icon_name="xmark.circle.fill"
              android_material_icon_name="cancel"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {showRateLimitBanner && (
        <View style={styles.rateLimitBanner}>
          <IconSymbol
            ios_icon_name="exclamationmark.triangle.fill"
            android_material_icon_name="warning"
            size={20}
            color="#FF9500"
          />
          <Text style={styles.rateLimitText}>
            API rate limit reached. Showing sample courses. Full database will be available soon.
          </Text>
        </View>
      )}

      <ScrollView
        style={styles.resultsContainer}
        contentContainerStyle={styles.resultsContent}
        keyboardShouldPersistTaps="handled"
      >
        {isSearching && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: themeColors.text }]}>
              Searching courses...
            </Text>
          </View>
        )}

        {showNoResults && (
          <View style={styles.emptyContainer}>
            <IconSymbol
              ios_icon_name="magnifyingglass"
              android_material_icon_name="search"
              size={48}
              color={colors.textSecondary}
            />
            <Text style={[styles.emptyTitle, { color: themeColors.text }]}>
              No courses found
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              Try searching for a different course name or location
            </Text>
          </View>
        )}

        {hasResults &&
          searchResults.map((course, index) => {
            const isSelected = selectedCourse?.id === course.id;
            const courseName = course.name;
            const courseLocation = course.location;
            const courseDetails = `${course.holes || 18} holes • Par ${course.par || 72}`;

            return (
              <TouchableOpacity
                key={`${course.id}-${index}`}
                style={[
                  styles.courseCard,
                  { backgroundColor: themeColors.card },
                  isSelected && styles.courseCardSelected,
                ]}
                onPress={() => handleCourseSelect(course)}
              >
                <View style={styles.courseInfo}>
                  <Text style={[styles.courseName, { color: themeColors.text }]}>
                    {courseName}
                  </Text>
                  <Text style={[styles.courseLocation, { color: colors.textSecondary }]}>
                    {courseLocation}
                  </Text>
                  <Text style={[styles.courseDetails, { color: colors.textSecondary }]}>
                    {courseDetails}
                  </Text>
                </View>
                {isSelected && (
                  <IconSymbol
                    ios_icon_name="checkmark.circle.fill"
                    android_material_icon_name="check-circle"
                    size={24}
                    color={colors.primary}
                  />
                )}
              </TouchableOpacity>
            );
          })}

        {hasMore && !isLoadingMore && (
          <TouchableOpacity style={styles.loadMoreButton} onPress={handleLoadMore}>
            <Text style={styles.loadMoreText}>Load More</Text>
          </TouchableOpacity>
        )}

        {isLoadingMore && (
          <View style={styles.loadingMoreContainer}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={[styles.loadingMoreText, { color: themeColors.text }]}>
              Loading more...
            </Text>
          </View>
        )}
      </ScrollView>

      {selectedCourse && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.continueButton, { backgroundColor: colors.primary }]}
            onPress={handleContinue}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 32,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    marginHorizontal: 20,
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  rateLimitBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    gap: 12,
  },
  rateLimitText: {
    flex: 1,
    fontSize: 13,
    color: '#E65100',
    lineHeight: 18,
  },
  resultsContainer: {
    flex: 1,
  },
  resultsContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
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
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  courseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  courseCardSelected: {
    borderColor: colors.primary,
  },
  courseInfo: {
    flex: 1,
    gap: 4,
  },
  courseName: {
    fontSize: 16,
    fontWeight: '600',
  },
  courseLocation: {
    fontSize: 14,
  },
  courseDetails: {
    fontSize: 12,
  },
  loadMoreButton: {
    backgroundColor: colors.cardBackground,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  loadMoreText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  loadingMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 12,
  },
  loadingMoreText: {
    fontSize: 14,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  continueButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
