import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  sessionId: { type: String },
  userId: { type: String }
});

export const Wishlist = mongoose.model('Wishlist', wishlistSchema);
