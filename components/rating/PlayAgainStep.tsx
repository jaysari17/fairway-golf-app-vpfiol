
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { colors } from '@/styles/commonStyles';
import * as Haptics from 'expo-haptics';

interface PlayAgainStepProps {
  courseName: string;
  onSelect: (response: 'definitely' | 'maybe' | 'no') => void;
}

export function PlayAgainStep({ courseName, onSelect }: PlayAgainStepProps) {
  const theme = useTheme();

  const handleSelect = (response: 'definitely' | 'maybe' | 'no') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSelect(response);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.greeting, { color: theme.colors.text }]}>
        How was your round at
      </Text>
      <Text style={[styles.courseName, { color: colors.primary }]}>
        {courseName}?
      </Text>

      <View style={styles.spacer} />

      <Text style={[styles.question, { color: theme.colors.text }]}>
        Would you play {courseName} again?
      </Text>

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[styles.option, styles.optionDefinitely]}
          onPress={() => handleSelect('definitely')}
          activeOpacity={0.8}
        >
          <Text style={styles.optionEmoji}>🎯</Text>
          <Text style={styles.optionText}>Definitely</Text>
          <Text style={styles.optionSubtext}>I&apos;d love to play here again</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, styles.optionMaybe]}
          onPress={() => handleSelect('maybe')}
          activeOpacity={0.8}
        >
          <Text style={styles.optionEmoji}>🤔</Text>
          <Text style={styles.optionText}>Maybe</Text>
          <Text style={styles.optionSubtext}>It was okay, might return</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, styles.optionNo]}
          onPress={() => handleSelect('no')}
          activeOpacity={0.8}
        >
          <Text style={styles.optionEmoji}>👎</Text>
          <Text style={styles.optionText}>No</Text>
          <Text style={styles.optionSubtext}>Not my favorite</Text>
        </TouchableOpacity>
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
  greeting: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  courseName: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 16,
  },
  spacer: {
    height: 40,
  },
  question: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 32,
  },
  optionsContainer: {
    gap: 16,
  },
  option: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  optionDefinitely: {
    backgroundColor: '#34C759',
  },
  optionMaybe: {
    backgroundColor: '#FF9500',
  },
  optionNo: {
    backgroundColor: '#FF3B30',
  },
  optionEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  optionText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  optionSubtext: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
  },
});
