import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { SwipeRow } from "react-native-swipe-list-view";
import Icon from "react-native-vector-icons/Ionicons";
import { RFValue } from "react-native-responsive-fontsize";
import getFoodIcon from "../../utils/getFoodIcon";
import useFoodData from "../../hooks/useFoodData";
import { useNavigation } from "@react-navigation/native";

const FoodItem = ({
  value,
  onEdit,
  view,
  onLongPress,
  onToggleSelect,
  isSelected,
  isSelectionMode,
}) => {
  const navigation = useNavigation();
  const handlePress = () => {
    if (isSelectionMode) {
      onToggleSelect();
    } else {
      navigation.navigate("Food Detail", { food: value });
    }
  };

  const { daysUntilExpiration } = useFoodData();

  if (view === "Fridge" || view === "Pantry") {
    return (
      <TouchableOpacity
        onPress={() => onEdit(value)}
        style={styles.iconContainer}
      >
        <Text style={styles.quantity}>
          {value.quantity} {value.unit}
        </Text>
        <Image source={getFoodIcon(value.category)} style={styles.icon} />
        <Text style={styles.iconText}>
          {value.name.split(" ").slice(0, 3).join(" ") +
            (value.name.split(" ").length > 3 ? "..." : "")}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      onLongPress={onLongPress}
      // style={pressableStyles}
    >
      <View style={styles.rowFront}>
        {isSelectionMode && (
          <Icon
            name={isSelected ? "checkbox" : "square-outline"}
            size={20}
            color={isSelected ? "#007AFF" : "#ccc"}
            style={{ marginRight: 10 }}
          />
        )}
        <View style={styles.info}>
          <Text style={styles.name}>{value.name}</Text>

          {daysUntilExpiration(value.expDate) < 0 ? (
            <Text style={styles.expDateExpired}>Expired</Text>
          ) : (
            <Text style={styles.expDate}>
              In {daysUntilExpiration(value.expDate)} days
            </Text>
          )}
        </View>
        <View style={styles.quantityContainer}>
          <Text style={styles.quantity}>x{value.quantity}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  rowFront: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "#fff",
    backgroundColor: "#EDEDED",
    height: 75,
    // borderBottomWidth: 1,

    minWidth: "97%",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,

    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 2,
  },

  info: {
    marginLeft: 10,

    flex: 1,
  },
  expDateExpired: {
    fontSize: RFValue(12),
    fontFamily: "Lexend-SemiBold",
    width: "40%",
    paddingHorizontal: 5,
    paddingVertical: 3,
    textAlign: "center",
    backgroundColor: "#FF0000",
    borderRadius: 20,
    marginTop: 5,
    color: "#fff",
  },
  expDate: {
    fontSize: RFValue(12),
    fontFamily: "Lexend-Regular",
    width: "40%",
    paddingHorizontal: 5,
    paddingVertical: 3,
    textAlign: "center",
    backgroundColor: "#D9D9D9",
    borderRadius: 20,
    marginTop: 5,
    color: "#848484",
  },
  name: {
    fontSize: RFValue(12),
    fontFamily: "Lexend-SemiBold",

    textAlign: "left",
    color: "#333",
  },
  quantityContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D9D9D9",
    marginHorizontal: 4,
    borderRadius: 100,
    overflow: "hidden",
    width: 45,
    height: 45,
  },
  quantity: {
    fontFamily: "Lexend-Regular",
    fontSize: RFValue(13),
    color: "#848484",

    // minWidth: 50,
  },

  iconContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontSize: RFValue(12),
    textAlign: "center",
  },
  icon: {
    width: 50,
    height: 50,
  },
});

export default FoodItem;
