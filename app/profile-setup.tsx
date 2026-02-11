
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
  ActivityIndicator,
  Modal,
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
  const [errorMessage, setErrorMessage] = useState('');
  const [showEmailConfirmModal, setShowEmailConfirmModal] = useState(false);
  const [confirmationEmail, setConfirmationEmail] = useState('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s\-()]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  };

  const handleContinue = async () => {
    console.log('User tapped Create Account button');
    setErrorMessage('');
    
    const usernameValue = username.trim();
    const emailValue = email.trim();
    const passwordValue = password.trim();
    const phoneValue = phoneNumber.trim();
    
    if (!usernameValue) {
      setErrorMessage('Please enter a username');
      return;
    }

    if (!emailValue || !validateEmail(emailValue)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    if (!passwordValue || passwordValue.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }

    if (!phoneValue || !validatePhoneNumber(phoneValue)) {
      setErrorMessage('Please enter a valid phone number (at least 10 digits)');
      return;
    }

    try {
      setLoading(true);
      console.log('Creating Supabase account for:', emailValue);

      // Step 1: Create Supabase auth account
      const { error: signUpError, needsEmailConfirmation } = await signUp(emailValue, passwordValue, {
        username: usernameValue,
        phone_number: phoneValue,
        display_name: usernameValue,
        handicap: handicap ? parseFloat(handicap) : null,
      });

      if (signUpError) {
        console.error('Supabase signup error:', signUpError.message);
        setErrorMessage(signUpError.message || 'Failed to create account. Please try again.');
        return;
      }

      // Step 2: Check if email confirmation is required
      if (needsEmailConfirmation) {
        console.log('Email confirmation required - showing modal');
        setConfirmationEmail(emailValue);
        setShowEmailConfirmModal(true);
        return;
      }

      console.log('Supabase auth account created successfully - no email confirmation needed');

      // Step 3: Save profile to database (only if no email confirmation needed)
      try {
        const profile: UserProfile = {
          username: usernameValue,
          email: emailValue.toLowerCase(),
          phoneNumber: phoneValue,
          handicap: handicap ? parseFloat(handicap) : undefined,
          displayName: usernameValue,
          totalRounds: 0,
          totalCourses: 0,
          contactsSynced: false,
        };

        console.log('Saving profile to Supabase database');
        await StorageService.saveProfile(profile);
        console.log('Profile saved successfully');
        
        // Step 4: Mark onboarding as complete
        await StorageService.setOnboardingComplete();
        console.log('Onboarding marked complete');
        
        // Step 5: Navigate to contact sync screen
        console.log('Navigating to contact sync screen');
        router.replace('/contact-sync');
      } catch (profileError: any) {
        console.error('Error saving profile to database:', profileError);
        
        // Even if profile save fails, the user is authenticated
        // Navigate them to the app and they can complete profile later
        console.log('Profile save failed, but user is authenticated - navigating to app');
        await StorageService.setOnboardingComplete();
        router.replace('/contact-sync');
      }
    } catch (error: any) {
      console.error('Unexpected error during profile setup:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    console.log('User tapped Back to Login');
    router.back();
  };

  const handleEmailConfirmModalClose = () => {
    console.log('User acknowledged email confirmation requirement');
    setShowEmailConfirmModal(false);
    router.replace('/login');
  };

  const usernameValue = username;
  const emailValue = email;
  const passwordValue = password;
  const phoneValue = phoneNumber;
  const handicapValue = handicap;
  const isLoading = loading;
  const errorText = errorMessage;
  const confirmEmailValue = confirmationEmail;

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

            {errorText ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errorText}</Text>
              </View>
            ) : null}

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Username *</Text>
                <TextInput
                  style={styles.input}
                  value={usernameValue}
                  onChangeText={setUsername}
                  placeholder="Enter your username"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email *</Text>
                <TextInput
                  style={styles.input}
                  value={emailValue}
                  onChangeText={setEmail}
                  placeholder="your.email@example.com"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password *</Text>
                <TextInput
                  style={styles.input}
                  value={passwordValue}
                  onChangeText={setPassword}
                  placeholder="At least 6 characters"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Phone Number *</Text>
                <TextInput
                  style={styles.input}
                  value={phoneValue}
                  onChangeText={setPhoneNumber}
                  placeholder="+1 (555) 123-4567"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  keyboardType="phone-pad"
                  editable={!isLoading}
                />
                <Text style={styles.helperText}>
                  Used to connect with friends who are already on FAIRWAY
                </Text>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Handicap (Optional)</Text>
                <TextInput
                  style={styles.input}
                  value={handicapValue}
                  onChangeText={setHandicap}
                  placeholder="e.g., 12.5"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  keyboardType="decimal-pad"
                  editable={!isLoading}
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={handleContinue}
              style={[styles.continueButton, isLoading && styles.buttonDisabled]}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.primary} />
              ) : (
                <Text style={styles.continueButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={handleBackToLogin} disabled={isLoading}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.termsText}>
              By creating an account, you agree to our Terms of Service and Privacy Policy
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <Modal
        visible={showEmailConfirmModal}
        transparent
        animationType="fade"
        onRequestClose={handleEmailConfirmModalClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>✅ Account Created!</Text>
            <Text style={styles.modalMessage}>
              We&apos;ve sent a confirmation email to:
            </Text>
            <Text style={styles.modalEmail}>{confirmEmailValue}</Text>
            <Text style={styles.modalMessage}>
              Please check your inbox and click the verification link to complete your registration.
            </Text>
            <Text style={styles.modalNote}>
              💡 Don&apos;t forget to check your spam folder if you don&apos;t see the email within a few minutes.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleEmailConfirmModalClose}
            >
              <Text style={styles.modalButtonText}>OK, Got It!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  errorContainer: {
    backgroundColor: 'rgba(255, 59, 48, 0.15)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.3)',
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  loginText: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  loginLink: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  termsText: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.7,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  modalEmail: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalNote: {
    fontSize: 14,
    color: colors.text,
    opacity: 0.7,
    lineHeight: 20,
    marginBottom: 24,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  modalButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
