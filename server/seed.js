import mongoose from 'mongoose';
import dotenv from 'dotenv';

import { User } from './models/User.js';
import { Product } from './models/Product.js';
import { Order } from './models/Order.js';
import { Message } from './models/Message.js';
import { CarouselSlide } from './models/CarouselSlide.js';
import { Wishlist } from './models/Wishlist.js';

dotenv.config();

const DEFAULT_USERS = [
  { id: 'admin-001', name: 'Admin User', email: 'admin@dawai.com', phone: '+880 1711 000000', role: 'admin', joinedAt: '2024-01-01', address: 'DawaiGhor HQ, Dhaka', isActive: true },
  { id: 'user-001', name: 'Rahim Uddin', email: 'rahim@example.com', phone: '+880 1712 123456', role: 'user', joinedAt: '2024-06-15', address: 'Mirpur, Dhaka', isActive: true },
  { id: 'user-002', name: 'Fatema Begum', email: 'fatema@example.com', phone: '+880 1713 234567', role: 'user', joinedAt: '2024-08-22', address: 'Gulshan, Dhaka', isActive: true },
  { id: 'user-003', name: 'Karim Ahmed', email: 'karim@example.com', phone: '+880 1714 345678', role: 'user', joinedAt: '2024-10-05', address: 'Dhanmondi, Dhaka', isActive: false },
  { id: 'user-004', name: 'Nasrin Khatun', email: 'nasrin@example.com', phone: '+880 1715 456789', role: 'user', joinedAt: '2024-11-18', address: 'Uttara, Dhaka', isActive: true },
  { id: 'user-005', name: 'Shahin Alam', email: 'shahin@example.com', phone: '+880 1716 567890', role: 'user', joinedAt: '2025-01-10', address: 'Mohammadpur, Dhaka', isActive: true },
  { id: 'user-006', name: 'Roksana Parvin', email: 'roksana@example.com', phone: '+880 1717 678901', role: 'user', joinedAt: '2025-02-20', address: 'Wari, Dhaka', isActive: true },
];

const DEFAULT_ORDERS = [
  { id: 'ORD-2025-001', userId: 'user-001', userName: 'Rahim Uddin', userEmail: 'rahim@example.com', items: [], subtotal: 25.50, shipping: 5.99, total: 31.49, status: 'delivered', createdAt: '2025-03-15', address: 'Mirpur, Dhaka', paymentMethod: 'Cash on Delivery' },
  { id: 'ORD-2025-002', userId: 'user-002', userName: 'Fatema Begum', userEmail: 'fatema@example.com', items: [], subtotal: 45.00, shipping: 0, total: 45.00, status: 'shipped', createdAt: '2025-04-01', address: 'Gulshan, Dhaka', paymentMethod: 'Mobile Banking' },
  { id: 'ORD-2025-003', userId: 'user-003', userName: 'Karim Ahmed', userEmail: 'karim@example.com', items: [], subtotal: 12.99, shipping: 5.99, total: 18.98, status: 'processing', createdAt: '2025-04-10', address: 'Dhanmondi, Dhaka', paymentMethod: 'Cash on Delivery' },
  { id: 'ORD-2025-004', userId: 'user-004', userName: 'Nasrin Khatun', userEmail: 'nasrin@example.com', items: [], subtotal: 68.50, shipping: 0, total: 68.50, status: 'pending', createdAt: '2025-04-18', address: 'Uttara, Dhaka', paymentMethod: 'Mobile Banking' },
  { id: 'ORD-2025-005', userId: 'user-005', userName: 'Shahin Alam', userEmail: 'shahin@example.com', items: [], subtotal: 33.00, shipping: 5.99, total: 38.99, status: 'cancelled', createdAt: '2025-04-19', address: 'Mohammadpur, Dhaka', paymentMethod: 'Cash on Delivery' },
  { id: 'ORD-2025-006', userId: 'user-006', userName: 'Roksana Parvin', userEmail: 'roksana@example.com', items: [], subtotal: 52.00, shipping: 0, total: 52.00, status: 'delivered', createdAt: '2025-04-12', address: 'Wari, Dhaka', paymentMethod: 'Mobile Banking' },
];

const DEFAULT_MESSAGES = [
  { id: 'msg-001', name: 'Rahim Uddin', email: 'rahim@example.com', subject: 'Question about prescription medicines', content: 'I need to know if I can get Amoxicillin without a prescription. My doctor recommended it but I lost the prescription slip. Can you help me?', createdAt: '2025-04-15', read: true, replied: true },
  { id: 'msg-002', name: 'Fatema Begum', email: 'fatema@example.com', subject: 'Delivery issue with my order', content: 'My order ORD-2025-002 has been showing "shipped" status for 3 days now. When will it arrive? I need the medicines urgently. Please help!', createdAt: '2025-04-17', read: true, replied: false },
  { id: 'msg-003', name: 'Mohammad Ali', email: 'malikhbd@gmail.com', subject: 'Request to add new medicine to catalog', content: 'Can you please add Pantoprazole 40mg to your product catalog? Many customers including myself need it for gastric issues. It would be very helpful.', createdAt: '2025-04-18', read: false, replied: false },
  { id: 'msg-004', name: 'Nasrin Khatun', email: 'nasrin@example.com', subject: 'Excellent AI chatbot experience!', content: 'The AI doctor chatbot is absolutely amazing! It helped me identify my symptoms and recommended the right medicine. Keep up the great work, DawaiGhor team!', createdAt: '2025-04-19', read: false, replied: false },
];

const DEFAULT_CAROUSEL = [
  { id: 'slide-001', title: 'Your Health, Just a Click Away', subtitle: 'Get instant medical advice from our AI Doctor and order 100% authentic medicines.', image: '/images/hero_ai_health.png', badge: 'Premium Care', ctaText: 'Consult AI Doctor', ctaLink: '/ai-doctor', active: true, order: 0 },
  { id: 'slide-002', title: 'Fast Doorstep Delivery', subtitle: 'Get your medicines delivered directly to your home within 24-48 hours.', image: '/images/hero_delivery.png', badge: 'Quick Delivery', ctaText: 'Shop Now', ctaLink: '/products', active: true, order: 1 },
  { id: 'slide-003', title: '100% Authentic Medicines', subtitle: 'All products are verified and sourced directly from reputable manufacturers.', image: '/images/hero_authentic.png', badge: 'Trusted Quality', ctaText: 'Browse Products', ctaLink: '/products', active: true, order: 2 },
];

const MOCK_PRODUCTS = [
  {
    id: 'prod-001',
    name: 'Napa Extend 665mg',
    price: 1.5,
    originalPrice: 2.0,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=60',
    category: 'OTC',
    description: 'Napa Extend is used for the treatment of mild to moderate pain and fever.',
    brand: 'Beximco',
    stock: 100,
    rating: 4.8,
    reviewCount: 125,
    dosage: '665mg',
    activeIngredient: 'Paracetamol',
    requiresPrescription: false,
    inStock: true,
    tags: ['painkiller', 'fever']
  },
  {
    id: 'prod-002',
    name: 'Seclo 20mg',
    price: 5.0,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=60',
    category: 'Prescription',
    description: 'Used for treating stomach ulcers and acid reflux.',
    brand: 'Square',
    stock: 50,
    rating: 4.5,
    reviewCount: 89,
    dosage: '20mg',
    activeIngredient: 'Omeprazole',
    requiresPrescription: true,
    inStock: true,
    tags: ['gastric', 'ulcer']
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    console.log('Clearing old data...');
    await User.deleteMany({});
    await Order.deleteMany({});
    await Message.deleteMany({});
    await CarouselSlide.deleteMany({});
    await Product.deleteMany({});
    await Wishlist.deleteMany({});

    console.log('Inserting default data...');
    await User.insertMany(DEFAULT_USERS);
    await Order.insertMany(DEFAULT_ORDERS);
    await Message.insertMany(DEFAULT_MESSAGES);
    await CarouselSlide.insertMany(DEFAULT_CAROUSEL);
    await Product.insertMany(MOCK_PRODUCTS);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
