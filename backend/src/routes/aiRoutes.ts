import express from 'express';
import { getRecommendation } from '../controllers/aiController';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Strict rate limit for AI to prevent billing abuse
const aiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 20 requests per windowMs
    message: 'Too many AI requests from this IP, please try again later'
});

router.post('/chat', aiLimiter as any, getRecommendation);

export default router;