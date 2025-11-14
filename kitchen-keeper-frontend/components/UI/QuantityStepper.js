import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
} from "react-native";

const QuantityStepper = ({ value, onChange, unit, setUnit }) => {
  const units = [
    "Units",
    "Servings",
    "Ounces",
    "Grams",
    "Kilograms",
    "Mililiters",
    "Liters",
  ];
  const [showDropdown, setShowDropdown] = useState(false);
  return (
    <View>
      <Text style={styles.label}>Quantity</Text>

      <View style={styles.container}>
        <View style={styles.dropdownContainer}>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setShowDropdown(!showDropdown)}
          >
            <Text
              style={[styles.dropdownButtonText, !unit && styles.placeholder]}
            >
              {unit || "Units"}
            </Text>
            <Text style={styles.dropdownArrow}>▼</Text>
          </TouchableOpacity>
          {showDropdown && (
            <View style={styles.dropdownList}>
              <FlatList
                data={units}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      setUnit(item);
                      setShowDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </View>

        <View style={styles.stepper}>
          <TouchableOpacity
            onPress={() => onChange(Math.max(1, value - 1))}
            style={styles.button}
          >
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.valueText}>{value}</Text>
          <TouchableOpacity
            onPress={() => onChange(value + 1)}
            style={styles.button}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 50,
    width: "100%",

    zIndex: 9999,
    elevation: 9999,
  },
  button: {
    paddingHorizontal: 12,
  },
  buttonText: {
    color: "black",
    fontSize: 22,
  },
  valueText: {
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    paddingLeft: 5,
  },
  stepper: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0F0F0",
    color: "#000",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: "100%",
    width: "35%",
  },
  dropdownContainer: {
    zIndex: 1000,
    width: "60%",
    height: "100%",
  },

  dropdownButton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    color: "#000",
    borderRadius: 8,
    height: "100%",
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: "#000",
  },
  placeholder: {
    color: "grey",
  },
  dropdownArrow: {
    fontSize: 12,
    color: "#666",
  },
  dropdownList: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#FBFCFD",
    borderWidth: 0.2,
    borderColor: "grey",
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    maxHeight: 150,
    zIndex: 2000,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#333",
  },
});
export default QuantityStepper;
