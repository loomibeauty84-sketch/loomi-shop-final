import { useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useAppStore } from "@/lib/store";
import AdminLayout from "@/components/layout/AdminLayout";
import { useAdminListProducts, useAdminDeleteProduct } from "@workspace/api-client-react";
import { Loader2, Plus, Edit, Trash2, ExternalLink } from "lucide-react";
import { getStoreName } from "@/components/ui/ProductCard";

export default function AdminProducts() {
  const { adminAuth } = useAppStore();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!adminAuth) setLocation("/admin/login");
  }, [adminAuth, setLocation]);

  const { data, isLoading, refetch } = useAdminListProducts();
  const { mutate: deleteProduct, isPending: isDeleting } = useAdminDeleteProduct();

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct({ id }, {
        onSuccess: () => refetch()
      });
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground mt-1">Manage your imported affiliate products.</p>
        </div>
        <Link 
          href="/admin/import" 
          className="bg-primary text-white px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Import New
        </Link>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-4 font-semibold text-sm text-muted-foreground">Product</th>
                  <th className="px-6 py-4 font-semibold text-sm text-muted-foreground">Store</th>
                  <th className="px-6 py-4 font-semibold text-sm text-muted-foreground">Price</th>
                  <th className="px-6 py-4 font-semibold text-sm text-muted-foreground">Clicks</th>
                  <th className="px-6 py-4 font-semibold text-sm text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data?.products?.length ? data.products.map((product) => (
                  <tr key={product.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden shrink-0">
                          <img src={product.images?.[0]} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground line-clamp-1 max-w-[300px]">{product.title}</p>
                            <div className="flex items-center gap-3 mt-0.5">
                              <Link href={`/product/${product.id}`} className="text-xs text-[#F59E0B] hover:underline flex items-center gap-1">
                                Internal Page <ExternalLink className="w-3 h-3" />
                              </Link>
                              <a href={product.affiliateUrl || product.originalUrl} target="_blank" rel="noreferrer" className="text-xs text-white/30 hover:text-white/60 flex items-center gap-1">
                                Affiliate Link <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-primary/5 text-primary">
                        {getStoreName(product.store)}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      ${product.price?.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {product.clickCount}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {/* Edit button placeholder for a real app */}
                        <button className="p-2 text-muted-foreground hover:text-primary transition-colors bg-muted rounded-lg">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          disabled={isDeleting}
                          className="p-2 text-muted-foreground hover:text-destructive transition-colors bg-muted rounded-lg disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      No products found. Start by importing some!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
