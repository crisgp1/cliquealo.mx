import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

// ========================================
// TIPOS Y INTERFACES
// ========================================
interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  quality?: 'low' | 'medium' | 'high' | 'auto';
  priority?: boolean;
  sizes?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: (error: string) => void;
  fallback?: string;
}

interface ImageLoadState {
  isLoaded: boolean;
  isError: boolean;
  currentSrc: string;
  loadingProgress: number;
}

// ========================================
// CONFIGURACIÓN DE OPTIMIZACIÓN
// ========================================
const OPTIMIZATION_CONFIG = {
  cloudinaryBaseUrl: 'https://res.cloudinary.com/tu-cloud-name',
  qualities: {
    low: 'w_400,q_auto:low,f_auto',
    medium: 'w_800,q_auto:good,f_auto',
    high: 'w_1200,q_auto:best,f_auto',
    auto: 'w_auto,q_auto,f_auto'
  },
  placeholders: {
    default: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNhcmdhbmRvLi4uPC90ZXh0Pjwvc3ZnPg==',
    car: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHBhdGggZD0iTTIwIDUwaDYwdjEwSDIweiIgZmlsbD0iIzlDQTNBRiIvPjwvc3ZnPg=='
  },
  intersectionOptions: {
    rootMargin: '50px 0px',
    threshold: 0.1
  }
};

export function LazyImage({
  src,
  alt,
  className = "",
  placeholder,
  quality = 'medium',
  priority = false,
  sizes,
  objectFit = 'cover',
  loading = 'lazy',
  onLoad,
  onError,
  fallback = OPTIMIZATION_CONFIG.placeholders.default
}: LazyImageProps) {
  
  // ========================================
  // ESTADO DEL COMPONENTE
  // ========================================
  const [loadState, setLoadState] = useState<ImageLoadState>({
    isLoaded: false,
    isError: false,
    currentSrc: placeholder || OPTIMIZATION_CONFIG.placeholders.default,
    loadingProgress: 0
  });

  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // ========================================
  // UTILIDADES DE OPTIMIZACIÓN
  // ========================================
  const getOptimizedSrc = useCallback((originalSrc: string, targetQuality: keyof typeof OPTIMIZATION_CONFIG.qualities) => {
    // Si no es una URL de Cloudinary, retornar original
    if (!originalSrc.includes('cloudinary.com') && !originalSrc.startsWith('/')) {
      return originalSrc;
    }

    // Si es URL de Cloudinary existente
    if (originalSrc.includes('cloudinary.com')) {
      const transformation = OPTIMIZATION_CONFIG.qualities[targetQuality];
      return originalSrc.replace(/\/upload\/([^/]*\/)?/, `/upload/${transformation}/`);
    }

    // Si es path local, asumir estructura optimizada
    return `/api/optimize-image?src=${encodeURIComponent(originalSrc)}&quality=${targetQuality}`;
  }, []);

  // ========================================
  // CARGA PROGRESIVA DE IMÁGENES
  // ========================================
  const loadProgressively = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    try {
      // ========================================
      // FASE 1: Cargar versión de baja calidad
      // ========================================
      if (quality === 'high' || quality === 'auto') {
        setLoadState(prev => ({ ...prev, loadingProgress: 25 }));
        
        const lowQualitySrc = getOptimizedSrc(src, 'low');
        const lowImg = new Image();
        
        lowImg.onload = () => {
          if (signal.aborted) return;
          
          setLoadState(prev => ({
            ...prev,
            currentSrc: lowQualitySrc,
            isLoaded: true,
            loadingProgress: 50
          }));
          
          // ========================================
          // FASE 2: Precargar imagen de alta calidad
          // ========================================
          const highQualitySrc = getOptimizedSrc(src, quality);
          const highImg = new Image();
          
          highImg.onload = () => {
            if (signal.aborted) return;
            
            setLoadState(prev => ({
              ...prev,
              currentSrc: highQualitySrc,
              loadingProgress: 100
            }));
            
            onLoad?.();
          };
          
          highImg.onerror = () => {
            if (signal.aborted) return;
            console.warn('Failed to load high quality image, keeping low quality');
            onLoad?.(); // Llamar onLoad incluso con imagen de baja calidad
          };
          
          highImg.src = highQualitySrc;
        };
        
        lowImg.onerror = () => {
          if (signal.aborted) return;
          handleImageError('Failed to load low quality image');
        };
        
        lowImg.src = lowQualitySrc;
        
      } else {
        // ========================================
        // CARGA DIRECTA PARA CALIDADES MEDIAS/BAJAS
        // ========================================
        setLoadState(prev => ({ ...prev, loadingProgress: 50 }));
        
        const optimizedSrc = getOptimizedSrc(src, quality);
        const img = new Image();
        
        img.onload = () => {
          if (signal.aborted) return;
          
          setLoadState(prev => ({
            ...prev,
            currentSrc: optimizedSrc,
            isLoaded: true,
            loadingProgress: 100
          }));
          
          onLoad?.();
        };
        
        img.onerror = () => {
          if (signal.aborted) return;
          handleImageError('Failed to load image');
        };
        
        img.src = optimizedSrc;
      }
      
    } catch (error) {
      if (!signal.aborted) {
        handleImageError(`Loading error: ${error}`);
      }
    }
  }, [src, quality, getOptimizedSrc, onLoad]);

  // ========================================
  // MANEJO DE ERRORES
  // ========================================
  const handleImageError = useCallback((errorMessage: string) => {
    setLoadState(prev => ({
      ...prev,
      isError: true,
      currentSrc: fallback,
      loadingProgress: 0
    }));
    
    onError?.(errorMessage);
    console.error('LazyImage Error:', errorMessage);
  }, [fallback, onError]);

  // ========================================
  // INTERSECTION OBSERVER PARA LAZY LOADING
  // ========================================
  useEffect(() => {
    if (priority) {
      loadProgressively();
      return;
    }

    if (!imgRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !loadState.isLoaded && !loadState.isError) {
            loadProgressively();
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      OPTIMIZATION_CONFIG.intersectionOptions
    );

    observerRef.current.observe(imgRef.current);

    return () => {
      observerRef.current?.disconnect();
      abortControllerRef.current?.abort();
    };
  }, [priority, loadProgressively, loadState.isLoaded, loadState.isError]);

  // ========================================
  // CLEANUP EN UNMOUNT
  // ========================================
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      observerRef.current?.disconnect();
    };
  }, []);

  // ========================================
  // RENDERIZADO CONDICIONAL
  // ========================================
  if (loadState.isError) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <div className="text-center p-4">
          <div className="w-12 h-12 mx-auto mb-2 bg-gray-300 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">Error al cargar imagen</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* ========================================
          IMAGEN PRINCIPAL CON ANIMACIÓN
          ======================================== */}
      <motion.img
        ref={imgRef}
        src={loadState.currentSrc}
        alt={alt}
        className={`w-full h-full object-${objectFit} transition-all duration-300`}
        style={{
          filter: loadState.isLoaded ? 'none' : 'blur(5px)',
        }}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: loadState.currentSrc !== placeholder ? 1 : 0.7
        }}
        transition={{ duration: 0.3 }}
        loading={priority ? "eager" : loading}
        decoding="async"
        sizes={sizes}
      />

      {/* ========================================
          INDICADOR DE PROGRESO DE CARGA
          ======================================== */}
      {!loadState.isLoaded && loadState.loadingProgress > 0 && (
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
          <div className="bg-white rounded-full p-2">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      )}

      {/* ========================================
          OVERLAY DE CALIDAD BAJA
          ======================================== */}
      {loadState.isLoaded && loadState.loadingProgress < 100 && (
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
          Optimizando...
        </div>
      )}
    </div>
  );
}