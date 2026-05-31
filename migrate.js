import fs from 'fs';
import path from 'path';

const SRC_DIR = '/Users/mdsunny/Downloads/Dawaighor website/src/app';

function walkSync(dir, callback) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      walkSync(filepath, callback);
    } else {
      callback(filepath);
    }
  }
}

walkSync(SRC_DIR, (filepath) => {
  if (!filepath.endsWith('.tsx') && !filepath.endsWith('.ts')) return;
  let content = fs.readFileSync(filepath, 'utf8');
  let original = content;

  // Add useState if needed when we convert getCurrentUser
  if (content.includes('const user = getCurrentUser()') && !content.includes('useState')) {
     // rudimentary import adding
     content = content.replace(/import {([^}]+)} from "react";/, 'import { $1, useState, useEffect } from "react";');
  }

  // UserProfile.tsx
  if (filepath.endsWith('UserProfile.tsx')) {
    content = content.replace(/const user = getCurrentUser\(\);/, 'const [user, setUser] = useState<any>(null);\n  useEffect(() => { getCurrentUser().then(setUser); }, []);');
    content = content.replace(/saveCurrentUser\(updatedUser\);/, 'await saveCurrentUser(updatedUser);');
  }
  
  // UserOrders.tsx
  if (filepath.endsWith('UserOrders.tsx')) {
    content = content.replace(/const user = getCurrentUser\(\);/, 'const [user, setUser] = useState<any>(null);\n  useEffect(() => { getCurrentUser().then(setUser); }, []);');
  }

  // UserPrescriptions.tsx
  if (filepath.endsWith('UserPrescriptions.tsx')) {
    content = content.replace(/const user = getUser\(\);/, 'const user = await getUser();');
  }

  // UserLayout.tsx and AdminLayout.tsx
  if (filepath.endsWith('UserLayout.tsx') || filepath.endsWith('AdminLayout.tsx')) {
    content = content.replace(/const user = getCurrentUser\(\);/, 'const [user, setUser] = useState<any>(null);\n  useEffect(() => { getCurrentUser().then(setUser); }, []);');
    content = content.replace(/logoutUser\(\);/, 'await logoutUser();');
    content = content.replace(/const handleLogout = \(\) => {/g, 'const handleLogout = async () => {');
  }
  
  // Header.tsx and MobileNav.tsx
  if (filepath.endsWith('Header.tsx') || filepath.endsWith('MobileNav.tsx')) {
    content = content.replace(/const \[user, setUser\] = useState\(getCurrentUser\(\)\);/g, 'const [user, setUser] = useState<any>(null);\n  useEffect(() => { getCurrentUser().then(setUser); }, []);');
    content = content.replace(/const updateUser = \(\) => setUser\(getCurrentUser\(\)\);/g, 'const updateUser = () => getCurrentUser().then(setUser);');
    content = content.replace(/logoutUser\(\);/g, 'await logoutUser();');
    content = content.replace(/const handleLogout = \(\) => {/g, 'const handleLogout = async () => {');
    content = content.replace(/const cart = getCart\(\);/g, 'const cart = await getCart();');
    content = content.replace(/const updateCartCount = \(\) => {[\s\S]*?};/, 'const updateCartCount = async () => {\n    const cart = await getCart();\n    setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));\n  };');
  }

  // Cart.tsx
  if (filepath.endsWith('Cart.tsx')) {
    content = content.replace(/const loadCart = \(\) => setCartItems\(getCart\(\)\);/, 'const loadCart = () => getCart().then(setCartItems);');
    content = content.replace(/updateCartQuantity\(id, qty\);/, 'await updateCartQuantity(id, qty);');
    content = content.replace(/removeFromCart\(id\);/, 'await removeFromCart(id);');
    content = content.replace(/clearCart\(\);/, 'await clearCart();');
    content = content.replace(/const handleUpdateQuantity = \(id: string, qty: number\) => {/g, 'const handleUpdateQuantity = async (id: string, qty: number) => {');
    content = content.replace(/const handleRemove = \(id: string\) => {/g, 'const handleRemove = async (id: string) => {');
    content = content.replace(/const handleCheckout = \(\) => {/g, 'const handleCheckout = async () => {');
  }

  // Products, ProductDetail, UserWishlist, TrendingProducts
  content = content.replace(/addToCart\(product\);/g, 'await addToCart(product);');
  content = content.replace(/addToCart\(p\)/g, 'await addToCart(p)');
  content = content.replace(/const handleAddToCart = \(\) => {/g, 'const handleAddToCart = async () => {');
  content = content.replace(/const handleAddAllToCart = \(\) => {/g, 'const handleAddAllToCart = async () => {');

  if (content !== original) {
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`Updated ${filepath}`);
  }
});
