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
import AsyncStorage from "@react-native-async-storage/async-storage";
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

  // Load user data
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");

      setLoading(false);
    }
  }, [user]);
  //   console.log(data);

  const handleSave = async () => {
    try {
      setSaving(true);
      //   console.log("caca!!", data._id);

      const res = await updateUser({
        id: user._id,
        firstName,
        lastName,
        email,
        ...(password ? { password } : {}),
      });

      console.log(res);

      Alert.alert("Success", "Your account has been updated.");
      setPassword(""); // clear password field
    } catch (err) {
      Alert.alert("Error", "Could not update your account.");
      console.log("caca??");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <ActivityIndicator style={{ marginTop: 40 }} size="large" />;

  return (
    <SafeContainer>
      <View style={styles.container}>
        <Text style={styles.title}>Account Details</Text>

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
        />

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
      </View>
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: {
    fontFamily: "Lexend-Bold",
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
  },
  label: { fontSize: 14, marginTop: 10, color: "#555" },
  input: {
    backgroundColor: "#F3F3F3",
    padding: 12,
    borderRadius: 8,
    marginTop: 5,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 14,
    borderRadius: 10,
    marginTop: 25,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
