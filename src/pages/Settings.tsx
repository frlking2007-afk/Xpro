import React, { useState, useEffect } from 'react';
import { User, Moon, Sun, Palette, DollarSign, Save, Upload, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

type Theme = 'light' | 'dark' | 'blue';
type Currency = 'UZS' | 'USD' | 'EUR';

export default function Settings() {
  const [fullName, setFullName] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [theme, setTheme] = useState<Theme>('blue');
  const [currency, setCurrency] = useState<Currency>('UZS');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Load user profile (try to get from user_profiles, fallback to user metadata)
      let profile = null;
      try {
        const { data } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        profile = data;
      } catch (error) {
        // Table might not exist yet, use user metadata as fallback
        console.log('user_profiles table not found, using user metadata');
      }

      if (profile) {
        setFullName(profile.full_name || '');
        setAvatar(profile.avatar_url || null);
      } else if (user.user_metadata?.full_name) {
        setFullName(user.user_metadata.full_name);
      }

      // Load theme from localStorage
      const savedTheme = localStorage.getItem('theme') as Theme;
      if (savedTheme && ['light', 'dark', 'blue'].includes(savedTheme)) {
        setTheme(savedTheme);
        applyTheme(savedTheme);
      }

      // Load currency from localStorage
      const savedCurrency = localStorage.getItem('currency') as Currency;
      if (savedCurrency && ['UZS', 'USD', 'EUR'].includes(savedCurrency)) {
        setCurrency(savedCurrency);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const applyTheme = (selectedTheme: Theme) => {
    document.documentElement.classList.remove('light-theme', 'dark-theme', 'blue-theme');
    document.documentElement.classList.add(`${selectedTheme}-theme`);
    localStorage.setItem('theme', selectedTheme);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Rasm hajmi 5MB dan katta bo\'lmasligi kerak');
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Foydalanuvchi topilmadi');
        return;
      }

      let avatarUrl = avatar;

      // Upload avatar if new file selected
      if (avatarFile) {
        try {
          const fileExt = avatarFile.name.split('.').pop();
          const fileName = `${user.id}-${Date.now()}.${fileExt}`;
          const filePath = `avatars/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, avatarFile, { upsert: true });

          if (uploadError) {
            // If storage bucket doesn't exist, use data URL as fallback
            console.warn('Storage upload failed, using data URL:', uploadError);
            avatarUrl = avatar;
          } else {
            const { data: { publicUrl } } = supabase.storage
              .from('avatars')
              .getPublicUrl(filePath);
            avatarUrl = publicUrl;
          }
        } catch (storageError) {
          // Use data URL as fallback if storage is not available
          console.warn('Storage not available, using data URL');
          avatarUrl = avatar;
        }
      }

      // Save or update profile (try user_profiles table, fallback to user metadata)
      try {
        const { error: profileError } = await supabase
          .from('user_profiles')
          .upsert({
            user_id: user.id,
            full_name: fullName,
            avatar_url: avatarUrl,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          });

        if (profileError) {
          // If table doesn't exist, save to user metadata as fallback
          console.warn('user_profiles table error, using metadata:', profileError);
          await supabase.auth.updateUser({
            data: { full_name: fullName, avatar_url: avatarUrl }
          });
        }
      } catch (error) {
        // Fallback to user metadata
        await supabase.auth.updateUser({
          data: { full_name: fullName, avatar_url: avatarUrl }
        });
      }

      // Save theme and currency
      applyTheme(theme);
      localStorage.setItem('currency', currency);
      
      // Save full name to localStorage for sidebar
      localStorage.setItem('user_full_name', fullName);
      if (avatarUrl) {
        localStorage.setItem('user_avatar_url', avatarUrl);
      }
      
      // Dispatch event to update sidebar
      window.dispatchEvent(new Event('profileUpdated'));

      toast.success('Sozlamalar saqlandi!');
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast.error('Xatolik: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const removeAvatar = () => {
    setAvatar(null);
    setAvatarFile(null);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-white tracking-tight">Sozlamalar</h2>

      {/* Profile Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20">
            <User className="h-5 w-5 text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Foydalanuvchi Profili</h3>
        </div>

        <div className="space-y-6">
          {/* Avatar Upload */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-400">Avatar (Rasm)</label>
            <div className="flex items-center gap-4">
              <div className="relative">
                {avatar ? (
                  <div className="relative">
                    <img
                      src={avatar}
                      alt="Avatar"
                      className="h-20 w-20 rounded-full object-cover border-2 border-white/10"
                    />
                    <button
                      onClick={removeAvatar}
                      className="absolute -top-1 -right-1 rounded-full bg-red-500 p-1 text-white hover:bg-red-600 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/5 border-2 border-dashed border-white/10">
                    <User className="h-8 w-8 text-slate-500" />
                  </div>
                )}
              </div>
              <div>
                <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors cursor-pointer">
                  <Upload className="h-4 w-4" />
                  Rasm yuklash
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
                <p className="mt-1 text-xs text-slate-500">JPG, PNG yoki GIF (maks. 5MB)</p>
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-400">Ism va Familiya</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ism va Familiya kiriting"
              className="block w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white placeholder-slate-600 focus:border-blue-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>
      </motion.div>

      {/* Theme Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-3xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20">
            <Palette className="h-5 w-5 text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Mavzu (Theme)</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(['light', 'dark', 'blue'] as Theme[]).map((themeOption) => (
            <button
              key={themeOption}
              onClick={() => {
                setTheme(themeOption);
                applyTheme(themeOption);
              }}
              className={`relative flex flex-col items-center gap-3 rounded-xl border-2 p-4 transition-all ${
                theme === themeOption
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
            >
              {themeOption === 'light' && <Sun className="h-6 w-6 text-yellow-400" />}
              {themeOption === 'dark' && <Moon className="h-6 w-6 text-slate-400" />}
              {themeOption === 'blue' && <Palette className="h-6 w-6 text-blue-400" />}
              <span className="text-sm font-medium text-white capitalize">{themeOption} Mode</span>
              {theme === themeOption && (
                <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-blue-500" />
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Currency Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-3xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20">
            <DollarSign className="h-5 w-5 text-emerald-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">Valyuta Turi</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(['UZS', 'USD', 'EUR'] as Currency[]).map((currencyOption) => (
            <button
              key={currencyOption}
              onClick={() => setCurrency(currencyOption)}
              className={`relative flex items-center justify-center gap-2 rounded-xl border-2 p-4 transition-all ${
                currency === currencyOption
                  ? 'border-emerald-500 bg-emerald-500/10'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
            >
              <DollarSign className="h-5 w-5 text-emerald-400" />
              <span className="text-sm font-medium text-white">{currencyOption}</span>
              {currency === currencyOption && (
                <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-500" />
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-bold text-white hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Saqlanmoqda...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Saqlash
            </>
          )}
        </button>
      </div>
    </div>
  );
}
