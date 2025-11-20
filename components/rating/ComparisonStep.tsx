
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import * as Haptics from 'expo-haptics';

interface ComparisonCourse {
  courseId: string;
  courseName: string;
  courseLocation: string;
  userRating?: number;
  playCount: number;
}

interface ComparisonStepProps {
  targetCourse: ComparisonCourse;
  comparisonCourse: ComparisonCourse;
  onSelect: (selectedCourseId: string) => void;
}

export function ComparisonStep({ 
  targetCourse, 
  comparisonCourse, 
  onSelect 
}: ComparisonStepProps) {
  const theme = useTheme();

  const handleSelect = (courseId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect(courseId);
  };

  const renderCourseCard = (course: ComparisonCourse, isLeft: boolean) => (
    <TouchableOpacity
      style={[styles.courseCard, { backgroundColor: theme.colors.card }]}
      onPress={() => handleSelect(course.courseId)}
      activeOpacity={0.8}
    >
      <View style={[styles.cardImage, { backgroundColor: colors.primary + '20' }]}>
        <Text style={styles.cardEmoji}>⛳</Text>
      </View>
      
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, { color: theme.colors.text }]} numberOfLines={2}>
          {course.courseName}
        </Text>
        
        <View style={styles.cardLocation}>
          <IconSymbol
            ios_icon_name="location.fill"
            android_material_icon_name="location-on"
            size={14}
            color={theme.dark ? '#98989D' : '#666'}
          />
          <Text style={[styles.cardLocationText, { color: theme.dark ? '#98989D' : '#666' }]} numberOfLines={1}>
            {course.courseLocation}
          </Text>
        </View>

        {course.userRating !== undefined && (
          <View style={styles.cardStat}>
            <Text style={[styles.cardStatLabel, { color: theme.dark ? '#98989D' : '#666' }]}>
              Your rating:
            </Text>
            <Text style={[styles.cardStatValue, { color: colors.primary }]}>
              {course.userRating.toFixed(1)}
            </Text>
          </View>
        )}

        <View style={styles.cardStat}>
          <Text style={[styles.cardStatLabel, { color: theme.dark ? '#98989D' : '#666' }]}>
            Played:
          </Text>
          <Text style={[styles.cardStatValue, { color: theme.colors.text }]}>
            {course.playCount} {course.playCount === 1 ? 'time' : 'times'}
          </Text>
        </View>
      </View>

      <View style={[styles.tapIndicator, { backgroundColor: colors.primary }]}>
        <Text style={styles.tapText}>TAP TO SELECT</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.question, { color: theme.colors.text }]}>
        Which course do you like more?
      </Text>

      <View style={styles.comparisonContainer}>
        {renderCourseCard(targetCourse, true)}
        
        <View style={styles.vsContainer}>
          <Text style={[styles.vsText, { color: colors.primary }]}>VS</Text>
        </View>
        
        {renderCourseCard(comparisonCourse, false)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  question: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 32,
  },
  comparisonContainer: {
    flex: 1,
    gap: 20,
  },
  courseCard: {
    borderRadius: 20,
    overflow: 'hidden',
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  cardImage: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardEmoji: {
    fontSize: 48,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  cardLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  cardLocationText: {
    fontSize: 14,
    flex: 1,
  },
  cardStat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  cardStatLabel: {
    fontSize: 14,
  },
  cardStatValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  tapIndicator: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  tapText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  vsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: -10,
    zIndex: 10,
  },
  vsText: {
    fontSize: 24,
    fontWeight: '800',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    overflow: 'hidden',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
});
