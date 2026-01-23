
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
import { searchGolfCourses, testGolfCourseApi } from '@/utils/golfCourseApi';
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
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreResults, setHasMoreResults] = useState(false);
  const [currentOffset, setCurrentOffset] = useState(0);

  // Debounced search effect
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        performSearch(searchQuery, true);
      } else {
        setSearchResults([]);
        setShowResults(false);
        setHasSearched(false);
        setHasMoreResults(false);
        setCurrentOffset(0);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const performSearch = async (query: string, isNewSearch: boolean = false) => {
    console.log('User searching for golf courses:', query);
    console.log('Search query length:', query.length);
    console.log('Is new search:', isNewSearch);
    
    if (isNewSearch) {
      setIsSearching(true);
      setCurrentOffset(0);
    } else {
      setIsLoadingMore(true);
    }
    
    setShowResults(true);
    setHasSearched(true);
    
    try {
      const offset = isNewSearch ? 0 : currentOffset;
      const limit = 100;
      
      console.log('Calling searchGolfCourses API with query:', query, 'offset:', offset);
      const results = await searchGolfCourses(query, limit, offset);
      console.log('Search results received:', results.length, 'courses');
      
      if (results.length > 0) {
        console.log('First result:', results[0].name, '-', results[0].location);
      } else {
        console.log('No results found for query:', query);
      }
      
      if (isNewSearch) {
        setSearchResults(results);
      } else {
        setSearchResults(prev => [...prev, ...results]);
      }
      
      setHasMoreResults(results.length === limit);
      setCurrentOffset(offset + results.length);
      
    } catch (error) {
      console.error('Search error in modal:', error);
      console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error);
      if (isNewSearch) {
        setSearchResults([]);
      }
    } finally {
      setIsSearching(false);
      setIsLoadingMore(false);
      console.log('Search completed');
    }
  };

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMoreResults && searchQuery.trim().length >= 2) {
      console.log('User loading more results, current offset:', currentOffset);
      performSearch(searchQuery, false);
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

  const handleTestApi = async () => {
    console.log('User testing Golf Course API connection');
    
    const result = await testGolfCourseApi();
    
    Alert.alert(
      result.success ? '✅ Worldwide Golf Course Database' : '⚠️ Golf Course Search Status',
      result.message,
      [{ text: 'OK' }]
    );
  };

  const displayedCourses = showResults && searchQuery.trim().length >= 2
    ? searchResults
    : sampleCourses;

  const showingApiResults = showResults && searchQuery.trim().length >= 2 && searchResults.length > 0;
  const showingSampleCourses = !showResults || searchQuery.trim().length < 2;
  const showNoResults = hasSearched && searchResults.length === 0 && !isSearching && searchQuery.trim().length >= 2;

  const resultsCountText = searchResults.length > 0 
    ? `${searchResults.length}${hasMoreResults ? '+' : ''} courses found`
    : '';

  return (
    <SafeAreaView 
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
      edges={['bottom']}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerTextContainer}>
              <Text style={[styles.title, { color: theme.colors.text }]}>
                Select a Course
              </Text>
              <Text style={[styles.subtitle, { color: theme.dark ? '#98989D' : '#666' }]}>
                🌍 Search thousands of courses worldwide
              </Text>
            </View>
            <TouchableOpacity
              style={styles.testButton}
              onPress={handleTestApi}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <IconSymbol
                ios_icon_name="info.circle"
                android_material_icon_name="info"
                size={20}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>
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
              placeholder="Try: Pebble Beach, St Andrews, Dubai, Tokyo, Paris..."
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
                  setHasMoreResults(false);
                  setCurrentOffset(0);
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
                ✓ {resultsCountText} from worldwide database
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
                Popular courses • Search above for any course worldwide
              </Text>
            </View>
          )}
          
          {showNoResults && (
            <View style={[styles.noResultsCard, { backgroundColor: theme.dark ? '#1C1C1E' : '#FFF3CD' }]}>
              <View style={styles.noResultsHeader}>
                <IconSymbol
                  ios_icon_name="magnifyingglass"
                  android_material_icon_name="search"
                  size={20}
                  color="#FF9500"
                />
                <Text style={[styles.noResultsTitle, { color: '#FF9500' }]}>
                  No Results Found
                </Text>
              </View>
              <Text style={[styles.noResultsText, { color: theme.dark ? '#98989D' : '#666' }]}>
                No courses found for &quot;{searchQuery}&quot;. Try searching for:
              </Text>
              <Text style={[styles.noResultsSuggestions, { color: theme.dark ? '#98989D' : '#666' }]}>
                • Course name: &quot;Pebble Beach&quot;, &quot;St Andrews&quot;, &quot;Augusta&quot;{'\n'}
                • City: &quot;Scottsdale&quot;, &quot;Dubai&quot;, &quot;Tokyo&quot;{'\n'}
                • Country: &quot;Scotland&quot;, &quot;Ireland&quot;, &quot;Australia&quot;
              </Text>
              <TouchableOpacity
                style={[styles.clearSearchButton, { backgroundColor: colors.primary }]}
                onPress={() => {
                  console.log('User viewing popular courses after no results');
                  setSearchQuery('');
                  setShowResults(false);
                  setHasSearched(false);
                  setHasMoreResults(false);
                  setCurrentOffset(0);
                }}
              >
                <Text style={styles.clearSearchButtonText}>
                  View Popular Courses
                </Text>
              </TouchableOpacity>
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
                Searching worldwide golf courses...
              </Text>
              <Text style={[styles.loadingSubtext, { color: theme.dark ? '#98989D' : '#666' }]}>
                Searching for: {searchQuery}
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
                Try a different search term
              </Text>
            </View>
          ) : (
            <React.Fragment>
              <View style={styles.courseGrid}>
                {displayedCourses.map((course, index) => {
                  const isApiCourse = course.id.startsWith('gc-');
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
                        !isSelected && { 
                          backgroundColor: theme.colors.card,
                          borderColor: theme.colors.border,
                        },
                      ]}
                      onPress={() => handleCourseSelect(course)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.courseCardContent}>
                        {isApiCourse && showingApiResults && (
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
                              Worldwide DB
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
                          <View style={styles.courseDetailsRow}>
                            <Text
                              style={[
                                styles.courseDetails,
                                { color: isSelected ? '#FFFFFF' : theme.dark ? '#98989D' : '#666' },
                              ]}
                            >
                              {course.holes} holes
                            </Text>
                            <Text
                              style={[
                                styles.courseDetailsSeparator,
                                { color: isSelected ? '#FFFFFF' : theme.dark ? '#98989D' : '#666' },
                              ]}
                            >
                              •
                            </Text>
                            <Text
                              style={[
                                styles.courseDetails,
                                { color: isSelected ? '#FFFFFF' : theme.dark ? '#98989D' : '#666' },
                              ]}
                            >
                              Par {course.par}
                            </Text>
                          </View>
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
              
              {hasMoreResults && showingApiResults && (
                <TouchableOpacity
                  style={[
                    styles.loadMoreButton,
                    { 
                      backgroundColor: theme.dark ? '#1C1C1E' : '#F2F2F7',
                      borderColor: theme.colors.border,
                    }
                  ]}
                  onPress={handleLoadMore}
                  disabled={isLoadingMore}
                  activeOpacity={0.7}
                >
                  {isLoadingMore ? (
                    <React.Fragment>
                      <ActivityIndicator size="small" color={colors.primary} />
                      <Text style={[styles.loadMoreText, { color: theme.colors.text }]}>
                        Loading more courses...
                      </Text>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <IconSymbol
                        ios_icon_name="arrow.down.circle"
                        android_material_icon_name="expand-more"
                        size={24}
                        color={colors.primary}
                      />
                      <Text style={[styles.loadMoreText, { color: theme.colors.text }]}>
                        Load More Courses
                      </Text>
                    </React.Fragment>
                  )}
                </TouchableOpacity>
              )}
            </React.Fragment>
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
  headerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  testButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(87, 200, 161, 0.1)',
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
  noResultsCard: {
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  noResultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  noResultsTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  noResultsText: {
    fontSize: 14,
    lineHeight: 20,
  },
  noResultsSuggestions: {
    fontSize: 13,
    lineHeight: 20,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  clearSearchButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  clearSearchButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
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
  courseDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  courseDetails: {
    fontSize: 12,
  },
  courseDetailsSeparator: {
    fontSize: 12,
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
    fontWeight: '600',
  },
  loadingSubtext: {
    fontSize: 14,
    textAlign: 'center',
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
  loadMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 16,
  },
  loadMoreText: {
    fontSize: 16,
    fontWeight: '600',
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
