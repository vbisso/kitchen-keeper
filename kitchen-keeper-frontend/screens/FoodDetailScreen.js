import React from "react";
import { View, StyleSheet } from "react-native";
import SafeContainer from "../components/SafeContainer";
import FoodForm from "../components/food/FoodForm";
import useFoodHandlers from "../hooks/useFoodHandlers";

export default function FoodDetailScreen({ route, navigation }) {
  const {
    handleSaveFood,
    handleDeleteFood,
    handleWastedFood,
    handleConsumedFood,
  } = useFoodHandlers();
  const selectedFood = route.params?.food || null;
  const remainingItems = route.params?.remainingItems || [];
  const totalItems = route.params?.totalItems || 1;
  const processedCount = totalItems - remainingItems.length;

  const isEditing = !!selectedFood;

  const handleSave = async (foodData) => {
    await handleSaveFood(foodData);
    if (isEditing) {
      navigation.goBack();
    }
    if (remainingItems.length > 0) {
      const [next, ...rest] = remainingItems;
      navigation.replace("FoodDetail", {
        food: next,
        remainingItems: rest,
        totalItems: data.items.length,
      });
    } else {
      navigation.goBack();
    }
  };

  const handleDelete = async (id) => {
    await handleDeleteFood(id);

    navigation.goBack();
  };

  const handleConsumed = async (id) => {
    await handleConsumedFood(id);
    navigation.goBack();
  };

  const handleWasted = async (id) => {
    await handleWastedFood(id);
    navigation.goBack();
  };

  return (
    <SafeContainer style={styles.container}>
      <View>
        {remainingItems.length > 0 && (
          <Text style={styles.counter}>
            Item {processedCount} of {totalItems}
          </Text>
        )}
        <FoodForm
          selectedFood={selectedFood}
          isEditing={isEditing}
          onSave={handleSave}
          onDelete={handleDelete}
          onConsumed={handleConsumed}
          onWasted={handleWasted}
        />
      </View>
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  counter: {
    fontSize: 20,
    textAlign: "center",

    marginBottom: 10,
    fontFamily: "Lexend-SemiBold",
  },
});
