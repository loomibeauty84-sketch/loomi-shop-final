import { Link } from "wouter";
import AppLayout from "@/components/layout/AppLayout";
import ProductCard from "@/components/ui/ProductCard";
import { useListProducts } from "@workspace/api-client-react";
import { useTranslation } from "@/lib/i18n";
import { useAppStore } from "@/lib/store";
import { motion } from "framer-motion";
import { Loader2, ShoppingCart, Package, Globe, Scissors, Zap } from "lucide-react";

const stores = [
  {
    id: "amazon",
    name: "Amazon",
    path: "/amazon",
    bg: "from-orange-500/20 to-orange-700/30",
    iconColor: "text-orange-400",
    Icon: ShoppingCart,
  },
  {
    id: "temu",
    name: "Temu",
    path: "/temu",
    bg: "from-red-500/20 to-orange-600/30",
    iconColor: "text-red-400",
    Icon: Package,
  },
  {
    id: "aliexpress",
    name: "AliExpress",
    path: "/aliexpress",
    bg: "from-red-700/20 to-red-900/30",
    iconColor: "text-red-500",
    Icon: Globe,
  },
  {
    id: "shein",
    name: "Shein",
    path: "/shein",
    bg: "from-zinc-600/20 to-zinc-900/30",
    iconColor: "text-zinc-300",
    Icon: Scissors,
  },
  {
    id: "daily_deals",
    name: "Daily Deals",
    path: "/daily-deals",
    bg: "from-purple-600/20 to-blue-700/30",
    iconColor: "text-purple-300",
    Icon: Zap,
  },
];

const MARQUEE_ITEMS = [
  "🛍 Amazon Deals",
  "✦",
  "📦 Temu Finds",
  "✦",
  "🌏 AliExpress",
  "✦",
  "👗 Shein Fashion",
  "✦",
  "⚡ Daily Deals",
  "✦",
  "🚀 Free Shipping",
  "✦",
  "💎 Exclusive Picks",
  "✦",
  "🎯 Best Prices",
  "✦",
  "🌍 Ships Worldwide",
  "✦",
];

export default function Home() {
  const { language } = useAppStore();
  const t = useTranslation(language);
  const { data, isLoading } = useListProducts({ limit: 8 });

  return (
    <AppLayout>
      {/* Hero Section */}
      <section className="relative w-full h-[64vh] min-h-[520px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[#0F172A]">
          <img
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
            alt=""
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/50 to-transparent" />
          {/* Purple/blue ambient glow */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-purple-600/20 blur-[100px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/4 w-[300px] h-[200px] rounded-full bg-blue-600/15 blur-[80px] pointer-events-none" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-5 leading-tight drop-shadow-xl">
              Curated Luxury <br />
              <span className="gradient-text">Global Finds</span>
            </h1>
            <p className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto">
              Discover the best deals from top global marketplaces, handpicked for quality and value.
            </p>
            <Link
              href="/daily-deals"
              className="inline-block px-10 py-4 rounded-full font-bold text-white gradient-bg hover:opacity-90 hover:scale-105 transition-all duration-300 shadow-[0_0_50px_rgba(168,85,247,0.4)]"
            >
              {t("shop_now")}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Scrolling Marquee */}
      <div
        className="w-full overflow-hidden border-y border-white/5 py-3"
        style={{ background: "rgba(168,85,247,0.06)" }}
      >
        <div className="flex animate-marquee whitespace-nowrap w-max select-none">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span
              key={i}
              className={`mx-4 text-sm font-semibold ${
                item === "✦" ? "text-purple-500/50 mx-2" : "text-white/50"
              }`}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Stores Section */}
      <section className="py-16 bg-[#0F172A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold text-center mb-10 text-white">
            {t("stores") || "Shop by Store"}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
            {stores.map((store, i) => (
              <motion.div
                key={store.id}
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link href={store.path} className="block group">
                  <div
                    className={`aspect-[4/3] bg-gradient-to-br ${store.bg} p-6 flex flex-col items-center justify-center text-white hover:-translate-y-1 transition-all duration-300 relative overflow-hidden`}
                    style={{
                      borderRadius: '16px',
                      border: '1px solid rgba(255,255,255,0.09)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                    }}
                  >
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />
                    <store.Icon
                      strokeWidth={1.5}
                      className={`w-8 h-8 mb-3 ${store.iconColor} group-hover:scale-110 transition-transform duration-300`}
                    />
                    <span className="font-semibold text-base tracking-wide z-10 text-white/80 group-hover:text-white transition-colors">
                      {store.name}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-[#0F172A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <h2 className="font-display text-3xl font-bold text-white">{t("trending")}</h2>
            <Link
              href="/daily-deals"
              className="gradient-text font-semibold hover:underline hidden sm:block text-sm"
            >
              View All →
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 strokeWidth={1.5} className="w-10 h-10 animate-spin text-purple-400" />
            </div>
          ) : data?.products && data.products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
              {data.products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center text-white/30 py-12">
              No products found. Add some from the admin dashboard!
            </div>
          )}
        </div>
      </section>
    </AppLayout>
  );
}
