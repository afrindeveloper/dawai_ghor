import { motion } from "motion/react";
import { Users, PackageCheck, Headset, Star } from "lucide-react";

export default function StatsSection() {
  const stats = [
    {
      icon: Users,
      value: "10,000+",
      label: "Happy Customers",
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      icon: PackageCheck,
      value: "5,000+",
      label: "Products Available",
      color: "text-green-500",
      bg: "bg-green-50",
    },
    {
      icon: Headset,
      value: "24/7",
      label: "Customer Support",
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
    {
      icon: Star,
      value: "4.9",
      label: "Average Rating",
      color: "text-yellow-500",
      bg: "bg-yellow-50",
    },
  ];

  return (
    <section className="relative z-20 my-12 container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl p-6 shadow-2xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/40 to-white/10 pointer-events-none"></div>
        <div className="relative grid grid-cols-2 md:grid-cols-4 gap-6 divide-y md:divide-y-0 md:divide-x divide-gray-200/50">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center justify-center p-4 text-center">
              <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4 shadow-sm`}>
                <stat.icon className="w-7 h-7" />
              </div>
              <h3 className="text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">
                {stat.value}
              </h3>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
