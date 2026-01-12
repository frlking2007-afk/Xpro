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
      // Find the latest OPEN shift
      const { data, error } = await supabase
        .from('shifts')
        .select('*')
        .eq('status', 'open')
        .order('opened_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
        console.error('Error fetching shift:', error);
      }

      setCurrentShift(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openShift = async (startingBalance: number = 0, shiftName?: string) => {
    try {
      const now = new Date();
      
      // Base insert data without name field
      const insertData: any = {
        status: 'open',
        starting_balance: startingBalance,
        opened_at: now.toISOString(),
      };

      // Try to insert without name first (safer approach)
      // If name column exists, we can add it later via migration
      let { data, error } = await supabase
        .from('shifts')
        .insert([insertData])
        .select()
        .single();

      // If successful but name column might exist, try to update with name
      if (!error && data) {
        const defaultName = shiftName || `Smena ${now.toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric' })} ${now.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}`;
        
        // Try to update with name (silently fail if column doesn't exist)
        try {
          await supabase
            .from('shifts')
            .update({ name: defaultName })
            .eq('id', data.id);
        } catch (updateError) {
          // Ignore update error if name column doesn't exist
          console.log('Name column not available, skipping name update');
        }
      }

      if (error) throw error;
      setCurrentShift(data);
      toast.success('Yangi smena ochildi!');
      return data;
    } catch (error: any) {
      console.error('Error opening shift:', error);
      toast.error('Smena ochishda xatolik: ' + error.message);
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
