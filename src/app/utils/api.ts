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

// ─── API Helper ──────────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_URL || '';

async function fetchAPI(endpoint: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE}/api${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    credentials: 'include',
    ...options,
  });
  if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
  return res.json();
}

// ─── Cart ────────────────────────────────────────────────────────────────────
export const getCart = async (): Promise<CartItem[]> => {
  return fetchAPI('/cart');
};
export const saveCart = async (cart: CartItem[]): Promise<void> => {
  // We don't save entire cart arrays typically now, but keeping signature for compatibility if needed.
};
export const addToCart = async (product: Product): Promise<CartItem[]> => {
  return fetchAPI('/cart/add', {
    method: 'POST',
    body: JSON.stringify(product)
  });
};
export const removeFromCart = async (id: string): Promise<CartItem[]> => {
  return fetchAPI(`/cart/remove/${id}`, { method: 'DELETE' });
};
export const updateCartQuantity = async (id: string, qty: number): Promise<CartItem[]> => {
  return fetchAPI('/cart/update', {
    method: 'PUT',
    body: JSON.stringify({ id, quantity: qty })
  });
};
export const clearCart = async (): Promise<CartItem[]> => {
  return fetchAPI('/cart', { method: 'DELETE' });
};

// ─── Current User ─────────────────────────────────────────────────────────────
let cachedUser: User | null = null;
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const user = await fetchAPI('/users/me');
    cachedUser = user;
    return user;
  } catch {
    cachedUser = null;
    return null;
  }
};
export const getUser = async (): Promise<User | null> => getCurrentUser();
export const saveCurrentUser = async (user: User): Promise<void> => {
  await fetchAPI(`/users/${user.id}`, {
    method: 'PUT',
    body: JSON.stringify(user)
  });
  cachedUser = user;
};
export const saveUser = async (user: User): Promise<void> => saveCurrentUser(user);
export const logoutUser = async (): Promise<void> => {
  await fetchAPI('/users/logout', { method: 'POST' });
  cachedUser = null;
};

// ─── All Users ────────────────────────────────────────────────────────────────
export const getAllUsers = async (): Promise<User[]> => {
  return fetchAPI('/users');
};
export const saveAllUsers = async (users: User[]): Promise<void> => {
  // Handled individually in DB
};

export const loginUser = async (email: string, password: string): Promise<User | null> => {
  try {
    const user = await fetchAPI('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    cachedUser = user;
    return user;
  } catch (err) {
    return null;
  }
};

export const registerNewUser = async (data: { name: string; email: string; phone?: string }): Promise<User> => {
  const newUser = {
    id: `user-${Date.now()}`,
    name: data.name,
    email: data.email,
    phone: data.phone,
    role: 'user',
    joinedAt: new Date().toISOString().split('T')[0],
    isActive: true,
  };
  const created = await fetchAPI('/users', {
    method: 'POST',
    body: JSON.stringify(newUser)
  });
  cachedUser = created;
  return created;
};

// ─── Orders ───────────────────────────────────────────────────────────────────
export const getOrders = async (): Promise<Order[]> => {
  return fetchAPI('/orders');
};
export const saveOrders = async (orders: Order[]): Promise<void> => {
  // handled individually
};
export const getUserOrders = async (userId: string): Promise<Order[]> => {
  const all = await getOrders();
  return all.filter(o => o.userId === userId);
};
export const addOrder = async (order: Omit<Order, 'id' | 'createdAt'>): Promise<Order> => {
  const newOrder = { ...order, id: `ORD-${Date.now()}`, createdAt: new Date().toISOString().split('T')[0] };
  return fetchAPI('/orders', {
    method: 'POST',
    body: JSON.stringify(newOrder)
  });
};

// ─── Messages ─────────────────────────────────────────────────────────────────
export const getMessages = async (): Promise<Message[]> => {
  return fetchAPI('/messages');
};
export const saveMessages = async (messages: Message[]): Promise<void> => {
  // handled individually
};
export const addMessage = async (msg: Omit<Message, 'id' | 'createdAt' | 'read' | 'replied'>): Promise<Message> => {
  const newMsg = {
    ...msg,
    id: `msg-${Date.now()}`,
    createdAt: new Date().toISOString().split('T')[0],
    read: false,
    replied: false
  };
  return fetchAPI('/messages', {
    method: 'POST',
    body: JSON.stringify(newMsg)
  });
};
export const updateMessage = async (id: string, updates: Partial<Message>): Promise<Message> => {
  return fetchAPI(`/messages/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  });
};

// ─── Wishlist ─────────────────────────────────────────────────────────────────
export const getWishlist = async (): Promise<string[]> => {
  return fetchAPI('/wishlist');
};
export const toggleWishlist = async (productId: string): Promise<boolean> => {
  const res = await fetchAPI('/wishlist/toggle', {
    method: 'POST',
    body: JSON.stringify({ productId })
  });
  return res.added;
};
export const isInWishlist = async (productId: string): Promise<boolean> => {
  const list = await getWishlist();
  return list.includes(productId);
};

// ─── Admin Product Management ─────────────────────────────────────────────────
export const getAdminProducts = async (): Promise<Product[]> => {
  return fetchAPI('/products');
};
export const saveAdminProducts = async (products: Product[]): Promise<void> => {
  await fetchAPI('/products', {
    method: 'POST',
    body: JSON.stringify(products)
  });
};
export const initProducts = async (defaults: Product[]): Promise<void> => {
  // Not strictly needed with seed script, but keeping interface
};
export const getManagedProducts = async (defaults: Product[]): Promise<Product[]> => {
  return fetchAPI('/products');
};
export const updateProduct = async (id: string, product: Partial<Product>): Promise<Product> => {
  return fetchAPI(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(product)
  });
};
export const addProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  const newProd = { ...product, id: `prod-${Date.now()}` };
  return fetchAPI('/products', {
    method: 'POST',
    body: JSON.stringify(newProd)
  });
};

// ─── Carousel Slides ──────────────────────────────────────────────────────────
export const getCarousel = async (): Promise<CarouselSlide[]> => {
  return fetchAPI('/carousel');
};
export const saveCarousel = async (slides: CarouselSlide[]): Promise<void> => {
  await fetchAPI('/carousel', {
    method: 'POST',
    body: JSON.stringify(slides)
  });
};