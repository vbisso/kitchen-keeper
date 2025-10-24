import { useState } from "react";
import { useFoodContext } from "../context/FoodContext";
import { scheduleExpirationNotification } from "../services/notificationService";

export default function useFoodHandlers(sortBy = "expDate") {
  const [selectedFood, setSelectedFood] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  // const [sortBy, setSortBy] = useState("expDate")'
  const [optionModalVisible, setOptionModalVisible] = useState(false);
  const { foods, saveFoods, deleteFood } = useFoodContext();

  const handleAddFood = () => {
    setSelectedFood(null); // Clear selection for new food
    setOptionModalVisible(true);
  };
  const handleEditFood = (food) => {
    setSelectedFood(food); // Set selected food for editing
    setModalVisible(true);
  };
  const handleDeleteFood = (index) => {
    deleteFood(index);
  };
  const handleSaveFood = async (foodData) => {
    try {
      await saveFoods(foodData);
      await scheduleExpirationNotification(foodData, foodData.expDate);
      setSelectedFood(null);
      setModalVisible(false);
    } catch (error) {
      console.error("Error saving food:", error);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedFood(null); // Clear selection when closing
  };

  return {
    foods,
    selectedFood,
    modalVisible,
    handleAddFood,
    handleEditFood,
    handleDeleteFood,
    handleSaveFood,
    handleCloseModal,
    setModalVisible,
    setSelectedFood,
    optionModalVisible,
    setOptionModalVisible,
  };
}
