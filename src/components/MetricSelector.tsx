import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MetricOption {
  value: string;
  label: string;
  color: string;
}

interface MetricSelectorProps {
  selected: string;
  onSelect: (value: string) => void;
  options: MetricOption[];
}

export default function MetricSelector({ selected, onSelect, options }: MetricSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(opt => opt.value === selected);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-w-[140px] justify-between"
      >
        <span className="flex items-center gap-2">
          {selectedOption?.label}
        </span>
        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-30" 
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 top-full z-40 mt-2 w-48 origin-top-right rounded-2xl border border-white/10 bg-slate-900 p-1.5 shadow-xl backdrop-blur-xl ring-1 ring-black/5"
            >
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onSelect(option.value);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors ${
                    selected === option.value
                      ? 'bg-white/10 text-white'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: option.color }} />
                    {option.label}
                  </div>
                  {selected === option.value && <Check className="h-3.5 w-3.5 text-white" />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
