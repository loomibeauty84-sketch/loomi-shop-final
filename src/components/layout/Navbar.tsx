import { Link } from "wouter";
import { useAppStore } from "@/lib/store";
import { useTranslation } from "@/lib/i18n";
import { CURRENCY_LIST } from "@/lib/currency";
import { Coins, ShieldCheck, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LANGUAGES = [
  { code: "en", flag: "🇬🇧", label: "EN" },
  { code: "ar", flag: "🇸🇦", label: "AR" },
  { code: "hi", flag: "🇮🇳", label: "HI" },
  { code: "zh", flag: "🇨🇳", label: "ZH" },
  { code: "es", flag: "🇪🇸", label: "ES" },
  { code: "fr", flag: "🇫🇷", label: "FR" },
  { code: "de", flag: "🇩🇪", label: "DE" },
];

export default function Navbar() {
  const { language, setLanguage, currency, setCurrency } = useAppStore();
  const t = useTranslation(language);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { name: t("home"), path: "/" },
    { name: "Amazon", path: "/amazon" },
    { name: "Temu", path: "/temu" },
    { name: "AliExpress", path: "/aliexpress" },
    { name: "Shein", path: "/shein" },
    { name: t("deals"), path: "/daily-deals" },
  ];

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    if (lang === "ar") setCurrency("SAR");
    else if (lang === "hi") setCurrency("USD");
    else if (["fr", "de", "es"].includes(lang)) setCurrency("EUR");
    else if (lang === "zh") setCurrency("USD");
    else setCurrency("USD");
  };

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 w-full border-b border-white/8 shadow-lg"
      style={{
        background: "rgba(15, 23, 42, 0.80)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[70px] gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-shadow">
              <img
                src={`${import.meta.env.BASE_URL}logo.jpg`}
                alt="Loomi Shop"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-display font-bold text-xl tracking-wide gradient-text hidden sm:block">
              Loomi Shop
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className="text-sm font-medium text-white/70 hover:text-purple-300 transition-colors relative after:absolute after:bottom-[-4px] after:start-0 after:h-[2px] after:w-0 hover:after:w-full after:gradient-bg after:transition-all after:duration-300"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-2">

            {/* Language Switcher — always visible */}
            <div className="flex items-center gap-0.5 bg-white/5 border border-white/10 rounded-xl px-1.5 py-1">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  title={lang.label}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    language === lang.code
                      ? "gradient-bg text-white shadow-sm"
                      : "text-white/50 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <span className="text-base leading-none">{lang.flag}</span>
                  <span className="hidden xl:inline">{lang.label}</span>
                </button>
              ))}
            </div>

            {/* Currency Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1.5 text-sm font-medium text-white/70 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 hover:border-purple-400/50">
                <Coins strokeWidth={1.5} className="w-4 h-4 text-purple-400" />
                <span>{currency}</span>
              </button>
              <div className="absolute top-full mt-2 end-0 w-28 bg-[hsl(218_41%_14%)] text-white rounded-xl shadow-2xl border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all origin-top-right z-50 py-1">
                {CURRENCY_LIST.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    className={`block w-full text-start px-4 py-2 text-sm hover:bg-white/8 transition-colors ${
                      currency === c
                        ? "gradient-text font-semibold"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <Link
              href="/admin"
              className="p-2 text-white/50 hover:text-purple-400 hover:bg-white/5 rounded-lg transition-colors"
            >
              <ShieldCheck strokeWidth={1.5} className="w-5 h-5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-white/70 hover:text-purple-300"
            onClick={() => setMobileOpen(true)}
          >
            <Menu strokeWidth={1.5} className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed inset-0 z-50 h-screen w-full p-6 flex flex-col overflow-y-auto"
            style={{
              background: "rgba(15, 23, 42, 0.97)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            <div className="flex justify-between items-center mb-8">
              <span className="font-display font-bold text-xl gradient-text">Menu</span>
              <button onClick={() => setMobileOpen(false)} className="p-2 text-white/70 hover:text-purple-300">
                <X strokeWidth={1.5} className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  onClick={() => setMobileOpen(false)}
                  className="text-xl font-medium text-white/80 hover:text-purple-300 border-b border-white/10 pb-4"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="mt-8">
              <label className="text-xs text-white/40 mb-3 block uppercase tracking-wider">{t("language")}</label>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold border transition-all ${
                      language === lang.code
                        ? "gradient-bg text-white border-transparent"
                        : "bg-white/5 text-white/60 border-white/10 hover:border-purple-400/50"
                    }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <label className="text-xs text-white/40 mb-3 block uppercase tracking-wider">{t("currency")}</label>
              <div className="flex flex-wrap gap-2">
                {CURRENCY_LIST.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    className={`px-3 py-2 rounded-xl text-sm font-semibold border transition-all ${
                      currency === c
                        ? "gradient-bg text-white border-transparent"
                        : "bg-white/5 text-white/60 border-white/10 hover:border-purple-400/50"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-8">
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 text-white/50 hover:text-purple-300 text-sm"
              >
                <ShieldCheck strokeWidth={1.5} className="w-4 h-4" />
                Admin
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
