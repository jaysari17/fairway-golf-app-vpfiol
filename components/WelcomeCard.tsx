
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { colors } from '@/styles/commonStyles';

interface WelcomeCardProps {
  onGetStarted: () => void;
}

export function WelcomeCard({ onGetStarted }: WelcomeCardProps) {
  const theme = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
      <Text style={styles.emoji}>👋</Text>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Welcome to FAIRWAY!
      </Text>
      <Text style={[styles.description, { color: theme.dark ? '#98989D' : '#666' }]}>
        Ready to start tracking your golf journey? Log your first round to get started.
      </Text>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={onGetStarted}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Log Your First Round</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 16,
    marginVertical: 12,
    alignItems: 'center',
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  emoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    boxShadow: '0px 2px 8px rgba(87, 200, 161, 0.3)',
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
