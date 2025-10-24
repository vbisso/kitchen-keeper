import { useState, useEffect, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../utils/config";

const API = API_BASE_URL;

export default function useFoodData(sortBy) {
  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      return token;
    } catch (err) {
      console.error("Error reading token:", err);
      return null;
    }
  };

  const [foods, setFoods] = useState([]);

  useEffect(() => {
    loadFoods();
  }, []);

  useEffect(() => {
    setFoods((prevFoods) => sortFoods([...prevFoods], sortBy));
  }, [sortBy]);

  useEffect(() => {
    // console.log("Loaded foods from storage or API:", foods);
  }, [foods]);

  const loadFoods = async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${API}/foods`, {
        // const res = await fetch(`http://10.34.112.249:3000/foods`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      // console.log("API response:", data);

      const parsedFoods = data.map((food) => ({
        ...food,
        expDate: new Date(food.expDate),
      }));

      setFoods(sortFoods(parsedFoods, sortBy));
    } catch (error) {
      console.error("Error loading foods from API:", error);
    }
  };

  const saveFoods = async (newFood) => {
    try {
      const token = await getToken();

      const method = newFood._id ? "PUT" : "POST";
      const endpoint = newFood._id
        ? `${API}/foods/${newFood._id}`
        : `${API}/foods`;

      const res = await fetch(endpoint, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newFood),
      });

      const updatedFood = await res.json();

      // refresh food list from server
      await loadFoods();
    } catch (err) {
      console.error("Error saving food to API:", err);
    }
  };
  const deleteFood = async (id) => {
    console.log("Deleting food with ID:", id);
    try {
      const token = await getToken();

      await fetch(`${API}/foods/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Refresh the list
      await loadFoods();
    } catch (err) {
      console.error("Error deleting food from API:", err);
    }
  };

  const sortFoods = (foods, criterion) => {
    return foods.sort((a, b) => {
      if (criterion === "expDate") {
        return new Date(a.expDate) - new Date(b.expDate);
      } else if (criterion === "category") {
        return a.category.localeCompare(b.category);
      } else if (criterion === "name") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  };
  const handleEdit = (foodItem) => {
    return foodItem;
  };

  // Helper function to check if date is today
  const isToday = (date) => {
    const today = new Date();
    const checkDate = new Date(date);
    return (
      checkDate.getDate() === today.getDate() &&
      checkDate.getMonth() === today.getMonth() &&
      checkDate.getFullYear() === today.getFullYear()
    );
  };

  // Helper function to check if date is within the next 7 days (not including today)
  const isUpcomingSoon = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(today.getDate() + 7);

    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    return checkDate > today && checkDate <= sevenDaysFromNow;
  };

  // Helper function to check if date is expired
  const isExpired = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  const isFridge = (view) => {
    return view === "Fridge";
  };
  const isPantry = (view) => {
    return view === "Pantry";
  };
  const isFreezer = (view) => {
    return view === "Freezer";
  };

  // Calculate counts of food items
  const counts = useMemo(() => {
    const allItems = foods.length;
    const dueToday = foods.filter(
      (food) => food.expDate && isToday(food.expDate)
    ).length;
    const upcoming = foods.filter(
      (food) => food.expDate && isUpcomingSoon(food.expDate)
    ).length;
    const expired = foods.filter(
      (food) => food.expDate && isExpired(food.expDate)
    ).length;

    const fridgeCount = foods.filter((food) => isFridge(food.view)).length;
    const pantryCount = foods.filter((food) => isPantry(food.view)).length;
    const freezerCount = foods.filter((food) => isFreezer(food.view)).length;

    return {
      allItems,
      dueToday,
      upcoming,
      expired,
      fridgeCount,
      pantryCount,
      freezerCount,
    };
  }, [foods]);

  //calculate items in fridge, pantry or freezer

  return {
    foods,
    saveFoods,
    loadFoods,
    deleteFood,
    sortFoods,
    handleEdit,
    counts,
  };
}
