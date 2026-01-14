import React from 'react';
import { AlertCircle, RefreshCw, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  is403Error?: boolean;
}

export function ErrorState({ 
  message = 'Ma\'lumotlarni yuklashda xatolik yuz berdi', 
  onRetry,
  is403Error = false
}: ErrorStateProps) {
  const navigate = useNavigate();

  const handleLoginRedirect = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 p-8 backdrop-blur-sm"
    >
      <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
      <h3 className="text-lg font-semibold text-white mb-2">
        {is403Error ? 'Ruxsat yo\'q' : 'Xatolik yuz berdi'}
      </h3>
      <p className="text-sm text-slate-400 text-center mb-6 max-w-md">
        {message}
      </p>
      <div className="flex gap-2">
        {is403Error ? (
          <button
            onClick={handleLoginRedirect}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors border border-blue-500/30"
          >
            <LogIn className="h-4 w-4" />
            <span>Login sahifasiga o'tish</span>
          </button>
        ) : (
          onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors border border-red-500/30"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Qayta urinish</span>
            </button>
          )
        )}
      </div>
    </motion.div>
  );
}

export default ErrorState;
