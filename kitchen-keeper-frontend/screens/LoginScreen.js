import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../utils/config";
import SafeContainer from "../components/SafeContainer";

const API = API_BASE_URL;
export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      console.log("API:", API);
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok) {
        login(data.token); // store token
      } else {
        Alert.alert("Login Failed", data.message || "Try again");
      }
    } catch (err) {
      Alert.alert("Error", "Could not login");
      console.log("Error", err);
    }
  };

  return (
    <SafeContainer>
      {/* <View style={styles.logoContainer}> */}
      <Image
        style={styles.logo}
        source={require("../assets/icons/logo.png")}
      ></Image>
      {/* </View> */}
      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <TouchableOpacity
        title="Login"
        onPress={handleLogin}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Don't have an account?</Text>
        <TouchableOpacity
          title="Register instead"
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.registerButton}>Register</Text>
        </TouchableOpacity>
      </View>
    </SafeContainer>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    justifyContent: "start",
    alignItems: "center",
    backgroundColor: "#45AAF3",
  },
  logo: {
    width: 100,
    height: 100,
    marginTop: "25%",
    marginBottom: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
  },
  input: {
    width: "85%",
    height: 50,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#FFF",
    paddingVertical: 10,
    paddingHorizontal: 55,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "#333",
    fontSize: RFValue(12),
  },
  registerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    gap: 8,
  },
  registerText: {
    color: "#fff",
    fontSize: RFValue(12),
  },
  registerButton: {
    color: "#fff",
    fontSize: RFValue(12),
    fontWeight: "bold",
  },
});
