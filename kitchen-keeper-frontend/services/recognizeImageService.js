import { API_BASE_URL } from "../utils/config";
import categoriesJSON from "../assets/data/categories.json";

//uploads a phto to the backend for ai food recognition
//returns an array of items like: [{name: "apple", category: "fruit"}, {name: "banana", category: "fruit"}]

export async function recognizeImage(asset) {
  const form = new FormData();
  form.append("photo", {
    uri: asset.uri,
    type: "image/jpeg",
    name: "photo.jpg",
  });
  form.append("categories", JSON.stringify(Object.keys(categoriesJSON)));

  const response = await fetch(`${API_BASE_URL}/vision/recognize-image`, {
    method: "POST",
    body: form,
  });

  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`);
  }
  const data = await response.json();
  return data;
}
