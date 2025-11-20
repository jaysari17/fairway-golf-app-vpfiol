
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: string;
}

export function StatCard({ label, value, icon }: StatCardProps) {
  const theme = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text style={[styles.value, { color: theme.colors.text }]}>{value}</Text>
      <Text style={[styles.label, { color: theme.dark ? '#98989D' : '#666' }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  icon: {
    fontSize: 32,
    marginBottom: 8,
  },
  value: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
});
