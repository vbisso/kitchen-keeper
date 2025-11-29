import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../utils/config";

const API = API_BASE_URL;
// console.log(API);

export const login = async (email, password) => {
  console.log("API:", API);
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error("Email or password incorrect");

  const data = await res.json(); //reads the data from the response -> which is the token
  await AsyncStorage.setItem("token", data.token);
  return data;
};

export const register = async (firstName, lastName, email, password) => {
  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ firstName, lastName, email, password }),
  });

  if (!res.ok) throw new Error("Email already in use");
  return await login(email, password);
};

export const logout = async () => {
  await AsyncStorage.removeItem("token");
};

export const getToken = async () => {
  const token = await AsyncStorage.getItem("token");
  return token;
};
