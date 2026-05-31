import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  id: String,
  name: String,
  price: Number,
  originalPrice: Number,
  image: String,
  category: String,
  description: String,
  brand: String,
  stock: Number,
  rating: Number,
  reviewCount: Number,
  dosage: String,
  activeIngredient: String,
  requiresPrescription: Boolean,
  inStock: Boolean,
  tags: [String],
  quantity: Number
}, { _id: false });

const cartSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  items: [cartItemSchema]
}, { timestamps: true });

export const Cart = mongoose.model('Cart', cartSchema);
