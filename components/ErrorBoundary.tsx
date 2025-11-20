
import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/styles/commonStyles';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.emoji}>⚠️</Text>
          <Text style={styles.title}>Oops! Something went wrong</Text>
          <Text style={styles.message}>
            We&apos;re sorry for the inconvenience. Please try again.
          </Text>
          {__DEV__ && this.state.error && (
            <Text style={styles.errorText}>
              {this.state.error.toString()}
            </Text>
          )}
          <TouchableOpacity
            style={styles.button}
            onPress={this.handleReset}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.background,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
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
