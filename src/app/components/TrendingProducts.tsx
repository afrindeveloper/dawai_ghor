import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ShoppingCart, Star, ChevronRight } from "lucide-react";
import { Link } from "react-router";
import { addToCart, getAdminProducts, Product } from "../utils/api";
import { toast } from "sonner";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export default function TrendingProducts() {
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);

  useEffect(() => {
    getAdminProducts().then((data) => {
      // Just slice the first 10 products to display as "Trending"
      setTrendingProducts(data.slice(0, 10));
    });
  }, []);

  const handleAddToCart = async (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(product);
    toast.success(`${product.name} added to cart!`);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  return (
    <section className="py-24 relative bg-white/40 overflow-hidden backdrop-blur-3xl">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[20%] left-[-5%] w-[40%] h-[60%] bg-orange-100/50 rounded-full blur-[120px]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 mb-4 rounded-full bg-orange-100/50 backdrop-blur-sm border border-orange-200 text-orange-600 text-sm font-bold tracking-widest uppercase">
              Top Sellers
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
              Trending Now
            </h2>
          </div>
          <Link
            to="/products"
            className="group flex items-center gap-2 px-6 py-3 bg-white/80 hover:bg-white backdrop-blur-md border border-gray-200 hover:border-orange-300 rounded-xl text-gray-900 hover:text-orange-600 font-bold transition-all shadow-sm hover:shadow-md"
          >
            View All Medicines
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {trendingProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative flex flex-col bg-white/60 backdrop-blur-xl border border-white/80 rounded-[2rem] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgb(255,107,53,0.12)] transition-all duration-500 overflow-hidden hover:-translate-y-2"
            >
              {/* Product Image Area */}
              <Link
                to={`/products/${product.id}`}
                className="relative w-full aspect-square bg-gray-50 rounded-2xl mb-4 overflow-hidden group-hover:shadow-inner transition-all block"
              >
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-bold text-gray-800">{product.rating || 4.8}</span>
                </div>
                {product.originalPrice && (
                  <div className="absolute top-3 left-3 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-lg font-bold">
                    -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </div>
                )}
              </Link>

              {/* Product Info */}
              <div className="flex flex-col flex-grow px-2 pb-2">
                <p className="text-xs font-bold text-orange-500 mb-1 uppercase tracking-wider">
                  {product.category}
                </p>
                <Link to={`/products/${product.id}`}>
                  <h3 className="font-extrabold text-gray-900 mb-4 line-clamp-2 text-lg leading-snug group-hover:text-orange-600 transition-colors">
                    {product.name}
                  </h3>
                </Link>

                <div className="mt-auto flex items-center justify-between pt-2 border-t border-gray-100/50">
                  <div className="flex flex-col">
                    {product.originalPrice && (
                      <span className="text-xs text-gray-400 line-through font-medium">
                        $\{(product.originalPrice).toFixed(2)}
                      </span>
                    )}
                    <span className="text-xl font-black text-gray-900">
                      $\{(product.price).toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    className="w-12 h-12 rounded-2xl bg-orange-50 hover:bg-orange-500 text-orange-600 hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-lg group/btn"
                  >
                    <ShoppingCart className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
