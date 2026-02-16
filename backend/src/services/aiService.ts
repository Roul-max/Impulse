import { GoogleGenAI } from "@google/genai";
import { Product } from "../models/Product";

class AiService {
  private ai: GoogleGenAI | null = null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;

    console.log("🧠 [AI] Initializing AI Service...");

    if (apiKey) {
      console.log("✅ [AI] GEMINI_API_KEY detected");
      console.log("🔑 [AI] Key starts with:", apiKey.substring(0, 6));

      this.ai = new GoogleGenAI({ apiKey });
      console.log("🚀 [AI] Gemini initialized successfully");
    } else {
      console.log("❌ [AI] No GEMINI_API_KEY provided");
    }
  }

  async getRecommendation(userQuery: string): Promise<string> {
    console.log("📥 [AI] Incoming user query:", userQuery);

    if (!this.ai) {
      console.log("⛔ [AI] AI not initialized");
      return "AI is currently unavailable.";
    }

    try {
      console.time("⏳ GeminiResponse");

      const lowerQuery = userQuery.toLowerCase();
      let productContext = "";

      console.log("🔎 [AI] Checking for recommendation intent...");

      if (
        lowerQuery.includes("recommend") ||
        lowerQuery.includes("suggest") ||
        lowerQuery.includes("best") ||
        lowerQuery.includes("buy")
      ) {
        console.log("🛍️ [AI] Recommendation intent detected. Fetching products...");

        const products = await Product.find({ isActive: true })
          .select("name price")
          .limit(5);

        console.log("📦 [AI] Products fetched:", products);

        productContext = `
Available products (sample):
${JSON.stringify(products)}
`;
      }

      const systemInstruction = `
You are an AI assistant for 'Impulse', a modern luxury e-commerce brand.
Currency: INR (₹).
Be concise and professional.

${productContext}
`;

      console.log("🤖 [AI] Using model: gemini-1.5-flash-latest");
      console.log("📡 [AI] Sending request to Gemini...");

      const response = await this.ai.models.generateContent({
        model: "gemini-1.5-flash-latest",
        contents: userQuery,
        config: {
          systemInstruction,
        },
      });

      console.timeEnd("⏳ GeminiResponse");

      console.log("✅ [AI] Raw Gemini response:", response);
      console.log("📝 [AI] Extracted text:", response?.text);

      return response?.text || "No response generated.";
    } catch (error: any) {
      console.timeEnd("⏳ GeminiResponse");

      console.error("🚨 FULL GEMINI ERROR:");
      console.error(error);
      console.error("Error message:", error?.message);
      console.error("Error stack:", error?.stack);

      return "AI Service temporarily unavailable.";
    }
  }
}

export default new AiService();
