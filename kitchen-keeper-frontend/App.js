import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import "react-native-get-random-values";

import WelcomeScreen from "./screens/WelcomeScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
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
          <Stack.Screen name="Home" component={HomeScreen} />
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

// import React from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import { createStackNavigator } from "@react-navigation/stack";
// import "react-native-get-random-values";
// import LoginScreen from "./screens/LoginScreen";
// import RegisterScreen from "./screens/RegisterScreen";
// import HomeScreen from "./screens/HomeScreen";
// import Fridge from "./screens/Fridge";
// import Pantry from "./screens/Pantry";

// export default function App() {
//   const Stack = createStackNavigator();
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Home">
//         <Stack.Screen name="Fridge" component={Fridge} />
//         <Stack.Screen name="Home" component={HomeScreen} />
//         <Stack.Screen name="Pantry" component={Pantry} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// import React from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { createStackNavigator } from "@react-navigation/stack";
// import "react-native-get-random-values";

// import HomeScreen from "./screens/HomeScreen";
// import Fridge from "./screens/Fridge";
// import Pantry from "./screens/Pantry"; // optional
// // import Settings from "./screens/Settings"; // optional

// const Stack = createStackNavigator();
// const Tab = createBottomTabNavigator();

// // Optional: if Home needs a stack (e.g., Home → Add/Edit Food)
// function HomeStackNavigator() {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen name="Kitchen Keeper" component={HomeScreen} />

//       {/* <Stack.Screen name="Food Details" component={FoodModal} /> */}
//     </Stack.Navigator>
//   );
// }

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Tab.Navigator screenOptions={{ headerShown: false }}>
//         <Tab.Screen name="Fridge" component={Fridge} />
//         <Tab.Screen name="Home" component={HomeStackNavigator} />
//         <Tab.Screen name="Pantry" component={Pantry} />
//         {/* <Tab.Screen name="Pantry" component={Pantry} />
//         <Tab.Screen name="Settings" component={Settings} /> */}
//       </Tab.Navigator>
//     </NavigationContainer>
//   );
// }
