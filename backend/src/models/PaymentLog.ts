import mongoose, { Schema, Document } from 'mongoose';

export interface IPaymentLog extends Document {
  paymentId: string;
  orderId?: string;
  event: string;
  status: string;
  payload: any;
  processedAt: Date;
}

const PaymentLogSchema: Schema = new Schema({
  paymentId: { type: String, required: true, unique: true, index: true },
  orderId: { type: String, index: true },
  event: { type: String, required: true },
  status: { type: String, required: true },
  payload: { type: Object },
  processedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  expireAfterSeconds: 60 * 60 * 24 * 30 // Auto-delete logs after 30 days
});

export const PaymentLog = mongoose.model<IPaymentLog>('PaymentLog', PaymentLogSchema);