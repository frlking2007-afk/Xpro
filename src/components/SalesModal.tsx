import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, X } from 'lucide-react';
import { getCurrencySymbol } from '../utils/currency';
import { toast } from 'sonner';

interface SalesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (amount: number) => void;
  currentSales: number;
}

export default function SalesModal({
  isOpen,
  onClose,
  onSave,
  currentSales
}: SalesModalProps) {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAmount(currentSales > 0 ? currentSales.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : '');
      setError('');
    }
  }, [isOpen, currentSales]);

  // Format number with spaces (50000 -> 50 000)
  const formatNumber = (value: string): string => {
    const numericValue = value.replace(/\s/g, '').replace(/[^0-9]/g, '');
    if (!numericValue) return '';
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatNumber(value);
    setAmount(formatted);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) {
      setError('Summani kiriting');
      return;
    }

    const numericAmount = parseFloat(amount.replace(/\s/g, ''));
    if (isNaN(numericAmount) || numericAmount < 0) {
      setError('Noto\'g\'ri summa');
      return;
    }

    onSave(numericAmount);
    onClose();
  };

  const handleClose = () => {
    setAmount('');
    setError('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl"
            >
              <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                      <DollarSign className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        Savdo summasini kiriting
                      </h3>
                      <p className="text-xs text-slate-400">
                        Joriy savdo summasini yangilang
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Summa
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={amount}
                        onChange={handleAmountChange}
                        placeholder="0"
                        className={`block w-full rounded-xl border ${
                          error ? 'border-red-500' : 'border-white/10'
                        } bg-white/5 py-3 pl-4 pr-12 text-lg font-bold text-white placeholder-slate-600 focus:border-green-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-green-500 transition-all`}
                        autoFocus
                      />
                      <span className="absolute right-4 top-3.5 text-sm font-medium text-slate-500">{getCurrencySymbol()}</span>
                    </div>
                    {error && (
                      <p className="mt-1.5 text-xs text-red-400">{error}</p>
                    )}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                    >
                      Bekor qilish
                    </button>
                    <button
                      type="submit"
                      className="flex-1 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 py-3 text-sm font-bold text-white transition-all hover:from-green-500 hover:to-emerald-500 shadow-lg shadow-green-500/20"
                    >
                      Saqlash
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
