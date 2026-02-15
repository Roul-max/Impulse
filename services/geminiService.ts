import { GoogleGenAI } from "@google/genai";
import { MOCK_PRODUCTS } from "../constants";

let ai: GoogleGenAI | null = null;

if (process.env.API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
}

export const GeminiService = {
  async chat(message: string): Promise<string> {
    if (!ai) {
      return "AI is not configured properly.";
    }

    try {
      console.time("GeminiResponse");

      const lowerMessage = message.toLowerCase();
      let productContext = "";

      // Only include product info if user asks for recommendation
      if (
        lowerMessage.includes("recommend") ||
        lowerMessage.includes("suggest") ||
        lowerMessage.includes("buy") ||
        lowerMessage.includes("best")
      ) {
        const simplifiedProducts = MOCK_PRODUCTS.slice(0, 5).map((p) => ({
          name: p.name,
          price: p.price,
        }));

        productContext = `
Available products (sample):
${JSON.stringify(simplifiedProducts)}
`;
      }

      const systemPrompt = `
You are 'Impulse AI', a smart shopping assistant.
All prices are in INR (₹).
Be concise, friendly, and helpful.

${productContext}
`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: message,
        config: {
          systemInstruction: systemPrompt,
          thinkingConfig: { thinkingBudget: 0 },
        },
      });

      console.timeEnd("GeminiResponse");

      return response.text || "I'm unable to respond right now.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "AI service temporarily unavailable.";
    }
  },
};
