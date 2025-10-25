import React, { useState } from "react";
import {
  View,
  Button,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import SafeContainer from "../components/SafeContainer";

import * as ImagePicker from "expo-image-picker";
import FoodModal from "../components/modals/FoodModal";
import useFoodHandlers from "../hooks/useFoodHandlers";
import { recognizeImage } from "../services/recognizeImageService";

export default function ImageRecognizeScreen() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [remainingItems, setRemainingItems] = useState([]);
  const { handleSaveFood, handleDeleteFood } = useFoodHandlers();

  const requestPermissions = async () => {
    const cameraPerm = await ImagePicker.requestCameraPermissionsAsync();
    const mediaPerm = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraPerm.status !== "granted" || mediaPerm.status !== "granted") {
      Alert.alert(
        "Permissions required",
        "Camera and gallery permissions are needed."
      );
      return false;
    }
    return true;
  };

  //take photo
  const takePhoto = async () => {
    const hasPerm = await requestPermissions();
    if (!hasPerm) return;

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      await handleRecognize(result.assets[0]);
    }
  };

  // picks from library
  const pickImage = async () => {
    const hasPerm = await requestPermissions();
    if (!hasPerm) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      await handleRecognize(result.assets[0]);
    }
  };

  const handleRecognize = async (asset) => {
    try {
      setLoading(true);
      const data = await recognizeImage(asset);
      console.log("Recognized items:", data);

      if (!data.items || data.items.length === 0) {
        Alert.alert("No items found", "Try a clearer image.");
        return;
      }

      const [firstItem, ...rest] = data.items.map((it) => ({
        ...it,
        expDate: it.expDate ? new Date(it.expDate) : new Date(),
        view: "",
      }));

      setSelectedFood(firstItem);
      setRemainingItems(rest);
      setModalVisible(true);
    } catch (err) {
      console.error("Error recognizing image:", err);
      Alert.alert("Error", "Image recognition failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Save and move to next item
  const handleSaveAndNext = (food) => {
    handleSaveFood(food);
    if (remainingItems.length > 0) {
      const [next, ...rest] = remainingItems;
      setSelectedFood(next);
      setRemainingItems(rest);
    } else {
      setModalVisible(false);
      setSelectedFood(null);
    }
  };

  return (
    <SafeContainer>
      <Button title="📸 Take Photo" onPress={takePhoto} />
      <View style={{ height: 10 }} />
      <Button title="🖼 Choose from Library" onPress={pickImage} />

      {loading && <ActivityIndicator size="large" style={{ marginTop: 20 }} />}
      {image && (
        <Image
          source={{ uri: image }}
          style={{ width: "100%", height: 300, marginTop: 20 }}
          resizeMode="contain"
        />
      )}

      <FoodModal
        visible={modalVisible}
        selectedFood={selectedFood}
        onClose={() => {
          setModalVisible(false);
          setSelectedFood(null);
          setRemainingItems([]);
        }}
        onSave={handleSaveAndNext}
        onDelete={(id) => {
          handleDeleteFood(id);
          setModalVisible(false);
        }}
      />
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
