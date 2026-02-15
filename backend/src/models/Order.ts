import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string;
  image: string;
  price: number;
  quantity: number;
  variant?: {
    size?: string;
    color?: string;
  };
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  orderItems: IOrderItem[];
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phoneNumber: string;
  };
  paymentMethod: 'RAZORPAY' | 'COD';
  paymentResult?: {
    id: string;
    status: string;
    email_address: string;
  };
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: Date;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  deliveredAt?: Date;
  createdAt: Date;
}

const OrderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  // Snapshot price in Decimal128
  price: { type: Schema.Types.Decimal128, required: true, get: (v: any) => parseFloat(v.toString()) }, 
  quantity: { type: Number, required: true, min: 1 },
  variant: {
    size: String,
    color: String
  }
}, { _id: false });

const OrderSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  orderItems: [OrderItemSchema],
  shippingAddress: {
    fullName: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    phoneNumber: { type: String, required: true },
  },
  paymentMethod: { type: String, enum: ['RAZORPAY', 'COD'], required: true },
  paymentResult: {
    id: String,
    status: String,
    email_address: String,
  },
  // Financial fields using Decimal128
  itemsPrice: { type: Schema.Types.Decimal128, required: true, default: 0.0, get: (v: any) => parseFloat(v.toString()) },
  taxPrice: { type: Schema.Types.Decimal128, required: true, default: 0.0, get: (v: any) => parseFloat(v.toString()) },
  shippingPrice: { type: Schema.Types.Decimal128, required: true, default: 0.0, get: (v: any) => parseFloat(v.toString()) },
  totalPrice: { type: Schema.Types.Decimal128, required: true, default: 0.0, get: (v: any) => parseFloat(v.toString()) },
  
  isPaid: { type: Boolean, required: true, default: false },
  paidAt: { type: Date },
  status: { 
    type: String, 
    enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'], 
    default: 'PENDING',
    index: true 
  },
  deliveredAt: { type: Date },
}, {
  timestamps: true,
  toJSON: { getters: true },
  toObject: { getters: true }
});

// Module 5: Compound Index for "My Orders" queries
OrderSchema.index({ user: 1, createdAt: -1 });

export const Order = mongoose.model<IOrder>('Order', OrderSchema);