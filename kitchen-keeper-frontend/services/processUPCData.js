import { extractFoodData } from "../utils/extractFoodData";
import axios from "axios";
import Constants from "expo-constants";

let lastUPC = null;

const apiKey =
  process.env.OPENAI_API_KEY ||
  (typeof Constants !== "undefined"
    ? Constants.expoConfig?.extra?.OPENAI_API_KEY
    : null);

export const processUPCResponse = async (upcData, categories) => {
  try {
    if (lastUPC === upcData.upc) {
      return;
    }

    lastUPC = upcData.upc;

    const prompt = `Clean this UPC data and extract:
- name (include what the item is e.g. Milk, Chicken, Apples)
- matching category from [${categories.join(", ")}]
- quantity and unit (e.g. oz, lb, g, ml)
- Give me an approximate expiration date in YYYY-MM-DD format based on the type of item

Here is the data:
${JSON.stringify(upcData)}`;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = JSON.parse(response.data.choices[0].message.content);
    console.log("ChatGPT result:", result);
    return result;
  } catch (err) {
    console.warn(
      "⚠️ ChatGPT failed — falling back to local parser:",
      err.message
    );
    return extractFoodData(upcData); // fallback
  }
};
export const resetLastUPC = () => {
  lastUPC = null;
};
