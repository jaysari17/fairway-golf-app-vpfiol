
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, onAuthStateChange } from '@/utils/supabase';
import { Session, User } from '@supabase/supabase-js';
import { Alert } from 'react-native';

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
    console.log('Initializing Supabase auth session');
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      console.log('Initial session loaded:', session ? 'User logged in' : 'No active session');
    });

    // Listen for auth changes
    const { data: { subscription } } = onAuthStateChange((event, session) => {
      console.log('Auth event:', event);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('Signing in user:', email);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('Sign in error:', error.message);
      
      // Provide helpful error messages
      if (error.message.includes('Email not confirmed')) {
        return { 
          error: { 
            message: 'Please verify your email address before signing in. Check your inbox for the confirmation link.' 
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
    } else {
      console.log('Sign in successful');
    }
    
    return { error };
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    console.log('Signing up user:', email);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: undefined, // Don't redirect on email confirmation
      },
    });
    
    if (error) {
      console.error('Sign up error:', error.message);
      
      // Provide helpful error messages
      if (error.message.includes('already registered')) {
        return { 
          error: { 
            message: 'This email is already registered. Please sign in instead or use a different email.' 
          },
          needsEmailConfirmation: false
        };
      }
      
      if (error.message.includes('password')) {
        return { 
          error: { 
            message: 'Password is too weak. Please use at least 6 characters with a mix of letters and numbers.' 
          },
          needsEmailConfirmation: false
        };
      }
      
      return { error, needsEmailConfirmation: false };
    }
    
    // Check if email confirmation is required
    const needsEmailConfirmation = data.user && !data.session;
    
    if (needsEmailConfirmation) {
      console.log('Sign up successful - email confirmation required');
      return { 
        error: null, 
        needsEmailConfirmation: true 
      };
    } else {
      console.log('Sign up successful - user logged in automatically');
      return { 
        error: null, 
        needsEmailConfirmation: false 
      };
    }
  };

  const resendConfirmationEmail = async (email: string) => {
    console.log('Resending confirmation email to:', email);
    
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });
    
    if (error) {
      console.error('Resend confirmation error:', error.message);
      
      if (error.message.includes('rate limit')) {
        return {
          error: {
            message: 'Please wait a moment before requesting another confirmation email.'
          }
        };
      }
    } else {
      console.log('Confirmation email resent successfully');
    }
    
    return { error };
  };

  const signOutUser = async () => {
    console.log('Signing out user');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error.message);
      throw error;
    }
    console.log('Sign out successful');
  };

  const signInWithGoogle = async () => {
    console.log('Initiating Google sign in');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'fairway://auth/callback',
      },
    });
    
    if (error) {
      console.error('Google sign in error:', error.message);
    }
    
    return { error };
  };

  const signInWithApple = async () => {
    console.log('Initiating Apple sign in');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: 'fairway://auth/callback',
      },
    });
    
    if (error) {
      console.error('Apple sign in error:', error.message);
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
