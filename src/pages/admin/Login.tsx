import { useState } from "react";
import { useLocation } from "wouter";
import { useAppStore } from "@/lib/store";
import { Lock, User, ShieldCheck, Eye, EyeOff } from "lucide-react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [, setLocation] = useLocation();
  const { login } = useAppStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      setLocation("/admin");
    } else {
      setError("Invalid username or password");
      setPassword("");
    }
  };

  const inputClass =
    "w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30 transition-all text-white placeholder:text-white/30";

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "hsl(222 47% 11%)" }}
    >
      {/* Background glows */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full opacity-20 blur-[120px] bg-purple-600 pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full opacity-15 blur-[120px] bg-blue-600 pointer-events-none" />

      <div
        className="w-full max-w-md relative z-10 p-8 rounded-3xl border border-white/10"
        style={{ background: "hsl(218 41% 14%)", backdropFilter: "blur(16px)" }}
      >
        {/* Icon */}
        <div className="flex justify-center mb-7">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center gradient-bg shadow-lg shadow-purple-500/30">
            <ShieldCheck strokeWidth={1.5} className="w-8 h-8 text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-display font-bold text-center text-white mb-1.5">
          Admin Portal
        </h1>
        <p className="text-center text-white/40 mb-8 text-sm">
          Sign in to access the Loomi Shop dashboard
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div className="relative">
            <div className="absolute inset-y-0 start-0 pl-4 flex items-center pointer-events-none">
              <User strokeWidth={1.5} className="w-5 h-5 text-white/30" />
            </div>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className={inputClass}
              autoComplete="username"
              autoFocus
            />
          </div>

          {/* Password */}
          <div className="relative">
            <div className="absolute inset-y-0 start-0 pl-4 flex items-center pointer-events-none">
              <Lock strokeWidth={1.5} className="w-5 h-5 text-white/30" />
            </div>
            <input
              type={showPass ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={`${inputClass} pe-12`}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute inset-y-0 end-0 pe-4 flex items-center text-white/30 hover:text-white/70 transition-colors"
            >
              {showPass
                ? <EyeOff strokeWidth={1.5} className="w-4 h-4" />
                : <Eye strokeWidth={1.5} className="w-4 h-4" />}
            </button>
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-xl py-2.5">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full gradient-bg text-white font-bold py-4 rounded-2xl hover:opacity-90 hover:shadow-lg hover:shadow-purple-500/30 transition-all active:scale-[0.98] mt-2"
          >
            Access Dashboard
          </button>
        </form>

        <div className="mt-8 text-center">
          <a href="/" className="text-sm text-white/30 hover:text-white/70 transition-colors">
            ← Back to Storefront
          </a>
        </div>
      </div>
    </div>
  );
}
