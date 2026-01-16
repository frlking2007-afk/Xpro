export type ID = string;

export interface Shift {
  id: ID;
  user_id?: string;
  starting_balance: number;
  closing_balance?: number | null;
  opened_at: string;
  closed_at?: string | null;
  name?: string | null;
}

export type TransactionType = 'kirim' | 'chiqim' | 'uzcard' | 'click' | 'humo' | 'xarajat';

export interface Transaction {
  id: ID;
  shift_id?: ID | null;
  amount: number;
  type: TransactionType;
  category?: string | null;
  description?: string | null;
  created_at: string;
}

export interface Customer {
  id: ID;
  name: string;
  phone?: string | null;
  created_at?: string;
}