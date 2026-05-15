// Local Storage Utility Functions

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  description: string;
  brand?: string;
  stock?: number;
  rating?: number;
  reviewCount?: number;
  dosage?: string;
  activeIngredient?: string;
  requiresPrescription?: boolean;
  inStock?: boolean;
  tags?: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'user';
  joinedAt: string;
  address?: string;
  isActive: boolean;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  address: string;
  paymentMethod: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  content: string;
  createdAt: string;
  read: boolean;
  replied: boolean;
}

// ─── Cart ────────────────────────────────────────────────────────────────────
export const getCart = (): CartItem[] => {
  try { return JSON.parse(localStorage.getItem('dawaiGhorCart') || '[]'); } catch { return []; }
};
export const saveCart = (cart: CartItem[]): void => {
  localStorage.setItem('dawaiGhorCart', JSON.stringify(cart));
};
export const addToCart = (product: Product): void => {
  const cart = getCart();
  const existing = cart.find(i => i.id === product.id);
  if (existing) existing.quantity += 1;
  else cart.push({ ...product, quantity: 1 });
  saveCart(cart);
};
export const removeFromCart = (id: string): void => saveCart(getCart().filter(i => i.id !== id));
export const updateCartQuantity = (id: string, qty: number): void => {
  if (qty <= 0) return removeFromCart(id);
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (item) { item.quantity = qty; saveCart(cart); }
};
export const clearCart = (): void => localStorage.removeItem('dawaiGhorCart');

// ─── Current User ─────────────────────────────────────────────────────────────
export const getCurrentUser = (): User | null => {
  try { return JSON.parse(localStorage.getItem('dawaiGhorCurrentUser') || 'null'); } catch { return null; }
};
export const getUser = (): User | null => getCurrentUser();
export const saveCurrentUser = (user: User): void =>
  localStorage.setItem('dawaiGhorCurrentUser', JSON.stringify(user));
export const saveUser = (user: User): void => saveCurrentUser(user);
export const logoutUser = (): void => localStorage.removeItem('dawaiGhorCurrentUser');

// ─── All Users ────────────────────────────────────────────────────────────────
const DEFAULT_USERS: User[] = [
  { id: 'admin-001', name: 'Admin User', email: 'admin@dawai.com', phone: '+880 1711 000000', role: 'admin', joinedAt: '2024-01-01', address: 'DawaiGhor HQ, Dhaka', isActive: true },
  { id: 'user-001', name: 'Rahim Uddin', email: 'rahim@example.com', phone: '+880 1712 123456', role: 'user', joinedAt: '2024-06-15', address: 'Mirpur, Dhaka', isActive: true },
  { id: 'user-002', name: 'Fatema Begum', email: 'fatema@example.com', phone: '+880 1713 234567', role: 'user', joinedAt: '2024-08-22', address: 'Gulshan, Dhaka', isActive: true },
  { id: 'user-003', name: 'Karim Ahmed', email: 'karim@example.com', phone: '+880 1714 345678', role: 'user', joinedAt: '2024-10-05', address: 'Dhanmondi, Dhaka', isActive: false },
  { id: 'user-004', name: 'Nasrin Khatun', email: 'nasrin@example.com', phone: '+880 1715 456789', role: 'user', joinedAt: '2024-11-18', address: 'Uttara, Dhaka', isActive: true },
  { id: 'user-005', name: 'Shahin Alam', email: 'shahin@example.com', phone: '+880 1716 567890', role: 'user', joinedAt: '2025-01-10', address: 'Mohammadpur, Dhaka', isActive: true },
  { id: 'user-006', name: 'Roksana Parvin', email: 'roksana@example.com', phone: '+880 1717 678901', role: 'user', joinedAt: '2025-02-20', address: 'Wari, Dhaka', isActive: true },
];

export const getAllUsers = (): User[] => {
  try {
    const stored = localStorage.getItem('dawaiGhorUsers');
    if (stored) return JSON.parse(stored);
    localStorage.setItem('dawaiGhorUsers', JSON.stringify(DEFAULT_USERS));
    return DEFAULT_USERS;
  } catch { return DEFAULT_USERS; }
};
export const saveAllUsers = (users: User[]): void =>
  localStorage.setItem('dawaiGhorUsers', JSON.stringify(users));

export const loginUser = (email: string, password: string): User | null => {
  if (email === 'admin@dawai.com' && password === 'admin123') {
    const admin = DEFAULT_USERS[0];
    saveCurrentUser(admin);
    return admin;
  }
  const users = getAllUsers();
  const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.isActive && u.role !== 'admin');
  if (found) { saveCurrentUser(found); return found; }
  // For demo: allow login with any valid email if password >= 6 chars
  if (email && password.length >= 6) {
    const demoUser: User = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0],
      email,
      role: 'user',
      joinedAt: new Date().toISOString().split('T')[0],
      isActive: true,
    };
    saveCurrentUser(demoUser);
    return demoUser;
  }
  return null;
};

export const registerNewUser = (data: { name: string; email: string; phone?: string }): User => {
  const users = getAllUsers();
  const newUser: User = {
    id: `user-${Date.now()}`,
    name: data.name,
    email: data.email,
    phone: data.phone,
    role: 'user',
    joinedAt: new Date().toISOString().split('T')[0],
    isActive: true,
  };
  users.push(newUser);
  saveAllUsers(users);
  saveCurrentUser(newUser);
  return newUser;
};

// ─── Orders ───────────────────────────────────────────────────────────────────
const DEFAULT_ORDERS: Order[] = [
  { id: 'ORD-2025-001', userId: 'user-001', userName: 'Rahim Uddin', userEmail: 'rahim@example.com', items: [], subtotal: 25.50, shipping: 5.99, total: 31.49, status: 'delivered', createdAt: '2025-03-15', address: 'Mirpur, Dhaka', paymentMethod: 'Cash on Delivery' },
  { id: 'ORD-2025-002', userId: 'user-002', userName: 'Fatema Begum', userEmail: 'fatema@example.com', items: [], subtotal: 45.00, shipping: 0, total: 45.00, status: 'shipped', createdAt: '2025-04-01', address: 'Gulshan, Dhaka', paymentMethod: 'Mobile Banking' },
  { id: 'ORD-2025-003', userId: 'user-003', userName: 'Karim Ahmed', userEmail: 'karim@example.com', items: [], subtotal: 12.99, shipping: 5.99, total: 18.98, status: 'processing', createdAt: '2025-04-10', address: 'Dhanmondi, Dhaka', paymentMethod: 'Cash on Delivery' },
  { id: 'ORD-2025-004', userId: 'user-004', userName: 'Nasrin Khatun', userEmail: 'nasrin@example.com', items: [], subtotal: 68.50, shipping: 0, total: 68.50, status: 'pending', createdAt: '2025-04-18', address: 'Uttara, Dhaka', paymentMethod: 'Mobile Banking' },
  { id: 'ORD-2025-005', userId: 'user-005', userName: 'Shahin Alam', userEmail: 'shahin@example.com', items: [], subtotal: 33.00, shipping: 5.99, total: 38.99, status: 'cancelled', createdAt: '2025-04-19', address: 'Mohammadpur, Dhaka', paymentMethod: 'Cash on Delivery' },
  { id: 'ORD-2025-006', userId: 'user-006', userName: 'Roksana Parvin', userEmail: 'roksana@example.com', items: [], subtotal: 52.00, shipping: 0, total: 52.00, status: 'delivered', createdAt: '2025-04-12', address: 'Wari, Dhaka', paymentMethod: 'Mobile Banking' },
];

export const getOrders = (): Order[] => {
  try {
    const stored = localStorage.getItem('dawaiGhorOrders');
    if (stored) return JSON.parse(stored);
    localStorage.setItem('dawaiGhorOrders', JSON.stringify(DEFAULT_ORDERS));
    return DEFAULT_ORDERS;
  } catch { return DEFAULT_ORDERS; }
};
export const saveOrders = (orders: Order[]): void =>
  localStorage.setItem('dawaiGhorOrders', JSON.stringify(orders));
export const getUserOrders = (userId: string): Order[] =>
  getOrders().filter(o => o.userId === userId);
export const addOrder = (order: Omit<Order, 'id' | 'createdAt'>): Order => {
  const orders = getOrders();
  const newOrder: Order = { ...order, id: `ORD-${Date.now()}`, createdAt: new Date().toISOString().split('T')[0] };
  orders.unshift(newOrder);
  saveOrders(orders);
  return newOrder;
};

// ─── Messages ─────────────────────────────────────────────────────────────────
const DEFAULT_MESSAGES: Message[] = [
  { id: 'msg-001', name: 'Rahim Uddin', email: 'rahim@example.com', subject: 'Question about prescription medicines', content: 'I need to know if I can get Amoxicillin without a prescription. My doctor recommended it but I lost the prescription slip. Can you help me?', createdAt: '2025-04-15', read: true, replied: true },
  { id: 'msg-002', name: 'Fatema Begum', email: 'fatema@example.com', subject: 'Delivery issue with my order', content: 'My order ORD-2025-002 has been showing "shipped" status for 3 days now. When will it arrive? I need the medicines urgently. Please help!', createdAt: '2025-04-17', read: true, replied: false },
  { id: 'msg-003', name: 'Mohammad Ali', email: 'malikhbd@gmail.com', subject: 'Request to add new medicine to catalog', content: 'Can you please add Pantoprazole 40mg to your product catalog? Many customers including myself need it for gastric issues. It would be very helpful.', createdAt: '2025-04-18', read: false, replied: false },
  { id: 'msg-004', name: 'Nasrin Khatun', email: 'nasrin@example.com', subject: 'Excellent AI chatbot experience!', content: 'The AI doctor chatbot is absolutely amazing! It helped me identify my symptoms and recommended the right medicine. Keep up the great work, DawaiGhor team!', createdAt: '2025-04-19', read: false, replied: false },
];

export const getMessages = (): Message[] => {
  try {
    const stored = localStorage.getItem('dawaiGhorMessages');
    if (stored) return JSON.parse(stored);
    localStorage.setItem('dawaiGhorMessages', JSON.stringify(DEFAULT_MESSAGES));
    return DEFAULT_MESSAGES;
  } catch { return DEFAULT_MESSAGES; }
};
export const saveMessages = (messages: Message[]): void =>
  localStorage.setItem('dawaiGhorMessages', JSON.stringify(messages));

// ─── Wishlist ─────────────────────────────────────────────────────────────────
export const getWishlist = (): string[] => {
  try { return JSON.parse(localStorage.getItem('dawaiGhorWishlist') || '[]'); } catch { return []; }
};
export const toggleWishlist = (productId: string): boolean => {
  const wishlist = getWishlist();
  const idx = wishlist.indexOf(productId);
  if (idx >= 0) {
    wishlist.splice(idx, 1);
    localStorage.setItem('dawaiGhorWishlist', JSON.stringify(wishlist));
    return false;
  }
  wishlist.push(productId);
  localStorage.setItem('dawaiGhorWishlist', JSON.stringify(wishlist));
  return true;
};
export const isInWishlist = (productId: string): boolean => getWishlist().includes(productId);

// ─── Admin Product Management ─────────────────────────────────────────────────
export const getAdminProducts = (): Product[] | null => {
  try { return JSON.parse(localStorage.getItem('dawaiGhorProducts') || 'null'); } catch { return null; }
};
export const saveAdminProducts = (products: Product[]): void =>
  localStorage.setItem('dawaiGhorProducts', JSON.stringify(products));
export const initProducts = (defaults: Product[]): void => {
  if (!localStorage.getItem('dawaiGhorProducts')) saveAdminProducts(defaults);
};
export const getManagedProducts = (defaults: Product[]): Product[] => {
  initProducts(defaults);
  return getAdminProducts() || defaults;
};

// ─── Carousel Slides ──────────────────────────────────────────────────────────
export interface CarouselSlide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  badge: string;
  ctaText: string;
  ctaLink: string;
  active: boolean;
  order: number;
}

const DEFAULT_CAROUSEL: CarouselSlide[] = [
  { id: 'slide-001', title: 'Your Health, Just a Click Away', subtitle: 'Get instant medical advice from our AI Doctor and order 100% authentic medicines.', image: 'https://images.unsplash.com/photo-1758691461916-dc7894eb8f94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', badge: 'Premium Care', ctaText: 'Consult AI Doctor', ctaLink: '/ai-doctor', active: true, order: 0 },
  { id: 'slide-002', title: 'Fast Doorstep Delivery', subtitle: 'Get your medicines delivered directly to your home within 24-48 hours.', image: 'https://images.unsplash.com/photo-1630531208352-a734a7e89c5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', badge: 'Quick Delivery', ctaText: 'Shop Now', ctaLink: '/products', active: true, order: 1 },
  { id: 'slide-003', title: '100% Authentic Medicines', subtitle: 'All products are verified and sourced directly from reputable manufacturers.', image: 'https://images.unsplash.com/photo-1729949129758-0b668478dce5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', badge: 'Trusted Quality', ctaText: 'Browse Products', ctaLink: '/products', active: true, order: 2 },
];

export const getCarousel = (): CarouselSlide[] => {
  try {
    const stored = localStorage.getItem('dawaiGhorCarousel');
    if (stored) return JSON.parse(stored);
    localStorage.setItem('dawaiGhorCarousel', JSON.stringify(DEFAULT_CAROUSEL));
    return DEFAULT_CAROUSEL;
  } catch { return DEFAULT_CAROUSEL; }
};
export const saveCarousel = (slides: CarouselSlide[]): void =>
  localStorage.setItem('dawaiGhorCarousel', JSON.stringify(slides));