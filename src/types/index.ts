export type Customer = {
  id: string;
  created_at: string;
  full_name: string;
  phone: string;
  status: 'active' | 'inactive';
  last_purchase_date: string | null;
  total_spent: number;
};

export type Transaction = {
  id: string;
  date: string;
  amount: number;
  type: string;
  description: string | null;
  category: string | null;
  payment_type: string | null;
  created_at?: string;
  updated_at?: string;
};

export type DashboardStats = {
  jamiFoyda: number;
  kechagiFoyda: number;
  jamiZarar: number;
  sofFoyda: number;
  jamiFoydaChange: string;
  kechagiFoydaChange: string;
  jamiZararChange: string;
  sofFoydaChange: string;
};

export type ChartDataPoint = {
  name: string;
  savdo: number;
  zarar: number;
  daromad: number;
};

export type DashboardData = {
  stats: DashboardStats;
  chartData: ChartDataPoint[];
};
