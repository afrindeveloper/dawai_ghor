import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Heart, ShoppingCart, Trash2, Star } from "lucide-react";
import { getWishlist, toggleWishlist, addToCart, getManagedProducts } from "../../utils/api";
import { products as defaultProducts } from "../../data/mockData";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

export default function UserWishlist() {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [allProducts, setAllProducts] = useState<typeof defaultProducts>([]);

  useEffect(() => {
    getWishlist().then(setWishlistIds);
    getManagedProducts(defaultProducts).then(setAllProducts);
  }, []);

  const wishlistProducts = allProducts.filter(p => wishlistIds.includes(p.id));

  const handleRemove = async (productId: string) => {
    await toggleWishlist(productId);
    const updated = await getWishlist();
    setWishlistIds(updated);
    toast.success("Removed from wishlist");
  };

  const handleAddToCart = async (product: typeof defaultProducts[0], e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    try {
      await addToCart(product);
      window.dispatchEvent(new Event("cartUpdated"));
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error("Please sign in to add items to cart");
    }
  };

  const handleAddAllToCart = async () => {
    if (wishlistProducts.length === 0) return;
    try {
      await Promise.all(wishlistProducts.map(p => addToCart(p)));
      window.dispatchEvent(new Event("cartUpdated"));
      toast.success("All items added to cart!");
    } catch (error) {
      toast.error("Please sign in to add items to cart");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-slate-900" style={{ fontWeight: 700 }}>My Wishlist</h2>
          <p className="text-slate-500 mt-1">{wishlistProducts.length} saved items</p>
        </div>
        {wishlistProducts.length > 0 && (
          <button
            onClick={handleAddAllToCart}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl text-sm transition-colors"
            style={{ fontWeight: 600 }}
          >
            <ShoppingCart className="w-4 h-4" />
            Add All to Cart
          </button>
        )}
      </div>

      {wishlistProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence>
            {wishlistProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.07 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-square bg-gradient-to-br from-orange-50 to-orange-100 overflow-hidden">
                  <Link to={`/products/${product.id}`}>
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </Link>
                  <button
                    onClick={() => handleRemove(product.id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors"
                  >
                    <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                  </button>
                  {product.originalPrice && (
                    <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full" style={{ fontWeight: 600 }}>
                      -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full" style={{ fontWeight: 500 }}>{product.category}</span>
                  <Link to={`/products/${product.id}`}>
                    <h3 className="text-slate-900 mt-2 mb-1 line-clamp-1 hover:text-orange-600 transition-colors" style={{ fontWeight: 600 }}>{product.name}</h3>
                  </Link>
                  <p className="text-slate-400 text-xs mb-2">{product.brand}</p>
                  {product.rating && (
                    <div className="flex items-center gap-1 mb-3">
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs text-slate-600">{product.rating} ({product.reviewCount})</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-orange-600" style={{ fontWeight: 700 }}>${product.price.toFixed(2)}</span>
                    {product.originalPrice && (
                      <span className="text-slate-400 text-sm line-through">${product.originalPrice.toFixed(2)}</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      className="flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-orange-500 text-white py-2 px-4 rounded-xl transition-colors text-sm"
                      style={{ fontWeight: 600 }}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleRemove(product.id)}
                      className="p-2.5 border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-slate-100">
          <Heart className="w-16 h-16 mx-auto text-slate-300 mb-4" />
          <p className="text-slate-900" style={{ fontWeight: 600 }}>Your wishlist is empty</p>
          <p className="text-slate-400 text-sm mt-1 mb-5">Save items you love by clicking the heart icon on products</p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl text-sm transition-colors"
            style={{ fontWeight: 600 }}
          >
            Explore Products
          </Link>
        </div>
      )}
    </div>
  );
}
