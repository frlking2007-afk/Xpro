import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronDown, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subMonths, addMonths, startOfDay, isSameDay, isWithinInterval, isSameMonth, getDaysInMonth, getDay } from 'date-fns';
import { uz } from 'date-fns/locale';

interface DateFilterProps {
  onFilterChange: (range: { start: Date; end: Date; label: string }) => void;
}

const CustomCalendar = ({ selectedDate, onSelect, title }: { selectedDate: Date | null, onSelect: (date: Date) => void, title: string }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getDay(startOfMonth(currentMonth)); // 0 = Sunday
  const startingDay = firstDay === 0 ? 6 : firstDay - 1; // Adjust for Monday start

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: startingDay }, (_, i) => i);

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const weekDays = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'];

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-white">{title}</span>
        <div className="flex items-center gap-1">
          <button onClick={handlePrevMonth} className="rounded-lg p-1 hover:bg-white/10 text-slate-400 hover:text-white">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-xs font-medium text-white min-w-[80px] text-center">
            {format(currentMonth, 'MMMM yyyy', { locale: uz })}
          </span>
          <button onClick={handleNextMonth} className="rounded-lg p-1 hover:bg-white/10 text-slate-400 hover:text-white">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 mb-1 text-center">
        {weekDays.map(d => (
          <div key={d} className="text-[10px] font-medium text-slate-500 py-1">{d}</div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {blanks.map(b => <div key={`blank-${b}`} />)}
        {days.map(d => {
          const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d);
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          
          return (
            <button
              key={d}
              onClick={() => onSelect(date)}
              className={`h-7 w-full rounded-md text-xs font-medium transition-all ${
                isSelected 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default function DateFilter({ onFilterChange }: DateFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('Bu oy');
  const [showCustomRange, setShowCustomRange] = useState(false);
  
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const presets = [
    { label: 'Bugun', getValue: () => ({ start: new Date(), end: new Date() }) },
    { label: 'Kecha', getValue: () => ({ start: subDays(new Date(), 1), end: subDays(new Date(), 1) }) },
    { label: 'Bu hafta', getValue: () => ({ start: startOfWeek(new Date(), { weekStartsOn: 1 }), end: new Date() }) },
    { label: 'O\'tgan hafta', getValue: () => ({ start: startOfWeek(subDays(new Date(), 7), { weekStartsOn: 1 }), end: endOfWeek(subDays(new Date(), 7), { weekStartsOn: 1 }) }) },
    { label: 'Bu oy', getValue: () => ({ start: startOfMonth(new Date()), end: new Date() }) },
    { label: 'O\'tgan oy', getValue: () => ({ start: startOfMonth(subMonths(new Date(), 1)), end: endOfMonth(subMonths(new Date(), 1)) }) },
  ];

  const handleSelect = (preset: typeof presets[0]) => {
    const range = preset.getValue();
    setSelectedLabel(preset.label);
    onFilterChange({ ...range, label: preset.label });
    setIsOpen(false);
    setShowCustomRange(false);
  };

  const handleCustomApply = () => {
    if (startDate && endDate) {
      // Ensure start is before end
      const start = startDate < endDate ? startDate : endDate;
      const end = startDate < endDate ? endDate : startDate;
      
      const label = `${format(start, 'dd.MM')} - ${format(end, 'dd.MM')}`;
      setSelectedLabel(label);
      onFilterChange({ start, end, label });
      setIsOpen(false);
      setShowCustomRange(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
      >
        <CalendarIcon className="h-4 w-4 text-blue-400" />
        <span>{selectedLabel}</span>
        <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-30" 
              onClick={() => { setIsOpen(false); setShowCustomRange(false); }}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className={`absolute right-0 top-full z-40 mt-2 origin-top-right rounded-2xl border border-white/10 bg-slate-900 p-2 shadow-xl backdrop-blur-xl ring-1 ring-black/5 ${showCustomRange ? 'w-80' : 'w-64'}`}
            >
              {!showCustomRange ? (
                <div className="space-y-1">
                  {presets.map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => handleSelect(preset)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors ${
                        selectedLabel === preset.label 
                          ? 'bg-blue-600/20 text-blue-400' 
                          : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {preset.label}
                      {selectedLabel === preset.label && <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />}
                    </button>
                  ))}
                  <div className="my-2 h-px bg-white/10" />
                  <button
                    onClick={() => setShowCustomRange(true)}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white"
                  >
                    Boshqa sana...
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </button>
                </div>
              ) : (
                <div className="p-2">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setShowCustomRange(false)}
                        className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <span className="text-sm font-medium text-white">Oraliqni tanlash</span>
                    </div>
                    <button 
                      onClick={() => setIsOpen(false)}
                      className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                    <CustomCalendar 
                      title="Boshlanish" 
                      selectedDate={startDate} 
                      onSelect={setStartDate} 
                    />
                    <CustomCalendar 
                      title="Tugash" 
                      selectedDate={endDate} 
                      onSelect={setEndDate} 
                    />
                    
                    <button
                      onClick={handleCustomApply}
                      disabled={!startDate || !endDate}
                      className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Qo'llash
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
