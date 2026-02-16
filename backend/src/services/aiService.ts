import { GoogleGenAI } from "@google/genai";
import { Product } from "../models/Product";

class AiService {
  private ai: GoogleGenAI | null = null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;

    // 🔎 Debug environment variable (safe)
    if (apiKey) {
      console.log("[AI] GEMINI_API_KEY detected");
      console.log("[AI] Key starts with:", apiKey.substring(0, 6)); // partial only

      this.ai = new GoogleGenAI({ apiKey });
      console.log("[AI] Gemini initialized successfully");
    } else {
      console.log("[AI] No GEMINI_API_KEY provided");
    }
  }

  async getRecommendation(userQuery: string): Promise<string> {
    if (!this.ai) {
      return "AI is currently unavailable.";
    }

    try {
      console.time("GeminiResponse");

      const lowerQuery = userQuery.toLowerCase();
      let productContext = "";

      // Only fetch products if recommendation intent detected
      if (
        lowerQuery.includes("recommend") ||
        lowerQuery.includes("suggest") ||
        lowerQuery.includes("best") ||
        lowerQuery.includes("buy")
      ) {
        const products = await Product.find({ isActive: true })
          .select("name price")
          .limit(5);

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

      const response = await this.ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: userQuery,
        config: {
          systemInstruction,
        },
      });

      console.timeEnd("GeminiResponse");

      return response.text || "No response generated.";
    } catch (error: any) {
      console.timeEnd("GeminiResponse");

      console.error("🚨 FULL GEMINI ERROR:");
      console.error(error);
      console.error("Error message:", error?.message);
      console.error("Error stack:", error?.stack);

      return "AI Service temporarily unavailable.";
    }
  }
}

export default new AiService();
