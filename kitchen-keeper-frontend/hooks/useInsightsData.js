import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../utils/config";

export default function useInsightsData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      return token;
    } catch (err) {
      console.error("Error reading token:", err);
      return null;
    }
  };

  const loadInsights = async () => {
    try {
      const token = await getToken();
      const res = await fetch(`${API_BASE_URL}/insights`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const insights = await res.json();
      setData(insights);
    } catch (err) {
      console.error("Error loading insights:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInsights();
  }, []);

  return { data, loading };
}
