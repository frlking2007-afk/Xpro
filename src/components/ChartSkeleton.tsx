import React from 'react';
import { motion } from 'framer-motion';

export function ChartSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm"
    >
      {/* Header skeleton */}
      <div className="mb-6 flex items-center justify-between">
        <div className="h-6 w-32 bg-white/10 rounded animate-pulse" />
        <div className="h-8 w-24 bg-white/10 rounded animate-pulse" />
      </div>

      {/* Chart area skeleton */}
      <div className="h-80 w-full relative">
        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-px w-full bg-white/5"
            />
          ))}
        </div>

        {/* Bars/Area skeleton */}
        <div className="absolute inset-0 flex items-end justify-between px-4 pb-4">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="w-6 bg-white/10 rounded-t animate-pulse"
              style={{
                height: `${Math.random() * 60 + 20}%`,
                animationDelay: `${i * 0.05}s`,
              }}
            />
          ))}
        </div>

        {/* X-axis labels skeleton */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 pb-2">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="h-3 w-8 bg-white/5 rounded animate-pulse"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default ChartSkeleton;
