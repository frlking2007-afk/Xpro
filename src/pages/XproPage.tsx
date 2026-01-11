import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, CreditCard, Banknote, Upload, ArrowDownRight, ArrowUpRight, DollarSign } from 'lucide-react';

const tabs = [
  { id: 'kassa', label: 'KASSA', icon: Wallet },
  { id: 'click', label: 'CLICK', icon: CreditCard },
  { id: 'uzcard', label: 'UZCARD', icon: CreditCard },
  { id: 'humo', label: 'HUMO', icon: CreditCard },
  { id: 'xarajat', label: 'XARAJAT', icon: Banknote },
  { id: 'eksport', label: 'EKSPORT', icon: Upload },
];

export default function XproPage() {
  const [activeTab, setActiveTab] = useState('kassa');

  return (
    <div className="space-y-8">
      {/* Top Navigation Tabs */}
      <div className="relative">
        <div className="flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-white/10 bg-black/40 p-2 backdrop-blur-xl sm:justify-start">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-300 ${
                  isActive ? 'text-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-xl bg-white"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <tab.icon className={`h-4 w-4 ${isActive ? 'text-black' : 'text-slate-400 group-hover:text-white'}`} />
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-3xl border border-white/5 bg-white/5 p-8 backdrop-blur-sm"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white uppercase tracking-wider">{tabs.find(t => t.id === activeTab)?.label}</h2>
          <div className="text-sm text-slate-400">Jami balans: <span className="text-white font-mono font-bold">12,450,000 UZS</span></div>
        </div>

        {/* Placeholder Content for Each Tab */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Example Cards */}
          <div className="rounded-2xl bg-black/20 p-6 border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                <ArrowDownRight className="h-5 w-5" />
              </div>
              <span className="text-xs text-slate-500">Bugun, 14:30</span>
            </div>
            <p className="text-2xl font-bold text-white mb-1">+ 450,000</p>
            <p className="text-sm text-slate-400">Kirim</p>
          </div>

          <div className="rounded-2xl bg-black/20 p-6 border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                <ArrowUpRight className="h-5 w-5" />
              </div>
              <span className="text-xs text-slate-500">Bugun, 12:15</span>
            </div>
            <p className="text-2xl font-bold text-white mb-1">- 120,000</p>
            <p className="text-sm text-slate-400">Chiqim</p>
          </div>

          <div className="rounded-2xl bg-black/20 p-6 border border-white/5 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/5 transition-colors group">
            <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 mb-3 group-hover:scale-110 transition-transform">
              <DollarSign className="h-6 w-6" />
            </div>
            <p className="font-medium text-white">Yangi operatsiya</p>
          </div>
        </div>

        {/* Tab Specific Message */}
        <div className="mt-8 text-center text-slate-500 text-sm">
          {activeTab === 'kassa' && "Naqd pul operatsiyalari tarixi"}
          {activeTab === 'click' && "Click orqali to'lovlar tarixi"}
          {activeTab === 'uzcard' && "Uzcard kartasidan o'tkazmalar"}
          {activeTab === 'humo' && "Humo terminali tushumlari"}
          {activeTab === 'xarajat' && "Do'kon va ofis xarajatlari ro'yxati"}
          {activeTab === 'eksport' && "Ma'lumotlarni Excel formatida yuklab olish"}
        </div>
      </motion.div>
    </div>
  );
}
