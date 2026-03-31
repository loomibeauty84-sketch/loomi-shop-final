import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-primary text-white/60 py-12 mt-20 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-display font-bold text-2xl text-white mb-4">Loomi Shop</h3>
            <p className="max-w-xs text-sm leading-relaxed">
              Discover the best deals from your favorite global marketplaces. Curated daily, localized perfectly.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Stores</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/amazon" className="hover:text-accent transition-colors">Amazon</Link></li>
              <li><Link href="/temu" className="hover:text-accent transition-colors">Temu</Link></li>
              <li><Link href="/aliexpress" className="hover:text-accent transition-colors">AliExpress</Link></li>
              <li><Link href="/shein" className="hover:text-accent transition-colors">Shein</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-accent transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm flex flex-col sm:flex-row justify-between items-center">
          <p>&copy; {new Date().getFullYear()} Loomi Shop. All rights reserved.</p>
          <Link href="/admin" className="mt-4 sm:mt-0 text-white/30 hover:text-white transition-colors">Admin Area</Link>
        </div>
      </div>
    </footer>
  );
}
