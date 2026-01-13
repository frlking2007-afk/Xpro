import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, BarChart3 } from 'lucide-react';
import { formatCurrency, getCurrencySymbol } from '../utils/currency';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  type: string;
  category?: string;
}

interface ExpenseCategoriesTabProps {
  categories: string[];
  transactions: Transaction[];
  onAddExpense: (category: string, amount: number, description: string) => void;
  onDeleteTransaction: (id: string) => void;
  loading: boolean;
  shiftId: string | undefined;
  isReadOnly?: boolean;
}

export default function ExpenseCategoriesTab({
  categories,
  transactions,
  onAddExpense,
  onDeleteTransaction,
  loading,
  shiftId,
  isReadOnly = false
}: ExpenseCategoriesTabProps) {
  const [categoryInputs, setCategoryInputs] = useState<Record<string, { amount: string; description: string }>>({});
  const navigate = useNavigate();

  // Format number with spaces (50000 -> 50 000)
  const formatNumber = (value: string): string => {
    const numericValue = value.replace(/\s/g, '').replace(/[^0-9]/g, '');
    if (!numericValue) return '';
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const handleAmountChange = (category: string, value: string) => {
    const formatted = formatNumber(value);
    setCategoryInputs(prev => ({
      ...prev,
      [category]: { ...prev[category], amount: formatted }
    }));
  };

  const handleDescriptionChange = (category: string, value: string) => {
    setCategoryInputs(prev => ({
      ...prev,
      [category]: { ...prev[category], description: value }
    }));
  };

  const handleSave = (e: React.FormEvent, category: string) => {
    e.preventDefault();
    const input = categoryInputs[category];
    if (!input?.amount) return;
    if (!shiftId) {
      toast.error("Smena ochiq emas! Iltimos, avval smenani oching.");
      return;
    }

    const numericAmount = parseFloat(input.amount.replace(/\s/g, ''));
    onAddExpense(category, numericAmount, input.description || '');
    
    // Clear inputs for this category
    setCategoryInputs(prev => ({
      ...prev,
      [category]: { amount: '', description: '' }
    }));
  };

  const getCategoryTransactions = (category: string) => {
    return transactions.filter(t => t.category === category);
  };


  if (categories.length === 0) {
    return (
      <div className="rounded-xl border border-white/5 bg-white/5 p-8 text-center text-slate-500">
        Hozircha ma'lumot yo'q
        <p className="mt-2 text-xs text-slate-600">Bo'lim qo'shish tugmasini bosing</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => {
        const categoryTransactions = getCategoryTransactions(category);
        
        return (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm"
          >
            {/* Category Name */}
            <h3 className="mb-4 text-lg font-bold text-white">{category}</h3>

            {/* Input Form */}
            <form onSubmit={(e) => handleSave(e, category)} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Summa
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={categoryInputs[category]?.amount || ''}
                    onChange={(e) => handleAmountChange(category, e.target.value)}
                    placeholder="0"
                    disabled={isReadOnly}
                    className="block w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-4 pr-12 text-base font-bold text-white placeholder-slate-600 focus:border-red-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                  />
                  <span className="absolute right-4 top-2.5 text-xs font-medium text-slate-500">{getCurrencySymbol()}</span>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Tavsif
                </label>
                <input
                  type="text"
                  value={categoryInputs[category]?.description || ''}
                  onChange={(e) => handleDescriptionChange(category, e.target.value)}
                  placeholder="Izoh yozing..."
                  disabled={isReadOnly}
                  className="block w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-4 text-sm text-white placeholder-slate-600 focus:border-red-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <button
                type="submit"
                disabled={loading || isReadOnly}
                className="w-full rounded-xl bg-gradient-to-r from-red-600 to-pink-600 py-2.5 text-sm font-bold text-white transition-all hover:from-red-500 hover:to-pink-500 shadow-lg shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saqlanmoqda...' : isReadOnly ? 'Faqat ko\'rish' : 'Saqlash'}
              </button>
            </form>

            {/* Statistics Button */}
            <button
              onClick={() => navigate('/expense-statistics')}
              className="mt-4 w-full rounded-xl border border-blue-500/50 bg-blue-500/10 py-2.5 text-sm font-medium text-blue-400 transition-all hover:bg-blue-500/20 flex items-center justify-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Statistika
            </button>

            {/* Category Transactions List */}
            {categoryTransactions.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Operatsiyalar</p>
                <div className="max-h-40 space-y-1.5 overflow-y-auto">
                  {categoryTransactions.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 p-2 text-xs"
                    >
                      <div>
                        <p className="font-semibold text-white">{formatCurrency(item.amount)}</p>
                        <p className="text-slate-400">{item.description || 'Izohsiz'}</p>
                      </div>
                      {!isReadOnly && (
                        <button
                          onClick={() => onDeleteTransaction(item.id)}
                          className="rounded p-1 text-slate-500 transition-all hover:bg-red-500/20 hover:text-red-400"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
