// Exportar componentes de lazy loading

// Componentes de imágenes y galerías optimizadas
export { default as LazyImage } from './LazyImage';
export { OptimizedGallery } from './OptimizedGallery';
export { OptimizedCarousel, type MediaItem } from './OptimizedCarousel';

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
    low: 'w_400,q_85,f_auto,fl_progressive',
    medium: 'w_800,q_90,f_auto,fl_progressive,e_sharpen:80',
    high: 'w_1200,q_92,f_auto,fl_progressive,e_sharpen:60',
    ultraHigh: 'w_1920,q_95,f_auto,fl_progressive,e_sharpen:40',
    auto: 'w_auto,q_auto:best,f_auto'
  }
};