import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SafeContainer({ children, style }) {
  return (
    <SafeAreaView
      style={[{ flex: 1, padding: 16, backgroundColor: "#F9F9F9" }, style]}
    >
      {children}
    </SafeAreaView>
  );
}
