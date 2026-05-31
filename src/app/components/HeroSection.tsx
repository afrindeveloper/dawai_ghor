import { motion } from "motion/react";
import { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AIDoctorChat from "./AIDoctorChat";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Sparkles, ArrowRight, Star } from "lucide-react";
import { getCarousel, CarouselSlide } from "../utils/api";
import { useNavigate } from "react-router";

const DEFAULT_SLIDES: CarouselSlide[] = [
  { id: "s1", title: "Your Health, Just a Click Away", subtitle: "Get instant medical advice from our AI Doctor and order 100% authentic medicines.", image: "/images/hero_ai_health.png", badge: "Premium Care", ctaText: "Consult AI Doctor", ctaLink: "/ai-doctor", active: true, order: 0 },
  { id: "s2", title: "Fast Doorstep Delivery", subtitle: "Get your medicines delivered directly to your home within 24-48 hours.", image: "/images/hero_delivery.png", badge: "Quick Delivery", ctaText: "Shop Now", ctaLink: "/products", active: true, order: 1 },
  { id: "s3", title: "100% Authentic Medicines", subtitle: "All products are verified and sourced directly from reputable manufacturers.", image: "/images/hero_authentic.png", badge: "Trusted Quality", ctaText: "Browse Products", ctaLink: "/products", active: true, order: 2 },
];

export default function HeroSection() {
  const [showAIChat, setShowAIChat] = useState(false);
  const [carouselItems, setCarouselItems] = useState<CarouselSlide[]>(DEFAULT_SLIDES);
  const navigate = useNavigate();

  useEffect(() => {
    getCarousel().then(loaded => {
      const active = loaded.filter(s => s.active).sort((a, b) => a.order - b.order);
      if (active.length > 0) setCarouselItems(active);
    });
  }, []);

  const handleCTA = (link: string) => {
    if (link === "/ai-doctor") { setShowAIChat(true); return; }
    navigate(link);
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    customPaging: () => (
      <div className="w-3 h-3 mx-1 bg-white/40 rounded-full hover:bg-white/80 transition-colors mt-4"></div>
    ),
  };

  return (
    <>
      <section className="relative w-full h-[600px] md:h-[700px] overflow-hidden">
        <Slider {...sliderSettings} className="w-full h-full [&_.slick-track]:h-full [&_.slick-list]:h-full [&_.slick-slide>div]:h-full">
          {carouselItems.map((item) => (
            <div key={item.id} className="relative w-full h-full focus:outline-none">
              <ImageWithFallback
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/50 to-transparent flex items-center">
                <div className="container mx-auto px-4 md:px-8">
                  <div className="max-w-2xl text-left">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8 }}
                      viewport={{ once: true }}
                    >
                      {item.badge && (
                        <span className="inline-block px-4 py-1.5 mb-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-orange-400 text-sm font-semibold tracking-wider uppercase">
                          {item.badge}
                        </span>
                      )}
                      <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight drop-shadow-md">
                        {item.title}
                      </h1>
                      <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-xl drop-shadow">
                        {item.subtitle}
                      </p>

                      <div className="flex flex-wrap gap-4">
                        <button
                          onClick={() => handleCTA(item.ctaLink)}
                          className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(255,107,53,0.3)] hover:shadow-[0_0_30px_rgba(255,107,53,0.5)] flex items-center gap-2"
                        >
                          <Sparkles className="w-5 h-5" />
                          {item.ctaText || "Explore"}
                        </button>
                        <button
                          onClick={() => navigate("/products")}
                          className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-xl font-bold transition-all flex items-center gap-2"
                        >
                          Shop Medicines
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>

        {/* Floating Glass Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="absolute bottom-16 right-4 md:right-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl max-w-sm hidden sm:block"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" className="w-10 h-10 rounded-full border-2 border-white/50" alt="Customer" />
                <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" className="w-10 h-10 rounded-full border-2 border-white/50" alt="Customer" />
                <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop" className="w-10 h-10 rounded-full border-2 border-white/50" alt="Customer" />
                <div className="w-10 h-10 rounded-full border-2 border-white/50 bg-orange-500 flex items-center justify-center text-white text-xs font-bold">+</div>
              </div>
              <div>
                <p className="text-white font-bold text-lg">10,000+</p>
                <p className="text-orange-200 text-sm font-medium">Happy Customers</p>
              </div>
            </div>
            <div className="h-px w-full bg-white/20"></div>
            <div className="flex items-center gap-3">
              <div className="flex text-yellow-400 text-xs mb-1">
                <Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" /><Star className="w-3 h-3 fill-current" />
              </div>
              <div className="text-white">
                <span className="font-bold text-lg">4.9/5</span>
                <span className="text-orange-200 text-sm ml-2 font-medium">Rating</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md border border-white/20 rounded-xl p-3 sm:hidden z-10">
          <div className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-white text-xs" style={{ fontWeight: 600 }}>4.9</span>
            <span className="text-xs text-gray-300">(10k+)</span>
          </div>
        </div>
      </section>

      {showAIChat && (
        <AIDoctorChat isOpen={showAIChat} onClose={() => setShowAIChat(false)} />
      )}
    </>
  );
}