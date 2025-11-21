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
  const [counts, setCounts] = useState({
    allItems: 0,
    dueToday: 0,
    upcoming: 0,
    expired: 0,
    fridgeCount: 0,
    pantryCount: 0,
    freezerCount: 0,
  });

  useEffect(() => {
    loadFoods();
  }, []);

  useEffect(() => {
    setFoods((prevFoods) => sortFoods([...prevFoods], sortBy));
  }, [sortBy]);

  useEffect(() => {}, [foods]);

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

      const sorted = sortFoods(parsedFoods, sortBy);
      setFoods(sorted);
      updateCounts(sorted);
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

  const markItemConsumed = async (id) => {
    try {
      const token = await getToken();
      const res = await fetch(`${API}/foods/${id}/consume`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        // Refresh the list
        await loadFoods();
        console.log("Item marked as consumed:", res);
      } else {
        console.error("Error marking item as consumed:", res);
      }
    } catch (err) {
      console.error("Error marking item as consumed:", err);
    }
  };

  const markItemWasted = async (id) => {
    try {
      const token = await getToken();
      const res = await fetch(`${API}/foods/${id}/waste`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        // Refresh the list
        await loadFoods();
      } else {
        console.error("Error marking item as consumed:", res.statusText);
      }
    } catch (err) {
      console.error("Error marking item as consumed:", err);
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

  const updateCounts = (foodsList) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isToday = (date) =>
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    const isUpcomingSoon = (date) => {
      const sevenDays = new Date(today);
      sevenDays.setDate(today.getDate() + 7);
      return date > today && date <= sevenDays;
    };

    const isExpired = (date) => date < today;

    const newCounts = {
      allItems: foodsList.length,
      dueToday: foodsList.filter((f) => f.expDate && isToday(f.expDate)).length,
      upcoming: foodsList.filter((f) => f.expDate && isUpcomingSoon(f.expDate))
        .length,
      expired: foodsList.filter((f) => f.expDate && isExpired(f.expDate))
        .length,
      fridgeCount: foodsList.filter((f) => f.view === "Fridge").length,
      pantryCount: foodsList.filter((f) => f.view === "Pantry").length,
      freezerCount: foodsList.filter((f) => f.view === "Freezer").length,
    };

    // console.log("Counts updated:", newCounts);

    setCounts(newCounts);
  };

  const daysUntilExpiration = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = date - today;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const filterFoodsByType = (foods, filterType) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sevenDays = new Date(today);
    sevenDays.setDate(today.getDate() + 7);

    return foods.filter((f) => {
      if (filterType === "all") return true;
      if (filterType === "dueToday")
        return (
          f.expDate &&
          new Date(f.expDate).toDateString() === today.toDateString()
        );
      if (filterType === "upcoming")
        return (
          f.expDate &&
          new Date(f.expDate) > today &&
          new Date(f.expDate) <= sevenDays
        );
      if (filterType === "expired")
        return f.expDate && new Date(f.expDate) < today;
      if (filterType === "Fridge") return f.view === "Fridge";
      if (filterType === "Pantry") return f.view === "Pantry";
      if (filterType === "Freezer") return f.view === "Freezer";
      return true;
    });
  };

  return {
    foods,
    saveFoods,
    loadFoods,
    deleteFood,
    markItemConsumed,
    markItemWasted,
    sortFoods,
    handleEdit,
    counts,
    filterFoodsByType,
    daysUntilExpiration,
  };
}
