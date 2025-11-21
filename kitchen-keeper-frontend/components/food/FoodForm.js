import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import QuantityStepper from "../UI/QuantityStepper";
import DatePicker from "../UI/DatePicker";
import CategoryPicker from "../UI/CategoryPicker";
import NameInput from "../UI/NameInput";
import ViewPicker from "../UI/ViewPicker";
import categoryKeywords from "../../assets/data/categories.json";
import { RFValue } from "react-native-responsive-fontsize";
import { useRoute } from "@react-navigation/native";
import SafeContainer from "../SafeContainer";

const FoodForm = ({
  onSave,
  onDelete,
  selectedFood,
  isEditing,
  onConsumed,
  onWasted,
}) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date());
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState("");
  const [view, setView] = useState("");
  const [suggestedCategory, setSuggestedCategory] = useState("");
  const [imageUri, setImageUri] = useState(null);

  // Pre-populate form fields when editing a food item
  useEffect(() => {
    if (selectedFood) {
      setName(selectedFood.name || "");
      setCategory(selectedFood.category || "");
      setDate(
        selectedFood.expDate ? new Date(selectedFood.expDate) : new Date()
      );
      setQuantity(selectedFood.quantity || 1);
      setUnit(selectedFood.unit || "");
      setView(selectedFood.view || "");
      setImageUri(selectedFood.image || null);
    } else {
      resetForm();
    }
  }, [selectedFood]);

  const resetForm = () => {
    setName("");
    setCategory("");
    setDate(new Date());
    setQuantity(1);
    setUnit("");
    setView("");
    setImageUri(null);
  };

  //Auto fill category based on name
  useEffect(() => {
    if (!name.trim()) {
      setSuggestedCategory("");
      return;
    }
    const lowerName = name.trim().toLowerCase();
    let foundCategory = "";
    for (const [cat, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.includes(lowerName)) {
        foundCategory = cat;
        break;
      }
    }
    setSuggestedCategory(foundCategory);
    // Auto-set category if it's empty and a suggested one is found
    if (foundCategory && !category) {
      setCategory(foundCategory);
    }
  }, [name]);

  const handleSave = () => {
    // Basic validation
    if (!name.trim()) {
      alert("Please enter a food name");
      return;
    }
    if (!category) {
      alert("Please select a category");
      return;
    }

    const foodData = {
      name: name.trim(),
      category,
      expDate: new Date(date),
      quantity,
      unit,
      view,
      image: imageUri,
    };

    // Include id if editing existing food
    if (isEditing && selectedFood?._id) {
      foodData._id = selectedFood._id;
    }

    onSave(foodData);
  };

  const handleDelete = () => {
    onDelete(selectedFood._id);
  };
  // Helper: Days until expiration
  const daysUntilExpiration = Math.max(
    0,
    Math.ceil((date - new Date()) / (1000 * 60 * 60 * 24))
  );

  return (
    <View>
      {/* ===== Header Section ===== */}
      <View style={styles.headerContainer}>
        <Image
          source={
            imageUri
              ? { uri: imageUri }
              : require("../../assets/icons/Image.png")
          }
          style={styles.foodImage}
        />
        <Text style={styles.foodName}>{name || "Unnamed Item"}</Text>
      </View>
      {/* ===== Stats Row ===== */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>days ago</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{quantity}</Text>
          <Text style={styles.statLabel}>items</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{daysUntilExpiration}</Text>
          <Text style={styles.statLabel}>days left</Text>
        </View>
      </View>
      {/* ===== Form Section ===== */}
      <View style={styles.formSection}>
        <NameInput value={name} onChange={setName} />

        <ViewPicker value={view} setView={setView} />

        <CategoryPicker value={category} setCategory={setCategory} />

        <DatePicker value={date} setDate={setDate} />

        <QuantityStepper
          value={quantity}
          onChange={setQuantity}
          unit={unit}
          setUnit={setUnit}
          style={styles.quantity}
        />
      </View>
      {/* ===== Action Buttons ===== */}
      <View style={styles.buttonContainer}>
        {isEditing && (
          <>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        {isEditing && (
          <>
            <TouchableOpacity
              style={styles.buttonConsumed}
              onPress={() => onConsumed(selectedFood._id)}
            >
              <Text>Mark as Consumed</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonWasted}
              onPress={() => onWasted(selectedFood._id)}
            >
              <Text>Mark as Wasted</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    // backgroundColor: "red",
    paddingBottom: 30,
  },
  headerContainer: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "linear-gradient(180deg, #e3e9f1, #ffffff)",
    paddingVertical: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: "relative",
  },
  foodImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  foodName: {
    fontSize: RFValue(18),
    fontWeight: "600",
    color: "#1C1C1E",
  },
  editButton: {
    position: "absolute",
    right: 25,
    top: 20,
    backgroundColor: "#007AFF20",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  editText: {
    color: "#007AFF",
    fontWeight: "600",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    backgroundColor: "#FFF",
    borderRadius: 20,
    paddingVertical: 10,
    marginTop: -15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  statBox: {
    alignItems: "center",
  },
  statValue: {
    fontSize: RFValue(14),
    fontWeight: "700",
    color: "#111",
  },
  statLabel: {
    fontSize: RFValue(10),
    color: "#666",
  },
  formSection: {
    width: "100%",
    backgroundColor: "#FFF",
    marginTop: 20,
    borderRadius: 16,
    padding: 15,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 25,
    marginHorizontal: "auto",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    // marginLeft: isEditing ? 10 : 0,
  },
  saveText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: RFValue(12),
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#FF3B30",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 10,
  },
  deleteText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: RFValue(12),
  },
  buttonConsumed: {
    flex: 1,
    backgroundColor: "#EDEDED",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 10,
  },

  buttonWasted: {
    flex: 1,
    backgroundColor: "#EDEDED",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
});
export default FoodForm;
