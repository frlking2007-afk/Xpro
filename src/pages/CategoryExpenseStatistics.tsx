import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BarChart3, DollarSign, TrendingUp, Calendar, FileText } from 'lucide-react';
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

export default function CategoryExpenseStatistics() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryName = searchParams.get('category');
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (categoryName) {
      fetchTransactions();
    }
  }, [categoryName]);

  const fetchTransactions = async () => {
    if (!categoryName) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('type', 'xarajat')
        .eq('category', categoryName)
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

  const getAverageExpense = () => {
    if (transactions.length === 0) return 0;
    return getTotalExpenses() / transactions.length;
  };

  if (!categoryName) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-white">Bo'lim topilmadi</div>
      </div>
    );
  }

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
            onClick={() => navigate('/expense-statistics')}
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-white transition-colors hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <BarChart3 className="h-7 w-7 text-red-400" />
              {categoryName} - Xarajatlar statistikasi
            </h1>
            <p className="text-sm text-slate-400 mt-1">Bo'lim bo'yicha batafsil statistika va tarix</p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
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
              <p className="text-xs text-slate-400 uppercase tracking-wider">Jami xarajat</p>
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
              <p className="text-xs text-slate-400 uppercase tracking-wider">Operatsiyalar soni</p>
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
              <p className="text-xs text-slate-400 uppercase tracking-wider">O'rtacha xarajat</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(getAverageExpense())}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Expenses History */}
      <div>
        <h2 className="mb-4 text-xl font-bold text-white flex items-center gap-2">
          <Calendar className="h-6 w-6 text-blue-400" />
          Xarajatlar tarixi
        </h2>
        
        {transactions.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-black/20 p-8 text-center backdrop-blur-sm">
            <p className="text-slate-400">Hozircha xarajatlar mavjud emas</p>
            <p className="text-sm text-slate-500 mt-2">Bu bo'lim bo'yicha xarajatlar qo'shilmagan</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
            <div className="space-y-3">
              {transactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-4 transition-colors hover:bg-white/10 hover:border-white/10"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-400">
                      <DollarSign className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-white text-lg">
                        {formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-sm text-slate-400 mt-1">
                        {transaction.description || 'Izohsiz'}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(transaction.date), 'd MMMM yyyy, HH:mm', { locale: uz })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
