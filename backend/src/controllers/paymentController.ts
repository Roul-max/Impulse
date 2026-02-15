import { Request, Response } from 'express';
import asyncHandler from '../middleware/asyncHandler';
import razorpay from '../config/razorpay';
import { Order } from '../models/Order';
import { Payment } from '../models/Payment';
import paymentService from '../services/paymentService';
import crypto from 'crypto';

// @desc    Create Razorpay Order
// @route   POST /api/payments/create-order
// @access  Private
const createPaymentOrder = asyncHandler(async (req: any, res: any) => {
  const { orderId } = req.body;
  const order = await Order.findById(orderId);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Ensure user owns the order
  if (req.user?.role !== 'admin' && order.user.toString() !== req.user?._id.toString()) {
      res.status(401);
      throw new Error('Not authorized');
  }

  const options = {
    amount: Math.round(order.totalPrice * 100), 
    currency: 'INR',
    receipt: order._id.toString(),
    payment_capture: 1 
  };

  try {
    const razorpayOrder = await razorpay.orders.create(options);
    
    // Create initial payment record
    await Payment.create({
        order: orderId,
        user: req.user?._id,
        razorpayOrderId: razorpayOrder.id,
        amount: order.totalPrice,
        currency: 'INR',
        status: 'created'
    });

    res.json({
      id: razorpayOrder.id,
      currency: razorpayOrder.currency,
      amount: razorpayOrder.amount,
      orderId: order._id,
      key: process.env.RAZORPAY_KEY_ID // Send key to frontend safely
    });
  } catch (error: any) {
    res.status(500);
    throw new Error('Payment gateway error');
  }
});

// @desc    Verify Payment Signature (Frontend Call)
// @route   POST /api/payments/verify
// @access  Private
const verifyPayment = asyncHandler(async (req: any, res: any) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body.toString())
    .digest('hex');

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // Logic duplicated in Webhook, but this provides immediate UI feedback
    const order = await Order.findById(orderId);
    if (order) {
      order.isPaid = true;
      order.paidAt = new Date();
      order.paymentResult = {
        id: razorpay_payment_id,
        status: 'captured',
        email_address: req.user?.email || '',
      };
      await order.save();
    }

    await Payment.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { 
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
            status: 'captured'
        }
    );

    res.json({ message: 'Payment verified successfully' });
  } else {
    res.status(400);
    throw new Error('Invalid payment signature');
  }
});

// @desc    Handle Razorpay Webhook
// @route   POST /api/payments/webhook
// @access  Public (Signature Verified)
const webhook = asyncHandler(async (req: any, res: any) => {
    const signature = req.headers['x-razorpay-signature'] as string;
    const body = JSON.stringify(req.body);

    if (!paymentService.verifySignature(body, signature)) {
        res.status(400).json({ message: 'Invalid signature' });
        return;
    }

    // Process asynchronously to return 200 OK fast to Razorpay
    paymentService.handleWebhook(req.body).catch(err => console.error(err));

    res.json({ status: 'ok' });
});

export { createPaymentOrder, verifyPayment, webhook };