
import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface LoadingSpinnerProps {
  size?: number;
  message?: string;
}

export function LoadingSpinner({ size = 50, message }: LoadingSpinnerProps) {
  const theme = useTheme();
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1000,
        easing: Easing.linear,
      }),
      -1
    );
  }, [rotation]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.spinner,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: size / 10,
            borderColor: theme.colors.border,
            borderTopColor: theme.colors.primary,
          },
          animatedStyle,
        ]}
      />
      {message && (
        <Text style={[styles.message, { color: theme.colors.text }]}>
          {message}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  spinner: {
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    fontWeight: '500',
  },
});
