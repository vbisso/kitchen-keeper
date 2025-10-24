import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import "react-native-get-random-values";
import { registerForNotifications } from "./services/notificationService";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import WelcomeScreen from "./screens/WelcomeScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import HomeScreen2 from "./screens/HomeScreen2";

import Fridge from "./screens/Fridge";
import Pantry from "./screens/Pantry";
import BarcodeScannerScreen from "./screens/BarcodeScannerScreen";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { FoodProvider } from "./context/FoodContext";
import ProfileScreen from "./screens/ProfileScreen";
import ImageRecognizeScreen from "./screens/ImageRecognizeScreen";

const Stack = createStackNavigator();

// This wrapper decides what to show depending on login
function AppNavigator() {
  const { token } = useAuth();

  return (
    <Stack.Navigator>
      {token ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen2} />
          <Stack.Screen name="AllItems" component={HomeScreen} />

          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Scan" component={BarcodeScannerScreen} />
          <Stack.Screen name="Take Photo" component={ImageRecognizeScreen} />
          <Stack.Screen name="Fridge" component={Fridge} />
          <Stack.Screen name="Pantry" component={Pantry} />
        </>
      ) : (
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
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
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </FoodProvider>
    </AuthProvider>
  );
}
