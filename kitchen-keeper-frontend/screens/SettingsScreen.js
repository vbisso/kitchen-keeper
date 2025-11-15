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
    <SafeContainer>
      <View style={styles.container}>
        <Text style={styles.title}>Notifications</Text>
        <Text style={styles.subtitle}>Notify me before an item expires:</Text>

        <Text style={styles.valueText}>
          {daysBefore} {daysBefore === 1 ? "day" : "days"} before
        </Text>

        <Slider
          style={{ width: "100%", height: 40, marginTop: 10 }}
          minimumValue={1}
          maximumValue={14}
          step={1}
          value={daysBefore}
          onValueChange={setDaysBefore}
        />

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
      </View>
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: {
    fontFamily: "Lexend-Bold",
    fontSize: 24,
    marginBottom: 10,
  },
  subtitle: { fontSize: 16, color: "#555", marginBottom: 20 },
  valueText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 14,
    borderRadius: 10,
    marginTop: 30,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
