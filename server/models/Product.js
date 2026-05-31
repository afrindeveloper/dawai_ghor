import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
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
  tags: [{ type: String }]
});

export const Product = mongoose.model('Product', productSchema);
