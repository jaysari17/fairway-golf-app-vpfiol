
import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PlayAgainStep } from '@/components/rating/PlayAgainStep';
import { ComparisonStep } from '@/components/rating/ComparisonStep';
import { DragRankStep } from '@/components/rating/DragRankStep';
import { ConfirmationStep } from '@/components/rating/ConfirmationStep';
import { IconSymbol } from '@/components/IconSymbol';
import { RatingStorageService } from '@/utils/ratingStorage';
import { StorageService } from '@/utils/storage';
import { RatingAlgorithm } from '@/utils/ratingAlgorithm';
import { AppStoreReviewService } from '@/utils/appStoreReview';
import { CourseRating } from '@/types/rating';
import { Round } from '@/types/golf';
import * as Haptics from 'expo-haptics';

type RatingStep = 'play-again' | 'comparison' | 'drag-rank' | 'confirmation';

interface ComparisonCourseData {
  courseId: string;
  courseName: string;
  courseLocation: string;
  userRating?: number;
  playCount: number;
}

export default function RatingFlowScreen() {
  const theme = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const courseId = params.courseId as string;
  const courseName = params.courseName as string;
  const courseLocation = params.courseLocation as string;

  const [currentStep, setCurrentStep] = useState<RatingStep>('play-again');
  const [playAgainResponse, setPlayAgainResponse] = useState<'definitely' | 'maybe' | 'no' | null>(null);
  const [comparisonWins, setComparisonWins] = useState(0);
  const [comparisonLosses, setComparisonLosses] = useState(0);
  const [comparedCourseIds, setComparedCourseIds] = useState<string[]>([]);
  const [currentComparisonIndex, setCurrentComparisonIndex] = useState(0);
  const [comparisonCourses, setComparisonCourses] = useState<string[]>([]);
  const [currentComparisonCourse, setCurrentComparisonCourse] = useState<ComparisonCourseData | null>(null);
  const [rankPosition, setRankPosition] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [rankedCourses, setRankedCourses] = useState<any[]>([]);
  const [playCount, setPlayCount] = useState(0);

  const loadData = useCallback(async () => {
    try {
      const ratings = await RatingStorageService.getRatings();
      const rounds = await StorageService.getRounds();
      const courseRounds = rounds.filter(r => r.courseId === courseId);
      setPlayCount(courseRounds.length);
      
      const comparisons = RatingAlgorithm.selectComparisonCourses(ratings, courseId, 3);
      setComparisonCourses(comparisons);
      
      const ranked = ratings
        .sort((a, b) => b.finalScore - a.finalScore)
        .map(r => ({
          courseId: r.courseId,
          courseName: r.courseName,
          courseLocation: r.courseLocation,
          rating: r.finalScore,
        }));
      setRankedCourses(ranked);
    } catch (error) {
      console.error('Error loading rating data:', error);
      Alert.alert('Error', 'Failed to load rating data');
    }
  }, [courseId]);

  const loadCurrentComparisonCourse = useCallback(async () => {
    try {
      if (currentComparisonIndex >= comparisonCourses.length) {
        setCurrentComparisonCourse(null);
        return;
      }
      
      const comparisonCourseId = comparisonCourses[currentComparisonIndex];
      const rounds = await StorageService.getRounds();
      const rating = await RatingStorageService.getRatingForCourse(comparisonCourseId);
      
      const courseRounds = rounds.filter(r => r.courseId === comparisonCourseId);
      const firstRound = courseRounds[0];
      
      if (!firstRound) {
        setCurrentComparisonCourse(null);
        return;
      }
      
      setCurrentComparisonCourse({
        courseId: comparisonCourseId,
        courseName: firstRound.courseName,
        courseLocation: firstRound.courseLocation,
        userRating: rating?.finalScore,
        playCount: courseRounds.length,
      });
    } catch (error) {
      console.error('Error loading comparison course:', error);
      setCurrentComparisonCourse(null);
    }
  }, [currentComparisonIndex, comparisonCourses]);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (currentStep === 'comparison' && comparisonCourses.length > 0) {
      loadCurrentComparisonCourse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, comparisonCourses.length]);

  const handlePlayAgainSelect = (response: 'definitely' | 'maybe' | 'no') => {
    setPlayAgainResponse(response);
    
    if (comparisonCourses.length > 0) {
      setCurrentStep('comparison');
    } else {
      setCurrentStep('drag-rank');
    }
  };

  const handleComparisonSelect = async (selectedCourseId: string) => {
    if (selectedCourseId === courseId) {
      setComparisonWins(prev => prev + 1);
    } else {
      setComparisonLosses(prev => prev + 1);
    }
    
    setComparedCourseIds(prev => [...prev, comparisonCourses[currentComparisonIndex]]);
    
    if (currentComparisonIndex < comparisonCourses.length - 1) {
      setCurrentComparisonIndex(prev => prev + 1);
    } else {
      setCurrentStep('drag-rank');
    }
  };

  const handleRankPlacement = async (position: number) => {
    setRankPosition(position);
    
    const neighborRatings: { above?: number; below?: number } = {};
    
    if (position > 0 && rankedCourses[position - 1]) {
      neighborRatings.above = rankedCourses[position - 1].rating;
    }
    if (position < rankedCourses.length && rankedCourses[position]) {
      neighborRatings.below = rankedCourses[position].rating;
    }
    
    const score = RatingAlgorithm.calculateFinalScore(
      playAgainResponse!,
      comparisonWins,
      comparisonLosses,
      position,
      rankedCourses.length + 1,
      neighborRatings
    );
    
    setFinalScore(score);
    setCurrentStep('confirmation');
  };

  const handleComplete = async () => {
    try {
      // Save the rating
      const rating: CourseRating = {
        id: Date.now().toString(),
        courseId,
        courseName,
        courseLocation,
        playAgainResponse: playAgainResponse!,
        comparisonWins,
        comparisonLosses,
        comparedCourseIds,
        rankPosition,
        totalCourses: rankedCourses.length + 1,
        finalScore,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      await RatingStorageService.saveRating(rating);
      
      // Save a round for this course
      const round: Round = {
        id: Date.now().toString(),
        courseId,
        courseName,
        courseLocation,
        date: new Date(),
        rating: Math.round(finalScore * 10), // Convert 1-10 to 1-100 for consistency
      };
      
      await StorageService.saveRound(round);
      await RatingStorageService.completeTrigger(courseId);
      
      await triggerAppStoreReview();
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      Alert.alert(
        'Success! 🎉',
        `${courseName} has been added to your Fairway list with a rating of ${finalScore.toFixed(1)}/10`,
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Error saving rating:', error);
      Alert.alert('Error', 'Failed to save rating');
    }
  };

  const triggerAppStoreReview = async () => {
    try {
      const ratings = await RatingStorageService.getRatings();
      const rounds = await StorageService.getRounds();
      
      if (ratings.length >= 3 && rounds.length >= 5) {
        await AppStoreReviewService.requestReview();
      }
    } catch (error) {
      console.error('Error triggering app store review:', error);
    }
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Alert.alert(
      'Exit Rating?',
      'Your progress will be lost. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Exit', 
          style: 'destructive', 
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            router.back();
          }
        },
      ]
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'play-again':
        return (
          <PlayAgainStep
            courseName={courseName}
            onSelect={handlePlayAgainSelect}
          />
        );
      
      case 'comparison':
        if (!currentComparisonCourse) {
          return null;
        }
        
        return (
          <ComparisonStep
            targetCourse={{
              courseId,
              courseName,
              courseLocation,
              playCount,
            }}
            comparisonCourse={currentComparisonCourse}
            onSelect={handleComparisonSelect}
            currentIndex={currentComparisonIndex}
            totalComparisons={comparisonCourses.length}
          />
        );
      
      case 'drag-rank':
        return (
          <DragRankStep
            targetCourseName={courseName}
            rankedCourses={rankedCourses}
            onPlacement={handleRankPlacement}
          />
        );
      
      case 'confirmation':
        return (
          <ConfirmationStep
            courseName={courseName}
            finalScore={finalScore}
            rankPosition={rankPosition}
            totalCourses={rankedCourses.length + 1}
            playCount={playCount}
            onComplete={handleComplete}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      visible={true}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView 
        style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
        edges={['top']}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.closeButton, { backgroundColor: theme.colors.card }]}
            onPress={handleClose}
            activeOpacity={0.7}
          >
            <IconSymbol
              ios_icon_name="xmark"
              android_material_icon_name="close"
              size={24}
              color={theme.colors.text}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {renderStep()}
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  content: {
    flex: 1,
  },
});
