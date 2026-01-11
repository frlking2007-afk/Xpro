import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, ArrowRight, Wallet, TrendingUp, ShieldCheck } from 'lucide-react';

export default function XproLanding() {
  const navigate = useNavigate();

  return (
    <div className="flex h-full flex-col items-center justify-center py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative max-w-2xl text-center"
      >
        {/* Background Gradients */}
        <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-blue-600/20 blur-[100px]" />
        <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-purple-600/20 blur-[100px]" />

        <div className="relative z-10">
          <div className="mb-8 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-blue-600 to-purple-600 shadow-2xl shadow-blue-500/30">
              <Zap className="h-10 w-10 text-white" />
            </div>
          </div>

          <h1 className="mb-10 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Xpro <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Moliya</span>
          </h1>

          <button
            onClick={() => navigate('/xpro/operations')}
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl bg-white px-8 py-4 text-lg font-bold text-slate-900 transition-all hover:bg-slate-100 hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-2">
              Xisobotni Boshlash
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </span>
          </button>

          {/* Features Grid */}
          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                <Wallet className="h-5 w-5" />
              </div>
              <h3 className="mb-1 font-semibold text-white">Kassa Nazorati</h3>
              <p className="text-xs text-slate-400">Kirimlarni to'liq nazorat qiling</p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h3 className="mb-1 font-semibold text-white">Aniq Statistika</h3>
              <p className="text-xs text-slate-400">Foyda va zararni kuzatib boring</p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/5 p-4 backdrop-blur-sm">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="mb-1 font-semibold text-white">Xavfsiz Tizim</h3>
              <p className="text-xs text-slate-400">Ma'lumotlar ishonchli qo'lda</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
