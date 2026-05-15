import { Pill, Cross, Baby, Stethoscope, Tablets, Heart, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";

export default function CategoriesSection() {
  const categories = [
    { id: "Prescription Medicine", name: "Prescription Medicine", desc: "Authentic Rx meds", icon: Pill, color: "from-blue-500 to-cyan-400", lightBg: "bg-blue-50/50", iconColor: "text-blue-500" },
    { id: "OTC", name: "OTC Medicines", desc: "Over the counter", icon: Cross, color: "from-green-500 to-emerald-400", lightBg: "bg-green-50/50", iconColor: "text-green-500" },
    { id: "Baby Care", name: "Baby Care", desc: "Gentle essentials", icon: Baby, color: "from-pink-500 to-rose-400", lightBg: "bg-pink-50/50", iconColor: "text-pink-500" },
    { id: "Devices & Kits", name: "Devices & Kits", desc: "Health monitors", icon: Stethoscope, color: "from-purple-500 to-indigo-400", lightBg: "bg-purple-50/50", iconColor: "text-purple-500" },
    { id: "Vitamins & Supplements", name: "Vitamins", desc: "Daily nutrition", icon: Tablets, color: "from-orange-500 to-amber-400", lightBg: "bg-orange-50/50", iconColor: "text-orange-500" },
    { id: "Women's Choice", name: "Women's Choice", desc: "Personal care", icon: Heart, color: "from-rose-500 to-red-400", lightBg: "bg-rose-50/50", iconColor: "text-rose-500" },
  ];

  return (
    <section className="py-24 relative bg-gray-50/50 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-[30%] h-[40%] bg-blue-100/40 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[40%] bg-orange-100/40 rounded-full blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 mb-4 rounded-full bg-white/60 backdrop-blur-sm border border-gray-200 text-gray-600 text-sm font-bold tracking-widest uppercase">
              Browse Store
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
              Explore Categories
            </h2>
          </div>
          <Link
            to="/products"
            className="group flex items-center gap-2 px-6 py-3 bg-white/80 hover:bg-white backdrop-blur-md border border-gray-200 hover:border-orange-300 rounded-xl text-gray-900 hover:text-orange-600 font-bold transition-all shadow-sm hover:shadow-md"
          >
            View All Categories
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link
                to="/products"
                className="group relative flex flex-col p-6 bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl hover:bg-white/80 hover:border-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 cursor-pointer overflow-hidden text-center items-center"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`}></div>
                <div className={`relative w-20 h-20 rounded-2xl ${category.lightBg} border border-white flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-20 blur-md rounded-full`}></div>
                  <category.icon className={`w-10 h-10 ${category.iconColor} relative z-10`} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-gray-800 mb-1 transition-colors leading-tight">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500 font-medium group-hover:text-gray-600 transition-colors">
                  {category.desc}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
