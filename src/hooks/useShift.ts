import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

export interface Shift {
  id: string;
  opened_at: string;
  closed_at: string | null;
  status: 'open' | 'closed';
  starting_balance: number;
  ending_balance: number | null;
  name?: string | null;
}

export function useShift() {
  const [currentShift, setCurrentShift] = useState<Shift | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrentShift();
  }, []);

  const fetchCurrentShift = async () => {
    try {
      console.log('📡 Fetching current shift...');
      
      // Find the latest OPEN shift
      const { data, error } = await supabase
        .from('shifts')
        .select('*')
        .eq('status', 'open')
        .order('opened_at', { ascending: false })
        .limit(1)
        .maybeSingle(); // Tuzatildi: .single() o'rniga .maybeSingle() ishlatildi

      if (error) {
<<<<<<< HEAD
        if (error.code === 'PGRST116') {
          // PGRST116 means no rows found - this is normal if no shift is open
          console.log('ℹ️ No open shift found');
        } else {
          console.error('❌ Supabase xatolik (fetchCurrentShift):', error);
          console.error('Xatolik kodi:', error.code);
          console.error('Xatolik xabari:', error.message);
          console.error('Xatolik tafsilotlari:', error);
        }
=======
        console.error('❌ Supabase error fetching shift:', error);
>>>>>>> 6cb695ac5069e878b946c53ab3c9c6843477bf6f
        setCurrentShift(null);
        return;
      }

      if (!data) {
        console.log('ℹ️ No open shift found');
        setCurrentShift(null);
      } else {
        console.log('✅ Current shift fetched successfully:', data);
        setCurrentShift(data);
      }
    } catch (error: any) {
      console.error('❌ Supabase xatolik (fetchCurrentShift):', error);
      const errorMessage = error?.message || error?.toString() || 'Noma\'lum xatolik';
      console.error('Xatolik xabari:', errorMessage);
      setCurrentShift(null);
    } finally {
      setLoading(false);
    }
  };

  const openShift = async (startingBalance: number = 0, shiftName?: string) => {
    try {
      console.log('🚀 Opening new shift...', { startingBalance, shiftName });
      
      const { data: { session } } = await supabase.auth.getSession();
      const now = new Date();
      
      const insertData: any = {
        status: 'open',
        starting_balance: Number(startingBalance) || 0,
        opened_at: now.toISOString(),
      };

      if (shiftName) {
        insertData.name = shiftName;
      }

      // Insert shift
      let { data, error } = await supabase
        .from('shifts')
        .insert([insertData])
        .select()
        .maybeSingle(); // Tuzatildi: Bu yerda ham xatolik oldi olindi
      
<<<<<<< HEAD
      console.log('📡 Supabase response received');
      console.log('📡 Response data:', data);
      console.log('📡 Response error:', error);
      
      if (error) {
        console.error('❌ Supabase xatolik (openShift):', error);
        console.error('Xatolik kodi:', error.code);
        console.error('Xatolik xabari:', error.message);
        console.error('Xatolik tafsilotlari:', error.details);
        console.error('Xatolik hint:', (error as any).hint);
        console.error('To\'liq xatolik obyekti:', JSON.stringify(error, null, 2));
        
        // Try to get more info from the error
        if ((error as any).response) {
          console.error('Response:', (error as any).response);
        }
        if ((error as any).status) {
          console.error('Status:', (error as any).status);
        }
        
        // Provide user-friendly error message
        let userMessage = 'Smena ochishda xatolik yuz berdi.';
        if (error.code === '403' || error.status === 403) {
          userMessage = 'Sizda bu amalni bajarishga ruxsat yo\'q. Iltimos, qayta kiring.';
          console.error('403 Forbidden - Ruxsat yo\'q');
        } else if (error.code === '42501') {
          userMessage = 'Ruxsat yo\'q. Iltimos, qayta kiring.';
        } else if (error.code === '23505') {
          userMessage = 'Bu smena allaqachon mavjud.';
        } else if (error.message) {
          userMessage = error.message;
        }
        
        throw new Error(userMessage);
      }

      // Update name if not provided in insert
      if (data && !shiftName) {
        const defaultName = `Smena ${now.toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric' })} ${now.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}`;
        
        const { error: updateError } = await supabase
          .from('shifts')
          .update({ name: defaultName })
          .eq('id', data.id);
        
        if (!updateError) {
          data.name = defaultName;
        }
      }

      setCurrentShift(data);
      toast.success('Yangi smena ochildi!');
      return data;
    } catch (error: any) {
<<<<<<< HEAD
      console.error('❌ Supabase xatolik (openShift):', error);
      const errorMessage = error?.message || error?.toString() || 'Noma\'lum xatolik';
      console.error('Xatolik xabari:', errorMessage);
      
      // Handle 403 errors
      if (error?.code === '403' || error?.status === 403 || errorMessage.includes('403') || errorMessage.includes('ruxsat')) {
        toast.error('Sizda bu amalni bajarishga ruxsat yo\'q. Iltimos, qayta kiring.');
      } else {
        toast.error(errorMessage);
      }
=======
      console.error('❌ Exception in openShift:', error);
      toast.error(error.message || 'Smena ochishda xatolik');
>>>>>>> 6cb695ac5069e878b946c53ab3c9c6843477bf6f
      return null;
    }
  };

  const closeShift = async (endingBalance: number) => {
    if (!currentShift) return;

    try {
      const { error } = await supabase
        .from('shifts')
        .update({
          status: 'closed',
          closed_at: new Date().toISOString(),
          ending_balance: endingBalance
        })
        .eq('id', currentShift.id);

      if (error) {
        console.error('❌ Supabase xatolik (closeShift):', error);
        const errorMessage = error.message || 'Noma\'lum xatolik';
        throw new Error(errorMessage);
      }
      
      setCurrentShift(null);
      toast.success('Smena muvaffaqiyatli yopildi!');
      return true;
    } catch (error: any) {
      console.error('❌ Supabase xatolik (closeShift):', error);
      const errorMessage = error?.message || error?.toString() || 'Noma\'lum xatolik';
      console.error('Xatolik xabari:', errorMessage);
      toast.error('Smena yopishda xatolik: ' + errorMessage);
      return false;
    }
  };

  return {
    currentShift,
    loading,
    openShift,
    closeShift,
    refreshShift: fetchCurrentShift
  };
          }
