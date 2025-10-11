import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import categoriesJSON from "../assets/data/categories.json";
import FoodModal from "../components/modals/FoodModal";
import useFoodHandlers from "../hooks/useFoodHandlers";
import { recognizeImage } from "../services/recognizeImageService";

export default function ImageRecognizeScreen() {
  const [items, setItems] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { handleSaveFood } = useFoodHandlers();

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Camera permission is required.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.6,
      base64: false,
      exif: false,
    });
    if (!result.canceled) {
      await sendToBackend(result.assets[0].uri);
    }
  };

  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Gallery permission is required.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.6,
      base64: false,
    });
    if (!result.canceled) {
      await sendToBackend(result.assets[0].uri);
    }
  };

  const sendToBackend = async (uri) => {
    try {
      const recognized = await recognizeImage(uri);
      setItems(recognized);
    } catch (e) {
      console.warn("Image recognition failed:", e.message);
      Alert.alert("Recognition failed", e.message);
    }
  };

  const openItem = (item) => {
    const expDate = item.expDate ? new Date(item.expDate) : new Date();
    setSelectedFood({
      name: capitalize(item.name || "Unknown item"),
      category: item.category || "Other",
      quantity: item.quantity || 1,
      unit: item.unit || "",
      expDate,
      view: "",
    });
    setModalVisible(true);
  };

  const capitalize = (s) =>
    typeof s === "string" ? s.charAt(0).toUpperCase() + s.slice(1) : s;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Button title="Take Photo" onPress={takePhoto} />
        <View style={{ width: 12 }} />
        <Button title="Pick From Gallery" onPress={pickFromGallery} />
      </View>

      <FlatList
        data={items}
        keyExtractor={(_, i) => String(i)}
        ListEmptyComponent={
          <Text style={styles.empty}>No items recognized yet.</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => openItem(item)}>
            <Text style={styles.title}>{capitalize(item.name)}</Text>
            <Text>
              {item.quantity} {item.unit}
            </Text>
            <Text>Category: {item.category}</Text>
            <Text>Exp: {item.expDate || "n/a"}</Text>
          </TouchableOpacity>
        )}
      />

      <FoodModal
        visible={modalVisible}
        selectedFood={selectedFood}
        onClose={() => {
          setModalVisible(false);
          setSelectedFood(null);
        }}
        onSave={(food) => {
          handleSaveFood(food);
          setModalVisible(false);
        }}
        onDelete={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  row: { flexDirection: "row", justifyContent: "center", marginBottom: 12 },
  empty: { textAlign: "center", marginTop: 16, opacity: 0.6 },
  card: {
    padding: 12,
    marginBottom: 8,
    borderRadius: 10,
    backgroundColor: "#1f2937",
  },
  title: { fontWeight: "600", marginBottom: 6, fontSize: 16 },
});
