import React from 'react';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  className?: string;
}

/**
 * Skeleton loading component for data tables
 * Displayed while the actual table data is being lazy loaded
 */
export function TableSkeleton({
  rows = 5,
  columns = 4,
  showHeader = true,
  className = ''
}: TableSkeletonProps) {
  return (
    <div className={`overflow-hidden rounded-lg border border-gray-200 ${className}`}>
      <div className="bg-white">
        {/* Table Header */}
        {showHeader && (
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
            <div className="h-6 w-1/4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        )}

        {/* Table Body */}
        <div className="divide-y divide-gray-200">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div 
              key={`row-${rowIndex}`}
              className="px-4 py-4 sm:px-6 animate-pulse"
            >
              <div className="flex flex-wrap items-center gap-4">
                {Array.from({ length: columns }).map((_, colIndex) => {
                  // Vary the widths to make it look more realistic
                  const widths = ['w-24', 'w-32', 'w-40', 'w-20', 'w-16'];
                  const width = widths[colIndex % widths.length];
                  
                  return (
                    <div 
                      key={`cell-${rowIndex}-${colIndex}`}
                      className={`h-4 ${width} bg-gray-200 rounded`}
                    ></div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Table Footer/Pagination */}
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-between items-center">
        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
        <div className="flex space-x-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={`page-${i}`} className="h-8 w-8 bg-gray-200 rounded-md animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TableSkeleton;