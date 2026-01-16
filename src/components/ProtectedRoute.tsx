import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';

export default function ProtectedRoute() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Supabase xatolik (getSession):', error);
          console.error('Xatolik kodi:', error.code);
          console.error('Xatolik xabari:', error.message);
          
          // Handle 403 Forbidden
          if (error.code === '403' || error.status === 403) {
            console.error('403 Forbidden - Ruxsat yo\'q');
            await supabase.auth.signOut();
            setSession(null);
            setLoading(false);
            return;
          }

          // Handle token expiration
          if (error.message?.includes('token') || error.message?.includes('expired') || error.message?.includes('refresh')) {
            console.error('Token muddati tugagan');
            await supabase.auth.signOut();
            setSession(null);
            setLoading(false);
            return;
          }

          setSession(null);
          setLoading(false);
          return;
        }

        // Check if session is expired
        if (session) {
          const expiresAt = session.expires_at;
          if (expiresAt && expiresAt * 1000 < Date.now()) {
            console.log('ℹ️ Session muddati tugagan');
            await supabase.auth.signOut();
            setSession(null);
            setLoading(false);
            return;
          }
        }

        setSession(session);
        setLoading(false);
      } catch (error: any) {
        console.error('❌ Supabase xatolik (checkSession):', error);
        const errorMessage = error?.message || error?.toString() || 'Noma\'lum xatolik';
        console.error('Xatolik xabari:', errorMessage);
        setSession(null);
        setLoading(false);
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      // Handle token refresh
      if (event === 'TOKEN_REFRESHED') {
        console.log('✅ Token yangilandi');
        setSession(session);
        return;
      }

      // Handle token refresh error
      if (event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
        setSession(session);
        return;
      }

      // Check session validity
      if (session) {
        const expiresAt = session.expires_at;
        if (expiresAt && expiresAt * 1000 < Date.now()) {
          console.log('ℹ️ Session muddati tugagan, chiqarilmoqda...');
          await supabase.auth.signOut();
          setSession(null);
          return;
        }
      }

      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Yuklanmoqda...</div>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
