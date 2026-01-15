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
      
      // Get current user session
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('❌ Error getting user:', userError);
        throw new Error('Foydalanuvchi ma\'lumotlari topilmadi. Iltimos, qayta kiring.');
      }
      
      const now = new Date();
      
      // Base insert data - only include fields that exist in schema
      const insertData: any = {
        status: 'open',
        starting_balance: startingBalance,
        opened_at: now.toISOString(),
      };

      // Add name if provided
      if (shiftName) {
        insertData.name = shiftName;
      }

      console.log('📝 Insert data:', JSON.stringify(insertData, null, 2));
      console.log('📝 Insert data types:', {
        status: typeof insertData.status,
        starting_balance: typeof insertData.starting_balance,
        opened_at: typeof insertData.opened_at
      });

      // Insert shift
      let { data, error } = await supabase
        .from('shifts')
        .insert([insertData])
        .select()
        .single();
      
      console.log('📡 Supabase response:', { data, error });

      if (error) {
        console.error('❌ Supabase error inserting shift:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error details:', error);
        console.error('Error hint:', (error as any).hint);
        console.error('Full error object:', JSON.stringify(error, null, 2));
        
        // Provide user-friendly error message
        let userMessage = 'Smena ochishda xatolik yuz berdi.';
        if (error.code === '42501') {
          userMessage = 'Ruxsat yo\'q. Iltimos, qayta kiring.';
        } else if (error.code === '23505') {
          userMessage = 'Bu smena allaqachon mavjud.';
        } else if (error.message) {
          userMessage = error.message;
        }
        
        throw new Error(userMessage);
      }

      console.log('✅ Shift inserted successfully:', data);

      // Update name if not provided in insert
      if (data && !shiftName) {
        const defaultName = `Smena ${now.toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric' })} ${now.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}`;
        
        try {
          const { error: updateError } = await supabase
            .from('shifts')
            .update({ name: defaultName })
            .eq('id', data.id);
          
          if (updateError) {
            console.log('ℹ️ Could not update shift name:', updateError.message);
            // Not critical, continue anyway
          } else {
            console.log('✅ Shift name updated successfully');
            // Update local data with name
            data.name = defaultName;
          }
        } catch (updateError: any) {
          console.log('ℹ️ Could not update shift name:', updateError.message);
          // Not critical, continue anyway
        }
      }

      setCurrentShift(data);
      toast.success('Yangi smena ochildi!');
      return data;
    } catch (error: any) {
      console.error('❌ Exception in openShift:', error);
      const errorMessage = error.message || 'Noma\'lum xatolik';
      console.error('Full error object:', error);
      
      // Show user-friendly error
      toast.error(errorMessage);
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
