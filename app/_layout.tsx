
import "react-native-reanimated";
import React, { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import { Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SystemBars } from "react-native-edge-to-edge";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useColorScheme } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { WidgetProvider } from "@/contexts/WidgetContext";
import { SupabaseAuthProvider, useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { StorageService } from "@/utils/storage";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

function RootNavigator() {
  const colorScheme = useColorScheme();
  const { user, loading: authLoading } = useSupabaseAuth();
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    async function checkOnboarding() {
      try {
        const complete = await StorageService.isOnboardingComplete();
        console.log('Onboarding complete:', complete);
        setIsOnboardingComplete(complete);
      } catch (error) {
        console.error('Error checking onboarding:', error);
        setIsOnboardingComplete(false);
      }
    }
    checkOnboarding();
  }, []);

  useEffect(() => {
    if (loaded && !authLoading && isOnboardingComplete !== null) {
      SplashScreen.hideAsync();
      
      console.log('Auth state - User:', user ? 'logged in' : 'not logged in', 'Onboarding:', isOnboardingComplete);
      
      // If onboarding not complete, show onboarding
      if (!isOnboardingComplete) {
        console.log('Navigating to onboarding');
        router.replace('/onboarding');
      }
      // If onboarding complete but no user, show login
      else if (!user) {
        console.log('Navigating to login');
        router.replace('/login');
      }
      // If user is logged in, show main app
      else {
        console.log('User authenticated, showing main app');
        router.replace('/(tabs)');
      }
    }
  }, [loaded, authLoading, isOnboardingComplete, user]);

  if (!loaded || authLoading || isOnboardingComplete === null) {
    return null;
  }

  const CustomDefaultTheme: Theme = {
    ...DefaultTheme,
    dark: false,
    colors: {
      primary: "#57C8A1",
      background: "#F8F8FF",
      card: "#FFFFFF",
      text: "#333333",
      border: "#E0E0E0",
      notification: "#FF9500",
    },
  };

  const CustomDarkTheme: Theme = {
    ...DarkTheme,
    colors: {
      primary: "#57C8A1",
      background: "#1C1C1E",
      card: "#2C2C2E",
      text: "#FFFFFF",
      border: "#38383A",
      notification: "#FF9500",
    },
  };

  return (
    <ThemeProvider
      value={colorScheme === "dark" ? CustomDarkTheme : CustomDefaultTheme}
    >
      <GestureHandlerRootView>
        <Stack>
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="profile-setup" options={{ headerShown: false }} />
          <Stack.Screen name="contact-sync" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options={{
              presentation: "modal",
              title: "Log Round",
            }}
          />
          <Stack.Screen
            name="rating-flow"
            options={{
              presentation: "modal",
              title: "Rate Course",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="formsheet"
            options={{
              presentation: "formSheet",
              title: "Course Details",
              sheetGrabberVisible: true,
              sheetAllowedDetents: [0.5, 0.8, 1.0],
              sheetCornerRadius: 20,
            }}
          />
          <Stack.Screen
            name="transparent-modal"
            options={{
              presentation: "transparentModal",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="comment-modal"
            options={{
              presentation: "modal",
              title: "Comments",
            }}
          />
          <Stack.Screen
            name="user-courses"
            options={{
              presentation: "modal",
              title: "Courses Played",
            }}
          />
          <Stack.Screen
            name="user-followers"
            options={{
              presentation: "modal",
              title: "Followers",
            }}
          />
          <Stack.Screen
            name="user-following"
            options={{
              presentation: "modal",
              title: "Following",
            }}
          />
        </Stack>
        <SystemBars style={"auto"} />
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" animated />
      <SupabaseAuthProvider>
        <WidgetProvider>
          <RootNavigator />
        </WidgetProvider>
      </SupabaseAuthProvider>
    </>
  );
}
