import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Tasdiqlash",
  cancelText = "Bekor qilish",
  isDanger = false
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-sm overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl"
            >
              <div className="p-6">
                <div className="mb-4 flex items-center justify-center">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-full ${isDanger ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
                    <AlertTriangle className="h-8 w-8" />
                  </div>
                </div>
                
                <h3 className="mb-2 text-center text-xl font-bold text-white">
                  {title}
                </h3>
                <p className="text-center text-sm text-slate-400">
                  {message}
                </p>
              </div>

              <div className="flex gap-3 bg-slate-950/50 p-4">
                <button
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  {cancelText}
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`flex-1 rounded-xl py-3 text-sm font-bold text-white transition-all shadow-lg ${
                    isDanger 
                      ? 'bg-red-600 hover:bg-red-500 shadow-red-500/20' 
                      : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20'
                  }`}
                >
                  {confirmText}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
