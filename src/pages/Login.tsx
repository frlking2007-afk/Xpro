import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Lock, Mail, ArrowRight, Zap, ShieldCheck, LayoutGrid } from 'lucide-react';
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
         toast.error('Kirish ruxsati yo\'q.');
         return;
      }

      toast.success('Xush kelibsiz!');
      navigate('/');
    } catch (error: any) {
      toast.error('Xatolik: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-950">
      {/* Animated Background */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl px-4">
        <div className="grid overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 shadow-2xl backdrop-blur-2xl lg:grid-cols-2">
          
          {/* Left Side - Brand */}
          <div className="relative hidden flex-col justify-between p-12 lg:flex">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
            
            <div className="relative">
              <div className="flex items-center gap-3 text-3xl font-bold text-white">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-500 to-purple-500 shadow-lg shadow-blue-500/30">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                Xpro CRM
              </div>
              <p className="mt-4 text-slate-400">
                Biznesingizni keyingi bosqichga olib chiqing. Zamonaviy, tezkor va xavfsiz.
              </p>
            </div>

            <div className="relative space-y-6">
              <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-4 border border-white/5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
                  <LayoutGrid className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Intuitiv Dashboard</h3>
                  <p className="text-sm text-slate-400">Barcha ko'rsatkichlar bir joyda</p>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-4 border border-white/5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Xavfsiz Tizim</h3>
                  <p className="text-sm text-slate-400">Ma'lumotlaringiz himoyalangan</p>
                </div>
              </div>
            </div>

            <div className="relative text-xs text-slate-500">
              © 2026 Xpro Inc. Barcha huquqlar himoyalangan.
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="flex flex-col justify-center p-8 sm:p-12 bg-white/5">
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-white mb-2">Xush kelibsiz</h2>
              <p className="text-slate-400">Davom etish uchun tizimga kiring</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Email manzilingiz</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-10 text-white placeholder-slate-500 focus:border-blue-500 focus:bg-black/40 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Parol</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-10 text-white placeholder-slate-500 focus:border-blue-500 focus:bg-black/40 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-500/25"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Kirilmoqda...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Tizimga kirish 
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
