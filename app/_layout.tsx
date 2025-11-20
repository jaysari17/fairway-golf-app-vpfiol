
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
import { StorageService } from "@/utils/storage";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    async function checkOnboarding() {
      try {
        const complete = await StorageService.isOnboardingComplete();
        setIsOnboardingComplete(complete);
      } catch (error) {
        console.error('Error checking onboarding:', error);
        setIsOnboardingComplete(false);
      }
    }
    checkOnboarding();
  }, []);

  useEffect(() => {
    if (loaded && isOnboardingComplete !== null) {
      SplashScreen.hideAsync();
      
      if (!isOnboardingComplete) {
        router.replace('/onboarding');
      }
    }
  }, [loaded, isOnboardingComplete]);

  if (!loaded || isOnboardingComplete === null) {
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
    <>
      <StatusBar style="auto" animated />
      <ThemeProvider
        value={colorScheme === "dark" ? CustomDarkTheme : CustomDefaultTheme}
      >
        <WidgetProvider>
          <GestureHandlerRootView>
            <Stack>
              <Stack.Screen name="onboarding" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="modal"
                options={{
                  presentation: "modal",
                  title: "Log Round",
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
            </Stack>
            <SystemBars style={"auto"} />
          </GestureHandlerRootView>
        </WidgetProvider>
      </ThemeProvider>
    </>
  );
}
