import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, ArrowUpRight, ArrowDownRight, Wallet, CreditCard, Banknote, Clock, CheckCircle2, XCircle, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { toast } from 'sonner';
import DateFilter from '../components/DateFilter';
import MetricSelector from '../components/MetricSelector';
import PasswordModal from '../components/PasswordModal';
import { verifyPassword, isPasswordSet } from '../utils/password';
import { formatCurrency } from '../utils/currency';

interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  type: string;
}

interface Shift {
  id: string;
  opened_at: string;
  closed_at: string | null;
  status: 'open' | 'closed';
  starting_balance: number;
  ending_balance: number | null;
}

export default function Reports() {
  const [activeTab, setActiveTab] = useState<'transactions' | 'shifts'>('transactions');
  
  // Transaction States
  const [search, setSearch] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [dateRange, setDateRange] = useState({ start: new Date(new Date().getFullYear(), new Date().getMonth(), 1), end: new Date() });
  const [filterType, setFilterType] = useState('all');

  // Shift States
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loadingShifts, setLoadingShifts] = useState(true);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [shiftToDelete, setShiftToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (activeTab === 'transactions') {
      fetchTransactions();
    } else {
      fetchShifts();
    }
  }, [activeTab, dateRange, filterType]);

  const fetchTransactions = async () => {
    setLoadingTransactions(true);
    try {
      let query = supabase
        .from('transactions')
        .select('*')
        .gte('date', dateRange.start.toISOString())
        .lte('date', dateRange.end.toISOString())
        .order('date', { ascending: false });

      if (filterType !== 'all') {
        query = query.eq('type', filterType);
      }

      const { data, error } = await query;

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoadingTransactions(false);
    }
  };

  const fetchShifts = async () => {
    setLoadingShifts(true);
    try {
      const { data, error } = await supabase
        .from('shifts')
        .select('*')
        .order('opened_at', { ascending: false });

      if (error) throw error;
      setShifts(data || []);
    } catch (error) {
      console.error('Error fetching shifts:', error);
    } finally {
      setLoadingShifts(false);
    }
  };

  const handleDeleteShift = async (id: string) => {
    // Check if password is set
    if (isPasswordSet()) {
      setShiftToDelete(id);
      setIsPasswordModalOpen(true);
      return;
    }

    // If no password is set, show confirmation and delete directly
    if (!window.confirm("Smenani o'chirishni tasdiqlaysizmi? Bu amalni ortga qaytarib bo'lmaydi.")) {
      return;
    }

    await performDeleteShift(id);
  };

  const performDeleteShift = async (id: string) => {
    try {
      // First, delete all transactions linked to this shift
      const { error: transactionsError } = await supabase
        .from('transactions')
        .delete()
        .eq('shift_id', id);

      if (transactionsError) {
        console.error('Error deleting transactions:', transactionsError);
        // Continue anyway, maybe transactions were already deleted
      }

      // Then delete the shift
      const { error } = await supabase
        .from('shifts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setShifts(shifts.filter(s => s.id !== id));
      toast.success("Smena va unga bog'liq operatsiyalar o'chirildi");
    } catch (error: any) {
      toast.error("O'chirishda xatolik: " + error.message);
    }
  };

  const handlePasswordConfirm = (password: string) => {
    if (!verifyPassword(password)) {
      toast.error('Noto\'g\'ri parol');
      return;
    }

    if (shiftToDelete) {
      performDeleteShift(shiftToDelete);
      setShiftToDelete(null);
    }
    setIsPasswordModalOpen(false);
  };

  const filteredTransactions = transactions.filter(t => 
    t.description?.toLowerCase().includes(search.toLowerCase()) ||
    t.amount.toString().includes(search)
  );

  const handleDateChange = (range: { start: Date; end: Date; label: string }) => {
    setDateRange({ start: range.start, end: range.end });
  };

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

  const typeOptions = [
    { value: 'all', label: 'Barchasi', color: '#94a3b8' },
    { value: 'kassa', label: 'Kassa', color: '#10b981' },
    { value: 'click', label: 'Click', color: '#3b82f6' },
    { value: 'uzcard', label: 'Uzcard', color: '#8b5cf6' },
    { value: 'humo', label: 'Humo', color: '#f97316' },
    { value: 'xarajat', label: 'Xarajat', color: '#ef4444' },
  ];

  return (
    <div className="space-y-8">
      {/* Header & Tabs */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-white tracking-tight">Xisobotlar</h2>
          <div className="flex rounded-xl bg-white/5 p-1">
            <button
              onClick={() => setActiveTab('transactions')}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-all ${
                activeTab === 'transactions' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Operatsiyalar
            </button>
            <button
              onClick={() => setActiveTab('shifts')}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-all ${
                activeTab === 'shifts' 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Smenalar
            </button>
          </div>
        </div>
        
        {activeTab === 'transactions' && (
          <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
            <DateFilter onFilterChange={handleDateChange} />
            <MetricSelector 
              selected={filterType}
              onSelect={setFilterType}
              options={typeOptions}
            />
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
          </div>
        )}
      </div>

      {/* Content */}
      <motion.div 
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-3xl border border-white/5 bg-white/5 backdrop-blur-sm overflow-hidden"
      >
        <div className="overflow-x-auto">
          {activeTab === 'transactions' ? (
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
                {loadingTransactions ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">Yuklanmoqda...</td>
                  </tr>
                ) : filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">Ma'lumot topilmadi</td>
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
                          {item.type === 'xarajat' ? '-' : '+'} {formatCurrency(item.amount)}
                        </span>
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
          ) : (
            <table className="w-full text-left text-sm text-slate-400">
              <thead className="bg-white/5 text-xs uppercase font-medium text-slate-300">
                <tr>
                  <th className="px-6 py-4">Ochilgan vaqti</th>
                  <th className="px-6 py-4">Yopilgan vaqti</th>
                  <th className="px-6 py-4 text-right">Boshlang'ich Balans</th>
                  <th className="px-6 py-4 text-right">Yakuniy Balans</th>
                  <th className="px-6 py-4 text-right">Holat</th>
                  <th className="px-6 py-4 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loadingShifts ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">Yuklanmoqda...</td>
                  </tr>
                ) : shifts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">Smenalar topilmadi</td>
                  </tr>
                ) : (
                  shifts.map((shift) => (
                    <tr key={shift.id} className="group hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-white">
                          <Clock className="h-4 w-4 text-blue-400" />
                          {format(new Date(shift.opened_at), 'dd.MM.yyyy HH:mm')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {shift.closed_at ? (
                          <div className="flex items-center gap-2 text-slate-300">
                            <Clock className="h-4 w-4 text-slate-500" />
                            {format(new Date(shift.closed_at), 'dd.MM.yyyy HH:mm')}
                          </div>
                        ) : (
                          <span className="text-emerald-400 font-medium">Hozir ochiq</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-slate-300">
                        {formatCurrency(shift.starting_balance)}
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-white font-bold">
                        {shift.ending_balance ? formatCurrency(shift.ending_balance) : '-'}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          shift.status === 'open'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                        }`}>
                          {shift.status === 'open' ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                          {shift.status === 'open' ? 'Ochiq' : 'Yopiq'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDeleteShift(shift.id)}
                          className="rounded-lg p-2 text-slate-500 opacity-0 transition-all hover:bg-red-500/20 hover:text-red-400 group-hover:opacity-100"
                          title="Smenani o'chirish"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Footer (Common) */}
        <div className="border-t border-white/5 bg-white/5 px-6 py-4">
          <span className="text-xs text-slate-500">
            Jami {activeTab === 'transactions' ? filteredTransactions.length : shifts.length} ta yozuv
          </span>
        </div>
      </motion.div>

      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => {
          setIsPasswordModalOpen(false);
          setShiftToDelete(null);
        }}
        onConfirm={handlePasswordConfirm}
        title="Parolni kiriting"
        message="Smenani o'chirish uchun parolni kiriting"
      />
    </div>
  );
}
