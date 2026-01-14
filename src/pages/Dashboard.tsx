import React, { useState, useEffect, lazy, Suspense } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import { startOfMonth } from 'date-fns';

// Lazy load heavy chart library
const AreaChart = lazy(() => import('recharts').then(module => ({ default: module.AreaChart })));
const Area = lazy(() => import('recharts').then(module => ({ default: module.Area })));
const XAxis = lazy(() => import('recharts').then(module => ({ default: module.XAxis })));
const YAxis = lazy(() => import('recharts').then(module => ({ default: module.YAxis })));
const CartesianGrid = lazy(() => import('recharts').then(module => ({ default: module.CartesianGrid })));
const Tooltip = lazy(() => import('recharts').then(module => ({ default: module.Tooltip })));
const ResponsiveContainer = lazy(() => import('recharts').then(module => ({ default: module.ResponsiveContainer })));
import DateFilter from '../components/DateFilter';
import MetricSelector from '../components/MetricSelector';
import { formatCurrency } from '../utils/currency';
import { useDashboardData } from '../hooks/useDashboardData';
import StatCardSkeleton from '../components/StatCardSkeleton';
import ChartSkeleton from '../components/ChartSkeleton';
import ErrorState from '../components/ErrorState';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const StatCard = ({ title, value, change, icon: Icon, color }: StatCardProps) => (
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
        <Icon className="h-6 w-6 text-white" />
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
  const [dateRange, setDateRange] = useState({ 
    start: startOfMonth(new Date()), 
    end: new Date() 
  });
  const [chartMetric, setChartMetric] = useState('savdo');

  // Use TanStack Query hook for data fetching
  const { 
    data, 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useDashboardData({
    startDate: dateRange.start,
    endDate: dateRange.end,
  });

  // Listen for currency updates to trigger re-render
  useEffect(() => {
    const handleCurrencyUpdate = () => {
      // Refetch data when currency changes
      refetch();
    };
    window.addEventListener('currencyUpdated', handleCurrencyUpdate);
    return () => window.removeEventListener('currencyUpdated', handleCurrencyUpdate);
  }, [refetch]);

  const handleFilterChange = (range: { start: Date; end: Date; label: string }) => {
    setDateRange({ start: range.start, end: range.end });
  };

  const metricOptions = [
    { value: 'savdo', label: 'Jami Foyda', color: '#3b82f6' },
    { value: 'daromad', label: 'Sof Foyda', color: '#8b5cf6' },
    { value: 'zarar', label: 'Jami Zarar', color: '#ef4444' },
  ];

  const currentMetric = metricOptions.find(m => m.value === chartMetric) || metricOptions[0];

  // Check if error is 403 Forbidden
  const is403Error = error instanceof Error && (
    error.message.includes('Ruxsat yo\'q') ||
    error.message.includes('Login muddati tugagan') ||
    error.message.includes('403') ||
    error.message.includes('PGRST301') ||
    error.message.includes('42501')
  );

  // Error state
  if (isError) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold text-white tracking-tight">Umumiy ko'rinish</h2>
          <div className="flex gap-2">
            <DateFilter onFilterChange={handleFilterChange} />
          </div>
        </div>
        <ErrorState 
          message={error instanceof Error ? error.message : 'Ma\'lumotlarni yuklashda xatolik yuz berdi'} 
          onRetry={!is403Error ? () => refetch() : undefined}
          is403Error={is403Error}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-white tracking-tight">Umumiy ko'rinish</h2>
        <div className="flex gap-2">
          <DateFilter onFilterChange={handleFilterChange} />
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <>
            <StatCardSkeleton color="bg-blue-500" />
            <StatCardSkeleton color="bg-emerald-500" />
            <StatCardSkeleton color="bg-red-500" />
            <StatCardSkeleton color="bg-purple-500" />
          </>
        ) : data ? (
          <>
            <StatCard 
              title="Jami Foyda" 
              value={formatCurrency(data.stats.jamiFoyda)}
              change={data.stats.jamiFoydaChange} 
              icon={DollarSign}
              color="bg-blue-500" 
            />
            <StatCard 
              title="Kechagi Foyda" 
              value={formatCurrency(data.stats.kechagiFoyda)}
              change={data.stats.kechagiFoydaChange} 
              icon={Wallet}
              color="bg-emerald-500" 
            />
            <StatCard 
              title="Jami Zarar" 
              value={formatCurrency(data.stats.jamiZarar)}
              change={data.stats.jamiZararChange} 
              icon={TrendingDown}
              color="bg-red-500" 
            />
            <StatCard 
              title="Sof Foyda" 
              value={formatCurrency(data.stats.sofFoyda)}
              change={data.stats.sofFoydaChange} 
              icon={TrendingUp}
              color="bg-purple-500" 
            />
          </>
        ) : null}
      </div>

      {/* Chart */}
      <div className="grid gap-6">
        {isLoading ? (
          <ChartSkeleton />
        ) : data ? (
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
              <Suspense fallback={<div className="h-full w-full flex items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-white"></div></div>}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.chartData}>
                    <defs>
                      <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={currentMetric.color} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={currentMetric.color} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#94a3b8" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      stroke="#94a3b8" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      tickFormatter={(value) => `${value/1000}k`} 
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#0f172a', 
                        border: '1px solid #1e293b', 
                        borderRadius: '8px' 
                      }}
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
              </Suspense>
            </div>
          </motion.div>
        ) : null}
      </div>
    </div>
  );
}
