// app/components/lazy/LazyImage.tsx
// Componente LazyImage Optimizado para Máxima Calidad con WebP
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

// ===============================================
// TIPOS Y CONFIGURACIÓN OPTIMIZADA
// ===============================================
interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  quality?: 'thumbnail' | 'medium' | 'high' | 'ultraHigh';
  priority?: boolean;
  sizes?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  onLoad?: () => void;
  onError?: (error: string) => void;
  fallback?: string;
  enableWebP?: boolean;
  responsiveBreakpoint?: 'mobile' | 'tablet' | 'desktop' | 'retina';
}

interface ImageLoadState {
  isLoaded: boolean;
  isError: boolean;
  currentSrc: string;
  isWebPSupported: boolean;
  loadingProgress: number;
}

// ===============================================
// CONFIGURACIÓN DE CALIDAD OPTIMIZADA (SIN DEGRADACIÓN)
// ===============================================
const QUALITY_CONFIG = {
  thumbnail: {
    cloudinary: 'w_300,h_200,c_fill,q_85,f_auto,fl_progressive',
    fallback: 'w_300,h_200,c_fill,q_80,f_jpg,fl_progressive'
  },
  medium: {
    cloudinary: 'w_800,h_600,c_limit,q_90,f_auto,fl_progressive,e_sharpen:80',
    fallback: 'w_800,h_600,c_limit,q_88,f_jpg,fl_progressive'
  },
  high: {
    cloudinary: 'w_1200,h_900,c_limit,q_92,f_auto,fl_progressive,e_sharpen:60',
    fallback: 'w_1200,h_900,c_limit,q_90,f_jpg,fl_progressive'
  },
  ultraHigh: {
    cloudinary: 'w_1920,h_1440,c_limit,q_95,f_auto,fl_progressive,e_sharpen:40',
    fallback: 'w_1920,h_1440,c_limit,q_92,f_jpg,fl_progressive'
  }
} as const;

// Placeholder de alta calidad SVG
const HIGH_QUALITY_PLACEHOLDER = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f8fafc;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#e2e8f0;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#grad)"/>
  <circle cx="400" cy="300" r="40" fill="#cbd5e1" opacity="0.6"/>
  <text x="400" y="320" text-anchor="middle" fill="#64748b" font-family="Arial" font-size="16">Cargando imagen...</text>
</svg>
`)}`;

// ===============================================
// DETECCIÓN DE SOPORTE WEBP
// ===============================================
let webpSupportCache: boolean | null = null;

const detectWebPSupport = (): Promise<boolean> => {
  if (webpSupportCache !== null) {
    return Promise.resolve(webpSupportCache);
  }

  return new Promise((resolve) => {
    const webp = new Image();
    webp.onload = webp.onerror = () => {
      webpSupportCache = webp.height === 2;
      resolve(webpSupportCache);
    };
    webp.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  });
};

// ===============================================
// COMPONENTE PRINCIPAL OPTIMIZADO
// ===============================================
export function LazyImage({
  src,
  alt,
  className = '',
  placeholder = HIGH_QUALITY_PLACEHOLDER,
  quality = 'high',
  priority = false,
  objectFit = 'cover',
  onLoad,
  onError,
  fallback,
  enableWebP = true,
  responsiveBreakpoint = 'desktop'
}: LazyImageProps) {
  // ===============================================
  // ESTADO Y REFERENCIAS
  // ===============================================
  const [loadState, setLoadState] = useState<ImageLoadState>({
    isLoaded: false,
    isError: false,
    currentSrc: placeholder,
    isWebPSupported: false,
    loadingProgress: 0
  });

  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isLoadingRef = useRef(false);
  const hasLoadedRef = useRef(false);

  // ===============================================
  // URL OPTIMIZADA CON SOPORTE WEBP
  // ===============================================
  const optimizedSrc = useMemo(() => {
    // Ensure valid quality parameter or default to 'high'
    const validQuality = (quality && QUALITY_CONFIG[quality]) ? quality : 'high';
    const config = QUALITY_CONFIG[validQuality] || QUALITY_CONFIG['high'];
    
    // Default cloudinary transform if config is missing
    const defaultCloudinary = 'w_1200,h_900,c_limit,q_auto,f_auto';
    const cloudinaryTransform = config && config.cloudinary ? config.cloudinary : defaultCloudinary;

    // Configuración específica para el breakpoint responsivo
    const responsiveConfig = {
      mobile: cloudinaryTransform.replace(/w_\d+/, 'w_400').replace(/h_\d+/, 'h_300'),
      tablet: cloudinaryTransform.replace(/w_\d+/, 'w_800').replace(/h_\d+/, 'h_600'),
      desktop: cloudinaryTransform,
      retina: cloudinaryTransform
        .replace(/w_(\d+)/, (match, width) => `w_${parseInt(width) * 2}`)
        .replace(/h_(\d+)/, (match, height) => `h_${parseInt(height) * 2}`)
    };

    // Si es URL de Cloudinary, aplicar transformaciones
    if (src.includes('cloudinary.com')) {
      const transformation = enableWebP && loadState.isWebPSupported
        ? responsiveConfig[responsiveBreakpoint]
        : config.fallback;
      return src.replace(/\/upload\/([^/]*\/)?/, `/upload/${transformation}/`);
    }

    // Si es URL externa o local, usar API de optimización propia
    if (src.startsWith('/') || src.startsWith('http')) {
      const params = new URLSearchParams({
        src: src,
        quality: quality,
        format: enableWebP && loadState.isWebPSupported ? 'webp' : 'jpg',
        breakpoint: responsiveBreakpoint
      });
      return `/api/optimize-image?${params.toString()}`;
    }

    return src;
  }, [src, quality, enableWebP, loadState.isWebPSupported, responsiveBreakpoint]);

  const fallbackSrc = useMemo(() => {
    if (fallback) return fallback;

    // Ensure valid quality parameter or default to 'high'
    const validQuality = (quality && QUALITY_CONFIG[quality]) ? quality : 'high';
    
    // Generar fallback de menor calidad
    const lowerQuality = validQuality === 'ultraHigh' ? 'high' : validQuality === 'high' ? 'medium' : 'thumbnail';
    const config = QUALITY_CONFIG[lowerQuality] || QUALITY_CONFIG['high'];
    
    // Default fallback transform if config is missing
    const defaultFallback = 'w_1200,h_900,c_limit,q_85,f_jpg';
    const fallbackTransform = config && config.fallback ? config.fallback : defaultFallback;

    if (src.includes('cloudinary.com')) {
      return src.replace(/\/upload\/([^/]*\/)?/, `/upload/${fallbackTransform}/`);
    }

    return src;
  }, [src, quality, fallback]);

  // ===============================================
  // DETECCIÓN DE SOPORTE WEBP
  // ===============================================
  useEffect(() => {
    if (enableWebP) {
      detectWebPSupport().then((isSupported) => {
        setLoadState(prev => ({ ...prev, isWebPSupported: isSupported }));
      });
    }
  }, [enableWebP]);

  // ===============================================
  // FUNCIÓN DE CARGA OPTIMIZADA
  // ===============================================
  const loadImage = useCallback(() => {
    if (isLoadingRef.current || hasLoadedRef.current || loadState.isError) {
      return;
    }

    isLoadingRef.current = true;
    setLoadState(prev => ({ ...prev, loadingProgress: 25 }));

    const img = new Image();

    // Configurar crossOrigin para imágenes externas
    if (src.startsWith('http') && !src.includes(window.location.hostname)) {
      img.crossOrigin = 'anonymous';
    }

    img.onload = () => {
      if (hasLoadedRef.current) return;
      hasLoadedRef.current = true;
      isLoadingRef.current = false;
      
      setLoadState(prev => ({
        ...prev,
        isLoaded: true,
        isError: false,
        currentSrc: optimizedSrc,
        loadingProgress: 100
      }));

      // Log de debugging en desarrollo
      if (process.env.NODE_ENV === 'development') {
        console.log(`✅ Imagen cargada: ${src} → ${optimizedSrc}`);
        console.log(`📊 WebP soportado: ${loadState.isWebPSupported}`);
        console.log(`🎯 Calidad: ${quality}`);
      }

      onLoad?.();
    };

    img.onerror = () => {
      isLoadingRef.current = false;

      // Intentar cargar fallback
      if (optimizedSrc !== fallbackSrc) {
        console.warn(`⚠️ Error cargando imagen optimizada, intentando fallback: ${fallbackSrc}`);
        const fallbackImg = new Image();
        
        fallbackImg.onload = () => {
          setLoadState(prev => ({
            ...prev,
            isLoaded: true,
            isError: false,
            currentSrc: fallbackSrc,
            loadingProgress: 100
          }));
          
          onLoad?.();
        };
        
        fallbackImg.onerror = () => {
          setLoadState(prev => ({
            ...prev,
            isLoaded: false,
            isError: true,
            currentSrc: placeholder,
            loadingProgress: 0
          }));
          
          onError?.('Error cargando imagen y fallback');
        };
        
        fallbackImg.src = fallbackSrc;
      } else {
        setLoadState(prev => ({
          ...prev,
          isLoaded: false,
          isError: true,
          currentSrc: placeholder,
          loadingProgress: 0
        }));
        
        onError?.('Error cargando imagen');
      }
    };

    img.src = optimizedSrc;
  }, [optimizedSrc, fallbackSrc, placeholder, loadState.isWebPSupported, src, quality, onLoad, onError]);

  // ===============================================
  // INTERSECTION OBSERVER PARA LAZY LOADING
  // ===============================================
  useEffect(() => {
    if (priority) {
      loadImage();
      return;
    }

    const currentImg = imgRef.current;
    if (!currentImg) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasLoadedRef.current) {
            loadImage();
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px 0px'
      }
    );

    observer.observe(currentImg);
    observerRef.current = observer;

    return () => {
      observer.disconnect();
    };
  }, [priority, loadImage]);

  // ===============================================
  // CLEANUP
  // ===============================================
  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
      isLoadingRef.current = false;
      hasLoadedRef.current = false;
    };
  }, []);

  // ===============================================
  // RENDERIZADO OPTIMIZADO
  // ===============================================
  if (loadState.isError) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
        <div className="text-center p-4">
          <div className="w-12 h-12 mx-auto mb-2 bg-gray-300 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">Error al cargar imagen</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        ref={imgRef}
        src={loadState.currentSrc}
        alt={alt}
        className={`w-full h-full object-${objectFit} transition-all duration-500 ease-out ${
          loadState.isLoaded ? 'opacity-100 filter-none' : 'opacity-70 filter blur-sm'
        }`}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        style={{ contentVisibility: 'auto', containIntrinsicSize: '800px 600px' }}
      />
      
      {/* Indicador de progreso de carga */}
      {!loadState.isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse">
          <div className="absolute bottom-2 left-2 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded">
            {loadState.loadingProgress}%
          </div>
        </div>
      )}
    </div>
  );
}

export default LazyImage;