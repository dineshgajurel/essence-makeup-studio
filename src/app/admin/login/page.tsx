"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Lock, User, ArrowRight, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "Invalid login credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-black relative overflow-hidden font-main">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-primary/20 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-8 sm:p-12 rounded-[32px] sm:rounded-[48px] shadow-2xl relative z-10"
      >
        <div className="text-center mb-10 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-white mb-2 uppercase">
            ESSENCE <span className="text-primary text-base sm:text-lg align-top tracking-widest ml-1">ADMIN</span>
          </h1>
          <p className="text-gray-500 text-[10px] sm:text-xs uppercase tracking-widest font-bold">Studio Management Panel</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 sm:space-y-8">
          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl flex items-center gap-3 text-[10px] uppercase font-bold tracking-widest"
            >
              <AlertCircle size={18} />
              {error}
            </motion.div>
          )}

          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-600 ml-1 uppercase tracking-widest">Email Address</label>
            <div className="relative">
              <User className="absolute left-6 top-1/2 -translate-y-1/2 text-primary" size={18} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@essence.com"
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-5 focus:outline-none focus:border-primary/50 transition-all text-white font-bold"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-600 ml-1 uppercase tracking-widest">Security Code</label>
            <div className="relative">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-primary" size={18} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-5 focus:outline-none focus:border-primary/50 transition-all text-white font-bold"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-black font-black py-5 sm:py-6 rounded-2xl sm:rounded-3xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4 disabled:opacity-50 disabled:scale-100 uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-primary/20"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                Enter Dashboard
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 sm:mt-12 text-center">
          <button className="text-gray-600 hover:text-primary text-[10px] font-black uppercase tracking-widest transition-colors">
            Forgot Credentials?
          </button>
        </div>
      </motion.div>

      {/* Footer Branding */}
      <div className="absolute bottom-8 text-gray-800 text-[10px] font-black tracking-[0.4em] uppercase pointer-events-none text-center px-6">
        Essence Unisex Studio &copy; 2026
      </div>
    </div>
  );
}
