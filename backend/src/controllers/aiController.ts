import asyncHandler from '../middleware/asyncHandler';
import aiService from '../services/aiService';

// @desc    Get AI Chat Recommendation
// @route   POST /api/ai/chat
// @access  Public (Rate limited)
const getRecommendation = asyncHandler(async (req: any, res: any) => {
  console.log("📥 Incoming AI Request Body:", req.body);

  const { message } = req.body;

  if (!message) {
    console.log("❌ No message provided in request");
    res.status(400);
    throw new Error("Message is required");
  }

  console.log("🧠 Message sent to AI Service:", message);

  const response = await aiService.getRecommendation(message);

  console.log("🤖 AI Service Response:", response);

  res.json({ text: response });
});

export { getRecommendation };
