import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, ArrowRight, Wallet, TrendingUp, ShieldCheck, Play, Lock, Plus } from 'lucide-react';
import { useShift } from '../hooks/useShift';

export default function XproLanding() {
  const navigate = useNavigate();
  const { currentShift, loading, openShift } = useShift();
  const [isStarting, setIsStarting] = useState(false);

  const handleStart = async () => {
    setIsStarting(true);
    if (currentShift) {
      // Shift already open, just navigate
      navigate('/xpro/operations');
    } else {
      // Open new shift
      const shift = await openShift(0); // Default 0 starting balance for now
      if (shift) {
        navigate('/xpro/operations');
      }
    }
    setIsStarting(false);
  };

  const handleNewShift = async () => {
    setIsStarting(true);
    // Always open a new shift, even if one is already open
    const shift = await openShift(0); // Default 0 starting balance for now
    if (shift) {
      navigate('/xpro/operations');
    }
    setIsStarting(false);
  };

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

          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Xpro <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Moliya</span>
          </h1>
          
          <div className="mb-10 flex justify-center">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border ${
              loading ? 'bg-slate-800 border-slate-700 text-slate-400' :
              currentShift 
                ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}>
              <span className={`mr-1.5 h-2 w-2 rounded-full ${
                loading ? 'bg-slate-500' :
                currentShift ? 'bg-green-500 animate-pulse' : 'bg-slate-500'
              }`}></span>
              {loading ? 'Yuklanmoqda...' : currentShift ? 'Smena Ochiq' : 'Smena Yopiq'}
            </span>
          </div>

          <div className="flex items-center gap-4 justify-center">
          <button
            onClick={handleStart}
            disabled={loading || isStarting}
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl bg-white px-8 py-4 text-lg font-bold text-slate-900 transition-all hover:bg-slate-100 hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span className="relative z-10 flex items-center gap-2">
              {currentShift ? 'Davom Ettirish' : 'Smenani Boshlash'}
              {currentShift ? <ArrowRight className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </span>
          </button>
            
            {currentShift && (
              <button
                onClick={handleNewShift}
                disabled={loading || isStarting}
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl border-2 border-blue-500/50 bg-blue-500/10 px-8 py-4 text-lg font-bold text-blue-400 transition-all hover:bg-blue-500/20 hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Yangi Smena Ochish
                  <Plus className="h-5 w-5" />
                </span>
              </button>
            )}
          </div>

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
