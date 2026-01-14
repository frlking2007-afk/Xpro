import { useQuery } from '@tanstack/react-query';
// Tree-shake date-fns imports - only import what we need
import { startOfDay } from 'date-fns/startOfDay';
import { endOfDay } from 'date-fns/endOfDay';
import { subDays } from 'date-fns/subDays';
import { startOfYear } from 'date-fns/startOfYear';
import { endOfYear } from 'date-fns/endOfYear';
import { isSameMonth } from 'date-fns/isSameMonth';
import { eachMonthOfInterval } from 'date-fns/eachMonthOfInterval';
import { format } from 'date-fns/format';
import { uz } from 'date-fns/locale/uz';
import { supabase, handleSupabaseError } from '../lib/supabase';
import { DashboardData, DashboardStats, ChartDataPoint, Transaction } from '../types';

interface UseDashboardDataParams {
  startDate: Date;
  endDate: Date;
}

// Calculate metrics from transactions
const calculateMetrics = (transactions: Transaction[]) => {
  const kirim = transactions
    .filter(t => t.type !== 'xarajat')
    .reduce((sum, t) => sum + t.amount, 0);
  const chiqim = transactions
    .filter(t => t.type === 'xarajat')
    .reduce((sum, t) => sum + t.amount, 0);
  return {
    jamiFoyda: kirim,
    jamiZarar: chiqim,
    sofFoyda: kirim - chiqim,
  };
};

// Calculate percentage change
const calculateChange = (current: number, prev: number): string => {
  if (prev === 0) return current > 0 ? '+100%' : '0%';
  const percent = ((current - prev) / prev) * 100;
  return `${percent > 0 ? '+' : ''}${percent.toFixed(1)}%`;
};

// Fetch transactions for a date range
const fetchTransactions = async (start: Date, end: Date): Promise<Transaction[]> => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .gte('date', start.toISOString())
    .lte('date', end.toISOString())
    .order('date', { ascending: false });

  if (error) {
    // Handle 403 Forbidden error specifically
    if (error.code === 'PGRST301' || error.code === '42501' || error.status === 403 || error.code === '403') {
      const errorMessage = handleSupabaseError(error);
      console.error('403 Forbidden error:', error);
      // Sign out user if session is invalid
      await supabase.auth.signOut();
      throw new Error(errorMessage);
    }
    
    // Handle other errors
    const errorMessage = handleSupabaseError(error);
    throw new Error(errorMessage);
  }

  return data || [];
};

// Main hook for fetching dashboard data
export function useDashboardData({ startDate, endDate }: UseDashboardDataParams) {
  return useQuery<DashboardData>({
    queryKey: ['dashboard', startDate.toISOString(), endDate.toISOString()],
    queryFn: async () => {
      // Fetch current period transactions
      const currentData = await fetchTransactions(startDate, endDate);

      // Calculate previous period for comparison
      const duration = endDate.getTime() - startDate.getTime();
      const prevStart = new Date(startDate.getTime() - duration);
      const prevEnd = new Date(endDate.getTime() - duration);
      const prevData = await fetchTransactions(prevStart, prevEnd);

      // Calculate current and previous metrics
      const currentMetrics = calculateMetrics(currentData);
      const prevMetrics = calculateMetrics(prevData);

      // Calculate yesterday's profit
      const yesterdayStart = startOfDay(subDays(new Date(), 1));
      const yesterdayEnd = endOfDay(subDays(new Date(), 1));
      const dayBeforeYesterdayStart = startOfDay(subDays(new Date(), 2));
      const dayBeforeYesterdayEnd = endOfDay(subDays(new Date(), 2));

      const yesterdayData = await fetchTransactions(yesterdayStart, yesterdayEnd);
      const dayBeforeYesterdayData = await fetchTransactions(
        dayBeforeYesterdayStart,
        dayBeforeYesterdayEnd
      );

      const yesterdayProfit = yesterdayData
        .filter(t => t.type !== 'xarajat')
        .reduce((sum, t) => sum + t.amount, 0);

      const dayBeforeYesterdayProfit = dayBeforeYesterdayData
        .filter(t => t.type !== 'xarajat')
        .reduce((sum, t) => sum + t.amount, 0);

      // Build stats object
      const stats: DashboardStats = {
        jamiFoyda: currentMetrics.jamiFoyda,
        jamiZarar: currentMetrics.jamiZarar,
        sofFoyda: currentMetrics.sofFoyda,
        kechagiFoyda: yesterdayProfit,
        jamiFoydaChange: calculateChange(currentMetrics.jamiFoyda, prevMetrics.jamiFoyda),
        jamiZararChange: calculateChange(currentMetrics.jamiZarar, prevMetrics.jamiZarar),
        sofFoydaChange: calculateChange(currentMetrics.sofFoyda, prevMetrics.sofFoyda),
        kechagiFoydaChange: calculateChange(yesterdayProfit, dayBeforeYesterdayProfit),
      };

      // Prepare chart data (yearly view)
      const startOfCurrentYear = startOfYear(new Date());
      const endOfCurrentYear = endOfYear(new Date());
      const yearData = await fetchTransactions(startOfCurrentYear, endOfCurrentYear);

      const months = eachMonthOfInterval({
        start: startOfCurrentYear,
        end: endOfCurrentYear,
      });

      const chartData: ChartDataPoint[] = months.map(month => {
        const monthTrans = yearData.filter(t =>
          isSameMonth(new Date(t.date), month)
        );
        const monthMetrics = calculateMetrics(monthTrans);

        return {
          name: format(month, 'MMM', { locale: uz }),
          savdo: monthMetrics.jamiFoyda,
          zarar: monthMetrics.jamiZarar,
          daromad: monthMetrics.sofFoyda,
        };
      });

      return {
        stats,
        chartData,
      };
    },
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}
