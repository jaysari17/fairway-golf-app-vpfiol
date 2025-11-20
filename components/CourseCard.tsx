
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { IconSymbol } from './IconSymbol';
import { GolfCourse } from '@/types/golf';
import { colors } from '@/styles/commonStyles';

interface CourseCardProps {
  course: GolfCourse;
  played?: boolean;
  playCount?: number;
  rating?: number;
  onPress?: () => void;
}

export function CourseCard({ course, played = false, playCount = 0, rating = 0, onPress }: CourseCardProps) {
  const theme = useTheme();

  const getCourseTypeIcon = (type?: string) => {
    switch (type) {
      case 'links':
        return '🌊';
      case 'parkland':
        return '🌳';
      case 'desert':
        return '🏜️';
      case 'mountain':
        return '⛰️';
      default:
        return '⛳';
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.colors.card }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.typeIcon}>{getCourseTypeIcon(course.type)}</Text>
          <View style={styles.headerText}>
            <Text style={[styles.courseName, { color: theme.colors.text }]} numberOfLines={1}>
              {course.name}
            </Text>
            <Text style={[styles.location, { color: theme.dark ? '#98989D' : '#666' }]} numberOfLines={1}>
              {course.city}, {course.state}
            </Text>
          </View>
        </View>
        {played && (
          <View style={[styles.playedBadge, { backgroundColor: colors.primary }]}>
            <IconSymbol
              ios_icon_name="checkmark"
              android_material_icon_name="check"
              size={14}
              color="#FFFFFF"
            />
          </View>
        )}
      </View>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <IconSymbol
            ios_icon_name="flag"
            android_material_icon_name="flag"
            size={16}
            color={theme.dark ? '#98989D' : '#666'}
          />
          <Text style={[styles.detailText, { color: theme.dark ? '#98989D' : '#666' }]}>
            {course.holes || 18} holes
          </Text>
        </View>
        <View style={styles.detailItem}>
          <IconSymbol
            ios_icon_name="arrow.up.right"
            android_material_icon_name="trending-up"
            size={16}
            color={theme.dark ? '#98989D' : '#666'}
          />
          <Text style={[styles.detailText, { color: theme.dark ? '#98989D' : '#666' }]}>
            Par {course.par || 72}
          </Text>
        </View>
        {course.yardage && (
          <View style={styles.detailItem}>
            <IconSymbol
              ios_icon_name="ruler"
              android_material_icon_name="straighten"
              size={16}
              color={theme.dark ? '#98989D' : '#666'}
            />
            <Text style={[styles.detailText, { color: theme.dark ? '#98989D' : '#666' }]}>
              {course.yardage.toLocaleString()} yds
            </Text>
          </View>
        )}
      </View>

      {played && (
        <View style={styles.playedInfo}>
          <View style={styles.playedStat}>
            <Text style={[styles.playedLabel, { color: theme.dark ? '#98989D' : '#666' }]}>
              Played
            </Text>
            <Text style={[styles.playedValue, { color: theme.colors.text }]}>
              {playCount} {playCount === 1 ? 'time' : 'times'}
            </Text>
          </View>
          {rating > 0 && (
            <View style={styles.playedStat}>
              <Text style={[styles.playedLabel, { color: theme.dark ? '#98989D' : '#666' }]}>
                Your Rating
              </Text>
              <View style={styles.ratingContainer}>
                <Text style={[styles.playedValue, { color: colors.primary }]}>
                  {rating}
                </Text>
                <Text style={[styles.ratingMax, { color: theme.dark ? '#98989D' : '#666' }]}>
                  /100
                </Text>
              </View>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  typeIcon: {
    fontSize: 32,
  },
  headerText: {
    flex: 1,
  },
  courseName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
  },
  playedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
  },
  playedInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  playedStat: {
    gap: 4,
  },
  playedLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  playedValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  ratingMax: {
    fontSize: 12,
  },
});
