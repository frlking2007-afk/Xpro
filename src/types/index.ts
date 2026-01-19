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
  created_at: string;
  date: string;
  amount: number;
  type: 'kassa' | 'olim_aka' | 'azam_aka' | 'other';
  description: string;
  category?: string;
  user_id?: string;
};

export type ExpenseCategory = {
  id: string;
  name: string;
  color: string;
  icon?: string;
  created_at: string;
  user_id?: string;
};

export type UserProfile = {
  id: string;
  email: string;
  full_name?: string;
  role: 'admin' | 'user';
  created_at: string;
};
