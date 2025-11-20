
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Round } from '@/types/golf';
import { IconSymbol } from './IconSymbol';

interface CourseCardProps {
  round: Round;
  onPress?: () => void;
}

export function CourseCard({ round, onPress }: CourseCardProps) {
  const theme = useTheme();

  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 80) return '#34C759';
    if (rating >= 60) return '#FF9500';
    return '#FF3B30';
  };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.colors.card }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={[styles.courseName, { color: theme.colors.text }]} numberOfLines={1}>
            {round.courseName}
          </Text>
          <View style={styles.locationRow}>
            <IconSymbol
              ios_icon_name="location.fill"
              android_material_icon_name="location-on"
              size={14}
              color={theme.dark ? '#98989D' : '#666'}
            />
            <Text style={[styles.location, { color: theme.dark ? '#98989D' : '#666' }]}>
              {round.courseLocation}
            </Text>
          </View>
        </View>
        <View style={[styles.ratingBadge, { backgroundColor: getRatingColor(round.rating) }]}>
          <Text style={styles.ratingText}>{round.rating}</Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <IconSymbol
            ios_icon_name="calendar"
            android_material_icon_name="calendar-today"
            size={16}
            color={theme.dark ? '#98989D' : '#666'}
          />
          <Text style={[styles.detailText, { color: theme.dark ? '#98989D' : '#666' }]}>
            {formatDate(round.date)}
          </Text>
        </View>
        {round.score && (
          <View style={styles.detailItem}>
            <IconSymbol
              ios_icon_name="flag.fill"
              android_material_icon_name="flag"
              size={16}
              color={theme.dark ? '#98989D' : '#666'}
            />
            <Text style={[styles.detailText, { color: theme.dark ? '#98989D' : '#666' }]}>
              Score: {round.score}
            </Text>
          </View>
        )}
      </View>

      {round.review && (
        <Text style={[styles.review, { color: theme.colors.text }]} numberOfLines={2}>
          {round.review}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  courseName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: 14,
  },
  ratingBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  details: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
  },
  review: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
});
