import mongoose from 'mongoose';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { Cart } from '../models/Cart';
import logger from '../utils/logger';

interface CreateOrderParams {
  userId: string;
  shippingAddress: any;
  paymentMethod: string;
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
}

class OrderService {
  /**
   * Creates an order transactionally.
   * Performs atomic stock deduction (Module 1).
   */
  async createOrder(params: CreateOrderParams) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. Fetch Cart
      const cart = await Cart.findOne({ user: params.userId }).populate('items.product');
      if (!cart || cart.items.length === 0) {
        throw new Error('No order items found in cart');
      }

      const orderItems = [];

      // 2. Atomic Stock Deduction (Critical Fix)
      for (const item of cart.items) {
        const product: any = item.product;

        if (!product) throw new Error('Product not found');

        // Module 1: Fix Inventory Race Condition
        // Find AND Update atomically. If stock < quantity, this returns null.
        const updatedProduct = await Product.findOneAndUpdate(
          { 
            _id: product._id, 
            stock: { $gte: item.quantity } // Condition: Stock must be sufficient
          },
          { 
            $inc: { stock: -item.quantity } // Atomic decrement
          },
          { session, new: true }
        );

        if (!updatedProduct) {
          throw new Error(`Insufficient stock for ${product.name}. Transaction aborted.`);
        }

        orderItems.push({
          product: product._id,
          name: product.name,
          image: product.images?.[0] || '',
          price: product.price, // Mongoose handles Decimal128 conversion
          quantity: item.quantity,
          variant: item.variant
        });
      }

      // 3. Create Order
      const order = new Order({
        orderItems,
        user: params.userId,
        shippingAddress: params.shippingAddress,
        paymentMethod: params.paymentMethod,
        itemsPrice: params.itemsPrice,
        taxPrice: params.taxPrice,
        shippingPrice: params.shippingPrice,
        totalPrice: params.totalPrice
      });

      const createdOrder = await order.save({ session });

      // 4. Clear Cart
      cart.items = [];
      await cart.save({ session });

      await session.commitTransaction();
      return createdOrder;

    } catch (error) {
      await session.abortTransaction();
      logger.error(`[OrderService] Transaction failed: ${(error as Error).message}`);
      throw error;
    } finally {
      session.endSession();
    }
  }
}

export default new OrderService();