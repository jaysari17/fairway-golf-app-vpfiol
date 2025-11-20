
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import * as Haptics from 'expo-haptics';

interface ConfirmationStepProps {
  courseName: string;
  finalScore: number;
  rankPosition: number;
  totalCourses: number;
  playCount: number;
  onComplete: () => void;
}

export function ConfirmationStep({
  courseName,
  finalScore,
  rankPosition,
  totalCourses,
  playCount,
  onComplete,
}: ConfirmationStepProps) {
  const theme = useTheme();

  const handleComplete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onComplete();
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return '#34C759';
    if (score >= 6) return '#FF9500';
    return '#FF3B30';
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 9) return '🏆';
    if (score >= 8) return '⭐';
    if (score >= 7) return '👍';
    if (score >= 6) return '👌';
    if (score >= 5) return '😐';
    return '👎';
  };

  return (
    <View style={styles.container}>
      <View style={styles.successIcon}>
        <IconSymbol
          ios_icon_name="checkmark.circle.fill"
          android_material_icon_name="check-circle"
          size={80}
          color={colors.primary}
        />
      </View>

      <Text style={[styles.title, { color: theme.colors.text }]}>
        {courseName}
      </Text>
      <Text style={[styles.subtitle, { color: theme.dark ? '#98989D' : '#666' }]}>
        added to your Fairway List
      </Text>

      <View style={styles.scoreContainer}>
        <Text style={styles.scoreEmoji}>{getScoreEmoji(finalScore)}</Text>
        <View style={[styles.scoreBadge, { backgroundColor: getScoreColor(finalScore) }]}>
          <Text style={styles.scoreValue}>{finalScore.toFixed(1)}</Text>
          <Text style={styles.scoreMax}>/10</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
          <IconSymbol
            ios_icon_name="list.number"
            android_material_icon_name="format-list-numbered"
            size={32}
            color={colors.primary}
          />
          <Text style={[styles.statValue, { color: theme.colors.text }]}>
            #{rankPosition + 1}
          </Text>
          <Text style={[styles.statLabel, { color: theme.dark ? '#98989D' : '#666' }]}>
            in your list
          </Text>
          <Text style={[styles.statSubtext, { color: theme.dark ? '#98989D' : '#666' }]}>
            out of {totalCourses} courses
          </Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
          <IconSymbol
            ios_icon_name="flag.fill"
            android_material_icon_name="flag"
            size={32}
            color={colors.primary}
          />
          <Text style={[styles.statValue, { color: theme.colors.text }]}>
            {playCount}
          </Text>
          <Text style={[styles.statLabel, { color: theme.dark ? '#98989D' : '#666' }]}>
            {playCount === 1 ? 'time played' : 'times played'}
          </Text>
        </View>
      </View>

      <View style={styles.infoBox}>
        <IconSymbol
          ios_icon_name="info.circle"
          android_material_icon_name="info"
          size={20}
          color={colors.primary}
        />
        <Text style={[styles.infoText, { color: theme.dark ? '#98989D' : '#666' }]}>
          Your rating helps us recommend courses you&apos;ll love
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.completeButton, { backgroundColor: colors.primary }]}
        onPress={handleComplete}
        activeOpacity={0.8}
      >
        <Text style={styles.completeButtonText}>Done</Text>
        <IconSymbol
          ios_icon_name="checkmark"
          android_material_icon_name="check"
          size={24}
          color="#FFFFFF"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    alignItems: 'center',
  },
  successIcon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  scoreEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  scoreMax: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    opacity: 0.8,
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '800',
    marginTop: 12,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  statSubtext: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.primary + '15',
    marginBottom: 32,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 16,
    boxShadow: '0px 4px 16px rgba(87, 200, 161, 0.4)',
    elevation: 4,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
