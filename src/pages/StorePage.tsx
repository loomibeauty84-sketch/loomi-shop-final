import { useRoute, useLocation } from "wouter";
import AppLayout from "@/components/layout/AppLayout";
import ProductCard, { getStoreColor, getStoreName } from "@/components/ui/ProductCard";
import { useListProducts, ProductStore } from "@workspace/api-client-react";
import { Loader2, ArrowLeft } from "lucide-react";

export default function StorePage() {
  const [, navigate] = useLocation();
  const [matchAmazon] = useRoute("/amazon");
  const [matchTemu] = useRoute("/temu");
  const [matchAliExpress] = useRoute("/aliexpress");
  const [matchShein] = useRoute("/shein");
  const [matchDeals] = useRoute("/daily-deals");

  let storeKey: string = '';
  if (matchAmazon) storeKey = 'amazon';
  else if (matchTemu) storeKey = 'temu';
  else if (matchAliExpress) storeKey = 'aliexpress';
  else if (matchShein) storeKey = 'shein';
  else if (matchDeals) storeKey = 'daily_deals';

  const { data, isLoading, error } = useListProducts({ 
    store: storeKey !== '' ? storeKey : undefined,
    limit: 24 
  });

  const title = getStoreName(storeKey);
  const colorClass = storeKey ? getStoreColor(storeKey) : 'bg-primary text-white';

  return (
    <AppLayout>
      <div className={`${colorClass} py-16 px-4 text-center border-b border-black/10 shadow-sm relative`}>
        <button
          onClick={() => navigate("/")}
          className="absolute start-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl bg-black/20 hover:bg-black/30 text-white/90 hover:text-white transition-all border border-white/20 hover:border-white/40 backdrop-blur-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back</span>
        </button>
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">{title}</h1>
        <p className="opacity-90 max-w-2xl mx-auto text-lg">
          Explore the best selections and deals imported directly from {title}.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-12 h-12 animate-spin text-accent" />
          </div>
        ) : error ? (
          <div className="text-center py-20 text-destructive">
            Failed to load products. Please try again later.
          </div>
        ) : data?.products && data.products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {data.products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed border-border">
            <h3 className="text-xl font-semibold mb-2">No products available</h3>
            <p className="text-muted-foreground">Check back later for new {title} deals.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
