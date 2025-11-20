
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
import { useRounds } from '@/hooks/useRounds';
import { useRatingTrigger } from '@/hooks/useRatingTrigger';
import { Round, GolfCourse } from '@/types/golf';
import { sampleCourses } from '@/data/sampleCourses';
import { colors } from '@/styles/commonStyles';

export default function LogRoundModal() {
  const theme = useTheme();
  const router = useRouter();
  const { addRound } = useRounds();
  const { triggerRatingAfterLog } = useRatingTrigger();

  const [selectedCourse, setSelectedCourse] = useState<GolfCourse | null>(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [rating, setRating] = useState(75);
  const [review, setReview] = useState('');
  const [score, setScore] = useState('');
  const [teeBox, setTeeBox] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!selectedCourse) {
      Alert.alert('Error', 'Please select a course');
      return;
    }

    try {
      setSaving(true);
      const newRound: Round = {
        id: Date.now().toString(),
        courseId: selectedCourse.id,
        courseName: selectedCourse.name,
        courseLocation: selectedCourse.location,
        date,
        rating,
        review: review.trim() || undefined,
        score: score ? parseInt(score) : undefined,
        teeBox: teeBox.trim() || undefined,
      };

      await addRound(newRound);
      
      // Trigger rating flow
      await triggerRatingAfterLog(
        selectedCourse.id,
        selectedCourse.name,
        newRound.id
      );
      
      Alert.alert('Success', 'Round logged successfully!');
      router.back();
      
      // Navigate to rating flow
      setTimeout(() => {
        router.push({
          pathname: '/rating-flow',
          params: {
            courseId: selectedCourse.id,
            courseName: selectedCourse.name,
            courseLocation: selectedCourse.location,
          },
        });
      }, 500);
    } catch (error) {
      console.error('Error saving round:', error);
      Alert.alert('Error', 'Failed to save round. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: theme.colors.text }]}>Log a Round</Text>

        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Select Course</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.courseScroll}>
            {sampleCourses.map((course) => (
              <TouchableOpacity
                key={course.id}
                style={[
                  styles.courseChip,
                  { 
                    backgroundColor: selectedCourse?.id === course.id 
                      ? colors.primary 
                      : theme.colors.card 
                  }
                ]}
                onPress={() => setSelectedCourse(course)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.courseChipText,
                    { 
                      color: selectedCourse?.id === course.id 
                        ? '#FFFFFF' 
                        : theme.colors.text 
                    }
                  ]}
                  numberOfLines={1}
                >
                  {course.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Date Played</Text>
          <TouchableOpacity
            style={[styles.input, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
            onPress={() => setShowDatePicker(true)}
          >
            <IconSymbol
              ios_icon_name="calendar"
              android_material_icon_name="calendar-today"
              size={20}
              color={theme.dark ? '#98989D' : '#666'}
            />
            <Text style={[styles.inputText, { color: theme.colors.text }]}>
              {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (selectedDate) {
                  setDate(selectedDate);
                }
              }}
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Rating: {rating}/100
          </Text>
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => setRating(star * 20)}
                activeOpacity={0.7}
              >
                <Text style={styles.star}>
                  {rating >= star * 20 ? '⭐' : '☆'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.sliderContainer}>
            <Text style={[styles.sliderLabel, { color: theme.dark ? '#98989D' : '#666' }]}>1</Text>
            <View style={styles.sliderTrack}>
              <View 
                style={[
                  styles.sliderFill, 
                  { 
                    width: `${rating}%`,
                    backgroundColor: colors.primary 
                  }
                ]} 
              />
            </View>
            <Text style={[styles.sliderLabel, { color: theme.dark ? '#98989D' : '#666' }]}>100</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Score (Optional)</Text>
          <TextInput
            style={[
              styles.textInput,
              { 
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
                color: theme.colors.text 
              }
            ]}
            placeholder="Enter your score"
            placeholderTextColor={theme.dark ? '#666' : '#999'}
            value={score}
            onChangeText={setScore}
            keyboardType="number-pad"
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Tee Box (Optional)</Text>
          <TextInput
            style={[
              styles.textInput,
              { 
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
                color: theme.colors.text 
              }
            ]}
            placeholder="e.g., Blue, White, Gold"
            placeholderTextColor={theme.dark ? '#666' : '#999'}
            value={teeBox}
            onChangeText={setTeeBox}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Review (Optional)</Text>
          <TextInput
            style={[
              styles.textArea,
              { 
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
                color: theme.colors.text 
              }
            ]}
            placeholder="Share your thoughts about the course..."
            placeholderTextColor={theme.dark ? '#666' : '#999'}
            value={review}
            onChangeText={setReview}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          style={[
            styles.saveButton,
            { backgroundColor: colors.primary },
            saving && styles.saveButtonDisabled
          ]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>
            {saving ? 'Saving...' : 'Save Round'}
          </Text>
        </TouchableOpacity>
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
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  courseScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  courseChip: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginRight: 12,
    maxWidth: 200,
  },
  courseChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  inputText: {
    fontSize: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  star: {
    fontSize: 32,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sliderTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    borderRadius: 4,
  },
  sliderLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  textInput: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
  },
  textArea: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
    minHeight: 100,
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    boxShadow: '0px 2px 8px rgba(87, 200, 161, 0.3)',
    elevation: 3,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
