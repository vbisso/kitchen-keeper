import { API_BASE_URL } from "../utils/config";
import categoriesJSON from "../assets/data/categories.json";

//uploads a phto to the backend for ai food recognition
//returns an array of items like: [{name: "apple", category: "fruit"}, {name: "banana", category: "fruit"}]

export const recognizeImage = async (imageUri) => {
  try {
    const form = new FormData();
    form.append("photo", {
      uri: imageUri,
      name: "photo.jpg",
      type: "image/jpeg",
    });
    form.append("categories", JSON.stringify(Object.keys(categoriesJSON)));

    const response = await fetch(`${API_BASE_URL}/vision/recognize-image`, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: form,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || `HTTP ${response.status}`);
    }
    const data = await response.json();
    return Array.isArray(data.itemss) ? data.items : [];
  } catch (error) {
    console.error("Error recognizing image:", error);
    return [];
  }
};
