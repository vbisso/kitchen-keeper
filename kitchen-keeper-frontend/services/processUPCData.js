import axios from "axios";
import Constants from "expo-constants";
import { extractFoodData } from "../utils/extractFoodData";

const apiKey =
  process.env.OPENAI_API_KEY ||
  (typeof Constants !== "undefined"
    ? Constants.expoConfig?.extra?.OPENAI_API_KEY
    : null);

export const processUPCResponse = async (upcData, categories) => {
  try {
    const title = upcData.title || "Unknown item";
    const description = upcData.description || "";
    const brand = upcData.brand || "";
    const categoryInfo = upcData.category || "";
    const size = upcData.size || "";
    const weight = upcData.weight || "";

    const guidance = `
You are a food data enrichment assistant. 
Your task is to clean and enrich a product entry using the given UPC data and output ONLY valid JSON (no code fences, no text before or after).

### Input fields:
- title: ${title}
- description: ${description}
- brand: ${brand}
- category: ${categoryInfo}
- size: ${size}
- weight: ${weight}

### Instructions:
1. Parse what the product actually is (the food or beverage name). Keep it singular and simple, e.g., "milk", "banana", "energy drink", "butter".
2. Extract and normalize:
   - **name**: short, descriptive item name (include type if relevant, e.g., "salted butter", "chocolate milk").
   - **quantity**: numeric quantity (e.g., 1, 2, 12). 
     If it's a pack or bottle count, include that number; otherwise default to 1.
   - **unit**: measurement unit (e.g., g, kg, oz, lb, ml, L, can, bottle, pack, unit, slice, piece).
   - **category**: ${
     categories?.length
       ? `choose ONE from this list: [${categories.join(", ")}]`
       : "short food category like Dairy, Produce, Meat, Bakery, Pantry, Frozen, Beverages, Other"
   }.
   - expDate: YYYY-MM-DD estimated shelf-life for typical storage (assume fridge if ambiguous). Be conservative.


### Example JSON:
{
  "name": "salted butter",
  "quantity": 1,
  "unit": "unit",
  "category": "Dairy",
  "expDate": "2025-10-25"
}

Now return ONLY valid JSON for this product.
`;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        temperature: 0.2,
        messages: [{ role: "user", content: guidance }],
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const text = response.data.choices?.[0]?.message?.content?.trim() || "{}";

    let result;
    try {
      result = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      result = match ? JSON.parse(match[0]) : {};
    }

    console.log("ChatGPT result:", result);
    return result;
  } catch (err) {
    console.warn("ChatGPT failed — using local fallback:", err.message);
    return extractFoodData(upcData); // fallback parser
  }
};
