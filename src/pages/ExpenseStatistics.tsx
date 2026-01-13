import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BarChart3, TrendingUp, DollarSign, FileText, TrendingDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { formatCurrency } from '../utils/currency';
import { format } from 'date-fns';
import { uz } from 'date-fns/locale';
import SalesModal from '../components/SalesModal';

interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  type: string;
  category?: string;
}

export default function ExpenseStatistics() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [sales, setSales] = useState<number>(0);
  const [isSalesModalOpen, setIsSalesModalOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchTransactions();
    loadSales();
  }, []);

  const loadSales = () => {
    const savedSales = localStorage.getItem('salesAmount');
    if (savedSales) {
      setSales(parseFloat(savedSales));
    }
  };

  const handleSaveSales = (amount: number) => {
    localStorage.setItem('salesAmount', amount.toString());
    setSales(amount);
  };

  const fetchCategories = () => {
    const cats = JSON.parse(localStorage.getItem('expenseCategories') || '[]');
    setCategories(cats);
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('type', 'xarajat')
        .order('date', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };


  const getTotalExpenses = () => {
    return transactions.reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalCount = () => {
    return transactions.length;
  };

  const getProfitOrLoss = () => {
    const totalExpenses = getTotalExpenses();
    const profit = sales - totalExpenses;
    return {
      amount: profit,
      isProfit: profit >= 0
    };
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-white">Yuklanmoqda...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/xpro/operations')}
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-white transition-colors hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <BarChart3 className="h-7 w-7 text-blue-400" />
              Xarajatlar statistikasi
            </h1>
            <p className="text-sm text-slate-400 mt-1">Barcha xarajatlar bo'yicha batafsil statistika</p>
          </div>
        </div>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => setIsSalesModalOpen(true)}
          className="cursor-pointer rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm transition-all hover:bg-black/30 hover:border-white/20"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 text-green-400">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Savdo</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(sales)}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-400">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Umumiy xarajat</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(getTotalExpenses())}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm"
        >
          <div className="flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
              getProfitOrLoss().isProfit ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
            }`}>
              {getProfitOrLoss().isProfit ? (
                <TrendingUp className="h-6 w-6" />
              ) : (
                <TrendingDown className="h-6 w-6" />
              )}
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">
                {getProfitOrLoss().isProfit ? 'Foyda' : 'Zarar'}
              </p>
              <p className={`text-2xl font-bold ${
                getProfitOrLoss().isProfit ? 'text-green-400' : 'text-red-400'
              }`}>
                {formatCurrency(Math.abs(getProfitOrLoss().amount))}
              </p>
            </div>
          </div>
        </motion.div>
      </div>


      {/* Recent Transactions */}
      {transactions.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-bold text-white">So'nggi operatsiyalar</h2>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
            <div className="space-y-3">
              {transactions.slice(0, 10).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-4"
                >
                  <div>
                    <p className="font-bold text-white">
                      {formatCurrency(transaction.amount)}
                    </p>
                    <p className="text-sm text-slate-400">
                      {transaction.category && (
                        <span className="text-blue-400">{transaction.category} • </span>
                      )}
                      {transaction.description || 'Izohsiz'} • {format(new Date(transaction.date), 'd MMMM yyyy, HH:mm', { locale: uz })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <SalesModal
        isOpen={isSalesModalOpen}
        onClose={() => setIsSalesModalOpen(false)}
        onSave={handleSaveSales}
        currentSales={sales}
      />
    </div>
  );
}
