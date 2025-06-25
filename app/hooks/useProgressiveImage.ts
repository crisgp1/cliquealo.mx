import { useState, useEffect, useRef, useCallback } from 'react';
import useIntersectionObserver from './useIntersectionObserver';

// Tipos de calidad de imagen
type ImageQuality = 'low' | 'medium' | 'high' | 'auto';

// Interfaz para las opciones del hook
interface ProgressiveImageOptions {
  quality?: ImageQuality;
  threshold?: number;
  rootMargin?: string;
  placeholder?: string;
  fallback?: string;
  crossOrigin?: 'anonymous' | 'use-credentials' | '';
  eager?: boolean; // Cargar inmediatamente sin lazy loading
  shouldPreload?: boolean; // Precargar en alta calidad después de baja calidad
  onLoad?: () => void;
  onError?: (error: string) => void;
}

// Estados posibles durante la carga de la imagen
type LoadingState = 'initial' | 'loading-low' | 'loading-high' | 'loaded' | 'error';

// Estados de retorno del hook
interface ProgressiveImageState {
  currentSrc: string;
  isLoaded: boolean;
  isError: boolean;
  loadingState: LoadingState;
  progress: number;
}

// Configuración por defecto
const DEFAULT_PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+';
const QUALITIES = {
  low: 'w_400,q_auto:low,f_auto',
  medium: 'w_800,q_auto:good,f_auto',
  high: 'w_1200,q_auto:best,f_auto',
  auto: 'w_auto,q_auto,f_auto'
};

/**
 * Hook para cargar imágenes progresivamente, primero una versión de baja calidad
 * y luego una de alta calidad cuando la imagen es visible en el viewport
 */
function useProgressiveImage(
  src: string, 
  options: ProgressiveImageOptions = {}
): ProgressiveImageState {
  // Extraer opciones con valores por defecto
  const {
    quality = 'medium',
    threshold = 0.1,
    rootMargin = '50px',
    placeholder = DEFAULT_PLACEHOLDER,
    fallback = placeholder,
    crossOrigin,
    eager = false,
    shouldPreload = true,
    onLoad,
    onError
  } = options;

  // Estado para la imagen
  const [imageState, setImageState] = useState<ProgressiveImageState>({
    currentSrc: placeholder,
    isLoaded: false,
    isError: false,
    loadingState: 'initial',
    progress: 0
  });

  // Referencias para controlar las cargas y evitar memory leaks
  const imgRefLow = useRef<HTMLImageElement | null>(null);
  const imgRefHigh = useRef<HTMLImageElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer para detectar cuando la imagen está en el viewport
  const { isIntersecting } = useIntersectionObserver(
    containerRef,
    {
      threshold,
      rootMargin,
      triggerOnce: true,
      skip: eager // Omitir la observación si es eager
    }
  );

  // Optimizar la URL de la imagen según la calidad
  const getOptimizedUrl = useCallback((originalSrc: string, targetQuality: ImageQuality): string => {
    // Si no es una URL de Cloudinary o similar, retornar original
    if (!originalSrc.includes('cloudinary.com') && !originalSrc.startsWith('/')) {
      return originalSrc;
    }

    // Si es URL de Cloudinary
    if (originalSrc.includes('cloudinary.com')) {
      const transformation = QUALITIES[targetQuality];
      return originalSrc.replace(/\/upload\/([^/]*\/)?/, `/upload/${transformation}/`);
    }

    // Si es path local, asumir API de optimización
    return `/api/optimize-image?src=${encodeURIComponent(originalSrc)}&quality=${targetQuality}`;
  }, []);

  // Limpiar recursos para evitar memory leaks
  const cleanup = useCallback(() => {
    // Abortar fetch si está en progreso
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // Limpiar imágenes en memoria
    if (imgRefLow.current) {
      imgRefLow.current.onload = null;
      imgRefLow.current.onerror = null;
      imgRefLow.current = null;
    }

    if (imgRefHigh.current) {
      imgRefHigh.current.onload = null;
      imgRefHigh.current.onerror = null;
      imgRefHigh.current = null;
    }
  }, []);

  // Manejar errores de carga
  const handleError = useCallback((errorMessage: string) => {
    setImageState(prev => ({
      ...prev,
      isError: true,
      currentSrc: fallback,
      loadingState: 'error',
      progress: 0
    }));
    
    onError?.(errorMessage);
    console.error('Image loading error:', errorMessage);
    cleanup();
  }, [fallback, onError, cleanup]);

  // Carga progresiva de imágenes
  const loadImage = useCallback(async () => {
    if (!src || imageState.isLoaded || imageState.isError) return;

    cleanup();
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    try {
      // Si la calidad es alta o auto, cargamos versión de baja calidad primero
      if (quality === 'high' || quality === 'auto') {
        setImageState(prev => ({
          ...prev,
          loadingState: 'loading-low',
          progress: 25
        }));
        
        // Carga de baja calidad
        const lowQualitySrc = getOptimizedUrl(src, 'low');
        imgRefLow.current = new Image();
        
        if (crossOrigin) {
          imgRefLow.current.crossOrigin = crossOrigin;
        }
        
        // Cuando carga la versión de baja calidad
        imgRefLow.current.onload = () => {
          if (signal.aborted) return;
          
          setImageState(prev => ({
            ...prev,
            currentSrc: lowQualitySrc,
            isLoaded: true,
            loadingState: 'loading-high',
            progress: 50
          }));
          
          // Si no queremos precargar alta calidad, terminamos aquí
          if (!shouldPreload) {
            onLoad?.();
            return;
          }
          
          // Precarga de alta calidad
          const highQualitySrc = getOptimizedUrl(src, quality);
          imgRefHigh.current = new Image();
          
          if (crossOrigin) {
            imgRefHigh.current.crossOrigin = crossOrigin;
          }
          
          // Cuando carga la versión de alta calidad
          imgRefHigh.current.onload = () => {
            if (signal.aborted) return;
            
            setImageState(prev => ({
              ...prev,
              currentSrc: highQualitySrc,
              loadingState: 'loaded',
              progress: 100
            }));
            
            onLoad?.();
          };
          
          // Error en alta calidad
          imgRefHigh.current.onerror = () => {
            if (signal.aborted) return;
            console.warn('Failed to load high quality image, keeping low quality');
            onLoad?.(); // Seguimos considerando éxito, tenemos la baja calidad
          };
          
          imgRefHigh.current.src = highQualitySrc;
        };
        
        // Error en baja calidad
        imgRefLow.current.onerror = () => {
          if (signal.aborted) return;
          handleError('Failed to load low quality image');
        };
        
        imgRefLow.current.src = lowQualitySrc;
        
      } else {
        // Carga directa para calidades medias o bajas
        setImageState(prev => ({
          ...prev,
          loadingState: 'loading-low',
          progress: 50
        }));
        
        const optimizedSrc = getOptimizedUrl(src, quality);
        imgRefLow.current = new Image();
        
        if (crossOrigin) {
          imgRefLow.current.crossOrigin = crossOrigin;
        }
        
        imgRefLow.current.onload = () => {
          if (signal.aborted) return;
          
          setImageState(prev => ({
            ...prev,
            currentSrc: optimizedSrc,
            isLoaded: true,
            loadingState: 'loaded',
            progress: 100
          }));
          
          onLoad?.();
        };
        
        imgRefLow.current.onerror = () => {
          if (signal.aborted) return;
          handleError('Failed to load image');
        };
        
        imgRefLow.current.src = optimizedSrc;
      }
      
    } catch (error) {
      if (!signal.aborted) {
        handleError(`Loading error: ${error}`);
      }
    }
  }, [
    src, 
    quality, 
    crossOrigin, 
    shouldPreload, 
    getOptimizedUrl, 
    handleError, 
    onLoad, 
    imageState.isLoaded, 
    imageState.isError,
    cleanup
  ]);

  // Efecto para cargar la imagen cuando está en el viewport o es eager
  useEffect(() => {
    if (eager || isIntersecting) {
      loadImage();
    }
    
    return cleanup;
  }, [eager, isIntersecting, loadImage, cleanup]);

  // Retornar datos para el componente de imagen
  return {
    currentSrc: imageState.currentSrc,
    isLoaded: imageState.isLoaded,
    isError: imageState.isError,
    loadingState: imageState.loadingState,
    progress: imageState.progress
  };
}

export default useProgressiveImage;