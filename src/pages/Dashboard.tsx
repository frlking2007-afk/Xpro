import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import { startOfDay, endOfDay, subDays, startOfMonth, endOfMonth, format, isSameMonth, subMonths, eachMonthOfInterval, startOfYear, endOfYear } from 'date-fns';
import { uz } from 'date-fns/locale';
import DateFilter from '../components/DateFilter';
import MetricSelector from '../components/MetricSelector';
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
  const [chartMetric, setChartMetric] = useState('savdo');
  const [stats, setStats] = useState({
    jamiFoyda: 0,
    olimAka: 0, // "Olim aka" (old name: kechagiFoyda)
    kassa: 0, // "Kassa" (old name: jamiZarar)
    azamAka: 0, // "Azam aka" (old name: sofFoyda)
    jamiFoydaChange: '0%',
    olimAkaChange: '0%', // (old name: kechagiFoydaChange)
    kassaChange: '0%', // (old name: jamiZararChange)
    azamAkaChange: '0%' // (old name: sofFoydaChange)
  });
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
  }, [dateRange]); // Refetch when date range changes

  // Listen for currency updates
  useEffect(() => {
    const handleCurrencyUpdate = () => {
      // Force re-render by updating stats
      setStats(prev => ({ ...prev }));
    };
    window.addEventListener('currencyUpdated', handleCurrencyUpdate);
    return () => window.removeEventListener('currencyUpdated', handleCurrencyUpdate);
  }, []);

  const fetchStats = async () => {
    try {
      console.log('📊 Fetching dashboard stats...', { start: dateRange.start, end: dateRange.end });
      
      // Check environment variables before making requests
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Supabase environment variables are missing!');
        toast.error('Supabase sozlamalari topilmadi. Environment variables\'ni tekshiring.');
        return;
      }
      
      console.log('📡 Supabase URL:', supabaseUrl ? 'Set' : 'Missing');
      console.log('📡 Supabase Key:', supabaseKey ? 'Set (' + supabaseKey.length + ' chars)' : 'Missing');
      
      // First, try to fetch all transactions to see if table exists and what columns it has
      // Then filter by date in JavaScript (safer approach if date column format is unknown)
      console.log('📡 Attempting to fetch all transactions first...');
      
      const { data: allTransactions, error: allError } = await supabase
        .from('transactions')
        .select('*')
        .limit(10000); // Large limit to get all transactions
      
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
        console.error('❌ Supabase error fetching transactions:', allError);
        console.error('Error code:', allError.code);
        console.error('Error message:', allError.message);
        console.error('Error details:', allError.details);
        console.error('Error hint:', (allError as any).hint);
        console.error('Full error object:', JSON.stringify(allError, null, 2));
        
        // Provide user-friendly error message
        let userMessage = 'Statistikani yuklashda xatolik yuz berdi.';
        if (allError.code === '42501') {
          userMessage = 'Ruxsat yo\'q. Iltimos, qayta kiring.';
        } else if (allError.code === 'PGRST301') {
          userMessage = 'Ma\'lumotlar bazasi jadvali topilmadi.';
        } else if (allError.message) {
          userMessage = allError.message;
        }
        
        toast.error(userMessage);
        return;
      }
      
      console.log('✅ All transactions fetched:', allTransactions?.length || 0, 'items');
      
      // Filter by date in JavaScript (more reliable)
      const currentData = (allTransactions || []).filter(t => {
        if (!t.date) return false;
        const transactionDate = new Date(t.date);
        return transactionDate >= dateRange.start && transactionDate <= dateRange.end;
      });
      
      console.log('✅ Current period transactions filtered:', currentData.length, 'items');

      // Fetch previous period data for comparison (simple comparison: same duration before start date)
      const duration = dateRange.end.getTime() - dateRange.start.getTime();
      const prevStart = new Date(dateRange.start.getTime() - duration);
      const prevEnd = new Date(dateRange.end.getTime() - duration);

      // Filter previous period in JavaScript
      const prevData = (allTransactions || []).filter(t => {
        if (!t.date) return false;
        const transactionDate = new Date(t.date);
        return transactionDate >= prevStart && transactionDate <= prevEnd;
      });
      
      console.log('✅ Previous period transactions filtered:', prevData.length, 'items');

      // Calculate Stats based on KASSA operations
      const calculateMetrics = (transactions: any[]) => {
        // Filter KASSA transactions only
        const kassaTransactions = transactions.filter(t => t.type === 'kassa');
        
        // Jami Foyda: KASSA tab'dagi + (plus) operatsiyalar yig'indisi
        const jamiFoyda = kassaTransactions
          .filter(t => t.amount > 0)
          .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        
        // Olim aka: KASSA tab'dagi - (minus) operatsiyalar, description "Olim aka" bo'lganlar
        const olimAka = kassaTransactions
          .filter(t => t.amount < 0 && t.description && t.description.toLowerCase().includes('olim aka'))
          .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        
        // Azam aka: KASSA tab'dagi - (minus) operatsiyalar, description "Azam aka" yoki "azam aka" bo'lganlar
        const azamAka = kassaTransactions
          .filter(t => t.amount < 0 && t.description && t.description.toLowerCase().includes('azam aka'))
          .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        
        // Kassa: KASSA tab'dagi - (minus) operatsiyalar, description "Kassa" yoki "kassa" bo'lganlar
        const kassa = kassaTransactions
          .filter(t => t.amount < 0 && t.description && t.description.toLowerCase().includes('kassa'))
          .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        
        return {
          jamiFoyda,
          olimAka,
          azamAka,
          kassa
        };
      };

      const currentMetrics = calculateMetrics(currentData || []);
      const prevMetrics = calculateMetrics(prevData || []);

      const calculateChange = (current: number, prev: number) => {
        if (prev === 0) return current > 0 ? '+100%' : '0%';
        const percent = ((current - prev) / prev) * 100;
        return `${percent > 0 ? '+' : ''}${percent.toFixed(1)}%`;
      };

      // Special calculation for "Kechagi Foyda" (always yesterday's profit, regardless of filter? Or based on filter?)
      // Usually "Yesterday" implies literally yesterday.
      const yesterdayStart = startOfDay(subDays(new Date(), 1));
      const yesterdayEnd = endOfDay(subDays(new Date(), 1));
      const dayBeforeYesterdayStart = startOfDay(subDays(new Date(), 2));
      const dayBeforeYesterdayEnd = endOfDay(subDays(new Date(), 2));

      // Filter yesterday data in JavaScript
      const yesterdayData = (allTransactions || []).filter(t => {
        if (!t.date) return false;
        const transactionDate = new Date(t.date);
        return transactionDate >= yesterdayStart && transactionDate <= yesterdayEnd;
      });
      
      console.log('✅ Yesterday transactions filtered:', yesterdayData.length, 'items');
      
      // Filter day before yesterday data in JavaScript
      const dayBeforeYesterdayData = (allTransactions || []).filter(t => {
        if (!t.date) return false;
        const transactionDate = new Date(t.date);
        return transactionDate >= dayBeforeYesterdayStart && transactionDate <= dayBeforeYesterdayEnd;
      });
      
      console.log('✅ Day before yesterday transactions filtered:', dayBeforeYesterdayData.length, 'items');

      // Calculate yesterday's "Olim aka" (same logic as current period)
      const yesterdayKassaTransactions = (yesterdayData || []).filter(t => t.type === 'kassa');
      const yesterdayOlimAka = yesterdayKassaTransactions
        .filter(t => t.amount < 0 && t.description && t.description.toLowerCase().includes('olim aka'))
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        
      const dayBeforeYesterdayKassaTransactions = (dayBeforeYesterdayData || []).filter(t => t.type === 'kassa');
      const dayBeforeYesterdayOlimAka = dayBeforeYesterdayKassaTransactions
        .filter(t => t.amount < 0 && t.description && t.description.toLowerCase().includes('olim aka'))
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      setStats({
        jamiFoyda: currentMetrics.jamiFoyda,
        olimAka: currentMetrics.olimAka, // "Olim aka"
        kassa: currentMetrics.kassa, // "Kassa"
        azamAka: currentMetrics.azamAka, // "Azam aka"
        jamiFoydaChange: calculateChange(currentMetrics.jamiFoyda, prevMetrics.jamiFoyda),
        olimAkaChange: calculateChange(currentMetrics.olimAka, prevMetrics.olimAka),
        kassaChange: calculateChange(currentMetrics.kassa, prevMetrics.kassa),
        azamAkaChange: calculateChange(currentMetrics.azamAka, prevMetrics.azamAka)
      });

      // Prepare Chart Data (Group by Day or Month based on range)
      // For simplicity, let's group by Day if range < 2 months, else by Month
      // Grouping logic...
      // Let's create a daily map for the current range
      const days = eachMonthOfInterval({ start: startOfYear(new Date()), end: endOfYear(new Date()) }); // Show yearly chart by default? Or based on filter?
      // Better: Show chart for the selected range.
      
      // Let's stick to the current "Monthly" view for the chart as in the original design (Jan, Feb...) 
      // but populated with real data from THIS YEAR.
      const startOfCurrentYear = startOfYear(new Date());
      const endOfCurrentYear = endOfYear(new Date());
      
      // Filter year data in JavaScript
      const yearData = (allTransactions || []).filter(t => {
        if (!t.date) return false;
        const transactionDate = new Date(t.date);
        return transactionDate >= startOfCurrentYear && transactionDate <= endOfCurrentYear;
      });
      
      console.log('✅ Year data filtered:', yearData.length, 'items');

      const monthsData = days.map(month => {
        const monthTrans = (yearData || []).filter(t => isSameMonth(new Date(t.date), month));
        
        // Filter KASSA transactions only
        const kassaTransactions = monthTrans.filter(t => t.type === 'kassa');
        
        // Calculate based on KASSA operations
        const jamiFoyda = kassaTransactions
          .filter(t => t.amount > 0)
          .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        
        const olimAka = kassaTransactions
          .filter(t => t.amount < 0 && t.description && t.description.toLowerCase().includes('olim aka'))
          .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        
        const azamAka = kassaTransactions
          .filter(t => t.amount < 0 && t.description && t.description.toLowerCase().includes('azam aka'))
          .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        
        const kassa = kassaTransactions
          .filter(t => t.amount < 0 && t.description && t.description.toLowerCase().includes('kassa'))
          .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        
        return {
          name: format(month, 'MMM', { locale: uz }),
          savdo: jamiFoyda, // Jami Foyda
          zarar: kassa, // Kassa
          daromad: azamAka // Azam aka
        };
      });

      setChartData(monthsData);
      
      console.log('✅ Dashboard stats calculated:', {
        jamiFoyda: currentMetrics.jamiFoyda,
        olimAka: currentMetrics.olimAka,
        azamAka: currentMetrics.azamAka,
        kassa: currentMetrics.kassa
      });

    } catch (error: any) {
      console.error('❌ Exception in fetchStats:', error);
      toast.error('Statistikani yuklashda xatolik: ' + (error.message || 'Noma\'lum xatolik'));
    }
  };

  const handleFilterChange = (range: { start: Date; end: Date; label: string }) => {
    setDateRange({ start: range.start, end: range.end });
  };

  const metricOptions = [
    { value: 'savdo', label: 'Jami Foyda', color: '#3b82f6' },
    { value: 'daromad', label: 'Sof Foyda', color: '#8b5cf6' },
    { value: 'zarar', label: 'Jami Zarar', color: '#ef4444' },
  ];

  const currentMetric = metricOptions.find(m => m.value === chartMetric) || metricOptions[0];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-white tracking-tight">Umumiy ko'rinish</h2>
        <div className="flex gap-2">
          <DateFilter onFilterChange={handleFilterChange} />
        </div>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Jami Foyda" 
          value={formatCurrency(stats.jamiFoyda)}
          change={stats.jamiFoydaChange} 
          icon={DollarSign}
          color="bg-blue-500" 
        />
        <StatCard 
          title="Olim aka" 
          value={formatCurrency(stats.olimAka)}
          change={stats.olimAkaChange} 
          icon={Wallet}
          color="bg-emerald-500" 
        />
        <StatCard 
          title="Kassa" 
          value={formatCurrency(stats.kassa)}
          change={stats.kassaChange} 
          icon={TrendingDown}
          color="bg-red-500" 
        />
        <StatCard 
          title="Azam aka" 
          value={formatCurrency(stats.azamAka)}
          change={stats.azamAkaChange} 
          icon={TrendingUp}
          color="bg-purple-500" 
        />
      </div>

      <div className="grid gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm"
        >
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Yillik Statistika</h3>
            <MetricSelector 
              selected={chartMetric}
              onSelect={setChartMetric}
              options={metricOptions}
            />
          </div>

          <div className="h-80 w-full min-h-[300px]">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                <AreaChart data={chartData}>
                  <defs>
                  <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={currentMetric.color} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={currentMetric.color} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value: number) => [formatCurrency(value), currentMetric.label]}
                />
                <Area 
                  type="monotone" 
                  dataKey={chartMetric} 
                  stroke={currentMetric.color} 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorMetric)" 
                />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-slate-500">
                Ma'lumotlar yuklanmoqda...
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
