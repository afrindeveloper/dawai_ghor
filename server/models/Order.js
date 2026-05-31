import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  image: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  brand: { type: String },
  stock: { type: Number },
  rating: { type: Number },
  reviewCount: { type: Number },
  dosage: { type: String },
  activeIngredient: { type: String },
  requiresPrescription: { type: Boolean },
  inStock: { type: Boolean },
  tags: [{ type: String }],
  quantity: { type: Number, required: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  items: [cartItemSchema],
  subtotal: { type: Number, required: true },
  shipping: { type: Number, required: true },
  total: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], required: true },
  createdAt: { type: String, required: true },
  address: { type: String, required: true },
  paymentMethod: { type: String, required: true }
});

export const Order = mongoose.model('Order', orderSchema);
