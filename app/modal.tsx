
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { IconSymbol } from '@/components/IconSymbol';
import { StorageService } from '@/utils/storage';
import { RatingStorageService } from '@/utils/ratingStorage';
import { Round } from '@/types/golf';
import { colors } from '@/styles/commonStyles';
import { sampleCourses } from '@/data/sampleCourses';
import * as Haptics from 'expo-haptics';

export default function LogRoundModal() {
  const theme = useTheme();
  const router = useRouter();

  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [rating, setRating] = useState(50);
  const [review, setReview] = useState('');
  const [score, setScore] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!selectedCourse) {
      Alert.alert('Error', 'Please select a course');
      return;
    }

    try {
      setSaving(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const course = sampleCourses.find(c => c.id === selectedCourse);
      if (!course) {
        Alert.alert('Error', 'Course not found');
        return;
      }

      const round: Round = {
        id: Date.now().toString(),
        courseId: course.id,
        courseName: course.name,
        courseLocation: course.location,
        date,
        rating,
        review: review.trim() || undefined,
        score: score ? parseInt(score, 10) : undefined,
      };

      await StorageService.saveRound(round);

      // Check if course needs rating
      const existingRating = await RatingStorageService.getRatingForCourse(course.id);
      
      if (!existingRating) {
        // Add rating trigger
        await RatingStorageService.addTrigger({
          courseId: course.id,
          courseName: course.name,
          roundId: round.id,
          triggerType: 'after_log',
          triggeredAt: new Date(),
          completed: false,
        });
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      Alert.alert(
        'Success',
        'Round logged successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              router.back();
              
              // Navigate to rating flow if no rating exists
              if (!existingRating) {
                setTimeout(() => {
                  router.push({
                    pathname: '/rating-flow',
                    params: {
                      courseId: course.id,
                      courseName: course.name,
                      courseLocation: course.location,
                    },
                  });
                }, 500);
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error saving round:', error);
      Alert.alert('Error', 'Failed to save round. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
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
            Log a Round
          </Text>
          <Text style={[styles.subtitle, { color: theme.dark ? '#98989D' : '#666' }]}>
            Track your golf journey
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Course *
            </Text>
            <View style={[styles.pickerContainer, { backgroundColor: theme.colors.card }]}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.courseList}
              >
                {sampleCourses.map((course) => (
                  <TouchableOpacity
                    key={course.id}
                    style={[
                      styles.courseChip,
                      selectedCourse === course.id && { backgroundColor: colors.primary },
                      { borderColor: theme.colors.border },
                    ]}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setSelectedCourse(course.id);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.courseChipText,
                        { color: selectedCourse === course.id ? '#FFFFFF' : theme.colors.text },
                      ]}
                      numberOfLines={2}
                    >
                      {course.name}
                    </Text>
                    <Text
                      style={[
                        styles.courseChipLocation,
                        { color: selectedCourse === course.id ? '#FFFFFF' : theme.dark ? '#98989D' : '#666' },
                      ]}
                      numberOfLines={1}
                    >
                      {course.city}, {course.state}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Date Played *
            </Text>
            <TouchableOpacity
              style={[styles.dateButton, { backgroundColor: theme.colors.card }]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowDatePicker(true);
              }}
              activeOpacity={0.7}
            >
              <IconSymbol
                ios_icon_name="calendar"
                android_material_icon_name="calendar-today"
                size={20}
                color={colors.primary}
              />
              <Text style={[styles.dateText, { color: theme.colors.text }]}>
                {date.toLocaleDateString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Quick Rating: {rating}/100
            </Text>
            <View style={styles.ratingContainer}>
              <TouchableOpacity
                style={[styles.ratingButton, { backgroundColor: theme.colors.card }]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setRating(Math.max(0, rating - 10));
                }}
              >
                <IconSymbol
                  ios_icon_name="minus"
                  android_material_icon_name="remove"
                  size={20}
                  color={colors.primary}
                />
              </TouchableOpacity>
              <View style={[styles.ratingDisplay, { backgroundColor: colors.primary }]}>
                <Text style={styles.ratingValue}>{rating}</Text>
              </View>
              <TouchableOpacity
                style={[styles.ratingButton, { backgroundColor: theme.colors.card }]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setRating(Math.min(100, rating + 10));
                }}
              >
                <IconSymbol
                  ios_icon_name="plus"
                  android_material_icon_name="add"
                  size={20}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </View>
            <Text style={[styles.helperText, { color: theme.dark ? '#98989D' : '#666' }]}>
              You&apos;ll rate this course in detail next
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Score (Optional)
            </Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: theme.colors.card,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                },
              ]}
              placeholder="e.g., 85"
              placeholderTextColor={theme.dark ? '#98989D' : '#999'}
              value={score}
              onChangeText={setScore}
              keyboardType="number-pad"
              maxLength={3}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Quick Notes (Optional)
            </Text>
            <TextInput
              style={[
                styles.textArea,
                { 
                  backgroundColor: theme.colors.card,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                },
              ]}
              placeholder="How was your round? Any memorable moments?"
              placeholderTextColor={theme.dark ? '#98989D' : '#999'}
              value={review}
              onChangeText={setReview}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: colors.primary }]}
            onPress={handleSave}
            disabled={saving || !selectedCourse}
            activeOpacity={0.8}
          >
            <Text style={styles.saveButtonText}>
              {saving ? 'Saving...' : 'Log Round'}
            </Text>
            <IconSymbol
              ios_icon_name="checkmark"
              android_material_icon_name="check"
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
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  pickerContainer: {
    borderRadius: 12,
    padding: 12,
  },
  courseList: {
    gap: 12,
    paddingVertical: 4,
  },
  courseChip: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    minWidth: 160,
    maxWidth: 200,
  },
  courseChipText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  courseChipLocation: {
    fontSize: 12,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  ratingButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingDisplay: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  helperText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  input: {
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
  },
  textArea: {
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    minHeight: 100,
  },
  footer: {
    marginTop: 32,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
    borderRadius: 12,
    boxShadow: '0px 4px 16px rgba(87, 200, 161, 0.4)',
    elevation: 4,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
