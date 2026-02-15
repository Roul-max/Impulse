import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  parent?: mongoose.Types.ObjectId;
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  description: { type: String },
  image: { type: String },
  isActive: { type: Boolean, default: true },
  parent: { type: Schema.Types.ObjectId, ref: 'Category', default: null }
}, {
  timestamps: true
});


export const Category = mongoose.model<ICategory>('Category', CategorySchema);