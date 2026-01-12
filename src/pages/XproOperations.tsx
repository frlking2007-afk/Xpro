import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, CreditCard, Banknote, Upload, Plus, History, Trash2, ArrowRight, Lock, Calendar, FolderPlus, Trash } from 'lucide-react';
import { format } from 'date-fns';
import { uz } from 'date-fns/locale';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';
import { useShift } from '../hooks/useShift';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';
import PasswordModal from '../components/PasswordModal';
import { verifyPassword, isPasswordSet } from '../utils/password';
import { formatCurrency, getCurrencySymbol } from '../utils/currency';

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
}

const PaymentTab = ({ 
  type, 
  color, 
  bg, 
  transactions, 
  onAddTransaction,
  onDeleteTransaction,
  loading,
  shiftId
}: { 
  type: string, 
  color: string, 
  bg: string, 
  transactions: Transaction[], 
  onAddTransaction: (amount: number, description: string) => void,
  onDeleteTransaction: (id: string) => void,
  loading: boolean,
  shiftId: string | undefined
}) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

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
      {/* Input Form */}
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
                className="block w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-4 pr-12 text-lg font-bold text-white placeholder-slate-600 focus:border-blue-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
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
              className="block w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-sm text-white placeholder-slate-600 focus:border-blue-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`group mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white transition-all shadow-lg ${
              type === 'xarajat' 
                ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 shadow-red-500/20' 
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-blue-500/20'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Saqlanmoqda...' : 'Saqlash'}
            {!loading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
          </button>
        </form>
      </div>

      {/* History List */}
      <div>
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-400 uppercase tracking-wider">
          <History className="h-4 w-4" />
          Bugungi operatsiyalar
        </h3>
        
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
                className="group flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-4 transition-colors hover:bg-white/10 hover:border-white/10"
              >
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
                <button 
                  onClick={() => onDeleteTransaction(item.id)}
                  className="rounded-lg p-2 text-slate-500 transition-all hover:bg-red-500/20 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default function XproOperations() {
  const [activeTab, setActiveTab] = useState('kassa');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const { currentShift, closeShift, loading: shiftLoading } = useShift();
  const navigate = useNavigate();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  const [isClearPasswordModalOpen, setIsClearPasswordModalOpen] = useState(false);

  const activeTabInfo = tabs.find(t => t.id === activeTab);

  // Fetch transactions ONLY for current shift
  useEffect(() => {
    if (currentShift) {
      fetchTransactions();
    }
  }, [currentShift]);

  const fetchTransactions = async () => {
    if (!currentShift) return;
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('shift_id', currentShift.id) // Filter by Shift ID
        .order('date', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error: any) {
      // toast.error('Ma\'lumotlarni yuklashda xatolik: ' + error.message);
    }
  };

  const handleAddTransaction = async (amount: number, description: string) => {
    if (!currentShift) {
      toast.error("Smena ochiq emas!");
      return;
    }
    
    setLoading(true);
    try {
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

      if (error) throw error;

      setTransactions([data, ...transactions]);
      toast.success("Muvaffaqiyatli saqlandi!");
    } catch (error: any) {
      toast.error('Xatolik: ' + error.message);
    } finally {
      setLoading(false);
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
      toast.success("O'chirildi!");
    } catch (error: any) {
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

      if (error) throw error;

      setTransactions(transactions.filter(t => t.type !== 'xarajat'));
      toast.success(`Barcha xarajatlar o'chirildi (${xarajatTransactions.length} ta)`);
    } catch (error: any) {
      toast.error('Tozalashda xatolik: ' + error.message);
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

  if (shiftLoading) return <div className="p-8 text-white">Yuklanmoqda...</div>;

  if (!currentShift) {
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

  return (
    <div className="space-y-8">
      {/* Shift Date Header - Centered with Close Shift Button */}
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-slate-300 backdrop-blur-sm">
          <Calendar className="h-4 w-4 text-blue-400" />
          <span>Smena: <span className="text-white">{format(new Date(currentShift.opened_at), 'd-MMMM yyyy', { locale: uz })}</span></span>
        </div>
        
        {activeTab === 'kassa' && (
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
                {activeTab === 'xarajat' ? 'Jami xarajat' : 'Jami kirim'}
              </span>
              <span className="text-3xl font-mono font-bold text-white tracking-tight">
                {formatCurrency(calculateTabBalance())}
              </span>
            </div>
            {activeTab === 'xarajat' && (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    // Bo'lim qo'shish funksiyasi
                    toast.info('Bo\'lim qo\'shish funksiyasi tez orada qo\'shiladi');
                  }}
                  className="flex items-center gap-2 rounded-xl border border-blue-500/50 bg-blue-500/10 px-4 py-2.5 text-sm font-medium text-blue-400 hover:bg-blue-500/20 transition-colors"
                >
                  <FolderPlus className="h-4 w-4" />
                  Bo'lim qo'shish
                </button>
                <button
                  onClick={handleClearAllTransactions}
                  className="flex items-center gap-2 rounded-xl border border-red-500/50 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <Trash className="h-4 w-4" />
                  Tozalash
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tab Specific Content */}
        {['kassa', 'click', 'uzcard', 'humo', 'xarajat'].includes(activeTab) && activeTabInfo ? (
          <PaymentTab 
            type={activeTab} 
            color={activeTabInfo.color} 
            bg={activeTabInfo.bg}
            transactions={filteredTransactions}
            onAddTransaction={handleAddTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            loading={loading}
            shiftId={currentShift.id}
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
    </div>
  );
}
