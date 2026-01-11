import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Calendar, ArrowUpRight, ArrowDownRight, Wallet, CreditCard, Banknote } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import DateFilter from '../components/DateFilter';

interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  type: string;
}

export default function Reports() {
  const [search, setSearch] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({ start: new Date(), end: new Date() });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(t => 
    t.description?.toLowerCase().includes(search.toLowerCase()) ||
    t.amount.toString().includes(search)
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'kassa': return <Wallet className="h-4 w-4 text-emerald-400" />;
      case 'xarajat': return <Banknote className="h-4 w-4 text-red-400" />;
      default: return <CreditCard className="h-4 w-4 text-blue-400" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'kassa': return 'Kassa';
      case 'click': return 'Click';
      case 'uzcard': return 'Uzcard';
      case 'humo': return 'Humo';
      case 'xarajat': return 'Xarajat';
      default: return type;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Search */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-white tracking-tight">Xisobotlar</h2>
        
        <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
          {/* Search Bar */}
          <div className="relative w-full sm:max-w-xs">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full rounded-xl border border-white/10 bg-black/20 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:bg-white/5 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
              placeholder="Qidiruv..."
            />
          </div>
          
          {/* Filter & Export Buttons */}
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filtr</span>
            </button>
            <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Yuklash</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-3xl border border-white/5 bg-white/5 backdrop-blur-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-white/5 text-xs uppercase font-medium text-slate-300">
              <tr>
                <th className="px-6 py-4">Sana</th>
                <th className="px-6 py-4">Turi</th>
                <th className="px-6 py-4">Izoh</th>
                <th className="px-6 py-4 text-right">Summa</th>
                <th className="px-6 py-4 text-right">Holat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    Yuklanmoqda...
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    Ma'lumot topilmadi
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((item) => (
                  <tr key={item.id} className="group hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-white">
                        <Calendar className="h-4 w-4 text-slate-500" />
                        {format(new Date(item.date), 'dd.MM.yyyy HH:mm')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="rounded-lg bg-white/5 p-1.5">
                          {getTypeIcon(item.type)}
                        </div>
                        <span className="font-medium text-white">{getTypeLabel(item.type)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {item.description || <span className="text-slate-600 italic">Izohsiz</span>}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <span className={`font-mono font-bold text-lg ${item.type === 'xarajat' ? 'text-red-400' : 'text-emerald-400'}`}>
                        {item.type === 'xarajat' ? '-' : '+'} {item.amount.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-500 ml-1">UZS</span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        item.type === 'xarajat' 
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {item.type === 'xarajat' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {item.type === 'xarajat' ? 'Chiqim' : 'Kirim'}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination (Placeholder) */}
        <div className="border-t border-white/5 bg-white/5 px-6 py-4 flex items-center justify-between">
          <span className="text-xs text-slate-500">Jami {filteredTransactions.length} ta yozuv</span>
          <div className="flex gap-2">
            <button className="rounded-lg border border-white/10 px-3 py-1 text-xs text-slate-400 hover:bg-white/5 hover:text-white disabled:opacity-50">Oldingi</button>
            <button className="rounded-lg border border-white/10 px-3 py-1 text-xs text-slate-400 hover:bg-white/5 hover:text-white disabled:opacity-50">Keyingi</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
