import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  isVerifiedPurchase: boolean;
}

const ReviewSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  isVerifiedPurchase: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Prevent multiple reviews from same user on same product
ReviewSchema.index({ user: 1, product: 1 }, { unique: true });

ReviewSchema.post('save', async function() {
  if (process.env.NODE_ENV === 'development') console.log(`[Review] New review added for product ${this.product}`);
  // Logic to update Product averageRating would typically go here or in a service
});

export const Review = mongoose.model<IReview>('Review', ReviewSchema);