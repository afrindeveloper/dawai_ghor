import fs from 'fs';
import path from 'path';

function replaceInFile(filepath, regex, replacement) {
  let content = fs.readFileSync(filepath, 'utf8');
  let original = content;
  content = content.replace(regex, replacement);
  if (content !== original) {
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`Updated ${filepath}`);
  }
}

// MobileNav.tsx
replaceInFile(
  '/Users/mdsunny/Downloads/Dawaighor website/src/app/components/MobileNav.tsx',
  /useEffect\(\(\) => {([\s\S]*?)}, \[\]\);/,
  `useEffect(() => {
    getCurrentUser().then(setUser);
    getCart().then(c => setCartCount(c.reduce((sum, item) => sum + item.quantity, 0)));
  }, []);`
);

// TrendingProducts.tsx
replaceInFile(
  '/Users/mdsunny/Downloads/Dawaighor website/src/app/components/TrendingProducts.tsx',
  /const handleAddToCart = \(product: any\) => {/,
  'const handleAddToCart = async (product: any) => {'
);

// Cart.tsx
replaceInFile(
  '/Users/mdsunny/Downloads/Dawaighor website/src/app/pages/Cart.tsx',
  /const handleClearCart = \(\) => {/,
  'const handleClearCart = async () => {'
);

// UserPrescriptions.tsx
replaceInFile(
  '/Users/mdsunny/Downloads/Dawaighor website/src/app/pages/dashboard/UserPrescriptions.tsx',
  /const handleUpload = \(\) => {/,
  'const handleUpload = async () => {'
);

// UserProfile.tsx
replaceInFile(
  '/Users/mdsunny/Downloads/Dawaighor website/src/app/pages/dashboard/UserProfile.tsx',
  /import { useState } from "react";/,
  'import { useState, useEffect } from "react";'
);

// UserWishlist.tsx
replaceInFile(
  '/Users/mdsunny/Downloads/Dawaighor website/src/app/pages/dashboard/UserWishlist.tsx',
  /const handleAddToCart = \(product: typeof defaultProducts\[0\]\) => {/,
  'const handleAddToCart = async (product: typeof defaultProducts[0]) => {'
);
replaceInFile(
  '/Users/mdsunny/Downloads/Dawaighor website/src/app/pages/dashboard/UserWishlist.tsx',
  /wishlistProducts\.forEach\(p => await addToCart\(p\)\);/,
  'await Promise.all(wishlistProducts.map(p => addToCart(p)));'
);

// Products.tsx
replaceInFile(
  '/Users/mdsunny/Downloads/Dawaighor website/src/app/pages/Products.tsx',
  /const handleAddToCart = \(product: typeof defaultProducts\[0\]\) => {/,
  'const handleAddToCart = async (product: typeof defaultProducts[0]) => {'
);
