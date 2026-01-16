import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import { startOfMonth, endOfMonth } from 'date-fns';
import DateFilter from '../components/DateFilter';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { formatCurrency } from '../utils/currency';

const StatCard = ({ title, value, change, icon: Icon, color }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm transition-all hover:bg-white/10"
  >
    <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full ${color} opacity-10 blur-2xl`} />
    
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-slate-400">{title}</p>
        <h3 className="mt-2 text-3xl font-bold text-white tracking-tight">{value}</h3>
      </div>
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 ${color} bg-opacity-20`}>
        <Icon className={`h-6 w-6 text-white`} />
      </div>
    </div>
    
    <div className="mt-4 flex items-center gap-2">
      <span className={`flex items-center text-sm font-medium ${parseFloat(change) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
        {parseFloat(change) >= 0 ? <TrendingUp className="mr-1 h-4 w-4" /> : <TrendingDown className="mr-1 h-4 w-4" />}
        {change}
      </span>
      <span className="text-sm text-slate-500">o'tgan davrga nisbatan</span>
    </div>
  </motion.div>
);

export default function Dashboard() {
  const [dateRange, setDateRange] = useState({ start: startOfMonth(new Date()), end: new Date() });
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    jamiFoyda: 0,
    olimAka: 0,
    kassa: 0,
    azamAka: 0,
    jamiFoydaChange: '0%',
    olimAkaChange: '0%',
    kassaChange: '0%',
    azamAkaChange: '0%'
  });

  useEffect(() => {
    fetchStats();
  }, [dateRange]);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const { data: allTransactions, error: allError } = await supabase
        .from('transactions')
        .select('*');
      
      console.log('📡 Supabase response:', { 
        dataCount: allTransactions?.length || 0, 
        error: allError ? {
          code: allError.code,
          message: allError.message,
          details: allError.details,
          hint: (allError as any).hint
        } : null
      });
      
      if (allError) {
        console.error('❌ Supabase xatolik:', allError);
        console.error('Xatolik kodi:', allError.code);
        console.error('Xatolik xabari:', allError.message);
        console.error('Xatolik tafsilotlari:', allError.details);
        console.error('Xatolik hint:', (allError as any).hint);
        console.error('To\'liq xatolik obyekti:', JSON.stringify(allError, null, 2));
        
        // Provide user-friendly error message
        let userMessage = 'Statistikani yuklashda xatolik yuz berdi.';
        if (allError.code === '403' || allError.status === 403) {
          userMessage = 'Sizda bu amalni bajarishga ruxsat yo\'q. Iltimos, qayta kiring.';
          console.error('403 Forbidden - Ruxsat yo\'q');
        } else if (allError.code === '42501') {
          userMessage = 'Ruxsat yo\'q. Iltimos, qayta kiring.';
        } else if (allError.code === 'PGRST301') {
          userMessage = 'Ma\'lumotlar bazasi jadvali topilmadi.';
        } else if (allError.message) {
          userMessage = allError.message;
        }
        
        // Throw proper Error instead of returning
        throw new Error(userMessage);
      }
      
      console.log('✅ All transactions fetched:', allTransactions?.length || 0, 'items');
      
      // Filter by date in JavaScript (more reliable)
      const currentData = (allTransactions || []).filter(t => {
        if (!t.date) return false;
        const transactionDate = new Date(t.date);
        return transactionDate >= dateRange.start && transactionDate <= dateRange.end;
      });
      
      console.log('✅ Current period transactions filtered:', currentData.length, 'items');

      const duration = dateRange.end.getTime() - dateRange.start.getTime();
      const prevStart = new Date(dateRange.start.getTime() - duration);
      const prevEnd = new Date(dateRange.end.getTime() - duration);

      const prevData = (allTransactions || []).filter(t => {
        const d = new Date(t.date);
        return d >= prevStart && d <= prevEnd;
      });

      const calculateMetrics = (transactions: any[]) => {
        const kassa = transactions.filter(t => t.type === 'kassa');
        return {
          jamiFoyda: kassa.filter(t => t.amount > 0).reduce((sum, t) => sum + Math.abs(t.amount), 0),
          olimAka: kassa.filter(t => t.amount < 0 && t.description?.toLowerCase().includes('olim aka')).reduce((sum, t) => sum + Math.abs(t.amount), 0),
          azamAka: kassa.filter(t => t.amount < 0 && t.description?.toLowerCase().includes('azam aka')).reduce((sum, t) => sum + Math.abs(t.amount), 0),
          kassa: kassa.filter(t => t.amount < 0 && t.description?.toLowerCase().includes('kassa')).reduce((sum, t) => sum + Math.abs(t.amount), 0)
        };
      };

      const currentMetrics = calculateMetrics(currentData);
      const prevMetrics = calculateMetrics(prevData);

      const calculateChange = (curr: number, prev: number) => {
        if (prev === 0) return curr > 0 ? '+100%' : '0%';
        const p = ((curr - prev) / prev) * 100;
        return `${p > 0 ? '+' : ''}${p.toFixed(1)}%`;
      };

      setStats({
        jamiFoyda: currentMetrics.jamiFoyda,
        olimAka: currentMetrics.olimAka,
        kassa: currentMetrics.kassa,
        azamAka: currentMetrics.azamAka,
        jamiFoydaChange: calculateChange(currentMetrics.jamiFoyda, prevMetrics.jamiFoyda),
        olimAkaChange: calculateChange(currentMetrics.olimAka, prevMetrics.olimAka),
        kassaChange: calculateChange(currentMetrics.kassa, prevMetrics.kassa),
        azamAkaChange: calculateChange(currentMetrics.azamAka, prevMetrics.azamAka)
      });
    } catch (error: any) {
      console.error('❌ Supabase xatolik (fetchStats):', error);
      const errorMessage = error?.message || error?.toString() || 'Noma\'lum xatolik';
      console.error('Xatolik xabari:', errorMessage);
      
      // Handle 403 errors
      if (error?.code === '403' || error?.status === 403 || errorMessage.includes('403') || errorMessage.includes('ruxsat')) {
        toast.error('Sizda bu amalni bajarishga ruxsat yo\'q. Iltimos, qayta kiring.');
      } else {
        toast.error('Statistikani yuklashda xatolik: ' + errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (range: any) => setDateRange({ start: range.start, end: range.end });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-white tracking-tight">Umumiy ko'rinish</h2>
        <DateFilter onFilterChange={handleFilterChange} />
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Jami Foyda" value={formatCurrency(stats.jamiFoyda)} change={stats.jamiFoydaChange} icon={DollarSign} color="bg-blue-500" />
        <StatCard title="Olim aka" value={formatCurrency(stats.olimAka)} change={stats.olimAkaChange} icon={Wallet} color="bg-emerald-500" />
        <StatCard title="Kassa" value={formatCurrency(stats.kassa)} change={stats.kassaChange} icon={TrendingDown} color="bg-red-500" />
        <StatCard title="Azam aka" value={formatCurrency(stats.azamAka)} change={stats.azamAkaChange} icon={TrendingUp} color="bg-purple-500" />
      </div>
    </div>
  );
}
