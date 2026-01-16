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
        console.error('❌ Supabase error fetching shift:', error);
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
      console.error('❌ Exception in fetchCurrentShift:', error);
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
      
      if (error) {
        console.error('❌ Supabase error inserting shift:', error);
        throw new Error(error.message);
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
      console.error('❌ Exception in openShift:', error);
      toast.error(error.message || 'Smena ochishda xatolik');
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

      if (error) throw error;
      
      setCurrentShift(null);
      toast.success('Smena muvaffaqiyatli yopildi!');
      return true;
    } catch (error: any) {
      toast.error('Smena yopishda xatolik: ' + error.message);
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
