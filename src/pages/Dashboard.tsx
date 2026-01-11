import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, ShoppingBag, DollarSign, ArrowUpRight, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import DateFilter from '../components/DateFilter';
import MetricSelector from '../components/MetricSelector';

const data = [
  { name: 'Yan', savdo: 4000, daromad: 2400, foyda: 1800, zarar: 200 },
  { name: 'Fev', savdo: 3000, daromad: 1398, foyda: 1200, zarar: 150 },
  { name: 'Mar', savdo: 2000, daromad: 9800, foyda: 4500, zarar: 300 },
  { name: 'Apr', savdo: 2780, daromad: 3908, foyda: 2100, zarar: 180 },
  { name: 'May', savdo: 1890, daromad: 4800, foyda: 1600, zarar: 120 },
  { name: 'Iyun', savdo: 2390, daromad: 3800, foyda: 1900, zarar: 250 },
  { name: 'Iyul', savdo: 3490, daromad: 4300, foyda: 2800, zarar: 400 },
];

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
      <span className="flex items-center text-sm font-medium text-emerald-400">
        <ArrowUpRight className="mr-1 h-4 w-4" />
        {change}
      </span>
      <span className="text-sm text-slate-500">o'tgan oyga nisbatan</span>
    </div>
  </motion.div>
);

export default function Dashboard() {
  const [dateRange, setDateRange] = useState({ start: new Date(), end: new Date() });
  const [chartMetric, setChartMetric] = useState('savdo');

  const handleFilterChange = (range: { start: Date; end: Date; label: string }) => {
    console.log('Tanlangan sana oralig\'i:', range);
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
          value="124.5M" 
          change="+12.5%" 
          icon={DollarSign}
          color="bg-blue-500" 
        />
        <StatCard 
          title="Kechagi Foyda" 
          value="1,234" 
          change="+8.2%" 
          icon={Wallet}
          color="bg-emerald-500" 
        />
        <StatCard 
          title="Jami Zarar" 
          value="3,456" 
          change="+5.1%" 
          icon={TrendingDown}
          color="bg-red-500" 
        />
        <StatCard 
          title="Sof Foyda" 
          value="45.2M" 
          change="+15.3%" 
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
            <h3 className="text-lg font-semibold text-white">Statistika</h3>
            <MetricSelector 
              selected={chartMetric}
              onSelect={setChartMetric}
              options={metricOptions}
            />
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={currentMetric.color} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={currentMetric.color} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
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
