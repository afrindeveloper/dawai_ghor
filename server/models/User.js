import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  joinedAt: { type: String, required: true },
  address: { type: String },
  isActive: { type: Boolean, default: true }
});

export const User = mongoose.model('User', userSchema);
