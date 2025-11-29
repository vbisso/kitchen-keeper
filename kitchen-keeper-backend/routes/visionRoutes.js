const express = require("express");
const multer = require("multer");
const OpenAI = require("openai");

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 6 * 1024 * 1024 }, // 6MB max
});

router.post("/recognize-image", upload.single("photo"), async (req, res) => {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded." });
    }

    let categories = [];
    if (req.body?.categories) {
      try {
        categories = JSON.parse(req.body.categories);
      } catch (e) {
        console.warn("Invalid categories JSON:", e.message);
      }
    }

    const sharp = require("sharp");

    //converts heic (iphone) to jpeg
    let processedBuffer = req.file.buffer;
    console.log("Uploaded mimetype:", req.file.mimetype);

    if (
      req.file.mimetype === "image/heic" ||
      req.file.mimetype === "image/png"
    ) {
      processedBuffer = await sharp(req.file.buffer)
        .toFormat("jpeg")
        .jpeg({ quality: 85 })
        .toBuffer();
    }

    //resizes image
    const resizedBuffer = await sharp(processedBuffer)
      .resize({ width: 1024, withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toBuffer();

    const dataUrl = `data:image/jpeg;base64,${resizedBuffer.toString(
      "base64"
    )}`;

    const guidance = `
Identify each distinct grocery/food item in this photo and return ONLY valid JSON (no code fences).
For each item include:
- name: singular common name (e.g., "banana", "milk", "apple")
- quantity: numeric value (how many items or packages)
- unit: unit of measure. (e.g. oz, lb, g, ml, ct, count, pack, fl oz)
- category: ${
      categories?.length
        ? `pick EXACTLY one from this list: [${categories.join(", ")}]`
        : "food category (short, e.g., Dairy, Produce, Meat, Bakery, Pantry, Frozen, Beverages, Other)"
    }
- expDate: YYYY-MM-DD estimated shelf-life for typical storage (assume fridge if ambiguous). Be conservative.

Example JSON:
[
  {"name": "banana", "quantity": 3, "unit": "unit", "category": "Produce", "expDate": "2025-10-15"},
  {"name": "milk", "quantity": 1, "unit": "L", "category": "Dairy", "expDate": "2025-10-20"}
]`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:
            "You extract grocery items from photos and return strict JSON only.",
        },
        {
          role: "user",
          content: [
            { type: "text", text: guidance },
            { type: "image_url", image_url: { url: dataUrl } },
          ],
        },
      ],
    });

    let text = completion.choices?.[0]?.message?.content?.trim() || "[]";
    console.log("Raw model output:", text);

    // Extract JSON
    let items;
    try {
      items = JSON.parse(text);
    } catch {
      const match = text.match(/\[[\s\S]*\]/);
      if (!match) throw new Error("Model did not return valid JSON.");
      items = JSON.parse(match[0]);
    }

    // Normalize data
    const normalized = (Array.isArray(items) ? items : []).map((it) => ({
      name: it.name?.toString()?.trim() || "Unknown item",
      quantity: Number(it.quantity) || 1,
      unit: it.unit?.toString()?.trim() || "unit",
      category: it.category?.toString()?.trim() || "Other",
      expDate: it.expDate?.toString()?.slice(0, 10) || null,
    }));

    res.json({ items: normalized });
  } catch (err) {
    console.error("recognize-image error:", err);
    res.status(500).json({
      error: err.message || "Image recognition failed.",
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
});

module.exports = router;
