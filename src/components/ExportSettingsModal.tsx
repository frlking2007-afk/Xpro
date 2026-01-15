import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, Printer, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface ExportSettings {
  paperWidth: '58mm' | '80mm';
  fontSize: 'small' | 'medium' | 'large';
}

interface ExportSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: ExportSettings) => void;
  itemName: string;
  itemType: 'category' | 'payment';
  currentSettings?: ExportSettings;
}

const defaultSettings: ExportSettings = {
  paperWidth: '58mm',
  fontSize: 'medium',
};

export default function ExportSettingsModal({
  isOpen,
  onClose,
  onSave,
  itemName,
  itemType,
  currentSettings
}: ExportSettingsModalProps) {
  const [settings, setSettings] = useState<ExportSettings>(currentSettings || defaultSettings);

  useEffect(() => {
    if (isOpen) {
      // Load saved settings from localStorage
      const savedSettings = localStorage.getItem(`exportSettings_${itemType}_${itemName}`);
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          setSettings({ ...defaultSettings, ...parsed });
        } catch (e) {
          setSettings(defaultSettings);
        }
      } else {
        setSettings(currentSettings || defaultSettings);
      }
    }
  }, [isOpen, itemName, itemType, currentSettings]);

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem(`exportSettings_${itemType}_${itemName}`, JSON.stringify(settings));
    onSave(settings);
    toast.success('Eksport sozlamalari saqlandi!');
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
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                      <Settings className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        Eksport sozlamalari
                      </h3>
                      <p className="text-xs text-slate-400">
                        {itemName} uchun sozlamalar
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Paper Width */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-white">
                      Qog'oz kengligi
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setSettings({ ...settings, paperWidth: '58mm' })}
                        className={`rounded-xl border p-4 transition-all ${
                          settings.paperWidth === '58mm'
                            ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                            : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
                        }`}
                      >
                        <Printer className="h-6 w-6 mx-auto mb-2" />
                        <div className="text-sm font-bold">58mm</div>
                        <div className="text-xs mt-1">Kichik chek</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSettings({ ...settings, paperWidth: '80mm' })}
                        className={`rounded-xl border p-4 transition-all ${
                          settings.paperWidth === '80mm'
                            ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                            : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
                        }`}
                      >
                        <Printer className="h-6 w-6 mx-auto mb-2" />
                        <div className="text-sm font-bold">80mm</div>
                        <div className="text-xs mt-1">Katta chek</div>
                      </button>
                    </div>
                  </div>

                  {/* Font Size */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-white">
                      Shrift o'lchami
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['small', 'medium', 'large'] as const).map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSettings({ ...settings, fontSize: size })}
                          className={`rounded-xl border p-3 transition-all ${
                            settings.fontSize === size
                              ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                              : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20'
                          }`}
                        >
                          <div className={`font-bold ${
                            size === 'small' ? 'text-xs' : size === 'medium' ? 'text-sm' : 'text-base'
                          }`}>
                            {size === 'small' ? 'Kichik' : size === 'medium' ? 'O\'rta' : 'Katta'}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                    >
                      Bekor qilish
                    </button>
                    <button
                      type="button"
                      onClick={handleSave}
                      className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 py-3 text-sm font-bold text-white transition-all hover:from-blue-500 hover:to-cyan-500 shadow-lg shadow-blue-500/20"
                    >
                      Saqlash
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
