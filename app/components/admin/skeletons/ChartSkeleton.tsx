import React from 'react';

interface ChartSkeletonProps {
  height?: string;
  width?: string;
  className?: string;
  showLegend?: boolean;
}

/**
 * Skeleton loading component for charts and analytics visualizations
 * Displayed while the actual chart is being lazy loaded
 */
export function ChartSkeleton({
  height = 'h-64',
  width = 'w-full',
  className = '',
  showLegend = true
}: ChartSkeletonProps) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm p-4 ${className}`}>
      {/* Chart Title */}
      <div className="mb-4">
        <div className="h-5 bg-gray-200 rounded w-1/3 animate-pulse"></div>
      </div>
      
      {/* Chart Visualization Area */}
      <div className={`${height} ${width} bg-gray-100 rounded-md mb-4 relative overflow-hidden`}>
        {/* Simulated Y-axis */}
        <div className="absolute left-0 top-0 bottom-0 w-10 bg-gray-50 border-r border-gray-200"></div>
        
        {/* Simulated X-axis */}
        <div className="absolute left-0 right-0 bottom-0 h-8 bg-gray-50 border-t border-gray-200"></div>
        
        {/* Simulated Chart Elements */}
        <div className="absolute left-14 right-4 top-4 bottom-12 flex items-end">
          {/* Bars or Lines */}
          {Array.from({ length: 7 }).map((_, index) => {
            // Random heights for the skeleton bars
            const randomHeight = 30 + Math.floor(Math.random() * 70);
            return (
              <div 
                key={`bar-${index}`}
                className="flex-1 mx-1 bg-gray-200 rounded-t animate-pulse"
                style={{ height: `${randomHeight}%` }}
              ></div>
            );
          })}
        </div>
        
        {/* Loading Overlay */}
        <div className="absolute inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
        </div>
      </div>
      
      {/* Chart Legend */}
      {showLegend && (
        <div className="flex flex-wrap gap-4 justify-center">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={`legend-${index}`} className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-gray-200 mr-2"></div>
              <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ChartSkeleton;