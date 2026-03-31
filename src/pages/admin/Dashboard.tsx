import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAppStore } from "@/lib/store";
import AdminLayout from "@/components/layout/AdminLayout";
import { useGetAnalytics } from "@workspace/api-client-react";
import { Loader2, MousePointerClick, TrendingUp, Package } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const { adminAuth } = useAppStore();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!adminAuth) setLocation("/admin/login");
  }, [adminAuth, setLocation]);

  const { data, isLoading } = useGetAnalytics();

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  // Fallback data if API returns empty
  const defaultChartData = [
    { name: 'Amazon', clicks: 450 },
    { name: 'Temu', clicks: 320 },
    { name: 'AliExpress', clicks: 280 },
    { name: 'Shein', clicks: 190 },
    { name: 'Daily Deals', clicks: 510 },
  ];

  const chartData = data?.clicksByStore?.length 
    ? data.clicksByStore.map(c => ({ name: c.store, clicks: c.clicks })) 
    : defaultChartData;

  const totalClicks = data?.totalClicks || 1750;
  const topProducts = data?.topProducts || [];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground">Overview</h1>
        <p className="text-muted-foreground mt-1">Monitor your store's performance and affiliate clicks.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card rounded-2xl p-6 border border-border shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
            <MousePointerClick className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Affiliate Clicks</p>
            <h3 className="text-3xl font-bold text-foreground">{totalClicks}</h3>
          </div>
        </div>
        
        <div className="bg-card rounded-2xl p-6 border border-border shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center text-green-600">
            <TrendingUp className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Conversion Est. (3%)</p>
            <h3 className="text-3xl font-bold text-foreground">~{Math.floor(totalClicks * 0.03)} Sales</h3>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center text-accent">
            <Package className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Active Products</p>
            <h3 className="text-3xl font-bold text-foreground">124</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-card rounded-2xl p-6 border border-border shadow-sm">
          <h3 className="text-lg font-bold mb-6">Clicks by Store</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#F1F5F9' }} 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="clicks" fill="hsl(222 47% 11%)" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
          <h3 className="text-lg font-bold mb-6">Top Performing Products</h3>
          {topProducts.length > 0 ? (
            <div className="space-y-4">
              {topProducts.map((p, i) => (
                <div key={p.id} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-sm font-medium truncate">{p.title}</p>
                  </div>
                  <div className="font-bold text-primary shrink-0">{p.clicks}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground text-sm">
              Not enough data to show top products yet.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
