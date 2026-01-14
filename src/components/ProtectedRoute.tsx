import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase, handleSupabaseError } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';

export default function ProtectedRoute() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [is403Error, setIs403Error] = useState(false);

  useEffect(() => {
    // Check if Supabase is properly configured
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
      setError('Supabase sozlamalari topilmadi. Environment variable\'larni tekshiring.');
      setLoading(false);
      return;
    }

    supabase.auth.getSession()
      .then(({ data: { session }, error }) => {
        if (error) {
          console.error('Session error:', error);
          
          // Check for 403 or 401 errors
          const isAuthError = error.status === 403 || error.status === 401 || 
                             error.code === 'PGRST301' || error.code === '42501' || 
                             error.code === '403' || error.code === '401';
          
          if (isAuthError) {
            setIs403Error(true);
            setError(handleSupabaseError(error));
            // Clear invalid session
            supabase.auth.signOut();
          } else {
            setError(handleSupabaseError(error));
          }
        }
        setSession(session);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to get session:', err);
        const errorMessage = handleSupabaseError(err);
        setError(errorMessage);
        
        // Check if it's a 403 error
        if (err.status === 403 || err.code === '403' || err.code === 'PGRST301') {
          setIs403Error(true);
          supabase.auth.signOut();
        }
        
        setLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      // If session is null and we had a 403 error, redirect to login
      if (!session && is403Error) {
        setError('Login muddati tugagan. Iltimos, qayta kiring.');
      }
    });

    return () => subscription.unsubscribe();
  }, [is403Error]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-white mx-auto mb-4"></div>
          <p className="text-gray-400">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
        <div className="max-w-md w-full bg-gray-800/50 backdrop-blur-sm border border-red-500/50 rounded-lg p-6 shadow-xl">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
          
          <h2 className="text-xl font-bold text-red-400 mb-2 text-center">
            {is403Error ? 'Ruxsat yo\'q' : 'Xatolik'}
          </h2>
          <p className="text-gray-300 mb-6 text-center">{error}</p>
          
          <div className="space-y-2">
            {is403Error ? (
              <button
                onClick={() => {
                  supabase.auth.signOut().then(() => {
                    window.location.href = '/login';
                  });
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Login sahifasiga o'tish
              </button>
            ) : (
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Sahifani yangilash
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
