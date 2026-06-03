import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { v4 as uuidv4 } from 'uuid';

import { User } from './models/User.js';
import { Product } from './models/Product.js';
import { Order } from './models/Order.js';
import { Message } from './models/Message.js';
import { CarouselSlide } from './models/CarouselSlide.js';
import { Wishlist } from './models/Wishlist.js';
import { Cart } from './models/Cart.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

const cookieOptions = {
  httpOnly: true,
  maxAge: 30 * 24 * 60 * 60 * 1000,
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  secure: process.env.NODE_ENV === 'production'
};

app.use((req, res, next) => {
  const origin = req.headers.origin || '*';
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
app.use(express.json());
app.use(cookieParser());

// Middleware to ensure a session cookie exists
app.use((req, res, next) => {
  if (!req.cookies.sessionId) {
    const newSessionId = uuidv4();
    res.cookie('sessionId', newSessionId, cookieOptions);
    req.sessionId = newSessionId;
  } else {
    req.sessionId = req.cookies.sessionId;
  }
  next();
});

// Users Auth API
app.get('/api/users/me', async (req, res) => {
  if (!req.cookies.userId) return res.json(null);
  const user = await User.findOne({ id: req.cookies.userId });
  res.json(user);
});
app.post('/api/users/logout', (req, res) => {
  res.clearCookie('userId');
  res.json({ success: true });
});
app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@dawai.com' && password === 'admin123') {
    let admin = await User.findOne({ email: 'admin@dawai.com' });
    if(!admin) {
      admin = new User({
        id: 'admin-1',
        name: 'Super Admin',
        email: 'admin@dawai.com',
        phone: '1234567890',
        role: 'admin',
        isActive: true
      });
      await admin.save();
    }
    res.cookie('userId', admin.id, cookieOptions);
    return res.json(admin);
  }
  const user = await User.findOne({ email: { $regex: new RegExp('^' + email + '$', 'i') }, isActive: true, role: 'user' });
  if (user) {
    if (user.password && user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.cookie('userId', user.id, cookieOptions);
    return res.json(user);
  }
  
  if (email && password.length >= 6) {
    const newUser = new User({
      id: `user-${Date.now()}`,
      name: email.split('@')[0],
      email,
      password,
      role: 'user',
      joinedAt: new Date().toISOString().split('T')[0],
      isActive: true,
    });
    await newUser.save();
    res.cookie('userId', newUser.id, cookieOptions);
    return res.json(newUser);
  }
  res.status(401).json({ error: 'Invalid credentials' });
});

// Users API
app.get('/api/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});
app.post('/api/users', async (req, res) => {
  const user = new User(req.body);
  await user.save();
  // Also login if it's registration
  res.cookie('userId', user.id, cookieOptions);
  res.json(user);
});
app.put('/api/users/:id', async (req, res) => {
  const user = await User.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
  res.json(user);
});

// Cart API
app.get('/api/cart', async (req, res) => {
  let cart = await Cart.findOne({ sessionId: req.sessionId });
  if (!cart) cart = await new Cart({ sessionId: req.sessionId, items: [] }).save();
  res.json(cart.items);
});
app.post('/api/cart/add', async (req, res) => {
  const product = req.body;
  let cart = await Cart.findOne({ sessionId: req.sessionId });
  if (!cart) cart = new Cart({ sessionId: req.sessionId, items: [] });
  
  const existing = cart.items.find(i => i.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.items.push({ ...product, quantity: 1 });
  }
  await cart.save();
  res.json(cart.items);
});
app.put('/api/cart/update', async (req, res) => {
  const { id, quantity } = req.body;
  let cart = await Cart.findOne({ sessionId: req.sessionId });
  if (cart) {
    if (quantity <= 0) {
      cart.items = cart.items.filter(i => i.id !== id);
    } else {
      const item = cart.items.find(i => i.id === id);
      if (item) item.quantity = quantity;
    }
    await cart.save();
    res.json(cart.items);
  } else {
    res.json([]);
  }
});
app.delete('/api/cart/remove/:id', async (req, res) => {
  const { id } = req.params;
  let cart = await Cart.findOne({ sessionId: req.sessionId });
  if (cart) {
    cart.items = cart.items.filter(i => i.id !== id);
    await cart.save();
    res.json(cart.items);
  } else {
    res.json([]);
  }
});
app.delete('/api/cart', async (req, res) => {
  let cart = await Cart.findOne({ sessionId: req.sessionId });
  if (cart) {
    cart.items = [];
    await cart.save();
  }
  res.json([]);
});

// Products API
app.get('/api/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});
app.post('/api/products', async (req, res) => {
  const products = req.body;
  if(Array.isArray(products)) {
    await Product.deleteMany({});
    const inserted = await Product.insertMany(products);
    return res.json(inserted);
  }
  const product = new Product(req.body);
  await product.save();
  res.json(product);
});
app.put('/api/products/:id', async (req, res) => {
  const product = await Product.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
  res.json(product);
});

// Orders API
app.get('/api/orders', async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});
app.post('/api/orders', async (req, res) => {
  const order = new Order(req.body);
  await order.save();
  res.json(order);
});
app.put('/api/orders/:id', async (req, res) => {
  const order = await Order.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
  res.json(order);
});

// Messages API
app.get('/api/messages', async (req, res) => {
  const messages = await Message.find().sort({ createdAt: -1 });
  res.json(messages);
});
app.post('/api/messages', async (req, res) => {
  const message = new Message(req.body);
  await message.save();
  res.json(message);
});
app.put('/api/messages/:id', async (req, res) => {
  const message = await Message.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
  res.json(message);
});

// Carousel API
app.get('/api/carousel', async (req, res) => {
  const slides = await CarouselSlide.find().sort({ order: 1 });
  res.json(slides);
});
app.post('/api/carousel', async (req, res) => {
  await CarouselSlide.deleteMany({});
  const inserted = await CarouselSlide.insertMany(req.body);
  res.json(inserted);
});

// Wishlist API
app.get('/api/wishlist', async (req, res) => {
  const query = req.cookies.userId ? { userId: req.cookies.userId } : { sessionId: req.sessionId };
  const items = await Wishlist.find(query);
  res.json(items.map(i => i.productId));
});
app.post('/api/wishlist/toggle', async (req, res) => {
  const { productId } = req.body;
  const query = req.cookies.userId ? { userId: req.cookies.userId, productId } : { sessionId: req.sessionId, productId };
  const existing = await Wishlist.findOne(query);
  if (existing) {
    await Wishlist.deleteOne(query);
    res.json({ added: false });
  } else {
    await new Wishlist({ ...query, productId }).save();
    res.json({ added: true });
  }
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));
