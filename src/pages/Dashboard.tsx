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
    kechagiFoyda: 0,
    jamiZarar: 0,
    sofFoyda: 0,
    jamiFoydaChange: '0%',
    kechagiFoydaChange: '0%',
    jamiZararChange: '0%',
    sofFoydaChange: '0%'
  });
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
  }, [dateRange]); // Refetch when date range changes

  const fetchStats = async () => {
    try {
      // 1. Fetch ALL transactions to calculate everything (or optimize with specific queries)
      // For now, let's fetch all for simplicity, but in production, filtering by date in SQL is better.
      // Fetching transactions within the selected date range
      const { data: currentData, error: currentError } = await supabase
        .from('transactions')
        .select('*')
        .gte('date', dateRange.start.toISOString())
        .lte('date', dateRange.end.toISOString());

      if (currentError) throw currentError;

      // Fetch previous period data for comparison (simple comparison: same duration before start date)
      const duration = dateRange.end.getTime() - dateRange.start.getTime();
      const prevStart = new Date(dateRange.start.getTime() - duration);
      const prevEnd = new Date(dateRange.end.getTime() - duration);

      const { data: prevData, error: prevError } = await supabase
        .from('transactions')
        .select('*')
        .gte('date', prevStart.toISOString())
        .lte('date', prevEnd.toISOString());

      if (prevError) throw prevError;

      // Calculate Stats
      const calculateMetrics = (transactions: any[]) => {
        const kirim = transactions.filter(t => t.type !== 'xarajat').reduce((sum, t) => sum + t.amount, 0);
        const chiqim = transactions.filter(t => t.type === 'xarajat').reduce((sum, t) => sum + t.amount, 0);
        return {
          jamiFoyda: kirim,
          jamiZarar: chiqim,
          sofFoyda: kirim - chiqim
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

      const { data: yesterdayData } = await supabase
        .from('transactions')
        .select('*')
        .gte('date', yesterdayStart.toISOString())
        .lte('date', yesterdayEnd.toISOString());
      
      const { data: dayBeforeYesterdayData } = await supabase
        .from('transactions')
        .select('*')
        .gte('date', dayBeforeYesterdayStart.toISOString())
        .lte('date', dayBeforeYesterdayEnd.toISOString());

      const yesterdayProfit = (yesterdayData || [])
        .filter(t => t.type !== 'xarajat')
        .reduce((sum, t) => sum + t.amount, 0);
        
      const dayBeforeYesterdayProfit = (dayBeforeYesterdayData || [])
        .filter(t => t.type !== 'xarajat')
        .reduce((sum, t) => sum + t.amount, 0);

      setStats({
        jamiFoyda: currentMetrics.jamiFoyda,
        jamiZarar: currentMetrics.jamiZarar,
        sofFoyda: currentMetrics.sofFoyda,
        kechagiFoyda: yesterdayProfit,
        jamiFoydaChange: calculateChange(currentMetrics.jamiFoyda, prevMetrics.jamiFoyda),
        jamiZararChange: calculateChange(currentMetrics.jamiZarar, prevMetrics.jamiZarar),
        sofFoydaChange: calculateChange(currentMetrics.sofFoyda, prevMetrics.sofFoyda),
        kechagiFoydaChange: calculateChange(yesterdayProfit, dayBeforeYesterdayProfit)
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
      
      const { data: yearData } = await supabase
        .from('transactions')
        .select('*')
        .gte('date', startOfCurrentYear.toISOString())
        .lte('date', endOfCurrentYear.toISOString());

      const monthsData = days.map(month => {
        const monthTrans = (yearData || []).filter(t => isSameMonth(new Date(t.date), month));
        const kirim = monthTrans.filter(t => t.type !== 'xarajat').reduce((sum, t) => sum + t.amount, 0);
        const chiqim = monthTrans.filter(t => t.type === 'xarajat').reduce((sum, t) => sum + t.amount, 0);
        
        return {
          name: format(month, 'MMM', { locale: uz }),
          savdo: kirim, // Jami Foyda
          zarar: chiqim, // Jami Zarar
          daromad: kirim - chiqim // Sof Foyda
        };
      });

      setChartData(monthsData);

    } catch (error: any) {
      console.error('Error fetching stats:', error);
      // toast.error('Statistikani yuklashda xatolik');
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
          value={`${stats.jamiFoyda.toLocaleString()} UZS`}
          change={stats.jamiFoydaChange} 
          icon={DollarSign}
          color="bg-blue-500" 
        />
        <StatCard 
          title="Kechagi Foyda" 
          value={`${stats.kechagiFoyda.toLocaleString()} UZS`}
          change={stats.kechagiFoydaChange} 
          icon={Wallet}
          color="bg-emerald-500" 
        />
        <StatCard 
          title="Jami Zarar" 
          value={`${stats.jamiZarar.toLocaleString()} UZS`}
          change={stats.jamiZararChange} 
          icon={TrendingDown}
          color="bg-red-500" 
        />
        <StatCard 
          title="Sof Foyda" 
          value={`${stats.sofFoyda.toLocaleString()} UZS`}
          change={stats.sofFoydaChange} 
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

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
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
                  formatter={(value: number) => [`${value.toLocaleString()} UZS`, currentMetric.label]}
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
          </div>
        </motion.div>
      </div>
    </div>
  );
}
