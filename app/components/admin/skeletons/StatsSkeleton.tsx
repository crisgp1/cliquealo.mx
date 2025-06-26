import React from 'react';

/**
 * Skeleton loading component for StatsWidget
 * Displayed while the actual stats widget is being lazy loaded
 */
export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <div 
          key={index}
          className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate-pulse"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {/* Title placeholder */}
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
              
              {/* Value placeholder */}
              <div className="h-7 bg-gray-300 rounded w-1/2 mb-4"></div>
              
              {/* Change placeholder */}
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
            
            {/* Icon placeholder */}
            <div className="w-12 h-12 rounded-lg bg-gray-200"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsSkeleton;