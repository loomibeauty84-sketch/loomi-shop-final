import { Link, useLocation } from "wouter";
import { LayoutDashboard, ShoppingBag, PlusCircle, Settings, LogOut } from "lucide-react";
import { useAppStore } from "@/lib/store";
import clsx from "clsx";

export default function AdminSidebar() {
  const [location] = useLocation();
  const { logout } = useAppStore();

  const links = [
    { name: "Dashboard",         path: "/admin",          icon: LayoutDashboard, exact: true },
    { name: "Products",          path: "/admin/products", icon: ShoppingBag },
    { name: "Import Product",    path: "/admin/import",   icon: PlusCircle },
    { name: "Affiliate Settings",path: "/admin/settings", icon: Settings },
  ];

  return (
    <aside
      className="w-64 h-screen sticky top-0 flex flex-col border-e border-white/10"
      style={{ background: "hsl(222 47% 9%)" }}
    >
      <div className="p-6 pb-4">
        <Link href="/" className="font-display font-bold text-2xl gradient-text block">
          Loomi Admin
        </Link>
        <p className="text-xs text-white/40 mt-1">Store Management</p>
      </div>

      <nav className="flex-1 px-3 space-y-1 mt-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = link.exact ? location === link.path : location.startsWith(link.path);
          return (
            <Link
              key={link.path}
              href={link.path}
              className={clsx(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm",
                isActive
                  ? "gradient-bg text-white font-semibold shadow-lg shadow-purple-500/25"
                  : "text-white/55 hover:bg-white/8 hover:text-white"
              )}
            >
              <Icon strokeWidth={1.5} className="w-5 h-5 shrink-0" />
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/8">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-start text-white/50 hover:bg-red-500/15 hover:text-red-400 transition-colors text-sm"
        >
          <LogOut strokeWidth={1.5} className="w-5 h-5 shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
