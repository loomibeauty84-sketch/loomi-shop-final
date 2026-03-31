import { useRoute, useLocation } from "wouter";
import AppLayout from "@/components/layout/AppLayout";
import { useGetProduct, useTrackProductClick } from "@workspace/api-client-react";
import { formatPrice } from "@/lib/currency";
import { useAppStore } from "@/lib/store";
import { useTranslation } from "@/lib/i18n";
import { Loader2, ShoppingCart, ExternalLink, ArrowLeft, ShieldCheck } from "lucide-react";
import { getStoreColor, getStoreName } from "@/components/ui/ProductCard";
import { useState } from "react";

export default function ProductDetails() {
  const [, params] = useRoute("/product/:id");
  const [, navigate] = useLocation();
  const id = params?.id ? parseInt(params.id) : 0;
  
  const { data: product, isLoading, error } = useGetProduct(id);
  const { mutate: trackClick } = useTrackProductClick();
  const { currency, language } = useAppStore();
  const t = useTranslation(language);

  const [mainImage, setMainImage] = useState<string | null>(null);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="h-[70vh] flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-accent" />
        </div>
      </AppLayout>
    );
  }

  if (error || !product) {
    return (
      <AppLayout>
        <div className="h-[70vh] flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-3xl font-display font-bold mb-4">Product Not Found</h2>
          <p className="text-muted-foreground mb-8">The product you're looking for might have been removed or doesn't exist.</p>
          <a href="/" className="text-accent font-semibold hover:underline flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </a>
        </div>
      </AppLayout>
    );
  }

  const handleBuyClick = () => {
    trackClick({ id: product.id });
    window.open(product.affiliateUrl, '_blank', 'noopener,noreferrer');
  };

  const images = product.images && product.images.length > 0 
    ? product.images 
    : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop'];

  const displayImage = mainImage || images[0];

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-0">
        <button
          onClick={() => window.history.length > 1 ? window.history.back() : navigate("/")}
          className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground hover:text-accent transition-all border border-border hover:border-accent/40 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back
        </button>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Image Gallery */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4">
            <div className="aspect-square bg-muted rounded-3xl overflow-hidden border border-border/50 shadow-lg relative">
              <div className={`absolute top-4 start-4 z-10 px-4 py-1.5 rounded-full text-sm font-bold shadow-md ${getStoreColor(product.store)}`}>
                {getStoreName(product.store)}
              </div>
              <img 
                src={displayImage} 
                alt={product.title} 
                className="w-full h-full object-cover transition-opacity duration-300" 
              />
            </div>
            
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImage(img)}
                    className={`shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${displayImage === img ? 'border-accent shadow-md' : 'border-transparent hover:border-border'}`}
                  >
                    <img src={img} alt={`Thumbnail ${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <h1 className="text-3xl lg:text-4xl font-display font-bold text-foreground leading-tight mb-6">
              {product.title}
            </h1>
            
            <div className="text-4xl font-bold text-primary mb-8 flex items-end gap-3">
              {formatPrice(product.price, currency)}
              <span className="text-base font-normal text-muted-foreground mb-1 line-through opacity-70">
                {formatPrice(product.price * 1.3, currency)}
              </span>
            </div>

            <div className="prose prose-slate prose-lg max-w-none text-muted-foreground mb-10">
              <p>{product.description || "No description available for this premium imported product."}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <button
                onClick={handleBuyClick}
                className="flex-1 gradient-bg text-white font-bold text-lg py-5 px-8 rounded-2xl shadow-lg shadow-purple-500/30 hover:opacity-90 hover:shadow-purple-500/50 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <ShoppingCart strokeWidth={1.5} className="w-6 h-6" />
                {t('buy_now')} {getStoreName(product.store)}
              </button>
              
              <button
                onClick={handleBuyClick}
                className="sm:w-20 gradient-bg text-white font-bold py-5 px-0 rounded-2xl shadow-lg shadow-blue-500/20 flex items-center justify-center hover:-translate-y-1 hover:opacity-90 transition-all duration-300"
                aria-label="External Link"
              >
                <ExternalLink strokeWidth={1.5} className="w-6 h-6" />
              </button>
            </div>

            <div className="mt-8 flex items-center gap-3 text-sm text-muted-foreground p-4 bg-muted/50 rounded-xl border border-border">
              <ShieldCheck strokeWidth={1.5} className="w-5 h-5 text-purple-400" />
              <span>We check all deals to ensure authenticity. Purchasing through our links helps support our curated platform at no extra cost to you.</span>
            </div>
          </div>
          
        </div>
      </div>
    </AppLayout>
  );
}
