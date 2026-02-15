import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import asyncHandler from '../middleware/asyncHandler';
import orderService from '../services/orderService';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import mongoose from 'mongoose';

// Utility: Convert Decimal128 fields safely
const cleanOrder = (order: any) => {
  const obj = order.toObject({ getters: true });

  obj.orderItems = obj.orderItems.map((item: any) => ({
    ...item,
    price: Number(item.price)
  }));

  obj.itemsPrice = Number(obj.itemsPrice);
  obj.taxPrice = Number(obj.taxPrice);
  obj.shippingPrice = Number(obj.shippingPrice);
  obj.totalPrice = Number(obj.totalPrice);

  return obj;
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req: any, res: any) => {
  const order = await orderService.createOrder({
    userId: req.user._id,
    ...req.body
  });

  res.status(201).json(cleanOrder(order));
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req: any, res: any) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (
    req.user?.role !== 'admin' &&
    order.user._id.toString() !== req.user?._id.toString()
  ) {
    res.status(401);
    throw new Error('Not authorized to view this order');
  }

  res.json(cleanOrder(order));
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req: any, res: any) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.status = status;

  if (status === 'DELIVERED') {
    order.deliveredAt = new Date();
  }

  const updatedOrder = await order.save();
  res.json(cleanOrder(updatedOrder));
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req: any, res: any) => {
  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 });

  const cleanedOrders = orders.map(cleanOrder);

  res.json(cleanedOrders);
});

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req: any, res: any) => {
  const pageSize = 20;
  const page = Number(req.query.pageNumber) || 1;

  const count = await Order.countDocuments({});

  const orders = await Order.find({})
    .populate('user', 'id name')
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  const cleanedOrders = orders.map(cleanOrder);

  res.json({
    orders: cleanedOrders,
    page,
    pages: Math.ceil(count / pageSize)
  });
});

// @desc    Cancel Order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = asyncHandler(async (req: any, res: any) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (
    req.user?.role !== 'admin' &&
    order.user.toString() !== req.user?._id.toString()
  ) {
    res.status(401);
    throw new Error('Not authorized');
  }

  if (order.status !== 'PENDING' && order.status !== 'PROCESSING') {
    res.status(400);
    throw new Error('Cannot cancel order in current status');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    order.status = 'CANCELLED';
    await order.save({ session });

    // Restore stock
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } },
        { session }
      );
    }

    await session.commitTransaction();

    res.json({
      message: 'Order cancelled successfully',
      order: cleanOrder(order)
    });

  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

export {
  addOrderItems,
  getOrderById,
  updateOrderStatus,
  getMyOrders,
  getOrders,
  cancelOrder
};
