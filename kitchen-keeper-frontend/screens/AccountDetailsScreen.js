import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import SafeContainer from "../components/SafeContainer";
import { useUser } from "../context/UserContext";

export default function AccountDetailScreen() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { user, updateUser } = useUser();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");
      setLoading(false);
    }
  }, [user]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateUser({
        id: user._id,
        firstName,
        lastName,
        email,
        ...(password ? { password } : {}),
      });

      Alert.alert("Success", "Your account has been updated.");
      setPassword("");
    } catch (err) {
      Alert.alert("Error", "Could not update your account.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <ActivityIndicator style={{ marginTop: 40 }} size="large" />;

  return (
    <SafeContainer style={styles.screen}>
      <Text style={styles.title}>Account Details</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
        />

        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <Text style={styles.label}>New Password (optional)</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Leave empty to keep current password"
          placeholderTextColor="#AAA"
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
          <Text style={styles.buttonText}>Save Changes</Text>
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
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  label: {
    fontSize: 16,
    fontFamily: "Lexend-Regular",
    marginTop: 12,
    color: "#555",
  },

  input: {
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 10,
    marginTop: 6,
    fontFamily: "Lexend-Regular",
    fontSize: 16,
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
