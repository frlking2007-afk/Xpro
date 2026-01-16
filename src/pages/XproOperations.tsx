import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, CreditCard, Banknote, Upload, Plus, History, Trash2, ArrowRight, Lock, Calendar, FolderPlus, Trash, Edit, Settings, X, DollarSign, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { uz } from 'date-fns/locale';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { useShift } from '../hooks/useShift';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';
import PasswordModal from '../components/PasswordModal';
import AddCategoryModal from '../components/AddCategoryModal';
import ExpenseCategoriesTab from '../components/ExpenseCategoriesTab';
import EditShiftNameModal from '../components/EditShiftNameModal';
import { verifyPassword, isPasswordSet } from '../utils/password';
import { formatCurrency, getCurrencySymbol } from '../utils/currency';
import ExportSettingsModal from '../components/ExportSettingsModal';
import { generateExpenseReceiptHTML, generatePaymentReceiptHTML, generateShiftReceiptHTML, printReceipt, getExportSettings, ExportSettings } from '../utils/export';

const tabs = [
  { id: 'kassa', label: 'KASSA', icon: Wallet, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
  { id: 'click', label: 'CLICK', icon: CreditCard, color: 'text-blue-400', bg: 'bg-blue-500/20' },
  { id: 'uzcard', label: 'UZCARD', icon: CreditCard, color: 'text-purple-400', bg: 'bg-purple-500/20' },
  { id: 'humo', label: 'HUMO', icon: CreditCard, color: 'text-orange-400', bg: 'bg-orange-500/20' },
  { id: 'xarajat', label: 'XARAJAT', icon: Banknote, color: 'text-red-400', bg: 'bg-red-500/20' },
  { id: 'eksport', label: 'EKSPORT', icon: Upload, color: 'text-gray-400', bg: 'bg-gray-500/20' },
];

interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  type: string;
  category?: string;
}

const PaymentTab = ({ 
  type, 
  color, 
  bg, 
  transactions, 
  onAddTransaction,
  onDeleteTransaction,
  onEditTransaction,
  loading,
  shiftId,
  isReadOnly = false
}: { 
  type: string, 
  color: string, 
  bg: string, 
  transactions: Transaction[], 
  onAddTransaction: (amount: number, description: string) => void,
  onDeleteTransaction: (id: string) => void,
  onEditTransaction?: (id: string, amount: number, description: string) => void,
  loading: boolean,
  shiftId: string | undefined,
  isReadOnly?: boolean
}) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Format number with spaces (50000 -> 50 000)
  const formatNumber = (value: string): string => {
    const numericValue = value.replace(/\s/g, '').replace(/[^0-9]/g, '');
    if (!numericValue) return '';
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  // Handle amount input change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatNumber(value);
    setAmount(formatted);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    if (!shiftId) {
      toast.error("Smena ochiq emas! Iltimos, avval smenani oching.");
      return;
    }

    const numericAmount = parseFloat(amount.replace(/\s/g, ''));
    onAddTransaction(numericAmount, description);
    setAmount('');
    setDescription('');
  };

  return (
    <div className="space-y-8">
      {/* Input Form - Hidden for xarajat */}
      {type !== 'xarajat' && (
        <div className="rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400 uppercase tracking-wider">Summa</label>
              <div className="relative">
                <input
                  type="text"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="0"
                  disabled={isReadOnly}
                  className="block w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-4 pr-12 text-lg font-bold text-white placeholder-slate-600 focus:border-blue-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                />
                <span className="absolute right-4 top-3.5 text-sm font-medium text-slate-500">{getCurrencySymbol()}</span>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400 uppercase tracking-wider">Tavsif (Ixtiyoriy)</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Izoh yozing..."
                disabled={isReadOnly}
                className="block w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-sm text-white placeholder-slate-600 focus:border-blue-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={loading || isReadOnly}
              className={`group mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white transition-all shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-blue-500/20 ${loading || isReadOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Saqlanmoqda...' : isReadOnly ? 'Faqat ko\'rish rejimi' : 'Saqlash'}
              {!loading && !isReadOnly && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
            </button>
          </form>
        </div>
      )}

      {/* History List - Hidden title for xarajat */}
      <div>
        {type !== 'xarajat' && (
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-400 uppercase tracking-wider">
            <History className="h-4 w-4" />
            Bugungi operatsiyalar
          </h3>
        )}
        
        <div className="space-y-3">
          {transactions.length === 0 ? (
            <div className="rounded-xl border border-white/5 bg-white/5 p-8 text-center text-slate-500">
              Hozircha ma'lumot yo'q
            </div>
          ) : (
            transactions.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`group rounded-xl border border-white/5 bg-white/5 p-4 transition-colors hover:bg-white/10 hover:border-white/10 ${
                  editingId === item.id ? 'border-blue-500/50 bg-blue-500/5' : ''
                }`}
              >
                {editingId === item.id ? (
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
                        onClick={() => {
                          if (onEditTransaction && editAmount) {
                            const numericAmount = parseFloat(editAmount.replace(/\s/g, '').replace(/[^0-9-]/g, ''));
                            onEditTransaction(item.id, numericAmount, editDescription);
                            setEditingId(null);
                            setEditAmount('');
                            setEditDescription('');
                          }
                        }}
                        className="flex-1 rounded-lg bg-green-500/20 px-3 py-2 text-green-400 transition-all hover:bg-green-500/30"
                      >
                        Saqlash
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditAmount('');
                          setEditDescription('');
                        }}
                        className="flex-1 rounded-lg bg-slate-500/20 px-3 py-2 text-slate-400 transition-all hover:bg-slate-500/30"
                      >
                        Bekor
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${bg} ${color}`}>
                        <Plus className={`h-5 w-5 ${type === 'xarajat' ? 'rotate-45' : ''}`} />
                      </div>
                      <div>
                        <p className="font-bold text-white">
                          {type === 'xarajat' ? '-' : '+'} {formatCurrency(item.amount)}
                        </p>
                        <p className="text-xs text-slate-400">
                          {item.description || "Izohsiz"} • {format(new Date(item.date), 'HH:mm')}
                        </p>
                      </div>
                    </div>
                    {!isReadOnly && (
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => onDeleteTransaction(item.id)}
                          className="rounded-lg p-2 text-slate-500 transition-all hover:bg-red-500/20 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        {onEditTransaction && (
                          <button
                            onClick={() => {
                              setEditingId(item.id);
                              setEditAmount(formatNumber(item.amount.toString()));
                              setEditDescription(item.description || '');
                            }}
                            className="rounded-lg p-2 text-slate-500 transition-all hover:bg-blue-500/20 hover:text-blue-400"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Kassa Tab Component
const KassaTab = ({
  transactions,
  kassaTransactions,
  onAddTransaction,
  onDeleteTransaction,
  onEditTransaction,
  loading,
  shiftId,
  isReadOnly = false
}: {
  transactions: Transaction[];
  kassaTransactions: Transaction[];
  onAddTransaction: (amount: number, description: string) => void;
  onDeleteTransaction: (id: string) => void;
  onEditTransaction: (id: string, amount: number, description: string) => void;
  loading: boolean;
  shiftId: string | undefined;
  isReadOnly?: boolean;
}) => {
  const [kassaAmount, setKassaAmount] = useState('');
  const [kassaDescription, setKassaDescription] = useState('');
  const [salesAmount, setSalesAmount] = useState<number>(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Load sales amount from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('kassa_sales');
    if (saved) {
      setSalesAmount(parseFloat(saved) || 0);
    }
  }, []);

  // Calculate total expenses (click + uzcard + humo + xarajatlar)
  const totalExpenses = transactions.reduce((sum, t) => {
    if (t.type === 'click' || t.type === 'uzcard' || t.type === 'humo' || t.type === 'xarajat') {
      return sum + t.amount;
    }
    return sum;
  }, 0);

  // Calculate profit/loss
  const profitOrLoss = salesAmount > 0 ? salesAmount - totalExpenses : 0;

  // Format number with spaces
  const formatNumber = (value: string): string => {
    const numericValue = value.replace(/\s/g, '').replace(/[^0-9-]/g, '');
    if (!numericValue) return '';
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const handleSalesClick = () => {
    const input = prompt('Savdo summasini kiriting:', salesAmount.toString());
    if (input !== null) {
      const amount = parseFloat(input.replace(/\s/g, '')) || 0;
      setSalesAmount(amount);
      localStorage.setItem('kassa_sales', amount.toString());
    }
  };

  const handleKassaSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kassaAmount) return;
    if (!shiftId) {
      toast.error("Smena ochiq emas! Iltimos, avval smenani oching.");
      return;
    }

    const numericAmount = parseFloat(kassaAmount.replace(/\s/g, '').replace(/[^0-9-]/g, ''));
    onAddTransaction(numericAmount, kassaDescription);
    setKassaAmount('');
    setKassaDescription('');
  };

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Savdo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleSalesClick}
          className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6 cursor-pointer hover:bg-emerald-500/20 transition-colors"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
              <DollarSign className="h-5 w-5 text-emerald-400" />
            </div>
            <span className="text-sm text-slate-400 uppercase">Savdo</span>
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(salesAmount)}</p>
        </motion.div>

        {/* Jami xarajat */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/20">
              <Banknote className="h-5 w-5 text-red-400" />
            </div>
            <span className="text-sm text-slate-400 uppercase">Jami xarajat</span>
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(totalExpenses)}</p>
        </motion.div>

        {/* Foyda */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl border p-6 ${
            profitOrLoss >= 0 
              ? 'border-emerald-500/20 bg-emerald-500/10' 
              : 'border-red-500/20 bg-red-500/10'
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
              profitOrLoss >= 0 ? 'bg-emerald-500/20' : 'bg-red-500/20'
            }`}>
              <TrendingUp className={`h-5 w-5 ${
                profitOrLoss >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`} />
            </div>
            <span className="text-sm text-slate-400 uppercase">Foyda</span>
          </div>
          <p className={`text-2xl font-bold ${
            profitOrLoss >= 0 ? 'text-emerald-400' : 'text-red-400'
          }`}>
            {profitOrLoss >= 0 ? '+' : ''}{formatCurrency(profitOrLoss)}
          </p>
        </motion.div>
      </div>

      {/* Kassa Input Form */}
      <div className="rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm">
        <form onSubmit={handleKassaSave} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400 uppercase tracking-wider">
              Kassa foyda/zarar
            </label>
            <div className="relative">
              <input
                type="text"
                value={kassaAmount}
                onChange={(e) => setKassaAmount(formatNumber(e.target.value))}
                placeholder="0 (zarar uchun - bilan boshlang)"
                disabled={isReadOnly}
                className="block w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-4 pr-12 text-lg font-bold text-white placeholder-slate-600 focus:border-blue-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
              <span className="absolute right-4 top-3.5 text-sm font-medium text-slate-500">{getCurrencySymbol()}</span>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400 uppercase tracking-wider">Tavsif (Ixtiyoriy)</label>
            <input
              type="text"
              value={kassaDescription}
              onChange={(e) => setKassaDescription(e.target.value)}
              placeholder="Izoh yozing..."
              disabled={isReadOnly}
              className="block w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-sm text-white placeholder-slate-600 focus:border-blue-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            disabled={loading || isReadOnly}
            className={`group mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white transition-all shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-blue-500/20 ${loading || isReadOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Saqlanmoqda...' : isReadOnly ? 'Faqat ko\'rish rejimi' : 'Saqlash'}
            {!loading && !isReadOnly && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
          </button>
        </form>
      </div>

      {/* Kassa Operations History */}
      <div>
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-400 uppercase tracking-wider">
          <History className="h-4 w-4" />
          Kassa operatsiyalar tarixi
        </h3>
        
        <div className="space-y-3">
          {kassaTransactions.length === 0 ? (
            <div className="rounded-xl border border-white/5 bg-white/5 p-8 text-center text-slate-500">
              Hozircha ma'lumot yo'q
            </div>
          ) : (
            kassaTransactions.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`group rounded-xl border border-white/5 bg-white/5 p-4 transition-colors hover:bg-white/10 hover:border-white/10 ${
                  editingId === item.id ? 'border-blue-500/50 bg-blue-500/5' : ''
                }`}
              >
                {editingId === item.id ? (
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
                        onClick={() => {
                          if (editAmount) {
                            const numericAmount = parseFloat(editAmount.replace(/\s/g, '').replace(/[^0-9-]/g, ''));
                            onEditTransaction(item.id, numericAmount, editDescription);
                            setEditingId(null);
                            setEditAmount('');
                            setEditDescription('');
                          }
                        }}
                        className="flex-1 rounded-lg bg-green-500/20 px-3 py-2 text-green-400 transition-all hover:bg-green-500/30"
                      >
                        Saqlash
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditAmount('');
                          setEditDescription('');
                        }}
                        className="flex-1 rounded-lg bg-slate-500/20 px-3 py-2 text-slate-400 transition-all hover:bg-slate-500/30"
                      >
                        Bekor
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                        <Wallet className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-white">
                          {item.amount >= 0 ? '+' : ''} {formatCurrency(item.amount)}
                        </p>
                        <p className="text-xs text-slate-400">
                          {item.description || "Izohsiz"} • {format(new Date(item.date), 'HH:mm')}
                        </p>
                      </div>
                    </div>
                    {!isReadOnly && (
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => onDeleteTransaction(item.id)}
                          className="rounded-lg p-2 text-slate-500 transition-all hover:bg-red-500/20 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(item.id);
                            setEditAmount(formatNumber(item.amount.toString()));
                            setEditDescription(item.description || '');
                          }}
                          className="rounded-lg p-2 text-slate-500 transition-all hover:bg-blue-500/20 hover:text-blue-400"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Export Tab Component
const ExportTab = ({
  transactions,
  expenseCategories,
  shiftName,
  onOpenSettings
}: {
  transactions: Transaction[];
  expenseCategories: string[];
  shiftName: string;
  onOpenSettings: (name: string, type: 'category' | 'payment') => void;
}) => {
  const paymentTypes = [
    { id: 'kassa', label: 'KASSA', icon: Wallet, color: 'text-emerald-400' },
    { id: 'click', label: 'CLICK', icon: CreditCard, color: 'text-blue-400' },
    { id: 'uzcard', label: 'UZCARD', icon: CreditCard, color: 'text-purple-400' },
    { id: 'humo', label: 'HUMO', icon: CreditCard, color: 'text-orange-400' },
  ];

  const handleExport = (name: string, type: 'category' | 'payment') => {
    try {
      let filteredTransactions: Transaction[] = [];
      
      if (type === 'category') {
        // Filter by category
        filteredTransactions = transactions.filter(t => {
          if (t.category === name) return true;
          if (t.type === 'xarajat' && t.description && t.description.includes(`[${name}]`)) return true;
          return false;
        });
      } else {
        // Filter by payment type
        filteredTransactions = transactions.filter(t => t.type === name);
      }

      if (filteredTransactions.length === 0) {
        toast.info('Eksport qilish uchun ma\'lumotlar mavjud emas');
        return;
      }

      const settings = getExportSettings(type, name);
      
      let html: string;
      if (type === 'category') {
        // Generate expense receipt
        html = generateExpenseReceiptHTML(filteredTransactions, name, settings, shiftName);
      } else {
        // Generate payment receipt
        html = generatePaymentReceiptHTML(filteredTransactions, name, settings, shiftName);
      }
      
      printReceipt(html);
      toast.success('Chek tayyorlandi!');
    } catch (error: any) {
      toast.error('Eksport qilishda xatolik: ' + error.message);
    }
  };

  const getCategoryTransactions = (category: string) => {
    return transactions.filter(t => {
      // Only process xarajat transactions
      if (t.type !== 'xarajat') {
        return false;
      }

      // Check if category column exists and matches (case-insensitive)
      if (t.category && t.category.toLowerCase().trim() === category.toLowerCase().trim()) {
        return true;
      }
      
      // Check if description contains [CategoryName] format (case-insensitive)
      if (t.description && t.description.toLowerCase().includes(`[${category.toLowerCase()}]`)) {
        return true;
      }
      
      // Check if description contains CategoryName without brackets (case-insensitive)
      if (t.description) {
        const descLower = t.description.toLowerCase();
        const categoryLower = category.toLowerCase();
        // Check if it's an exact word match or in brackets
        if (descLower.includes(`[${categoryLower}]`) || 
            descLower.trim() === categoryLower ||
            descLower.startsWith(`${categoryLower} `) ||
            descLower.endsWith(` ${categoryLower}`) ||
            descLower.includes(` ${categoryLower} `)) {
          return true;
        }
      }
      
      // Also check for exact match without brackets (for backward compatibility, case-insensitive)
      if (t.description && t.description.trim().toLowerCase() === category.toLowerCase().trim()) {
        return true;
      }
      
      return false;
    });
  };

  const handleTabakaExport = () => {
    try {
      // Filter only "Tabaka" category transactions (case-insensitive)
      const tabakaTransactions = transactions.filter(t => {
        if (t.type !== 'xarajat') {
          return false;
        }
        
        // Check if category column exists and matches (case-insensitive)
        if (t.category && t.category.toLowerCase().trim() === 'tabaka') {
          return true;
        }
        
        // Check if description contains [Tabaka] format (case-insensitive)
        if (t.description && t.description.toLowerCase().includes('[tabaka]')) {
          return true;
        }
        
        // Check if description contains Tabaka without brackets (case-insensitive)
        if (t.description) {
          const descLower = t.description.toLowerCase();
          if (descLower.includes('[tabaka]') || 
              descLower.trim() === 'tabaka' ||
              descLower.startsWith('tabaka ') ||
              descLower.endsWith(' tabaka') ||
              descLower.includes(' tabaka ')) {
            return true;
          }
        }
        
        return false;
      });

      if (tabakaTransactions.length === 0) {
        toast.info('Tabaka bo\'limi uchun ma\'lumotlar mavjud emas');
        return;
      }

      const settings = getExportSettings('category', 'Tabaka');
      const html = generateShiftReceiptHTML(tabakaTransactions, transactions, shiftName, settings);
      printReceipt(html);
      toast.success('Chek tayyorlandi!');
    } catch (error: any) {
      toast.error('Eksport qilishda xatolik: ' + error.message);
    }
  };

  return (
    <div className="space-y-8">
      {/* Xarajatlar bo'limi */}
      <div>
        <h2 className="mb-4 text-xl font-bold text-white flex items-center gap-2">
          <Banknote className="h-6 w-6 text-red-400" />
          Xarajatlar bo'limlari
        </h2>
        {expenseCategories.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-black/20 p-8 text-center backdrop-blur-sm">
            <p className="text-slate-400">Hozircha xarajat bo'limlari mavjud emas</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Tabaka - special handling */}
            {expenseCategories.includes('Tabaka') && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">Tabaka</h3>
                  <span className="text-sm text-slate-400">{getCategoryTransactions('Tabaka').length} ta</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleTabakaExport}
                    className="flex-1 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition-all hover:from-green-500 hover:to-emerald-500 shadow-lg shadow-green-500/20"
                  >
                    <Upload className="h-4 w-4 inline mr-2" />
                    Eksport
                  </button>
                  <button
                    onClick={() => onOpenSettings('Tabaka', 'category')}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                    title="Sozlamalar"
                  >
                    <Settings className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}
            {/* Other categories */}
            {expenseCategories.map((category) => {
              // Skip Tabaka as it's already rendered above
              if (category === 'Tabaka') return null;
              
              const categoryTransactions = getCategoryTransactions(category);
              const count = categoryTransactions.length;
              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">{category}</h3>
                    <span className="text-sm text-slate-400">{count} ta</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleExport(category, 'category')}
                      className="flex-1 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition-all hover:from-green-500 hover:to-emerald-500 shadow-lg shadow-green-500/20"
                    >
                      <Upload className="h-4 w-4 inline mr-2" />
                      Eksport
                    </button>
                    <button
                      onClick={() => onOpenSettings(category, 'category')}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                      title="Sozlamalar"
                    >
                      <Settings className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* To'lov turlari */}
      <div>
        <h2 className="mb-4 text-xl font-bold text-white flex items-center gap-2">
          <CreditCard className="h-6 w-6 text-blue-400" />
          To'lov turlari
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {paymentTypes.map((payment) => {
            const paymentTransactions = transactions.filter(t => t.type === payment.id);
            const count = paymentTransactions.length;
            const PaymentIcon = payment.icon;
            return (
              <motion.div
                key={payment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-white/10 bg-black/20 p-6 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <PaymentIcon className={`h-5 w-5 ${payment.color}`} />
                    <h3 className="text-lg font-bold text-white">{payment.label}</h3>
                  </div>
                  <span className="text-sm text-slate-400">{count} ta</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleExport(payment.id, 'payment')}
                    className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2.5 text-sm font-bold text-white transition-all hover:from-blue-500 hover:to-cyan-500 shadow-lg shadow-blue-500/20"
                  >
                    <Upload className="h-4 w-4 inline mr-2" />
                    Eksport
                  </button>
                  <button
                    onClick={() => onOpenSettings(payment.id, 'payment')}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                    title="Sozlamalar"
                  >
                    <Settings className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default function XproOperations() {
  const [activeTab, setActiveTab] = useState('kassa');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const { currentShift, closeShift, loading: shiftLoading, refreshShift } = useShift();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  const [isClearPasswordModalOpen, setIsClearPasswordModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isEditShiftNameModalOpen, setIsEditShiftNameModalOpen] = useState(false);
  const [expenseCategories, setExpenseCategories] = useState<string[]>([]);
  const [exportSettingsModalOpen, setExportSettingsModalOpen] = useState(false);
  const [exportSettingsItem, setExportSettingsItem] = useState<{ name: string; type: 'category' | 'payment' } | null>(null);
  
  // Get shift_id and tab from URL params
  const viewShiftId = searchParams.get('shift_id');
  const tabParam = searchParams.get('tab');
  const [viewShift, setViewShift] = useState<{ id: string; status: 'open' | 'closed'; opened_at: string; closed_at: string | null } | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [loadingViewShift, setLoadingViewShift] = useState(false);

  const activeTabInfo = tabs.find(t => t.id === activeTab);

  // Set active tab from URL parameter if provided
  useEffect(() => {
    if (tabParam && tabs.some(t => t.id === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Load expense categories from Supabase (user-specific)
  useEffect(() => {
    loadExpenseCategories();
  }, []);

  const loadExpenseCategories = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Fallback to localStorage if user not logged in
        const categories = JSON.parse(localStorage.getItem('expenseCategories') || '[]');
        setExpenseCategories(categories);
        return;
      }

      // Try to load from Supabase
      try {
        // Check if user.id is valid before making request
        if (!user.id) {
          console.warn('⚠️ User ID is missing, falling back to localStorage');
          const categories = JSON.parse(localStorage.getItem('expenseCategories') || '[]');
          setExpenseCategories(categories);
          return;
        }

        // Make sure user.id is a valid UUID string
        const userId = String(user.id).trim();
        if (!userId || userId.length < 10) {
          console.warn('⚠️ Invalid user ID, falling back to localStorage');
          const categories = JSON.parse(localStorage.getItem('expenseCategories') || '[]');
          setExpenseCategories(categories);
          return;
        }

        console.log('📡 Fetching expense_categories from Supabase...');
        console.log('📡 Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
        
        // Try to fetch from expense_categories table (public schema)
        const { data, error } = await supabase
          .from('expense_categories')
          .select('*');
        
        console.log("KELGAN MA'LUMOT:", data);

        if (error) {
          console.error('SUPABASE_XATO:', error.message);
          console.error('SUPABASE_XATO (full):', JSON.stringify(error, null, 2));
          // Fallback to localStorage
          const categories = JSON.parse(localStorage.getItem('expenseCategories') || '[]');
          setExpenseCategories(categories);
          return;
        }

        // Extract category names from data - try different possible column names
        const categories = data?.map(item => {
          // Try different possible column names
          return item.category_name || item.name || item.category || item.title || '';
        }).filter(name => name) || [];
        setExpenseCategories(categories);

        // Migrate from localStorage to Supabase if localStorage has data and Supabase is empty
        if (categories.length === 0) {
          const localCategories = JSON.parse(localStorage.getItem('expenseCategories') || '[]');
          if (localCategories.length > 0) {
            // Migrate to Supabase
            await migrateCategoriesToSupabase(localCategories, user.id);
            setExpenseCategories(localCategories);
          }
        }
      } catch (error: any) {
        console.error('SUPABASE_XATO:', error?.message || error?.toString() || 'Noma\'lum xatolik');
        console.error('SUPABASE_XATO (full):', JSON.stringify(error, null, 2));
        // Fallback to localStorage
        const categories = JSON.parse(localStorage.getItem('expenseCategories') || '[]');
        setExpenseCategories(categories);
      }
    } catch (error: any) {
      console.error('SUPABASE_XATO:', error?.message || error?.toString() || 'Noma\'lum xatolik');
      console.error('SUPABASE_XATO (full):', JSON.stringify(error, null, 2));
      // Fallback to localStorage
      const categories = JSON.parse(localStorage.getItem('expenseCategories') || '[]');
      setExpenseCategories(categories);
    }
  };

  const migrateCategoriesToSupabase = async (categories: string[], userId: string) => {
    try {
      const categoryData = categories.map(categoryName => ({
        category_name: categoryName
      }));

      const { error } = await supabase
        .from('expense_categories')
        .insert(categoryData);

      if (error) {
        console.error('SUPABASE_XATO:', error.message || 'Noma\'lum xatolik');
        console.error('SUPABASE_XATO (full):', JSON.stringify(error, null, 2));
      } else {
        // Clear localStorage after successful migration
        localStorage.removeItem('expenseCategories');
      }
    } catch (error: any) {
      console.error('SUPABASE_XATO:', error?.message || error?.toString() || 'Noma\'lum xatolik');
      console.error('SUPABASE_XATO (full):', JSON.stringify(error, null, 2));
    }
  };

  // Listen for category updates
  useEffect(() => {
    const handleCategoryUpdate = () => {
      loadExpenseCategories();
    };
    window.addEventListener('categoryUpdated', handleCategoryUpdate);
    return () => window.removeEventListener('categoryUpdated', handleCategoryUpdate);
  }, []);

  // Fetch view shift if shift_id is provided
  useEffect(() => {
    if (viewShiftId) {
      fetchViewShift(viewShiftId);
    } else {
      setViewShift(null);
      setIsViewMode(false);
    }
  }, [viewShiftId]);

  const fetchViewShift = async (shiftId: string) => {
    setLoadingViewShift(true);
    try {
      console.log('📡 Fetching view shift:', shiftId);
      
      const { data, error } = await supabase
        .from('shifts')
        .select('id, status, opened_at, closed_at')
        .eq('id', shiftId)
        .single();

      if (error) {
        console.error('SUPABASE_XATO:', error.message);
        console.error('SUPABASE_XATO (full):', JSON.stringify(error, null, 2));
        const errorMessage = error.message || 'Noma\'lum xatolik';
        throw new Error(errorMessage);
      }

      if (data) {
        console.log('✅ View shift fetched successfully:', data);
        setViewShift({
          id: data.id,
          status: data.status,
          opened_at: data.opened_at,
          closed_at: data.closed_at
        });
        setIsViewMode(true);
        await fetchTransactionsForShift(shiftId);
      } else {
        console.log('ℹ️ No shift data found');
      }
    } catch (error: any) {
      console.error('SUPABASE_XATO:', error?.message || error?.toString() || 'Noma\'lum xatolik');
      console.error('SUPABASE_XATO (full):', JSON.stringify(error, null, 2));
      toast.error('Smena topilmadi: ' + errorMessage);
      navigate('/reports');
    } finally {
      setLoadingViewShift(false);
    }
  };

  const fetchTransactionsForShift = async (shiftId: string) => {
    setLoading(true);
    try {
      console.log('📡 Fetching transactions for shift (view mode):', shiftId);
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*');

      console.log("KELGAN MA'LUMOT:", data);

      if (error) {
        console.error('SUPABASE_XATO:', error.message);
        console.error('SUPABASE_XATO (full):', JSON.stringify(error, null, 2));
        const errorMessage = error.message || 'Noma\'lum xatolik';
        throw new Error(errorMessage);
      }

      console.log('✅ Transactions fetched successfully (view mode):', data?.length || 0, 'items');
      setTransactions(data || []);
      
      if (!data || data.length === 0) {
        console.log('ℹ️ No transactions found for this shift');
      }
    } catch (error: any) {
      console.error('SUPABASE_XATO:', error?.message || error?.toString() || 'Noma\'lum xatolik');
      console.error('SUPABASE_XATO (full):', JSON.stringify(error, null, 2));
      const errorMessage = error?.message || error?.toString() || 'Noma\'lum xatolik';
      toast.error('Operatsiyalarni yuklashda xatolik: ' + errorMessage);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch transactions ONLY for current shift (if not in view mode)
  useEffect(() => {
    if (currentShift && !isViewMode) {
      fetchTransactions();
    }
  }, [currentShift, isViewMode]);

  // Listen for currency updates
  useEffect(() => {
    const handleCurrencyUpdate = () => {
      // Force re-render by updating a dummy state
      setTransactions([...transactions]);
    };
    window.addEventListener('currencyUpdated', handleCurrencyUpdate);
    return () => window.removeEventListener('currencyUpdated', handleCurrencyUpdate);
  }, [transactions]);

  // Listen for transaction deletions/updates
  useEffect(() => {
    const handleTransactionUpdate = () => {
      // Refresh transactions when deleted or added from other pages
      if (currentShift && !isViewMode) {
        fetchTransactions();
      } else if (isViewMode && viewShift) {
        fetchTransactionsForShift(viewShift.id);
      }
    };
    window.addEventListener('transactionDeleted', handleTransactionUpdate);
    window.addEventListener('transactionAdded', handleTransactionUpdate);
    window.addEventListener('transactionUpdated', handleTransactionUpdate);
    return () => {
      window.removeEventListener('transactionDeleted', handleTransactionUpdate);
      window.removeEventListener('transactionAdded', handleTransactionUpdate);
      window.removeEventListener('transactionUpdated', handleTransactionUpdate);
    };
  }, [currentShift, isViewMode, viewShift]);

  const fetchTransactions = async () => {
    if (!currentShift) {
      console.log('⚠️ No current shift, skipping fetchTransactions');
      return;
    }
    
    try {
      console.log('📡 Fetching transactions for shift:', currentShift.id);
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*');

      console.log("KELGAN MA'LUMOT:", data);

      if (error) {
        console.error('SUPABASE_XATO:', error.message);
        console.error('SUPABASE_XATO (full):', JSON.stringify(error, null, 2));
        const errorMessage = error.message || 'Noma\'lum xatolik';
        throw new Error(errorMessage);
      }

      console.log('✅ Transactions fetched successfully:', data?.length || 0, 'items');
      setTransactions(data || []);
      
      if (!data || data.length === 0) {
        console.log('ℹ️ No transactions found for this shift');
      }
    } catch (error: any) {
      console.error('SUPABASE_XATO:', error?.message || error?.toString() || 'Noma\'lum xatolik');
      console.error('SUPABASE_XATO (full):', JSON.stringify(error, null, 2));
      const errorMessage = error?.message || error?.toString() || 'Noma\'lum xatolik';
      toast.error('Ma\'lumotlarni yuklashda xatolik: ' + errorMessage);
      setTransactions([]);
    }
  };

  const handleAddTransaction = async (amount: number, description: string) => {
    if (!currentShift) {
      toast.error("Smena ochiq emas!");
      return;
    }
    
    setLoading(true);
    try {
      console.log('📝 Adding transaction:', { amount, description, type: activeTab, shift_id: currentShift.id });
      
      const { data, error } = await supabase
        .from('transactions')
        .insert([
          {
            amount,
            description,
            type: activeTab,
            date: new Date().toISOString(),
            shift_id: currentShift.id // Attach Shift ID
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('SUPABASE_XATO:', error.message);
        console.error('SUPABASE_XATO (full):', JSON.stringify(error, null, 2));
        const errorMessage = error.message || 'Noma\'lum xatolik';
        throw new Error(errorMessage);
      }

      console.log('✅ Transaction added successfully:', data);
      setTransactions([data, ...transactions]);
      window.dispatchEvent(new Event('transactionAdded'));
      toast.success("Muvaffaqiyatli saqlandi!");
    } catch (error: any) {
      console.error('SUPABASE_XATO:', error?.message || error?.toString() || 'Noma\'lum xatolik');
      console.error('SUPABASE_XATO (full):', JSON.stringify(error, null, 2));
      toast.error('Xatolik: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTransaction = async (id: string, amount: number, description: string) => {
    try {
      console.log('✏️ Editing transaction:', { id, amount, description });
      
      const { error } = await supabase
        .from('transactions')
        .update({ amount, description })
        .eq('id', id);

      if (error) {
        console.error('SUPABASE_XATO:', error.message);
        console.error('SUPABASE_XATO (full):', JSON.stringify(error, null, 2));
        const errorMessage = error.message || 'Noma\'lum xatolik';
        throw new Error(errorMessage);
      }

      console.log('✅ Transaction edited successfully');
      setTransactions(transactions.map(t => t.id === id ? { ...t, amount, description } : t));
      window.dispatchEvent(new Event('transactionUpdated'));
      toast.success("Tahrirlandi!");
    } catch (error: any) {
      console.error('SUPABASE_XATO:', error?.message || error?.toString() || 'Noma\'lum xatolik');
      console.error('SUPABASE_XATO (full):', JSON.stringify(error, null, 2));
      toast.error('Tahrirlashda xatolik: ' + errorMessage);
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
      console.log('🗑️ Deleting transaction:', id);
      
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('SUPABASE_XATO:', error.message);
        console.error('SUPABASE_XATO (full):', JSON.stringify(error, null, 2));
        const errorMessage = error.message || 'Noma\'lum xatolik';
        throw new Error(errorMessage);
      }

      console.log('✅ Transaction deleted successfully');
      setTransactions(transactions.filter(t => t.id !== id));
      window.dispatchEvent(new Event('transactionDeleted'));
      toast.success("O'chirildi!");
    } catch (error: any) {
      console.error('SUPABASE_XATO:', error?.message || error?.toString() || 'Noma\'lum xatolik');
      console.error('SUPABASE_XATO (full):', JSON.stringify(error, null, 2));
      toast.error('O\'chirishda xatolik: ' + errorMessage);
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

  const handleClearAllTransactions = () => {
    // Check if password is set
    if (isPasswordSet()) {
      setIsClearPasswordModalOpen(true);
      return;
    }

    // If no password is set, show confirmation and clear directly
    if (!window.confirm("Barcha xarajatlarni o'chirishni tasdiqlaysizmi? Bu amalni ortga qaytarib bo'lmaydi.")) {
      return;
    }

    performClearAll();
  };

  const performClearAll = async () => {
    try {
      const xarajatTransactions = transactions.filter(t => t.type === 'xarajat');
      
      if (xarajatTransactions.length === 0) {
        toast.info('O\'chirish uchun xarajatlar mavjud emas');
        return;
      }

      // Delete all xarajat transactions
      const ids = xarajatTransactions.map(t => t.id);
      const { error } = await supabase
        .from('transactions')
        .delete()
        .in('id', ids);

      if (error) {
        console.error('SUPABASE_XATO:', error.message);
        console.error('SUPABASE_XATO (full):', JSON.stringify(error, null, 2));
        const errorMessage = error.message || 'Noma\'lum xatolik';
        throw new Error(errorMessage);
      }

      setTransactions(transactions.filter(t => t.type !== 'xarajat'));
      toast.success(`Barcha xarajatlar o'chirildi (${xarajatTransactions.length} ta)`);
    } catch (error: any) {
      console.error('SUPABASE_XATO:', error?.message || error?.toString() || 'Noma\'lum xatolik');
      console.error('SUPABASE_XATO (full):', JSON.stringify(error, null, 2));
      toast.error('Tozalashda xatolik: ' + errorMessage);
    }
  };

  const handleClearPasswordConfirm = (password: string) => {
    if (!verifyPassword(password)) {
      toast.error('Noto\'g\'ri parol');
      return;
    }

    performClearAll();
    setIsClearPasswordModalOpen(false);
  };

  const handleAddCategory = async (categoryName: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Fallback to localStorage if user not logged in
        const categories = JSON.parse(localStorage.getItem('expenseCategories') || '[]');
        if (!categories.includes(categoryName)) {
          categories.push(categoryName);
          localStorage.setItem('expenseCategories', JSON.stringify(categories));
          setExpenseCategories(categories);
          window.dispatchEvent(new Event('categoryUpdated'));
          toast.success(`"${categoryName}" bo'limi qo'shildi`);
        } else {
          toast.info(`"${categoryName}" bo'limi allaqachon mavjud`);
        }
        setIsAddCategoryModalOpen(false);
        return;
      }

      // Check if category already exists
      if (expenseCategories.includes(categoryName)) {
        toast.info(`"${categoryName}" bo'limi allaqachon mavjud`);
        setIsAddCategoryModalOpen(false);
        return;
      }

      // Save to Supabase
      try {
        const { error } = await supabase
          .from('expense_categories')
          .insert({
            category_name: categoryName
          });

        if (error) {
          // Handle 400 Bad Request error
          if (error.code === '400' || error.status === 400 || error.message?.includes('400') || error.message?.includes('Bad Request')) {
            console.warn('⚠️ 400 Bad Request - expense_categories insert issue:', error.message);
            // Fallback to localStorage
            const categories = JSON.parse(localStorage.getItem('expenseCategories') || '[]');
            if (!categories.includes(categoryName)) {
              categories.push(categoryName);
              localStorage.setItem('expenseCategories', JSON.stringify(categories));
              setExpenseCategories(categories);
              window.dispatchEvent(new Event('categoryUpdated'));
              toast.success(`"${categoryName}" bo'limi qo'shildi`);
            }
            setIsAddCategoryModalOpen(false);
            return;
          }
          // Handle 403 Forbidden error
          if (error.code === '403' || error.status === 403 || error.message?.includes('403')) {
            console.warn('⚠️ 403 Forbidden - expense_categories insert issue:', error.message);
            // Fallback to localStorage
            const categories = JSON.parse(localStorage.getItem('expenseCategories') || '[]');
            if (!categories.includes(categoryName)) {
              categories.push(categoryName);
              localStorage.setItem('expenseCategories', JSON.stringify(categories));
              setExpenseCategories(categories);
              window.dispatchEvent(new Event('categoryUpdated'));
              toast.success(`"${categoryName}" bo'limi qo'shildi`);
            }
            setIsAddCategoryModalOpen(false);
            return;
          }
          // If table doesn't exist, fallback to localStorage
          if (error.code === '42P01' || error.code === 'PGRST205' || error.message?.includes('does not exist') || error.message?.includes('Could not find the table')) {
            const categories = JSON.parse(localStorage.getItem('expenseCategories') || '[]');
            if (!categories.includes(categoryName)) {
              categories.push(categoryName);
              localStorage.setItem('expenseCategories', JSON.stringify(categories));
              setExpenseCategories(categories);
              window.dispatchEvent(new Event('categoryUpdated'));
              toast.success(`"${categoryName}" bo'limi qo'shildi`);
            }
            setIsAddCategoryModalOpen(false);
            return;
          }
          // For other errors, fallback to localStorage instead of throwing
          console.error('SUPABASE_XATO:', error.message);
          console.error('SUPABASE_XATO (full):', JSON.stringify(error, null, 2));
          const categories = JSON.parse(localStorage.getItem('expenseCategories') || '[]');
          if (!categories.includes(categoryName)) {
            categories.push(categoryName);
            localStorage.setItem('expenseCategories', JSON.stringify(categories));
            setExpenseCategories(categories);
            window.dispatchEvent(new Event('categoryUpdated'));
            toast.success(`"${categoryName}" bo'limi qo'shildi`);
          }
          setIsAddCategoryModalOpen(false);
          return;
        } else {
          // Successfully saved to Supabase
          setExpenseCategories([...expenseCategories, categoryName]);
          window.dispatchEvent(new Event('categoryUpdated'));
          toast.success(`"${categoryName}" bo'limi qo'shildi`);
        }
      } catch (error: any) {
        console.error('SUPABASE_XATO:', error?.message || error?.toString() || 'Noma\'lum xatolik');
        console.error('SUPABASE_XATO (full):', JSON.stringify(error, null, 2));
        // Fallback to localStorage
        const categories = JSON.parse(localStorage.getItem('expenseCategories') || '[]');
        if (!categories.includes(categoryName)) {
          categories.push(categoryName);
          localStorage.setItem('expenseCategories', JSON.stringify(categories));
          setExpenseCategories(categories);
          window.dispatchEvent(new Event('categoryUpdated'));
          toast.success(`"${categoryName}" bo'limi qo'shildi`);
        }
      }
    } catch (error: any) {
      console.error('SUPABASE_XATO:', error?.message || error?.toString() || 'Noma\'lum xatolik');
      console.error('SUPABASE_XATO (full):', JSON.stringify(error, null, 2));
      // Fallback to localStorage
      const categories = JSON.parse(localStorage.getItem('expenseCategories') || '[]');
      if (!categories.includes(categoryName)) {
        categories.push(categoryName);
        localStorage.setItem('expenseCategories', JSON.stringify(categories));
        setExpenseCategories(categories);
        window.dispatchEvent(new Event('categoryUpdated'));
        toast.success(`"${categoryName}" bo'limi qo'shildi`);
      }
    }
    setIsAddCategoryModalOpen(false);
  };

  const handleEditCategory = async (oldName: string, newName: string) => {
    if (oldName === newName) return;
    
    try {
      // Check if new name already exists
      if (expenseCategories.includes(newName)) {
        toast.error(`"${newName}" bo'limi allaqachon mavjud`);
        return;
      }

      // Try to update in Supabase first
      try {
        console.log(`🔄 Updating category from "${oldName}" to "${newName}"`);
        const { error } = await supabase
          .from('expense_categories')
          .update({ category_name: newName })
          .eq('category_name', oldName);

        if (error) {
          console.error('SUPABASE_XATO:', error.message);
          console.error('SUPABASE_XATO (full):', JSON.stringify(error, null, 2));
          // Fallback to localStorage
          const categories = JSON.parse(localStorage.getItem('expenseCategories') || '[]');
          const index = categories.indexOf(oldName);
          if (index !== -1) {
            categories[index] = newName;
            localStorage.setItem('expenseCategories', JSON.stringify(categories));
            setExpenseCategories(categories);
            window.dispatchEvent(new Event('categoryUpdated'));
            updateTransactionsCategory(oldName, newName);
            toast.success(`"${oldName}" bo'limi "${newName}" ga o'zgartirildi`);
          } else {
            toast.error('Bo\'lim topilmadi');
          }
        } else {
          // Successfully updated in Supabase
          console.log(`✅ Category updated successfully in Supabase`);
          const updatedCategories = expenseCategories.map(cat => cat === oldName ? newName : cat);
          setExpenseCategories(updatedCategories);
          window.dispatchEvent(new Event('categoryUpdated'));
          updateTransactionsCategory(oldName, newName);
          toast.success(`"${oldName}" bo'limi "${newName}" ga o'zgartirildi`);
        }
      } catch (error: any) {
        console.error('SUPABASE_XATO:', error?.message || error?.toString() || 'Noma\'lum xatolik');
        console.error('SUPABASE_XATO (full):', JSON.stringify(error, null, 2));
        // Fallback to localStorage
        const categories = JSON.parse(localStorage.getItem('expenseCategories') || '[]');
        const index = categories.indexOf(oldName);
        if (index !== -1) {
          categories[index] = newName;
          localStorage.setItem('expenseCategories', JSON.stringify(categories));
          setExpenseCategories(categories);
          window.dispatchEvent(new Event('categoryUpdated'));
          updateTransactionsCategory(oldName, newName);
          toast.success(`"${oldName}" bo'limi "${newName}" ga o'zgartirildi`);
        } else {
          toast.error('Bo\'lim topilmadi');
        }
      }
    } catch (error: any) {
      console.error('Error in handleEditCategory:', error);
      toast.error('Bo\'limni o\'zgartirishda xatolik: ' + (error?.message || 'Noma\'lum xatolik'));
    }
  };

  const handleDeleteCategory = async (categoryName: string) => {
    try {
      // Try to delete from Supabase first
      try {
        console.log(`🗑️ Deleting category "${categoryName}"`);
        const { error } = await supabase
          .from('expense_categories')
          .delete()
          .eq('category_name', categoryName);

        if (error) {
          console.error('SUPABASE_XATO:', error.message);
          console.error('SUPABASE_XATO (full):', JSON.stringify(error, null, 2));
          // Fallback to localStorage
          const categories = JSON.parse(localStorage.getItem('expenseCategories') || '[]');
          const filtered = categories.filter((cat: string) => cat !== categoryName);
          localStorage.setItem('expenseCategories', JSON.stringify(filtered));
          setExpenseCategories(filtered);
          window.dispatchEvent(new Event('categoryUpdated'));
        } else {
          // Successfully deleted from Supabase
          console.log(`✅ Category deleted successfully from Supabase`);
          const filtered = expenseCategories.filter((cat: string) => cat !== categoryName);
          setExpenseCategories(filtered);
          window.dispatchEvent(new Event('categoryUpdated'));
        }
      } catch (error: any) {
        console.error('SUPABASE_XATO:', error?.message || error?.toString() || 'Noma\'lum xatolik');
        console.error('SUPABASE_XATO (full):', JSON.stringify(error, null, 2));
        // Fallback to localStorage
        const categories = JSON.parse(localStorage.getItem('expenseCategories') || '[]');
        const filtered = categories.filter((cat: string) => cat !== categoryName);
        localStorage.setItem('expenseCategories', JSON.stringify(filtered));
        setExpenseCategories(filtered);
        window.dispatchEvent(new Event('categoryUpdated'));
      }
      
      // Delete all transactions for this category
      try {
        const categoryTransactions = transactions.filter(t => 
          t.category === categoryName || 
          (t.type === 'xarajat' && t.description?.includes(`[${categoryName}]`))
        );
        
        if (categoryTransactions.length > 0) {
          const ids = categoryTransactions.map(t => t.id);
          const { error } = await supabase
            .from('transactions')
            .delete()
            .in('id', ids);
          
          if (error) {
        console.error('SUPABASE_XATO:', error.message);
        console.error('SUPABASE_XATO (full):', JSON.stringify(error, null, 2));
        const errorMessage = error.message || 'Noma\'lum xatolik';
        throw new Error(errorMessage);
      }
          
          setTransactions(transactions.filter(t => !ids.includes(t.id)));
        }
        
        toast.success(`"${categoryName}" bo'limi o'chirildi`);
      } catch (error: any) {
        console.error('Error deleting category transactions:', error);
        toast.error('Bo\'lim o\'chirildi, lekin ba\'zi operatsiyalar o\'chirilmadi');
      }
    } catch (error: any) {
      console.error('Error in handleDeleteCategory:', error);
      toast.error('Bo\'limni o\'chirishda xatolik: ' + error.message);
    }
  };

  const updateTransactionsCategory = async (oldName: string, newName: string) => {
    try {
      const categoryTransactions = transactions.filter(t => 
        t.category === oldName || 
        (t.type === 'xarajat' && t.description?.includes(`[${oldName}]`))
      );
      
      for (const transaction of categoryTransactions) {
        const updateData: any = {};
        
        // Try to update category column if it exists
        try {
          const { error: categoryError } = await supabase
            .from('transactions')
            .update({ category: newName })
            .eq('id', transaction.id);
          
          if (!categoryError) {
            // Successfully updated category column
            continue;
          }
        } catch (e) {
          // Category column doesn't exist, update description
        }
        
        // Update description if category column doesn't exist
        const newDescription = transaction.description?.replace(
          `[${oldName}]`,
          `[${newName}]`
        ) || `[${newName}]`;
        
        const { error } = await supabase
          .from('transactions')
          .update({ description: newDescription })
          .eq('id', transaction.id);
        
        if (error) {
          console.error('❌ Supabase xatolik (updateTransactionsCategory):', error);
          const errorMessage = error.message || 'Noma\'lum xatolik';
          console.error('Xatolik xabari:', errorMessage);
        }
      }
      
      // Refresh transactions
      if (currentShift && !isViewMode) {
        fetchTransactions();
      } else if (isViewMode && viewShift) {
        fetchTransactionsForShift(viewShift.id);
      }
    } catch (error: any) {
      console.error('Error updating transactions category:', error);
    }
  };

  const handleUpdateShiftName = async (name: string) => {
    if (!currentShift) return;
    
    try {
      const { error } = await supabase
        .from('shifts')
        .update({ name })
        .eq('id', currentShift.id);

      if (error) {
        // If name column doesn't exist, silently fail
        if (error.message.includes('name')) {
          toast.info('Smena nomi funksiyasi hali qo\'llanmagan. Iltimos, database migration\'ni bajarishingiz kerak.');
          return;
        }
        const errorMessage = error.message || 'Noma\'lum xatolik';
        throw new Error(errorMessage);
      }

      // Refresh shift data
      refreshShift();
      toast.success('Smena nomi yangilandi!');
      setIsEditShiftNameModalOpen(false);
    } catch (error: any) {
      console.error('Error updating shift name:', error);
      toast.error('Smena nomini yangilashda xatolik: ' + error.message);
    }
  };

  const handleAddExpenseToCategory = async (categoryName: string, amount: number, description: string) => {
    if (!currentShift && !isViewMode) {
      toast.error("Smena ochiq emas!");
      return;
    }
    
    try {
      // Prepare insert data
      let insertData: any = {
        amount,
        type: 'xarajat',
        date: new Date().toISOString(),
        shift_id: isViewMode ? viewShift?.id : currentShift?.id
      };

      // Try to add category column first
      insertData.category = categoryName;
      insertData.description = description || categoryName;

      const { data, error } = await supabase
        .from('transactions')
        .insert([insertData])
        .select()
        .single();

      if (error) {
        // If category column doesn't exist, store in description
        if (error.message.includes('category') || error.message.includes('column') || error.code === '42703') {
          delete insertData.category;
          insertData.description = `[${categoryName}] ${description || categoryName}`;
          
          const { data: retryData, error: retryError } = await supabase
            .from('transactions')
            .insert([insertData])
            .select()
            .single();
          
          if (retryError) throw retryError;
          
          // Add category to the returned data for consistency
          const transactionWithCategory = { ...retryData, category: categoryName };
          setTransactions([transactionWithCategory, ...transactions]);
        } else {
          const errorMessage = error.message || 'Noma\'lum xatolik';
        throw new Error(errorMessage);
        }
      } else {
        // Ensure category is set even if column doesn't exist
        const transactionWithCategory = { ...data, category: categoryName };
        setTransactions([transactionWithCategory, ...transactions]);
      }

      // Dispatch event to notify other components
      window.dispatchEvent(new Event('transactionAdded'));

      toast.success("Muvaffaqiyatli saqlandi!");
    } catch (error: any) {
      console.error('SUPABASE_XATO:', error?.message || error?.toString() || 'Noma\'lum xatolik');
      console.error('SUPABASE_XATO (full):', JSON.stringify(error, null, 2));
      toast.error('Xatolik: ' + errorMessage);
      throw new Error(errorMessage); // Re-throw to let component handle loading state
    }
  };

  const handleCloseShiftConfirm = async () => {
    const totalBalance = calculateTotalShiftBalance(); 
    const success = await closeShift(totalBalance);
    if (success) {
      navigate('/xpro');
    }
  };

  // Calculate balance for the CURRENT tab
  const calculateTabBalance = () => {
    return filteredTransactions.reduce((acc, curr) => {
      return acc + curr.amount; 
    }, 0);
  };

  // Calculate total balance for the SHIFT (for closing)
  const calculateTotalShiftBalance = () => {
    return transactions.reduce((acc, curr) => {
      if (curr.type === 'xarajat') {
        return acc - curr.amount;
      }
      return acc + curr.amount;
    }, 0);
  };

  const filteredTransactions = transactions.filter(t => t.type === activeTab);

  // Show loading while fetching view shift
  if (loadingViewShift) {
    return <div className="flex h-full flex-col items-center justify-center py-20 text-center">
      <div className="p-8 text-white">Yuklanmoqda...</div>
    </div>;
  }

  if (shiftLoading && !isViewMode) return <div className="p-8 text-white">Yuklanmoqda...</div>;

  // Show "Smena ochiq emas" only if NOT in view mode and no current shift
  if (!currentShift && !isViewMode && !viewShiftId) {
    return (
      <div className="flex h-full flex-col items-center justify-center py-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Smena ochiq emas</h2>
        <p className="text-slate-400 mb-8">Operatsiyalarni bajarish uchun avval smenani oching.</p>
        <button
          onClick={() => navigate('/xpro')}
          className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-500"
        >
          Smenani Ochish
        </button>
      </div>
    );
  }

  // If viewShiftId exists but viewShift is null, we're still loading or there was an error
  if (viewShiftId && !viewShift && !loadingViewShift) {
    return (
      <div className="flex h-full flex-col items-center justify-center py-20 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Smena topilmadi</h2>
        <p className="text-slate-400 mb-8">Smena ma'lumotlari yuklanmadi.</p>
        <button
          onClick={() => navigate('/reports')}
          className="rounded-xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-500"
        >
          Xisobotlarga qaytish
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Shift Date Header - Centered with Close Shift Button */}
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-slate-300 backdrop-blur-sm">
          <Calendar className="h-4 w-4 text-blue-400" />
          <span>Smena: <span className="text-white">
            {isViewMode && viewShift 
              ? (viewShift.name || format(new Date(viewShift.opened_at), 'd-MMMM yyyy', { locale: uz }))
              : currentShift 
                ? (currentShift.name || format(new Date(currentShift.opened_at), 'd-MMMM yyyy', { locale: uz }))
                : ''}
          </span></span>
          {!isViewMode && currentShift && (
            <button
              onClick={() => setIsEditShiftNameModalOpen(true)}
              className="ml-2 rounded-lg p-1 text-blue-400 transition-all hover:bg-blue-500/20 hover:text-blue-300"
              title="Smena nomini tahrirlash"
            >
              <Edit className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        
        {activeTab === 'kassa' && !isViewMode && (
          <button
            onClick={() => setIsConfirmOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-bold text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
          >
            <Lock className="h-4 w-4" />
            Smenani Yopish
          </button>
        )}
      </div>

      {/* Top Navigation Tabs */}
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-black/40 p-2 backdrop-blur-xl">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-300 ${
                  isActive ? 'text-black shadow-lg shadow-white/10' : 'text-slate-400 hover:text-white hover:bg-white/5'
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
                  <tab.icon className={`h-4 w-4 ${isActive ? 'text-black' : tab.color}`} />
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
        className="rounded-3xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm lg:p-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white uppercase tracking-wider flex items-center gap-3">
              {activeTabInfo?.icon && <activeTabInfo.icon className={`h-8 w-8 ${activeTabInfo.color}`} />}
              {activeTabInfo?.label}
            </h2>
            <p className="text-sm text-slate-400 mt-1">Operatsiyalar boshqaruvi</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">
                {activeTab === 'xarajat' ? 'Umumiy xarajat' : 'Jami kirim'}
              </span>
              <span className="text-3xl font-mono font-bold text-white tracking-tight">
                {formatCurrency(calculateTabBalance())}
              </span>
            </div>
            {activeTab === 'xarajat' && (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setIsAddCategoryModalOpen(true)}
                  className="flex items-center gap-2 rounded-xl border border-blue-500/50 bg-blue-500/10 px-4 py-2.5 text-sm font-medium text-blue-400 hover:bg-blue-500/20 transition-colors"
                >
                  <FolderPlus className="h-4 w-4" />
                  Bo'lim qo'shish
                </button>
              </div>
            )}
          </div>
        </div>

        {/* View Mode Banner */}
        {isViewMode && viewShift && (
          <div className="mb-6 rounded-xl border border-blue-500/20 bg-blue-500/10 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/20">
                  <History className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    {viewShift.status === 'closed' ? 'Yopiq Smena - Faqat Ko\'rish' : 'Ochik Smena - Ko\'rish'}
                  </h3>
                  <p className="text-sm text-slate-400">
                    {viewShift.status === 'closed' 
                      ? 'Bu smena yopiq. Ma\'lumot kiritish mumkin emas.' 
                      : 'Bu smenani ko\'rish rejimida ko\'ryapsiz.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  navigate('/reports');
                }}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors"
              >
                Xisobotlarga qaytish
              </button>
            </div>
          </div>
        )}

        {/* Tab Specific Content */}
        {activeTab === 'xarajat' && activeTabInfo ? (
          <ExpenseCategoriesTab
            categories={expenseCategories}
            transactions={filteredTransactions}
            onAddExpense={handleAddExpenseToCategory}
            onDeleteTransaction={handleDeleteTransaction}
            onEditCategory={handleEditCategory}
            onDeleteCategory={handleDeleteCategory}
            loading={loading}
            shiftId={isViewMode ? viewShift?.id : currentShift?.id}
            isReadOnly={isViewMode}
          />
        ) : activeTab === 'kassa' && activeTabInfo ? (
          <KassaTab
            transactions={transactions}
            kassaTransactions={filteredTransactions}
            onAddTransaction={handleAddTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            onEditTransaction={handleEditTransaction}
            loading={loading}
            shiftId={isViewMode ? viewShift?.id : currentShift?.id}
            isReadOnly={isViewMode}
          />
        ) : ['click', 'uzcard', 'humo'].includes(activeTab) && activeTabInfo ? (
          <PaymentTab 
            type={activeTab} 
            color={activeTabInfo.color} 
            bg={activeTabInfo.bg}
            transactions={filteredTransactions}
            onAddTransaction={handleAddTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            onEditTransaction={handleEditTransaction}
            loading={loading}
            shiftId={isViewMode ? viewShift?.id : currentShift?.id}
            isReadOnly={isViewMode}
          />
        ) : activeTab === 'eksport' ? (
          <ExportTab
            transactions={transactions}
            expenseCategories={expenseCategories}
            shiftName={isViewMode && viewShift 
              ? (viewShift.name || format(new Date(viewShift.opened_at), 'd-MMMM yyyy', { locale: uz }))
              : currentShift 
                ? (currentShift.name || format(new Date(currentShift.opened_at), 'd-MMMM yyyy', { locale: uz }))
                : 'Smena'}
            onOpenSettings={(name, type) => {
              setExportSettingsItem({ name, type });
              setExportSettingsModalOpen(true);
            }}
          />
        ) : (
          <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/20 text-slate-500">
            Eksport bo'limi tez orada...
          </div>
        )}
      </motion.div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleCloseShiftConfirm}
        title="Smenani yopish"
        message="Haqiqatan ham smenani yopmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi."
        confirmText="Yopish"
        isDanger={true}
      />

      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => {
          setIsPasswordModalOpen(false);
          setTransactionToDelete(null);
        }}
        onConfirm={handlePasswordConfirm}
        title="Parolni kiriting"
        message="Operatsiyani o'chirish uchun parolni kiriting"
      />

      <PasswordModal
        isOpen={isClearPasswordModalOpen}
        onClose={() => setIsClearPasswordModalOpen(false)}
        onConfirm={handleClearPasswordConfirm}
        title="Parolni kiriting"
        message="Barcha xarajatlarni o'chirish uchun parolni kiriting"
      />

      <AddCategoryModal
        isOpen={isAddCategoryModalOpen}
        onClose={() => setIsAddCategoryModalOpen(false)}
        onConfirm={handleAddCategory}
      />

      <EditShiftNameModal
        isOpen={isEditShiftNameModalOpen}
        onClose={() => setIsEditShiftNameModalOpen(false)}
        onSave={handleUpdateShiftName}
        currentName={currentShift?.name || null}
      />

      {exportSettingsItem && (
        <ExportSettingsModal
          isOpen={exportSettingsModalOpen}
          onClose={() => {
            setExportSettingsModalOpen(false);
            setExportSettingsItem(null);
          }}
          onSave={(settings) => {
            // Settings are saved in the modal itself
            setExportSettingsModalOpen(false);
            setExportSettingsItem(null);
          }}
          itemName={exportSettingsItem.name}
          itemType={exportSettingsItem.type}
          currentSettings={exportSettingsItem ? getExportSettings(exportSettingsItem.type, exportSettingsItem.name) : undefined}
        />
      )}
    </div>
  );
}
