import express from 'express';
import {
  createPaymentOrder,
  verifyPayment,
  webhook
} from '../controllers/paymentController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/create-order').post(protect, createPaymentOrder);
router.route('/verify').post(protect, verifyPayment);
router.route('/webhook').post(webhook); // Public, verified by signature

export default router;