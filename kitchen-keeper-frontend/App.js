import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";

import "react-native-get-random-values";
import { registerForNotifications } from "./services/notificationService";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import WelcomeScreen from "./screens/WelcomeScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ListViewScreen from "./screens/ListViewScreen";

import HomeScreen2 from "./screens/HomeScreen2";

import FoodDetailScreen from "./screens/FoodDetailScreen";

import Fridge from "./screens/Fridge";
import Pantry from "./screens/Pantry";
import BarcodeScannerScreen from "./screens/BarcodeScannerScreen";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { FoodProvider } from "./context/FoodContext";
import ProfileScreen from "./screens/ProfileScreen";
import ImageRecognizeScreen from "./screens/ImageRecognizeScreen";
import AccountDetailsScreen from "./screens/AccountDetailsScreen";
import SettingsScreen from "./screens/SettingsScreen";

const Stack = createStackNavigator();

// This wrapper decides what to show depending on login
function AppNavigator() {
  const { token } = useAuth();

  return (
    <Stack.Navigator>
      {token ? (
        <>
          <Stack.Screen
            name="Home"
            component={HomeScreen2}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ListView"
            component={ListViewScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Account"
            component={AccountDetailsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Scan"
            component={BarcodeScannerScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Take Photo"
            component={ImageRecognizeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Food Detail"
            component={FoodDetailScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Fridge"
            component={Fridge}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Pantry"
            component={Pantry}
            options={{ headerShown: false }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    "Lexend-SemiBold": require("./assets/fonts/Lexend-SemiBold.ttf"),
    "Lexend-Regular": require("./assets/fonts/Lexend-Regular.ttf"),
  });
  useEffect(() => {
    registerForNotifications();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <FoodProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </FoodProvider>
    </AuthProvider>
  );
}
