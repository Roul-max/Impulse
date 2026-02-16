import { GoogleGenAI } from "@google/genai";
import logger from "../utils/logger";
import { Product } from "../models/Product";

class AiService {
  private ai: GoogleGenAI | null = null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      this.ai = new GoogleGenAI({ apiKey });
      logger.info("[AI] Gemini initialized successfully");
    } else {
      logger.warn("[AI] No GEMINI_API_KEY provided");
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
          .select("name price") // reduce fields
          .limit(5); // reduce from 20 to 5

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
          thinkingConfig: { thinkingBudget: 0 },
        },
      });

      console.timeEnd("GeminiResponse");

      return response.text || "No response generated.";
    } catch (error: any) {
      logger.error(`[AI] Error: ${error.message}`);
      return "AI Service temporarily unavailable.";
    }
  }
}

export default new AiService();
