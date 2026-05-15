import { Headset, ShieldCheck, Truck, Lock } from "lucide-react";
import { motion } from "motion/react";

export default function FeaturesSection() {
  const features = [
    {
      icon: Headset,
      title: "Free AI Consultation",
      subtitle: "Get instant medical advice 24/7 from our AI doctor",
      color: "from-blue-500 to-blue-400",
      lightBg: "bg-blue-50/50",
      iconColor: "text-blue-500",
    },
    {
      icon: ShieldCheck,
      title: "100% Authentic",
      subtitle: "All medicines sourced directly from verified manufacturers",
      color: "from-green-500 to-green-400",
      lightBg: "bg-green-50/50",
      iconColor: "text-green-500",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      subtitle: "Doorstep delivery within 24-48 hours across Bangladesh",
      color: "from-orange-500 to-orange-400",
      lightBg: "bg-orange-50/50",
      iconColor: "text-orange-500",
    },
    {
      icon: Lock,
      title: "Secure Payments",
      subtitle: "Multiple payment options with bank-level security",
      color: "from-purple-500 to-purple-400",
      lightBg: "bg-purple-50/50",
      iconColor: "text-purple-500",
    },
  ];

  return (
    <section className="py-20 relative overflow-hidden bg-white/40 backdrop-blur-3xl">
      <div className="absolute top-0 right-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[60%] bg-orange-100/60 rounded-full blur-[100px]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 mb-4 rounded-full bg-orange-100/50 backdrop-blur-sm border border-orange-200 text-orange-600 text-sm font-bold tracking-widest uppercase">
            Our Features
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Why Choose DawaiGhor?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
            Experience healthcare reimagined with our commitment to quality, speed, and premium customer satisfaction.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative group h-full"
            >
              <div className="relative h-full bg-white/60 backdrop-blur-2xl border border-white/80 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-500 overflow-hidden z-10 hover:-translate-y-2">
                
                {/* Background Gradient Hover Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`}></div>
                
                {/* Icon Container */}
                <div className={`relative w-20 h-20 ${feature.lightBg} border border-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform duration-500 ease-out z-20`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-20 blur-xl rounded-full`}></div>
                  <feature.icon className={`w-10 h-10 ${feature.iconColor} relative z-10`} />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight relative z-20">
                  {feature.title}
                </h3>
                <p className="text-base text-gray-600 leading-relaxed font-medium relative z-20">
                  {feature.subtitle}
                </p>

                {/* Decorative Element */}
                <div className={`absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br ${feature.color} opacity-5 group-hover:opacity-10 rounded-full blur-2xl transition-opacity duration-500 -z-10`}></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
