import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Lock, Mail, ArrowRight, BarChart2, Shield, Users } from 'lucide-react';
import { toast } from 'sonner';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user?.email !== 'frlking2007@gmail.com') {
         await supabase.auth.signOut();
         toast.error('Ushbu hisobga kirish ruxsati yo\'q.');
         return;
      }

      toast.success('Xush kelibsiz!');
      navigate('/');
    } catch (error: any) {
      toast.error('Kirishda xatolik: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <nav className="mb-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-2xl font-bold text-blue-400">
            <BarChart2 className="h-8 w-8" />
            <span>Xpro</span>
          </div>
        </nav>

        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Chap tomon: Tanishtiruv */}
          <div className="space-y-8">
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              Biznesingizni <span className="text-blue-400">aqlli boshqaring</span>
            </h1>
            <p className="text-lg text-slate-300">
              Xpro - bu zamonaviy CRM tizimi bo'lib, mijozlar bilan ishlash, savdo hisobotlari va biznes jarayonlarini avtomatlashtirishga yordam beradi.
            </p>
            
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-800/50 p-6 backdrop-blur-sm">
                <Users className="mb-4 h-8 w-8 text-blue-400" />
                <h3 className="mb-2 text-xl font-semibold">Mijozlar Bazasi</h3>
                <p className="text-slate-400">Mijozlaringiz haqida barcha ma'lumotlar bir joyda.</p>
              </div>
              <div className="rounded-xl bg-slate-800/50 p-6 backdrop-blur-sm">
                <BarChart2 className="mb-4 h-8 w-8 text-green-400" />
                <h3 className="mb-2 text-xl font-semibold">Aniq Hisobotlar</h3>
                <p className="text-slate-400">Savdo va daromadlar bo'yicha batafsil statistikalar.</p>
              </div>
            </div>
          </div>

          {/* O'ng tomon: Login formasi */}
          <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-8 text-slate-900 shadow-2xl">
            <h2 className="mb-6 text-2xl font-bold text-center">Tizimga kirish</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="name@company.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Parol</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Kirilmoqda...' : 'Kirish'}
                <ArrowRight className="h-5 w-5" />
              </button>
            </form>
            <p className="mt-4 text-center text-sm text-slate-500">
              <Shield className="inline h-4 w-4 mr-1" />
              Faqat administrator uchun
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
