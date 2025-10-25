// BarcodeScannerScreen.js
import React, { useState, useEffect, useRef } from "react";
import SafeContainer from "../components/SafeContainer";
import { Text, View, StyleSheet, Alert, Button } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import FoodModal from "../components/modals/FoodModal";
import useFoodHandlers from "../hooks/useFoodHandlers";
import { lookupProductByBarcode } from "../services/lookUpProductByBarcode";
import { extractFoodData } from "../utils/extractFoodData";
import { processUPCResponse } from "../services/processUPCData";
import categoriesJSON from "../assets/data/categories.json";
import { Vibration } from "react-native";
import { lastUPC } from "../services/processUPCData";

export default function BarcodeScannerScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const cameraRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const { handleSaveFood, handleDeleteFood, handleCloseFoodModal, foods } =
    useFoodHandlers();

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, []);

  const scanLock = useRef(false);
  const scannedUPCs = useRef(new Set());

  const handleBarCodeScanned = ({ type, data }) => {
    if (scanLock.current || scannedUPCs.current.has(data) || scanned) return;

    scanLock.current = true;
    scannedUPCs.current.add(data);
    setScanned(true);
    Vibration.vibrate();

    (async () => {
      try {
        const upcData = await lookupProductByBarcode(data);
        if (!upcData) return;

        console.log("UPC response:", upcData);

        const processed = await processUPCResponse(
          upcData,
          Object.keys(categoriesJSON)
        );
        if (!processed) return;

        console.log("Processed by AI:", processed);

        const expDate = processed?.expDate
          ? new Date(processed.expDate)
          : new Date();

        const newFood = {
          name: processed?.name || upcData.title || "Unknown item",
          category: processed?.category,
          quantity: processed?.quantity || 1,
          unit: processed?.unit || "",
          expDate,
          view: "",
        };

        setSelectedFood(newFood);
        setModalVisible(true);
      } catch (error) {
        console.error("Error scanning barcode:", error);
      } finally {
        setTimeout(() => {
          scanLock.current = false;
          setScanned(false);
        }, 4500);
      }
    })();
  };

  if (!permission || !permission.granted) {
    return (
      <View style={styles.centered}>
        <Text>No access to camera</Text>
        <Button title="Grant Permission" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <SafeContainer>
      {!scanned && (
        <CameraView
          ref={cameraRef}
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "ean13", "upc_a"],
          }}
          style={StyleSheet.absoluteFillObject}
        />
      )}
      <FoodModal
        visible={modalVisible}
        selectedFood={selectedFood}
        onClose={() => {
          setModalVisible(false);
          setScanned(false);
          scanLock.current = false;
          scannedUPCs.current.clear(); // allow rescanning
        }}
        onSave={(food) => {
          handleSaveFood(food);
          setModalVisible(false);
        }}
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
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
