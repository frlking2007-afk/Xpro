export type Customer = {
  id: string;
  created_at: string;
  full_name: string;
  phone: string;
  status: 'active' | 'inactive';
  last_purchase_date: string | null;
  total_spent: number;
};
