import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAppStore } from "@/lib/store";
import AdminLayout from "@/components/layout/AdminLayout";
import { useGetAffiliateSettings, useUpdateAffiliateSettings } from "@workspace/api-client-react";
import { Loader2, Save, CheckCircle2 } from "lucide-react";

export default function AdminSettings() {
  const { adminAuth } = useAppStore();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!adminAuth) setLocation("/admin/login");
  }, [adminAuth, setLocation]);

  const { data, isLoading } = useGetAffiliateSettings();
  const { mutateAsync: updateSettings, isPending } = useUpdateAffiliateSettings();

  const [formData, setFormData] = useState({
    amazonTag: "",
    temuAffiliateId: "",
    aliexpressAffiliateId: "",
    sheinAffiliateId: "",
  });
  
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (data) {
      setFormData({
        amazonTag: data.amazonTag || "",
        temuAffiliateId: data.temuAffiliateId || "",
        aliexpressAffiliateId: data.aliexpressAffiliateId || "",
        sheinAffiliateId: data.sheinAffiliateId || "",
      });
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings({ data: formData });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground">Affiliate Settings</h1>
          <p className="text-muted-foreground mt-1">Configure your tracker IDs. These will be appended to product outbound links automatically.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 border border-border shadow-sm space-y-6">
          
          <div>
            <label className="block text-sm font-medium mb-2">Amazon Associate Tag</label>
            <input
              type="text"
              value={formData.amazonTag}
              onChange={(e) => setFormData({...formData, amazonTag: e.target.value})}
              placeholder="yourstore-20"
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-accent"
            />
            <p className="text-xs text-muted-foreground mt-2">Appended as ?tag=yourstore-20</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Temu Affiliate ID</label>
            <input
              type="text"
              value={formData.temuAffiliateId}
              onChange={(e) => setFormData({...formData, temuAffiliateId: e.target.value})}
              placeholder="temu_xxx"
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">AliExpress Affiliate ID</label>
            <input
              type="text"
              value={formData.aliexpressAffiliateId}
              onChange={(e) => setFormData({...formData, aliexpressAffiliateId: e.target.value})}
              placeholder="ali_xxx"
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Shein Affiliate ID</label>
            <input
              type="text"
              value={formData.sheinAffiliateId}
              onChange={(e) => setFormData({...formData, sheinAffiliateId: e.target.value})}
              placeholder="shein_xxx"
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-accent"
            />
          </div>

          <div className="pt-6 border-t border-border flex items-center justify-between">
            {success ? (
              <div className="flex items-center gap-2 text-green-600 font-medium bg-green-50 px-4 py-2 rounded-lg">
                <CheckCircle2 className="w-5 h-5" /> Settings Saved
              </div>
            ) : <div />}
            
            <button
              type="submit"
              disabled={isPending}
              className="gradient-bg text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/20 disabled:opacity-50 flex items-center gap-2"
            >
              {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
