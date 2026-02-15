import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  role: 'customer' | 'admin';
  avatar?: string;
  addresses: mongoose.Types.ObjectId[];
  refreshToken?: string;
  isEmailVerified: boolean;
  lastLogin?: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  phoneNumber: { type: String },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  avatar: { type: String },
  addresses: [{ type: Schema.Types.ObjectId, ref: 'Address' }],
  refreshToken: { type: String, select: false },
  isEmailVerified: { type: Boolean, default: false },
  lastLogin: { type: Date }
}, {
  timestamps: true
});

// ❌ Removed this line to fix duplicate index warning
// UserSchema.index({ email: 1 });

UserSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  
  if (process.env.NODE_ENV === 'development')
    console.log(`[User] Hashing password for ${this.email}`);
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password as string, salt);
});

UserSchema.methods.matchPassword = async function(enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema);
