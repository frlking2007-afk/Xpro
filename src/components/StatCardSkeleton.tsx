import React from 'react';
import { motion } from 'framer-motion';

interface StatCardSkeletonProps {
  color?: string;
}

export function StatCardSkeleton({ color = 'bg-blue-500' }: StatCardSkeletonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm"
    >
      <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full ${color} opacity-10 blur-2xl`} />
      
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Title skeleton */}
          <div className="h-4 w-24 bg-white/10 rounded animate-pulse mb-3" />
          
          {/* Value skeleton */}
          <div className="h-8 w-32 bg-white/10 rounded animate-pulse mb-4" />
        </div>
        
        {/* Icon skeleton */}
        <div className={`h-12 w-12 rounded-xl bg-white/5 ${color} bg-opacity-20 animate-pulse`} />
      </div>
      
      {/* Change skeleton */}
      <div className="flex items-center gap-2 mt-4">
        <div className="h-4 w-16 bg-white/10 rounded animate-pulse" />
        <div className="h-4 w-24 bg-white/5 rounded animate-pulse" />
      </div>
    </motion.div>
  );
}

export default StatCardSkeleton;
