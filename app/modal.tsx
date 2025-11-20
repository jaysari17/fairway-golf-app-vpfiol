
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { sampleCourses } from '@/data/sampleCourses';
import * as Haptics from 'expo-haptics';

export default function SelectCourseModal() {
  const theme = useTheme();
  const router = useRouter();
  const [selectedCourse, setSelectedCourse] = useState<string>('');

  const handleContinue = async () => {
    if (!selectedCourse) {
      Alert.alert('Error', 'Please select a course');
      return;
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const course = sampleCourses.find(c => c.id === selectedCourse);
      if (!course) {
        Alert.alert('Error', 'Course not found');
        return;
      }

      // Navigate directly to rating flow
      router.back();
      setTimeout(() => {
        router.push({
          pathname: '/rating-flow',
          params: {
            courseId: course.id,
            courseName: course.name,
            courseLocation: course.location,
          },
        });
      }, 300);
    } catch (error) {
      console.error('Error selecting course:', error);
      Alert.alert('Error', 'Failed to select course. Please try again.');
    }
  };

  return (
    <SafeAreaView 
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
      edges={['bottom']}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Select a Course
          </Text>
          <Text style={[styles.subtitle, { color: theme.dark ? '#98989D' : '#666' }]}>
            Choose the course you want to rate
          </Text>
        </View>

        <View style={styles.courseGrid}>
          {sampleCourses.map((course) => (
            <TouchableOpacity
              key={course.id}
              style={[
                styles.courseCard,
                selectedCourse === course.id && { 
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                },
                { 
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border,
                },
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSelectedCourse(course.id);
              }}
              activeOpacity={0.7}
            >
              <View style={styles.courseCardContent}>
                <Text
                  style={[
                    styles.courseName,
                    { color: selectedCourse === course.id ? '#FFFFFF' : theme.colors.text },
                  ]}
                  numberOfLines={2}
                >
                  {course.name}
                </Text>
                <Text
                  style={[
                    styles.courseLocation,
                    { color: selectedCourse === course.id ? '#FFFFFF' : theme.dark ? '#98989D' : '#666' },
                  ]}
                  numberOfLines={1}
                >
                  {course.city}, {course.state}
                </Text>
                {selectedCourse === course.id && (
                  <View style={styles.checkmark}>
                    <IconSymbol
                      ios_icon_name="checkmark.circle.fill"
                      android_material_icon_name="check-circle"
                      size={24}
                      color="#FFFFFF"
                    />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.continueButton, 
              { backgroundColor: colors.primary },
              !selectedCourse && styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={!selectedCourse}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>
              Continue to Rating
            </Text>
            <IconSymbol
              ios_icon_name="arrow.right"
              android_material_icon_name="arrow-forward"
              size={20}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  courseGrid: {
    gap: 12,
  },
  courseCard: {
    borderRadius: 16,
    borderWidth: 2,
    padding: 20,
    minHeight: 100,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 2,
  },
  courseCardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  courseName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  courseLocation: {
    fontSize: 14,
  },
  checkmark: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  footer: {
    marginTop: 32,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 18,
    borderRadius: 16,
    boxShadow: '0px 4px 16px rgba(87, 200, 161, 0.4)',
    elevation: 4,
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
