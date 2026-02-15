import mongoose, { Schema, Document } from 'mongoose';

export interface IAddress extends Document {
  user: mongoose.Types.ObjectId;
  fullName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phoneNumber: string;
  isDefault: boolean;
  type: 'HOME' | 'WORK' | 'OTHER';
}

const AddressSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  fullName: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true, default: 'India' },
  phoneNumber: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
  type: { type: String, enum: ['HOME', 'WORK', 'OTHER'], default: 'HOME' }
}, {
  timestamps: true
});

// Ensure only one default address per user
AddressSchema.pre('save', async function() {
  if (this.isDefault) {
    if (process.env.NODE_ENV === 'development') console.log(`[Address] Setting default address for user ${this.user}`);
    await mongoose.model('Address').updateMany(
      { user: this.user, _id: { $ne: this._id } },
      { $set: { isDefault: false } }
    );
  }
});

export const Address = mongoose.model<IAddress>('Address', AddressSchema);