import { Link } from "wouter";
import { formatPrice } from "@/lib/currency";
import { useAppStore } from "@/lib/store";
import { useTranslation } from "@/lib/i18n";
import type { Product } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function getStoreColor(store: string) {
  switch (store.toLowerCase()) {
    case 'amazon':     return 'bg-orange-500 text-white';
    case 'temu':       return 'bg-[#FF4500] text-white';
    case 'aliexpress': return 'bg-[#E62E04] text-white';
    case 'shein':      return 'bg-zinc-700 text-white';
    case 'daily_deals':return 'gradient-bg text-white';
    default:           return 'bg-[#0F172A] text-white';
  }
}

export function getStoreName(store: string) {
  return store.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
}

export default function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { currency, language } = useAppStore();
  const t = useTranslation(language);

  const imageUrl =
    product.images?.[0] ||
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group flex flex-col h-full overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.08)',
        background: 'hsl(218 41% 14%)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.35)',
      }}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-[#0F172A]" style={{ borderRadius: '16px 16px 0 0' }}>
        <div className={`absolute top-3 start-3 z-10 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide shadow ${getStoreColor(product.store)}`}>
          {getStoreName(product.store)}
        </div>
        <Link href={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={imageUrl}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <Link href={`/product/${product.id}`} className="block mb-3 flex-1">
          <h3 className="font-sans font-semibold text-white/90 line-clamp-2 leading-snug group-hover:text-purple-300 transition-colors text-sm">
            {product.title}
          </h3>
        </Link>

        <div className="flex items-center justify-between mt-auto pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <span className="font-display font-bold text-lg gradient-text">
            {formatPrice(product.price, currency)}
          </span>

          <Link
            href={`/product/${product.id}`}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white/30 group-hover:text-purple-400 transition-colors"
            style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)' }}
          >
            <ArrowRight strokeWidth={1.5} className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
