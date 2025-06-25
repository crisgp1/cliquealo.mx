// This file provides the types and implementation for backward compatibility
import React, { ReactNode } from 'react';
import useIntersectionObserver from './useIntersectionObserver';

// Type definitions
interface UseLazyLoadOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  skip?: boolean;
  onVisible?: () => void;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  initialState?: {
    isVisible?: boolean;
    isLoaded?: boolean;
    isError?: boolean;
  };
}

interface UseLazyLoadResult {
  isVisible: boolean;
  isLoaded: boolean;
  isError: boolean;
  error: Error | null;
  containerRef: React.RefObject<HTMLDivElement>;
  loadContent: () => Promise<void>;
}

// Simple implementation that delegates to the actual hook
function useLazyLoad(
  contentLoader: () => Promise<any> | any,
  options: UseLazyLoadOptions = {}
): UseLazyLoadResult {
  // Forward to the implementation in the .tsx file
  return require('./useLazyLoad.tsx').default(contentLoader, options);
}

// Re-export the LazyContent component
export const LazyContent: React.FC<{
  children: ReactNode | (() => ReactNode);
  fallback?: ReactNode;
  errorFallback?: ReactNode | ((error: Error) => ReactNode);
  options?: UseLazyLoadOptions;
  contentLoader?: () => Promise<any> | any;
}> = require('./useLazyLoad.tsx').LazyContent;

export default useLazyLoad;