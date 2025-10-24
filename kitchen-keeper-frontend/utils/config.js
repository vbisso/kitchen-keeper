import Constants from "expo-constants";
import { Platform } from "react-native";

// const LAN_IP = "192.168.0.16";
const LAN_IP = "10.244.190.231"; //BYUI WIFI

const isDevice = Constants.appOwnership === "expo"; // true on Expo Go
const isSimulator =
  (Platform.OS === "ios" && !isDevice) ||
  (Platform.OS === "android" && !isDevice);

export const API_BASE_URL = isSimulator
  ? "http://localhost:3000"
  : `http://${LAN_IP}:3000`;
