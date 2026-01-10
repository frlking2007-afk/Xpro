import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Yan', savdo: 4000 },
  { name: 'Fev', savdo: 3000 },
  { name: 'Mar', savdo: 2000 },
  { name: 'Apr', savdo: 2780 },
  { name: 'May', savdo: 1890 },
  { name: 'Iyun', savdo: 2390 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Umumiy ko'rinish</h2>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Jami Savdo', value: '12,345,000 UZS', change: '+12%' },
          { label: 'Yangi Mijozlar', value: '123', change: '+5%' },
          { label: 'Buyurtmalar', value: '456', change: '+8%' },
          { label: 'Daromad', value: '4,500,000 UZS', change: '+15%' },
        ].map((stat, i) => (
          <div key={i} className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">{stat.value}</p>
            <span className="text-sm text-green-600">{stat.change} o'tgan oyga nisbatan</span>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">Savdo Statistikasi</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="savdo" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
