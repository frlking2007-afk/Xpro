import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, ShoppingBag, DollarSign, ArrowUpRight, Wallet, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import DateFilter from '../components/DateFilter';

const data = [
  { name: 'Yan', savdo: 4000, daromad: 2400, foyda: 1800, mijozlar: 400 },
  { name: 'Fev', savdo: 3000, daromad: 1398, foyda: 1200, mijozlar: 300 },
  { name: 'Mar', savdo: 2000, daromad: 9800, foyda: 4500, mijozlar: 200 },
  { name: 'Apr', savdo: 2780, daromad: 3908, foyda: 2100, mijozlar: 278 },
  { name: 'May', savdo: 1890, daromad: 4800, foyda: 1600, mijozlar: 189 },
  { name: 'Iyun', savdo: 2390, daromad: 3800, foyda: 1900, mijozlar: 239 },
  { name: 'Iyul', savdo: 3490, daromad: 4300, foyda: 2800, mijozlar: 349 },
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
  const [chartMetric, setChartMetric] = useState('savdo'); // savdo, daromad, foyda, mijozlar

  const handleFilterChange = (range: { start: Date; end: Date; label: string }) => {
    console.log('Tanlangan sana oralig\'i:', range);
    setDateRange({ start: range.start, end: range.end });
  };

  const metrics = {
    savdo: { label: 'Jami Savdo', color: '#3b82f6' },
    daromad: { label: 'Sof Foyda', color: '#8b5cf6' },
    foyda: { label: 'Kechagi Foyda', color: '#10b981' },
    mijozlar: { label: 'Yangi Mijozlar', color: '#ec4899' },
  };

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
          title="Yangi Mijozlar" 
          value="3,456" 
          change="+5.1%" 
          icon={Users}
          color="bg-pink-500" 
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
            <div className="relative">
              <select
                value={chartMetric}
                onChange={(e) => setChartMetric(e.target.value)}
                className="appearance-none rounded-xl border border-white/10 bg-black/20 py-2 pl-4 pr-10 text-sm text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="savdo">Jami Savdo</option>
                <option value="daromad">Sof Foyda</option>
                <option value="foyda">Kechagi Foyda</option>
                <option value="mijozlar">Yangi Mijozlar</option>
              </select>
              <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={metrics[chartMetric as keyof typeof metrics].color} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={metrics[chartMetric as keyof typeof metrics].color} stopOpacity={0}/>
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
                  stroke={metrics[chartMetric as keyof typeof metrics].color} 
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
