
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import * as Haptics from 'expo-haptics';

interface RankedCourse {
  courseId: string;
  courseName: string;
  courseLocation: string;
  rating: number;
}

interface DragRankStepProps {
  targetCourseName: string;
  rankedCourses: RankedCourse[];
  onPlacement: (position: number) => void;
}

export function DragRankStep({ 
  targetCourseName, 
  rankedCourses, 
  onPlacement 
}: DragRankStepProps) {
  const theme = useTheme();
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);

  const handlePositionSelect = (position: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedPosition(position);
  };

  const handleConfirm = () => {
    if (selectedPosition !== null) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onPlacement(selectedPosition);
    }
  };

  const renderCourseItem = (course: RankedCourse, index: number) => (
    <View key={course.courseId} style={[styles.courseItem, { backgroundColor: theme.colors.card }]}>
      <View style={styles.rankBadge}>
        <Text style={styles.rankText}>{index + 1}</Text>
      </View>
      <View style={styles.courseInfo}>
        <Text style={[styles.courseItemName, { color: theme.colors.text }]} numberOfLines={1}>
          {course.courseName}
        </Text>
        <Text style={[styles.courseItemLocation, { color: theme.dark ? '#98989D' : '#666' }]} numberOfLines={1}>
          {course.courseLocation}
        </Text>
      </View>
      <View style={[styles.ratingBadge, { backgroundColor: colors.primary }]}>
        <Text style={styles.ratingText}>{course.rating.toFixed(1)}</Text>
      </View>
    </View>
  );

  const renderPlacementSlot = (position: number, label: string) => {
    const isSelected = selectedPosition === position;
    
    return (
      <TouchableOpacity
        key={`slot-${position}`}
        style={[
          styles.placementSlot,
          { 
            backgroundColor: isSelected ? colors.primary : theme.colors.card,
            borderColor: isSelected ? colors.primary : theme.colors.border,
          }
        ]}
        onPress={() => handlePositionSelect(position)}
        activeOpacity={0.7}
      >
        <View style={styles.placementContent}>
          <IconSymbol
            ios_icon_name={isSelected ? 'checkmark.circle.fill' : 'plus.circle'}
            android_material_icon_name={isSelected ? 'check-circle' : 'add-circle'}
            size={32}
            color={isSelected ? '#FFFFFF' : colors.primary}
          />
          <Text style={[
            styles.placementText,
            { color: isSelected ? '#FFFFFF' : theme.colors.text }
          ]}>
            {label}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.question, { color: theme.colors.text }]}>
        Where does {targetCourseName} belong in your list?
      </Text>
      <Text style={[styles.subtitle, { color: theme.dark ? '#98989D' : '#666' }]}>
        Tap to place it in your ranking
      </Text>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {rankedCourses.length === 0 ? (
          <View style={styles.emptyState}>
            {renderPlacementSlot(0, `Place ${targetCourseName} as your first course`)}
          </View>
        ) : (
          <View style={styles.rankingList}>
            {renderPlacementSlot(0, 'Place at top')}
            
            {rankedCourses.map((course, index) => (
              <React.Fragment key={course.courseId}>
                {renderCourseItem(course, index)}
                {renderPlacementSlot(index + 1, `Place here (${index + 2})`)}
              </React.Fragment>
            ))}
          </View>
        )}
      </ScrollView>

      {selectedPosition !== null && (
        <View style={styles.confirmContainer}>
          <TouchableOpacity
            style={[styles.confirmButton, { backgroundColor: colors.primary }]}
            onPress={handleConfirm}
            activeOpacity={0.8}
          >
            <Text style={styles.confirmButtonText}>Confirm Placement</Text>
            <IconSymbol
              ios_icon_name="arrow.right"
              android_material_icon_name="arrow-forward"
              size={20}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  question: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    paddingHorizontal: 24,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  emptyState: {
    paddingVertical: 40,
  },
  rankingList: {
    gap: 8,
  },
  courseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  rankBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  courseInfo: {
    flex: 1,
  },
  courseItemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  courseItemLocation: {
    fontSize: 14,
  },
  ratingBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  placementSlot: {
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    padding: 20,
    marginVertical: 4,
  },
  placementContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  placementText: {
    fontSize: 16,
    fontWeight: '600',
  },
  confirmContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 40,
    backgroundColor: 'transparent',
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
    borderRadius: 16,
    boxShadow: '0px 4px 16px rgba(87, 200, 161, 0.4)',
    elevation: 4,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
