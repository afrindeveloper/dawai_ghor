import mongoose from 'mongoose';

const carouselSlideSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  image: { type: String, required: true },
  badge: { type: String, required: true },
  ctaText: { type: String, required: true },
  ctaLink: { type: String, required: true },
  active: { type: Boolean, default: true },
  order: { type: Number, required: true }
});

export const CarouselSlide = mongoose.model('CarouselSlide', carouselSlideSchema);
