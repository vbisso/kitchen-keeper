import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import Slider from "@react-native-community/slider";
import SafeContainer from "../components/SafeContainer";
import { useUser } from "../context/UserContext";

export default function SettingsScreen() {
  const { user, loadingUser, updateUser } = useUser();
  const [daysBefore, setDaysBefore] = useState(1);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user && user.notifyDaysBefore != null) {
      setDaysBefore(user.notifyDaysBefore);
    }
  }, [user]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateUser({ notifyDaysBefore: daysBefore });
      Alert.alert("Saved", "Notification settings updated.");
    } catch (err) {
      Alert.alert("Error", "Could not save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loadingUser && !user) {
    return <ActivityIndicator style={{ marginTop: 40 }} size="large" />;
  }

  return (
    <SafeContainer style={styles.screen}>
      <Text style={styles.title}>Notifications</Text>

      <View style={styles.card}>
        <Text style={styles.subtitle}>Notify me before an item expires:</Text>

        <Text style={styles.valueText}>
          {daysBefore} {daysBefore === 1 ? "day" : "days"} before
        </Text>

        <Slider
          style={{ width: "100%", height: 40, marginTop: 15 }}
          minimumValue={1}
          maximumValue={14}
          step={1}
          value={daysBefore}
          onValueChange={setDaysBefore}
          minimumTrackTintColor="#007AFF"
          thumbTintColor="#007AFF"
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Save</Text>
        )}
      </TouchableOpacity>
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  screen: { padding: 20 },

  title: {
    fontFamily: "Lexend-SemiBold",
    fontSize: 36,
    marginBottom: 20,
  },

  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  subtitle: {
    fontSize: 15,
    color: "#555",
    marginBottom: 15,
    fontFamily: "Lexend-Regular",
  },

  valueText: {
    fontSize: 20,
    fontFamily: "Lexend-SemiBold",
    textAlign: "center",
    marginBottom: 5,
  },

  button: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    marginTop: 25,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontFamily: "Lexend-SemiBold",
    fontSize: 16,
  },
});
