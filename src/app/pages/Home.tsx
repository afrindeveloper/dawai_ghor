import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import StatsSection from "../components/StatsSection";
import FeaturesSection from "../components/FeaturesSection";
import CategoriesSection from "../components/CategoriesSection";
import TrendingProducts from "../components/TrendingProducts";
import AIHelpSection from "../components/AIHelpSection";
import PromoBanner from "../components/PromoBanner";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PromoBanner />
      <Header />
      <main className="flex-1">
        <HeroSection />
        <StatsSection />
        <AIHelpSection />
        <FeaturesSection />
        <CategoriesSection />
        <TrendingProducts />
      </main>
      <Footer />
    </div>
  );
}
