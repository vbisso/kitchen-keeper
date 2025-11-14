import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../utils/config";

export default function useUserData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUser = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to load user");

      const json = await res.json();

      setData(json);
      return json;
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (updates) => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${API_BASE_URL}/user/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!res.ok) throw new Error("Update failed");

      const updated = await res.json();
      setData(updated); // update local state too

      return updated;
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return { data, loading, error, loadUser, updateUser };
}
