export interface SupabaseError {
  message: string;
  details?: string | null;
  hint?: string | null;
  code?: string | null;
}

export interface SupabaseResponse<T> {
  data: T | null;
  error: SupabaseError | null;
}