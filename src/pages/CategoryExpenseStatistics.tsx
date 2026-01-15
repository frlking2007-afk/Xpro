import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BarChart3, DollarSign, TrendingUp, Calendar, FileText, Trash2, Edit, Check, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { formatCurrency } from '../utils/currency';
import { format } from 'date-fns';
import { uz } from 'date-fns/locale';
import { toast } from 'sonner';
import PasswordModal from '../components/PasswordModal';
import { verifyPassword, isPasswordSet } from '../utils/password';
import SalesModal from '../components/SalesModal';

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
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  const [isSalesModalOpen, setIsSalesModalOpen] = useState(false);
  const [categorySales, setCategorySales] = useState<number>(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState<string>('');
  const [editDescription, setEditDescription] = useState<string>('');

  useEffect(() => {
    if (categoryName) {
      fetchTransactions();
      // Load category sales from localStorage
      const savedSales = localStorage.getItem(`categorySales_${categoryName}`);
      setCategorySales(savedSales ? parseFloat(savedSales) : 0);
    }
  }, [categoryName]);

  // Listen for transaction updates when page is visible
  useEffect(() => {
    const handleTransactionUpdate = () => {
      if (categoryName) {
        fetchTransactions();
      }
    };
    
    window.addEventListener('transactionAdded', handleTransactionUpdate);
    window.addEventListener('transactionDeleted', handleTransactionUpdate);
    window.addEventListener('transactionUpdated', handleTransactionUpdate);
    
    // Refresh when page becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden && categoryName) {
        fetchTransactions();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('transactionAdded', handleTransactionUpdate);
      window.removeEventListener('transactionDeleted', handleTransactionUpdate);
      window.removeEventListener('transactionUpdated', handleTransactionUpdate);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [categoryName]);

  const fetchTransactions = async () => {
    if (!categoryName) return;
    
    setLoading(true);
    try {
      // First try to fetch by category column
      let { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('type', 'xarajat')
        .eq('category', categoryName)
        .order('date', { ascending: false });

      // If category column doesn't exist or returns empty, try filtering by description
      if (error || !data || data.length === 0) {
        // Fetch all xarajat transactions
        const { data: allData, error: allError } = await supabase
          .from('transactions')
          .select('*')
          .eq('type', 'xarajat')
          .order('date', { ascending: false });

        if (allError) throw allError;

        // Filter by category name in description (format: [CategoryName])
        data = (allData || []).filter(t => {
          // Check if category column exists and matches
          if (t.category === categoryName) return true;
          // Check if description contains [CategoryName]
          if (t.description && t.description.includes(`[${categoryName}]`)) return true;
          return false;
        });
      }

      if (error && !data) throw error;
      setTransactions(data || []);
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      // If error, try alternative method
      try {
        const { data: allData, error: allError } = await supabase
          .from('transactions')
          .select('*')
          .eq('type', 'xarajat')
          .order('date', { ascending: false });

        if (allError) throw allError;

        // Filter by description
        const filtered = (allData || []).filter(t => {
          if (t.category === categoryName) return true;
          if (t.description && t.description.includes(`[${categoryName}]`)) return true;
          return false;
        });

        setTransactions(filtered);
      } catch (fallbackError: any) {
        console.error('Fallback error:', fallbackError);
        setTransactions([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const getTotalExpenses = () => {
    return transactions.reduce((sum, t) => sum + t.amount, 0);
  };

  const getProfitOrLoss = () => {
    if (categorySales === 0) return 0;
    return categorySales - getTotalExpenses();
  };

  const handleSaveSales = (amount: number) => {
    if (categoryName) {
      localStorage.setItem(`categorySales_${categoryName}`, amount.toString());
      setCategorySales(amount);
      toast.success('Savdo summasi saqlandi!');
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    // Check if password is set
    if (isPasswordSet()) {
      setTransactionToDelete(id);
      setIsPasswordModalOpen(true);
      return;
    }

    // If no password is set, delete directly
    await performDelete(id);
  };

  const performDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTransactions(transactions.filter(t => t.id !== id));
      
      // Dispatch event to notify other components
      window.dispatchEvent(new Event('transactionDeleted'));
      
      toast.success("O'chirildi!");
    } catch (error: any) {
      console.error('Error deleting transaction:', error);
      toast.error('O\'chirishda xatolik: ' + error.message);
    }
  };

  const handlePasswordConfirm = (password: string) => {
    if (!verifyPassword(password)) {
      toast.error('Noto\'g\'ri parol');
      return;
    }

    if (transactionToDelete) {
      performDelete(transactionToDelete);
      setTransactionToDelete(null);
    }
    setIsPasswordModalOpen(false);
  };

  // Format number with spaces (50000 -> 50 000)
  const formatNumber = (value: string): string => {
    const numericValue = value.replace(/\s/g, '').replace(/[^0-9]/g, '');
    if (!numericValue) return '';
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setEditAmount(Math.abs(transaction.amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' '));
    setEditDescription(transaction.description || '');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditAmount('');
    setEditDescription('');
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editAmount) return;

    try {
      const numericAmount = parseFloat(editAmount.replace(/\s/g, ''));
      if (isNaN(numericAmount) || numericAmount <= 0) {
        toast.error('Noto\'g\'ri summa');
        return;
      }

      // Update transaction in Supabase
      const { error } = await supabase
        .from('transactions')
        .update({
          amount: numericAmount,
          description: editDescription || null
        })
        .eq('id', editingId);

      if (error) throw error;

      // Update local state
      setTransactions(transactions.map(t => 
        t.id === editingId 
          ? { ...t, amount: numericAmount, description: editDescription }
          : t
      ));

      // Dispatch event to notify other components
      window.dispatchEvent(new Event('transactionUpdated'));
      
      toast.success('O\'zgartirildi!');
      handleCancelEdit();
    } catch (error: any) {
      console.error('Error updating transaction:', error);
      toast.error('O\'zgartirishda xatolik: ' + error.message);
    }
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
            onClick={() => navigate('/xpro/operations?tab=xarajat')}
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
          onClick={() => setIsSalesModalOpen(true)}
          className="rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm cursor-pointer transition-all hover:bg-black/30 hover:border-white/20"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 text-green-400">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Savdo</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(categorySales)}</p>
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
              <FileText className="h-6 w-6" />
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
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm"
        >
          <div className="flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
              getProfitOrLoss() >= 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
            }`}>
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">
                {getProfitOrLoss() >= 0 ? 'Foyda' : 'Zarar'}
              </p>
              <p className={`text-2xl font-bold ${
                getProfitOrLoss() >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {formatCurrency(Math.abs(getProfitOrLoss()))}
              </p>
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
                  className={`rounded-xl border border-white/5 bg-white/5 p-4 transition-colors hover:bg-white/10 hover:border-white/10 ${
                    editingId === transaction.id ? 'border-blue-500/50 bg-blue-500/5' : ''
                  }`}
                >
                  {editingId === transaction.id ? (
                    // Edit Mode
                    <div className="space-y-3">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-400">Summa</label>
                        <input
                          type="text"
                          value={editAmount}
                          onChange={(e) => setEditAmount(formatNumber(e.target.value))}
                          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                          autoFocus
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-400">Tavsif</label>
                        <input
                          type="text"
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleSaveEdit}
                          className="flex-1 rounded-lg bg-green-500/20 px-3 py-2 text-green-400 transition-all hover:bg-green-500/30 flex items-center justify-center gap-2"
                        >
                          <Check className="h-4 w-4" />
                          Saqlash
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex-1 rounded-lg bg-red-500/20 px-3 py-2 text-red-400 transition-all hover:bg-red-500/30 flex items-center justify-center gap-2"
                        >
                          <X className="h-4 w-4" />
                          Bekor qilish
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="flex items-center justify-between">
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
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditTransaction(transaction)}
                          className="rounded-lg p-2 text-slate-500 transition-all hover:bg-blue-500/20 hover:text-blue-400"
                          title="Tahrirlash"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTransaction(transaction.id)}
                          className="rounded-lg p-2 text-slate-500 transition-all hover:bg-red-500/20 hover:text-red-400"
                          title="O'chirish"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => {
          setIsPasswordModalOpen(false);
          setTransactionToDelete(null);
        }}
        onConfirm={handlePasswordConfirm}
        title="Parolni kiriting"
        message="Xarajatni o'chirish uchun parolni kiriting"
      />

      <SalesModal
        isOpen={isSalesModalOpen}
        onClose={() => setIsSalesModalOpen(false)}
        onSave={handleSaveSales}
        currentSales={categorySales}
      />
    </div>
  );
}
