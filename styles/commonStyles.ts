
import { StyleSheet } from 'react-native';

export const colors = {
  // Light mode colors
  background: '#F8F8FF',
  text: '#333333',
  textSecondary: '#666666',
  primary: '#57C8A1',
  secondary: '#45A088',
  accent: '#228B22',
  card: '#FFFFFF',
  highlight: '#70E0C1',
  border: '#E0E0E0',
  
  // Dark mode colors (used dynamically via theme)
  darkBackground: '#1C1C1E',
  darkText: '#FFFFFF',
  darkTextSecondary: '#98989D',
  darkCard: '#2C2C2E',
  darkBorder: '#38383A',
};

export const buttonStyles = StyleSheet.create({
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 2px 8px rgba(87, 200, 161, 0.3)',
    elevation: 3,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: colors.card,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 800,
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 24,
  },
  textSecondary: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 20,
  },
  section: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    width: '100%',
    boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  cardLarge: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    marginVertical: 12,
    width: '100%',
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
});
