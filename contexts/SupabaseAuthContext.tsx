
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, onAuthStateChange } from '@/utils/supabase';
import { Session, User } from '@supabase/supabase-js';

interface SupabaseAuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any; needsEmailConfirmation?: boolean }>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signInWithApple: () => Promise<{ error: any }>;
  resendConfirmationEmail: (email: string) => Promise<{ error: any }>;
}

const SupabaseAuthContext = createContext<SupabaseAuthContextType | undefined>(undefined);

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔐 Initializing Supabase auth session');
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      if (session) {
        console.log('✅ Initial session loaded - User logged in:', session.user.email);
      } else {
        console.log('ℹ️ No active session found');
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = onAuthStateChange((event, session) => {
      console.log('🔄 Auth event:', event);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('🔑 Attempting sign in for:', email);
    
    const normalizedEmail = email.trim().toLowerCase();
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });
    
    if (error) {
      console.error('❌ Sign in error:', error.message);
      
      // Provide helpful error messages
      if (error.message.includes('Email not confirmed')) {
        return { 
          error: { 
            message: 'Please verify your email address before signing in. Check your inbox for the confirmation link.',
            needsConfirmation: true,
            email: normalizedEmail
          } 
        };
      }
      
      if (error.message.includes('Invalid login credentials')) {
        return { 
          error: { 
            message: 'Invalid email or password. Please check your credentials and try again.' 
          } 
        };
      }
      
      return { error: { message: error.message } };
    }
    
    console.log('✅ Sign in successful for user:', data.user?.email);
    return { error: null };
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    console.log('📝 Attempting sign up for:', email);
    
    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();
    
    // Validate password length
    if (password.length < 6) {
      console.error('❌ Password too short');
      return {
        error: {
          message: 'Password must be at least 6 characters long.'
        },
        needsEmailConfirmation: false
      };
    }
    
    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: metadata || {},
        emailRedirectTo: undefined, // Don't redirect on email confirmation
      },
    });
    
    if (error) {
      console.error('❌ Sign up error:', error.message);
      
      // Provide helpful error messages
      if (error.message.includes('already registered') || error.message.includes('User already registered')) {
        return { 
          error: { 
            message: 'This email is already registered. Please sign in instead or use the "Forgot Password" option if you need to reset your password.' 
          },
          needsEmailConfirmation: false
        };
      }
      
      if (error.message.includes('password')) {
        return { 
          error: { 
            message: 'Password must be at least 6 characters long.' 
          },
          needsEmailConfirmation: false
        };
      }
      
      return { error: { message: error.message }, needsEmailConfirmation: false };
    }
    
    // Check if email confirmation is required
    // If data.session exists, user is auto-logged in (email confirmation disabled)
    // If data.session is null but data.user exists, email confirmation is required
    const needsEmailConfirmation = data.user && !data.session;
    
    if (needsEmailConfirmation) {
      console.log('📧 Sign up successful - email confirmation required');
      return { 
        error: null, 
        needsEmailConfirmation: true 
      };
    } else if (data.session) {
      console.log('✅ Sign up successful - user logged in automatically (email confirmation disabled)');
      return { 
        error: null, 
        needsEmailConfirmation: false 
      };
    } else {
      console.warn('⚠️ Unexpected signup response - no session and no user');
      return {
        error: { message: 'Unexpected signup response. Please try again or contact support.' },
        needsEmailConfirmation: false
      };
    }
  };

  const resendConfirmationEmail = async (email: string) => {
    console.log('📧 Resending confirmation email to:', email);
    
    const normalizedEmail = email.trim().toLowerCase();
    
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: normalizedEmail,
    });
    
    if (error) {
      console.error('❌ Resend confirmation error:', error.message);
      
      if (error.message.includes('rate limit') || error.message.includes('too many')) {
        return {
          error: {
            message: 'Please wait a moment before requesting another confirmation email. Check your spam folder if you haven\'t received it.'
          }
        };
      }
      
      if (error.message.includes('already confirmed')) {
        return {
          error: {
            message: 'Your email is already confirmed. Please try signing in.'
          }
        };
      }
      
      return { error: { message: error.message } };
    }
    
    console.log('✅ Confirmation email resent successfully');
    return { error: null };
  };

  const signOutUser = async () => {
    console.log('🚪 Signing out user');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('❌ Sign out error:', error.message);
      throw error;
    }
    console.log('✅ Sign out successful');
  };

  const signInWithGoogle = async () => {
    console.log('🔑 Initiating Google sign in');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'fairway://auth/callback',
      },
    });
    
    if (error) {
      console.error('❌ Google sign in error:', error.message);
    }
    
    return { error };
  };

  const signInWithApple = async () => {
    console.log('🔑 Initiating Apple sign in');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: 'fairway://auth/callback',
      },
    });
    
    if (error) {
      console.error('❌ Apple sign in error:', error.message);
    }
    
    return { error };
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut: signOutUser,
    signInWithGoogle,
    signInWithApple,
    resendConfirmationEmail,
  };

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  );
}

export function useSupabaseAuth() {
  const context = useContext(SupabaseAuthContext);
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  return context;
}
