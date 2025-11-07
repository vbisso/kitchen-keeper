import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import SafeContainer from "../components/SafeContainer";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import useFoodHandlers from "../hooks/useFoodHandlers";
import { recognizeImage } from "../services/recognizeImageService";
import { RFValue } from "react-native-responsive-fontsize";

export default function ImageRecognizeScreen() {
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const { handleSaveFood } = useFoodHandlers();

  // Request permissions
  const requestPermissions = async () => {
    const cameraPerm = await ImagePicker.requestCameraPermissionsAsync();
    const mediaPerm = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraPerm.status !== "granted" || mediaPerm.status !== "granted") {
      Alert.alert(
        "Permissions required",
        "Please grant camera and gallery permissions to continue."
      );
      return false;
    }
    return true;
  };

  // Camera or Gallery Handlers
  const takePhoto = async () => {
    const hasPerm = await requestPermissions();
    if (!hasPerm) return;

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      await handleRecognize(result.assets[0]);
    }
  };

  const pickImage = async () => {
    const hasPerm = await requestPermissions();
    if (!hasPerm) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: [ImagePicker.MediaType.Image],
      quality: 0.8,
    });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      await handleRecognize(result.assets[0]);
    }
  };

  // Recognition Handler
  const handleRecognize = async (asset) => {
    try {
      setLoading(true);
      const data = await recognizeImage(asset);
      console.log("Recognized items:", data);

      if (!data.items || data.items.length === 0) {
        Alert.alert("No items found", "Try using a clearer photo.");
        return;
      }

      const [firstItem, ...rest] = data.items.map((it) => ({
        ...it,
        expDate: it.expDate ? new Date(it.expDate) : new Date(),
        view: "",
        image: asset.uri,
      }));

      navigation.navigate("FoodDetail", {
        food: firstItem,
        remainingItems: rest,
      });
    } catch (err) {
      console.error("Error recognizing image:", err);
      Alert.alert("Error", "Image recognition failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeContainer>
      <View style={styles.container}>
        {/* Header */}
        <Text style={styles.title}>Add Items with AI Recognition</Text>
        <Text style={styles.subtitle}>
          Take a photo or upload an image — Kitchen Keeper will detect your food
          items automatically.
        </Text>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={takePhoto}>
            <Ionicons name="camera-outline" size={22} color="#fff" />
            <Text style={styles.buttonText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={pickImage}
          >
            <Ionicons name="image-outline" size={22} color="#fff" />
            <Text style={[styles.buttonText]}>Choose from Library</Text>
          </TouchableOpacity>
        </View>

        {/* Loading State */}
        {loading && (
          <View style={styles.loadingWrapper}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={styles.loadingText}>Analyzing image...</Text>
          </View>
        )}

        {/* Image Preview */}
        {image && !loading && (
          <View style={styles.previewContainer}>
            <Image
              source={{ uri: image }}
              style={styles.previewImage}
              resizeMode="cover"
            />
          </View>
        )}
      </View>
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 22,
    alignItems: "center",
    // backgroundColor: "#F8FAFC", // soft background
  },
  title: {
    marginBottom: 10,
    textAlign: "center",
    fontSize: RFValue(20),
    fontFamily: "Lexend-SemiBold",
  },
  subtitle: {
    color: "#838A8F",
    fontSize: RFValue(12),
    fontFamily: "Lexend-Regular",
    textAlign: "center",
    marginBottom: 25,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    gap: 12,
    marginBottom: 25,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000",
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 12,
    width: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  secondaryButton: {
    backgroundColor: "#3C3A42",
  },
  buttonText: {
    fontSize: RFValue(12),
    fontFamily: "Lexend-Regular",
    marginLeft: 8,
    color: "#fff",
  },
  previewContainer: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  previewImage: {
    width: "100%",
    height: 300,
  },
  loadingWrapper: {
    alignItems: "center",
    marginTop: 30,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#64748B",
  },
});
