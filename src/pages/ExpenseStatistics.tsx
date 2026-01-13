import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BarChart3, TrendingUp, DollarSign, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { formatCurrency } from '../utils/currency';
import { format } from 'date-fns';
import { uz } from 'date-fns/locale';

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

  useEffect(() => {
    fetchCategories();
    fetchTransactions();
  }, []);

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

  const getCategoryStats = (category: string) => {
    const categoryTransactions = transactions.filter(t => t.category === category);
    const total = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
    return {
      count: categoryTransactions.length,
      total
    };
  };

  const getTotalExpenses = () => {
    return transactions.reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalCount = () => {
    return transactions.length;
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
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Jami operatsiyalar</p>
              <p className="text-2xl font-bold text-white">{getTotalCount()}</p>
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
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 text-green-400">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Bo'limlar soni</p>
              <p className="text-2xl font-bold text-white">{categories.length}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Category Statistics */}
      {categories.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-bold text-white">Bo'limlar bo'yicha statistika</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => {
              const stats = getCategoryStats(category);
              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm"
                >
                  <h3 className="mb-4 text-lg font-bold text-white">{category}</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">Jami:</span>
                      <span className="text-lg font-bold text-white">{formatCurrency(stats.total)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-400">Soni:</span>
                      <span className="text-lg font-bold text-white">{stats.count}</span>
                    </div>
                    {getTotalExpenses() > 0 && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                          <span>Foiz:</span>
                          <span>{((stats.total / getTotalExpenses()) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-red-500 to-pink-500 transition-all"
                            style={{ width: `${(stats.total / getTotalExpenses()) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

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
    </div>
  );
}
