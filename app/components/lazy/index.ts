// Exportar componentes de lazy loading

// Componentes de imágenes y galerías optimizadas
export { LazyImage } from './LazyImage';
export { OptimizedGallery } from './OptimizedGallery';

// Componentes base de lazy loading
export { LazyWrapper, withLazyLoading } from './LazyWrapper';

// Re-exportar hooks relevantes para hacer más fácil su uso
export { default as useIntersectionObserver } from '../../hooks/useIntersectionObserver';
export { default as useProgressiveImage } from '../../hooks/useProgressiveImage';
export { default as useLazyLoad, LazyContent } from '../../hooks/useLazyLoad';

// Configuración por defecto
export const LAZY_LOADING_CONFIG = {
  defaultThreshold: 0.1,
  defaultRootMargin: '50px 0px',
  defaultPreloadBuffer: 2,
  defaultPlaceholder: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+',
  cloudinaryQualities: {
    low: 'w_400,q_auto:low,f_auto',
    medium: 'w_800,q_auto:good,f_auto',
    high: 'w_1200,q_auto:best,f_auto',
    auto: 'w_auto,q_auto,f_auto'
  }
};