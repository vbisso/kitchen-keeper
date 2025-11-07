import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import FoodItem from "./FoodItem";
import { RFValue } from "react-native-responsive-fontsize";
import { useNavigation } from "@react-navigation/native";

const FoodList = ({
  foods,
  onDelete,
  onEdit,
  searchText,
  view,
  onLongPress,
  onToggleSelect,
  selectedIds,
  isSelectionMode,
  sortBy,
  filterCategory,
}) => {
  const filteredFoods = foods
    .filter((food) =>
      food.name.toLowerCase().includes(searchText.toLowerCase())
    )
    .filter((food) =>
      filterCategory === "All" ? true : food.category === filterCategory
    )
    .sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "expDate") {
        return new Date(a.expDate) - new Date(b.expDate);
      }
      return 0;
    });
  const navigation = useNavigation();

  return (
    <View>
      {foods.length === 0 ? (
        <View style={styles.textContainer}>
          <Text style={styles.emptyStateTitle}>No items found</Text>
          <Text style={styles.emptyStateMessage}>
            Tap the + button below to add your first item
          </Text>
        </View>
      ) : filteredFoods.length === 0 ? (
        <View style={styles.textContainer}>
          <Text style={styles.text}>No items found.</Text>
        </View>
      ) : (
        filteredFoods.map((food) => (
          <View style={styles.itemContainer} key={food._id}>
            <FoodItem
              value={food}
              onDelete={() => onDelete(food._id)}
              onEdit={() => navigation.navigate("FoodDetail", { food })}
              view={view}
              onLongPress={() => onLongPress(food._id)}
              onToggleSelect={() => onToggleSelect(food._id)}
              isSelected={selectedIds.includes(food._id)}
              isSelectionMode={isSelectionMode}
            />
          </View>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  textContainer: {
    position: "absolute",
    transform: [{ translateY: 250 }],
    alignSelf: "center",
    alignItems: "center",
  },
  text: {
    fontSize: RFValue(12),
    textAlign: "center",
    paddingTop: 10,
  },
  itemText: {
    fontSize: RFValue(12),
  },
  itemContainer: {
    // paddingHorizontal: 10,
    flex: 1,
    flexDirection: "row",
    alignSelf: "center",
  },

  emptyStateTitle: {
    fontSize: RFValue(16),
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  emptyStateMessage: {
    fontSize: RFValue(12),
    color: "#555",
    textAlign: "center",
    paddingHorizontal: 30,
  },
});

export default FoodList;
