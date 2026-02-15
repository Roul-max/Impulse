import mongoose, { Schema, Document } from 'mongoose';
import './Category';

export interface IVariant {
  size?: string;
  color?: string;
  sku: string;
  additionalPrice: number;
  stock: number;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  discountedPrice?: number;
  stock: number;
  category: mongoose.Types.ObjectId;
  images: string[];
  variants: IVariant[];
  averageRating: number;
  totalReviews: number;
  features: string[];
  isActive: boolean;
  tags: string[];
}

const VariantSchema = new Schema({
  size: { type: String },
  color: { type: String },
  sku: { type: String, required: true },

  additionalPrice: {
    type: Schema.Types.Decimal128,
    default: 0
  },

  stock: {
    type: Number,
    required: true,
    min: 0,
    validate: Number.isInteger
  }
});

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },

    // 🔥 Store money as Decimal128 (safe for ecommerce)
    price: {
      type: Schema.Types.Decimal128,
      required: true,
      min: 0
    },

    discountedPrice: {
      type: Schema.Types.Decimal128,
      min: 0
    },

    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
      validate: Number.isInteger
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true
    },

    images: [{ type: String, required: true }],
    variants: [VariantSchema],

    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },

    features: [{ type: String }],
    isActive: { type: Boolean, default: true },
    tags: [{ type: String }]
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true }
  }
);


//
// 🔥 CRITICAL FIX: Convert Decimal128 → number before sending to frontend
//
ProductSchema.set('toJSON', {
  getters: true,
  transform: (_doc, ret: any) => {
    if (ret.price instanceof mongoose.Types.Decimal128) {
      ret.price = parseFloat(ret.price.toString());
    }

    if (ret.discountedPrice instanceof mongoose.Types.Decimal128) {
      ret.discountedPrice = parseFloat(ret.discountedPrice.toString());
    }

    if (ret.variants && Array.isArray(ret.variants)) {
      ret.variants = ret.variants.map((variant: any) => {
        if (variant.additionalPrice instanceof mongoose.Types.Decimal128) {
          variant.additionalPrice = parseFloat(
            variant.additionalPrice.toString()
          );
        }
        return variant;
      });
    }

    return ret;
  }
});


// 🚀 Performance Indexes
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });
ProductSchema.index({ category: 1, price: 1 });
ProductSchema.index({ isActive: 1, stock: 1 });

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
