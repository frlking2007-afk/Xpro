import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Lock, Mail, ArrowRight, Zap, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
// Hyperspeed removed - using CSS gradient background instead

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if session exists and is valid
      const { data: { session: existingSession }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('❌ Supabase xatolik (getSession):', sessionError);
        const errorMessage = sessionError.message || 'Noma\'lum xatolik';
        throw new Error(errorMessage);
      }

      // If session exists but expired, sign out first
      if (existingSession) {
        const expiresAt = existingSession.expires_at;
        if (expiresAt && expiresAt * 1000 < Date.now()) {
          console.log('ℹ️ Session muddati tugagan, yangilash...');
          await supabase.auth.signOut();
        }
      }

      // Attempt login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Supabase xatolik (signInWithPassword):', error);
        console.error('Xatolik kodi:', error.code);
        console.error('Xatolik xabari:', error.message);
        console.error('Xatolik tafsilotlari:', error);
        
        // Handle 403 Forbidden error specifically
        if (error.code === '403' || error.status === 403) {
          const errorMessage = 'Sizda bu amalni bajarishga ruxsat yo\'q. Iltimos, administrator bilan bog\'laning.';
          console.error('403 Forbidden - Ruxsat yo\'q');
          toast.error(errorMessage);
          return;
        }

        // Handle token expiration
        if (error.message?.includes('token') || error.message?.includes('expired') || error.message?.includes('refresh')) {
          const errorMessage = 'Sessiya muddati tugagan. Iltimos, qayta kiring.';
          console.error('Token muddati tugagan');
          toast.error(errorMessage);
          await supabase.auth.signOut();
          return;
        }

        // Handle other errors
        const errorMessage = error.message || 'Noma\'lum xatolik';
        throw new Error(errorMessage);
      }

      // Verify user has access
      if (!data.user) {
        const errorMessage = 'Foydalanuvchi ma\'lumotlari topilmadi.';
        console.error('Foydalanuvchi ma\'lumotlari yo\'q');
        throw new Error(errorMessage);
      }

      // Check email authorization (RLS policy check)
      if (data.user?.email !== 'frlking2007@gmail.com') {
        console.warn('⚠️ Ruxsatsiz kirish urinishi:', data.user.email);
        await supabase.auth.signOut();
        toast.error('Kirish ruxsati yo\'q. Faqat ruxsatli foydalanuvchilar kirishi mumkin.');
        return;
      }

      // Verify session is valid after login
      const { data: { session: newSession }, error: verifyError } = await supabase.auth.getSession();
      
      if (verifyError) {
        console.error('❌ Supabase xatolik (session verify):', verifyError);
        const errorMessage = verifyError.message || 'Sessiya tekshirishda xatolik';
        throw new Error(errorMessage);
      }

      if (!newSession) {
        const errorMessage = 'Sessiya yaratilmadi. Iltimos, qayta urinib ko\'ring.';
        console.error('Sessiya yaratilmadi');
        throw new Error(errorMessage);
      }

      // Check if token is expired
      const expiresAt = newSession.expires_at;
      if (expiresAt && expiresAt * 1000 < Date.now()) {
        const errorMessage = 'Sessiya muddati tugagan. Iltimos, qayta kiring.';
        console.error('Sessiya muddati tugagan');
        await supabase.auth.signOut();
        throw new Error(errorMessage);
      }

      console.log('✅ Login muvaffaqiyatli:', data.user.email);
      toast.success('Xush kelibsiz!');
      navigate('/');
    } catch (error: any) {
      console.error('❌ Supabase xatolik (handleLogin):', error);
      const errorMessage = error?.message || error?.toString() || 'Noma\'lum xatolik';
      console.error('Xatolik xabari:', errorMessage);
      
      // Handle 403 errors in catch block as well
      if (error?.code === '403' || error?.status === 403 || errorMessage.includes('403') || errorMessage.includes('ruxsat')) {
        toast.error('Sizda bu amalni bajarishga ruxsat yo\'q. Iltimos, administrator bilan bog\'laning.');
      } else {
        toast.error('Xatolik: ' + errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-black">
      <div className="relative z-10 w-full max-w-md px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 p-8 shadow-2xl backdrop-blur-xl"
        >
          <div className="relative flex flex-col items-center text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 shadow-lg shadow-blue-500/20">
              <Zap className="h-8 w-8 text-white" />
            </div>
            
            <h2 className="mb-2 text-3xl font-bold text-white tracking-tight">Xush kelibsiz</h2>
            <p className="mb-8 text-slate-400">Xpro CRM tizimiga kirish</p>

            <form onSubmit={handleLogin} className="w-full space-y-5">
              <div className="space-y-2 text-left">
                <label className="text-xs font-medium uppercase tracking-wider text-slate-500">Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 text-white placeholder-slate-600 focus:border-blue-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div className="space-y-2 text-left">
                <label className="text-xs font-medium uppercase tracking-wider text-slate-500">Parol</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 text-white placeholder-slate-600 focus:border-blue-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.5)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]"
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
                    Kirish 
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </button>
            </form>

            <div className="mt-6 flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="h-3 w-3" />
              <span>Himoyalangan tizim</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
