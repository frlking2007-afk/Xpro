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
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // PGRST116 means no rows found - this is normal if no shift is open
          console.log('ℹ️ No open shift found');
        } else {
          console.error('❌ Supabase error fetching shift:', error);
          console.error('Error code:', error.code);
          console.error('Error message:', error.message);
          console.error('Error details:', error);
        }
        setCurrentShift(null);
        return;
      }

      console.log('✅ Current shift fetched successfully:', data);
      setCurrentShift(data);
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
      const now = new Date();
      
      // Base insert data without name field
      const insertData: any = {
        status: 'open',
        starting_balance: startingBalance,
        opened_at: now.toISOString(),
      };

      console.log('📝 Insert data:', insertData);

      // Try to insert without name first (safer approach)
      // If name column exists, we can add it later via migration
      let { data, error } = await supabase
        .from('shifts')
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error('❌ Supabase error inserting shift:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error details:', error);
        console.error('Error hint:', (error as any).hint);
        console.error('Error details object:', JSON.stringify(error, null, 2));
        throw error;
      }

      console.log('✅ Shift inserted successfully:', data);

      // If successful but name column might exist, try to update with name
      if (data) {
        const defaultName = shiftName || `Smena ${now.toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric' })} ${now.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}`;
        
        // Try to update with name (silently fail if column doesn't exist)
        try {
          const { error: updateError } = await supabase
            .from('shifts')
            .update({ name: defaultName })
            .eq('id', data.id);
          
          if (updateError) {
            console.log('ℹ️ Name column not available, skipping name update:', updateError.message);
          } else {
            console.log('✅ Shift name updated successfully');
          }
        } catch (updateError: any) {
          // Ignore update error if name column doesn't exist
          console.log('ℹ️ Name column not available, skipping name update:', updateError.message);
        }
      }

      setCurrentShift(data);
      toast.success('Yangi smena ochildi!');
      return data;
    } catch (error: any) {
      console.error('❌ Exception in openShift:', error);
      const errorMessage = error.message || 'Noma\'lum xatolik';
      console.error('Full error object:', error);
      toast.error('Smena ochishda xatolik: ' + errorMessage);
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
