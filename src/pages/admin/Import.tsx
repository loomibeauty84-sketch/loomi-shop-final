import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { useAppStore } from "@/lib/store";
import AdminLayout from "@/components/layout/AdminLayout";
import { useScrapeProduct, useAdminCreateProduct } from "@workspace/api-client-react";
import { Loader2, Link as LinkIcon, CheckCircle2, AlertTriangle, BadgeCheck, Settings, ExternalLink } from "lucide-react";

export default function AdminImport() {
  const { adminAuth } = useAppStore();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!adminAuth) setLocation("/admin/login");
  }, [adminAuth, setLocation]);

  const [url, setUrl] = useState("");
  const [success, setSuccess] = useState(false);
  const [publishedId, setPublishedId] = useState<number | null>(null);

  const { mutateAsync: scrape, isPending: isScraping, error: scrapeError } = useScrapeProduct();
  const { mutateAsync: create, isPending: isCreating } = useAdminCreateProduct();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    store: "amazon",
    category: "",
    images: "",
    originalUrl: "",
    affiliateUrl: "",
  });

  const affiliateInjected =
    formData.affiliateUrl &&
    formData.originalUrl &&
    formData.affiliateUrl !== formData.originalUrl;

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    try {
      const data = await scrape({ data: { url } });
      setFormData({
        title: data.title,
        description: data.description || "",
        price: data.price.toString(),
        store: data.store || "amazon",
        category: "",
        images: data.images?.join(",\n") || "",
        originalUrl: data.originalUrl,
        affiliateUrl: data.affiliateUrl || data.originalUrl,
      });
      setSuccess(false);
      setPublishedId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const product = await create({
        data: {
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          store: formData.store,
          originalUrl: formData.originalUrl,
          images: formData.images.split(",").map(i => i.trim()).filter(Boolean),
          category: formData.category,
        }
      });
      setSuccess(true);
      setPublishedId(product.id);
    } catch (err) {
      console.error(err);
    }
  };

  const inputClass =
    "w-full px-4 py-3 bg-[hsl(222_47%_11%)] border border-white/10 rounded-xl focus:outline-none focus:border-purple-400 text-white placeholder:text-white/30 text-sm transition-colors";
  const labelClass = "block text-sm font-medium text-white/70 mb-2";

  return (
    <AdminLayout>
      <div className="max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold">Import Product</h1>
          <p className="text-white/50 mt-1">
            Paste a product URL — the scraper auto-fills details and injects your affiliate ID.
          </p>
        </div>

        {/* Step 1: URL Scrape */}
        <div className="bg-[hsl(218_41%_14%)] rounded-2xl p-6 border border-white/8 mb-6">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">Step 1 — Paste URL</p>
          <form onSubmit={handleScrape} className="flex gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 start-0 pl-4 flex items-center pointer-events-none">
                <LinkIcon strokeWidth={1.5} className="w-4 h-4 text-white/30" />
              </div>
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.amazon.com/dp/... or https://www.temu.com/..."
                className="w-full pl-11 pr-4 py-3 bg-[hsl(222_47%_11%)] border border-white/10 rounded-xl focus:outline-none focus:border-purple-400 text-white placeholder:text-white/30 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={isScraping || !url}
              className="gradient-bg  px-6 py-3 rounded-xl font-bold  transition-colors disabled:opacity-50 flex items-center justify-center gap-2 min-w-[120px] shrink-0"
            >
              {isScraping ? <Loader2 strokeWidth={1.5} className="w-5 h-5 animate-spin" /> : "Scrape"}
            </button>
          </form>
          {scrapeError && (
            <div className="flex items-center gap-2 mt-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
              <AlertTriangle strokeWidth={1.5} className="w-4 h-4 shrink-0" />
              Could not auto-fetch data. Fill the form manually below.
            </div>
          )}
        </div>

        {/* Affiliate URL Preview Banner */}
        {formData.originalUrl && (
          <div
            className={`flex items-start gap-3 px-5 py-4 rounded-xl border mb-6 text-sm ${
              affiliateInjected
                ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400"
                : "bg-purple-500/10 border-purple-500/25 text-purple-400"
            }`}
          >
            {affiliateInjected ? (
              <BadgeCheck strokeWidth={1.5} className="w-5 h-5 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle strokeWidth={1.5} className="w-5 h-5 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              {affiliateInjected ? (
                <>
                  <p className="font-semibold mb-1">Affiliate ID injected ✓</p>
                  <p className="text-white/50 text-xs font-mono break-all">{formData.affiliateUrl}</p>
                </>
              ) : (
                <>
                  <p className="font-semibold mb-1">No affiliate ID configured yet</p>
                  <p className="text-white/50 text-xs">
                    Go to{" "}
                    <Link href="/admin/settings" className="gradient-text hover:underline">
                      Affiliate Settings
                    </Link>{" "}
                    to set your tracking IDs — they'll be injected automatically on the next scrape.
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Edit & Publish */}
        <form onSubmit={handleSave} className="bg-[hsl(218_41%_14%)] rounded-2xl p-8 border border-white/8 space-y-5">
          <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">Step 2 — Review & Publish</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className={labelClass}>Product Title *</label>
              <input
                required
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter product title"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Price (USD) *</label>
              <input
                required
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Store *</label>
              <select
                required
                value={formData.store}
                onChange={(e) => setFormData({ ...formData, store: e.target.value })}
                className={inputClass}
              >
                <option value="amazon">Amazon</option>
                <option value="temu">Temu</option>
                <option value="aliexpress">AliExpress</option>
                <option value="shein">Shein</option>
                <option value="daily_deals">Daily Deals</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Category</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Electronics, Fashion…"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Original URL *</label>
              <input
                required
                type="url"
                value={formData.originalUrl}
                onChange={(e) => setFormData({ ...formData, originalUrl: e.target.value })}
                className={inputClass}
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>
                Affiliate URL
                <span className="ms-2 text-xs text-white/30 font-normal">(auto-generated — editable)</span>
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={formData.affiliateUrl}
                  onChange={(e) => setFormData({ ...formData, affiliateUrl: e.target.value })}
                  className={`${inputClass} pe-10 ${affiliateInjected ? "border-emerald-500/40" : ""}`}
                  placeholder="Will be auto-filled after scraping"
                />
                {affiliateInjected && (
                  <div className="absolute inset-y-0 end-3 flex items-center pointer-events-none">
                    <BadgeCheck strokeWidth={1.5} className="w-4 h-4 text-emerald-400" />
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>Image URLs <span className="text-white/30 font-normal">(one per line or comma-separated)</span></label>
              <textarea
                rows={2}
                value={formData.images}
                onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                placeholder="https://..."
                className={`${inputClass} font-mono resize-none`}
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>Description</label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Product description…"
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>

          <div
            className="pt-5 flex items-center justify-between gap-4"
            style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
          >
            {success && publishedId ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-emerald-400 font-medium text-sm">
                  <CheckCircle2 strokeWidth={1.5} className="w-5 h-5" />
                  Published to database!
                </div>
                <Link
                  href={`/product/${publishedId}`}
                  className="flex items-center gap-1.5 text-xs gradient-text hover:underline"
                  target="_blank"
                >
                  <ExternalLink strokeWidth={1.5} className="w-3.5 h-3.5" />
                  View product page
                </Link>
              </div>
            ) : (
              <div />
            )}

            <button
              type="submit"
              disabled={isCreating || !formData.title || !formData.price}
              className="gradient-bg  px-8 py-3 rounded-xl font-bold  transition-colors shadow-lg shadow-purple-500/20 disabled:opacity-50 flex items-center gap-2 shrink-0"
            >
              {isCreating && <Loader2 strokeWidth={1.5} className="w-5 h-5 animate-spin" />}
              Publish to Store
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
