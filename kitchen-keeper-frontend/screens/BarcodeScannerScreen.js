import React, { useState, useEffect, useRef } from "react";
import { Text, View, StyleSheet, Alert, Button, Vibration } from "react-native";
import SafeContainer from "../components/SafeContainer";
import { CameraView, useCameraPermissions } from "expo-camera";
import { lookupProductByBarcode } from "../services/lookUpProductByBarcode";
import { processUPCResponse } from "../services/processUPCData";
import categoriesJSON from "../assets/data/categories.json";

export default function BarcodeScannerScreen({ navigation }) {
  console.log("✅ Barcode screen mounted");

  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const cameraRef = useRef(null);

  const scanLock = useRef(false);
  const scannedUPCs = useRef(new Set());

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  const handleBarCodeScanned = ({ type, data }) => {
    console.log("📸 Barcode detected:", type, data);

    // Prevent duplicate scans
    if (scanLock.current || scannedUPCs.current.has(data) || scanned) return;

    scanLock.current = true;
    scannedUPCs.current.add(data);
    setScanned(true);
    Vibration.vibrate();

    (async () => {
      try {
        // 🔍 Lookup product info
        const upcData = await lookupProductByBarcode(data);
        if (!upcData) {
          Alert.alert(
            "Not found",
            "No product information found for this barcode."
          );
          return;
        }

        console.log("UPC response:", upcData);

        // 🤖 Process data with your AI categorization logic
        const processed = await processUPCResponse(
          upcData,
          Object.keys(categoriesJSON)
        );

        if (!processed) {
          Alert.alert("Error", "Unable to process this barcode.");
          return;
        }

        console.log("Processed by AI:", processed);

        // 🧾 Create new food object
        const expDate = processed?.expDate
          ? processed.expDate
          : new Date().toISOString(); // 👈 convert to string

        const newFood = {
          name: processed?.name || upcData.title || "Unknown item",
          category: processed?.category,
          quantity: processed?.quantity || 1,
          unit: processed?.unit || "",
          expDate, // now a string
          view: "",
        };

        // ✅ Navigate to FoodDetailScreen with the scanned data
        navigation.navigate("Food Detail", { food: newFood });
      } catch (error) {
        console.error("Error scanning barcode:", error);
        Alert.alert(
          "Error",
          "There was an issue scanning the barcode. Try again."
        );
      } finally {
        // Unlock scanner after a short delay to avoid multiple triggers
        setTimeout(() => {
          scanLock.current = false;
          setScanned(false);
        }, 4000);
      }
    })();
  };

  if (!permission || !permission.granted) {
    return (
      <SafeContainer>
        <View style={styles.centered}>
          <Text>No access to camera</Text>
          <Button title="Grant Permission" onPress={requestPermission} />
        </View>
      </SafeContainer>
    );
  }

  return (
    <SafeContainer>
      <View style={styles.container}>
        {!scanned && (
          <CameraView
            ref={cameraRef}
            enableBarcodeScanner={true}
            facing="back"
            onBarcodeScanned={handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: [
                "qr",
                "ean13",
                "ean8",
                "upc_a",
                "upc_e",
                "code128",
                "code39",
              ],
            }}
            style={StyleSheet.absoluteFillObject}
          />
        )}

        <View style={styles.overlay}>
          <Text style={styles.overlayText}>
            Align the barcode inside the frame
          </Text>
          <View style={styles.frame} />
        </View>
      </View>
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  overlayText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  frame: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: "#3C3A42",
    borderRadius: 12,
    backgroundColor: "transparent",
  },
});
