
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/styles/commonStyles';
import { StorageService } from '@/utils/storage';
import { UserProfile } from '@/types/golf';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

export default function ProfileSetupScreen() {
  const router = useRouter();
  const { signUp } = useSupabaseAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [handicap, setHandicap] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s\-()]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  };

  const handleContinue = async () => {
    console.log('User tapped Continue button on profile setup');
    
    if (!username.trim()) {
      Alert.alert('Required Field', 'Please enter a username');
      return;
    }

    if (!email.trim() || !validateEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    if (!password.trim() || password.length < 6) {
      Alert.alert('Invalid Password', 'Password must be at least 6 characters');
      return;
    }

    if (!phoneNumber.trim() || !validatePhoneNumber(phoneNumber)) {
      Alert.alert('Invalid Phone', 'Please enter a valid phone number');
      return;
    }

    try {
      setLoading(true);
      console.log('Creating Supabase account for:', email);

      // Step 1: Create Supabase auth account
      const { error: signUpError } = await signUp(email, password, {
        username: username.trim(),
        phone_number: phoneNumber.trim(),
      });

      if (signUpError) {
        console.error('Supabase signup error:', signUpError);
        
        // Provide more specific error messages
        let errorMessage = 'Failed to create account. Please try again.';
        if (signUpError.message.includes('already registered')) {
          errorMessage = 'This email is already registered. Please use a different email or try logging in.';
        } else if (signUpError.message.includes('password')) {
          errorMessage = 'Password is too weak. Please use a stronger password.';
        } else if (signUpError.message) {
          errorMessage = signUpError.message;
        }
        
        Alert.alert('Signup Error', errorMessage);
        return;
      }

      console.log('Supabase auth account created successfully');

      // Step 2: Save profile to database
      try {
        const profile: UserProfile = {
          username: username.trim(),
          email: email.trim(),
          phoneNumber: phoneNumber.trim(),
          handicap: handicap ? parseFloat(handicap) : undefined,
          totalRounds: 0,
          totalCourses: 0,
          contactsSynced: false,
        };

        console.log('Saving profile to database:', profile);
        await StorageService.saveProfile(profile);
        console.log('Profile saved to Supabase successfully');
        
        // Step 3: Mark onboarding as complete
        await StorageService.setOnboardingComplete();
        console.log('Onboarding marked complete');
        
        // Step 4: Navigate to contact sync screen
        router.replace('/contact-sync');
      } catch (profileError: any) {
        console.error('Error saving profile to database:', profileError);
        
        // Provide specific error message
        let errorMessage = 'Database error saving new user';
        if (profileError.message) {
          errorMessage = `Database error: ${profileError.message}`;
        }
        
        Alert.alert('Signup Error', errorMessage);
      }
    } catch (error: any) {
      console.error('Unexpected error during profile setup:', error);
      Alert.alert('Error', error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={[colors.primary, colors.secondary]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <Text style={styles.title}>Create Your Account</Text>
              <Text style={styles.subtitle}>
                Sign up to track your golf journey and connect with friends
              </Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Username *</Text>
                <TextInput
                  style={styles.input}
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Enter your username"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email *</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="your.email@example.com"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password *</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="At least 6 characters"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Phone Number *</Text>
                <TextInput
                  style={styles.input}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  placeholder="+1 (555) 123-4567"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  keyboardType="phone-pad"
                  editable={!loading}
                />
                <Text style={styles.helperText}>
                  Used to connect with friends who are already on FAIRWAY
                </Text>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Handicap (Optional)</Text>
                <TextInput
                  style={styles.input}
                  value={handicap}
                  onChangeText={setHandicap}
                  placeholder="e.g., 12.5"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  keyboardType="decimal-pad"
                  editable={!loading}
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={handleContinue}
              style={[styles.continueButton, loading && styles.buttonDisabled]}
              activeOpacity={0.8}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.primary} />
              ) : (
                <Text style={styles.continueButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.termsText}>
              By creating an account, you agree to our Terms of Service and Privacy Policy
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    lineHeight: 22,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  helperText: {
    fontSize: 13,
    color: '#FFFFFF',
    opacity: 0.7,
    marginTop: 6,
    lineHeight: 18,
  },
  continueButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    elevation: 4,
    minHeight: 54,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  continueButtonText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: '700',
  },
  termsText: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.7,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 16,
  },
});
