import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, X } from 'lucide-react';

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (oldName: string, newName: string) => void;
  currentName: string;
}

export default function EditCategoryModal({
  isOpen,
  onClose,
  onSave,
  currentName
}: EditCategoryModalProps) {
  const [categoryName, setCategoryName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setCategoryName(currentName);
      setError('');
    }
  }, [isOpen, currentName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      setError('Bo\'lim nomini kiriting');
      return;
    }
    if (categoryName.trim() === currentName) {
      onClose();
      return;
    }
    onSave(currentName, categoryName.trim());
    setCategoryName('');
    setError('');
  };

  const handleClose = () => {
    setCategoryName('');
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
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                      <Edit className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        Bo'lim nomini tahrirlash
                      </h3>
                      <p className="text-xs text-slate-400">
                        Bo'lim nomini o'zgartiring
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
                      Bo'lim nomi
                    </label>
                    <input
                      type="text"
                      value={categoryName}
                      onChange={(e) => {
                        setCategoryName(e.target.value);
                        setError('');
                      }}
                      placeholder="Bo'lim nomini kiriting"
                      className={`block w-full rounded-xl border ${
                        error ? 'border-red-500' : 'border-white/10'
                      } bg-white/5 py-3 px-4 text-sm text-white placeholder-slate-600 focus:border-blue-500 focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all`}
                      autoFocus
                    />
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
                      className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-3 text-sm font-bold text-white transition-all hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-blue-500/20"
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
