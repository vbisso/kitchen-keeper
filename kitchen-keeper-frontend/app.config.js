import "dotenv/config";

export default {
  expo: {
    name: "kitchen-keeper",
    slug: "kitchen-keeper",
    version: "1.0.0",
    extra: {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      apiBaseUrl: process.env.API_BASE_URL,
    },
  },
};
