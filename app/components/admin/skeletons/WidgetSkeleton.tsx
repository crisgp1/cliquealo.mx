import React from 'react';

interface WidgetSkeletonProps {
  height?: string;
  className?: string;
}

/**
 * Generic skeleton loading component for any widget or UI element
 * Provides a flexible loading placeholder with customizable height
 */
export function WidgetSkeleton({ 
  height = "h-48", 
  className = "" 
}: WidgetSkeletonProps) {
  return (
    <div className={`${height} ${className} bg-gray-100 rounded-lg animate-pulse`}>
      <div className="p-4">
        <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-300 rounded"></div>
          <div className="h-3 bg-gray-300 rounded w-5/6"></div>
          <div className="h-3 bg-gray-300 rounded w-4/6"></div>
        </div>
      </div>
    </div>
  );
}

export default WidgetSkeleton;