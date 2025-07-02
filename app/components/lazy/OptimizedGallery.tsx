import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import LazyImage from './LazyImage';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

// ========================================
// TIPOS Y INTERFACES
// ========================================
interface OptimizedGalleryProps {
  images: string[];
  className?: string;
  maxVisible?: number;
  enableVirtualization?: boolean;
  enableLightbox?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showThumbnails?: boolean;
  thumbnailsPosition?: 'bottom' | 'right' | 'left';
}

// ========================================
// CONFIGURACIÓN ESTÁTICA
// ========================================
const GALLERY_CONFIG = {
  defaultMaxVisible: 8,
  preloadBuffer: 2,
  autoPlayDefault: 5000,
  transitionDuration: 300
} as const;

// ========================================
// COMPONENTE PRINCIPAL SIMPLIFICADO
// ========================================
export function OptimizedGallery({
  images,
  className = "",
  maxVisible = GALLERY_CONFIG.defaultMaxVisible,
  enableLightbox = true,
  autoPlay = false,
  autoPlayInterval = GALLERY_CONFIG.autoPlayDefault,
  showThumbnails = true,
  thumbnailsPosition = 'bottom'
}: OptimizedGalleryProps) {

  // ========================================
  // ESTADO SIMPLIFICADO
  // ========================================
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  
  // Referencias estables
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  // ========================================
  // MEMOIZACIÓN DE IMÁGENES FILTRADAS
  // ========================================
  const validImages = useMemo(() => {
    return images.filter(img => img && typeof img === 'string' && img.trim() !== '');
  }, [images]);

  // ========================================
  // NAVEGACIÓN ESTABLE
  // ========================================
  const goToPrevious = useCallback(() => {
    setCurrentIndex(prev => prev === 0 ? validImages.length - 1 : prev - 1);
  }, [validImages.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => prev === validImages.length - 1 ? 0 : prev + 1);
  }, [validImages.length]);

  const goToIndex = useCallback((index: number) => {
    if (index >= 0 && index < validImages.length) {
      setCurrentIndex(index);
    }
  }, [validImages.length]);

  // ========================================
  // AUTOPLAY CONTROLADO
  // ========================================
  const resetAutoPlay = useCallback(() => {
    if (!autoPlay || validImages.length <= 1) return;

    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }

    autoPlayRef.current = setInterval(() => {
      setCurrentIndex(prev => prev === validImages.length - 1 ? 0 : prev + 1);
    }, autoPlayInterval);
  }, [autoPlay, validImages.length, autoPlayInterval]);

  const pauseAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
  }, []);

  // ========================================
  // EFECTOS ESTABLES
  // ========================================
  useEffect(() => {
    resetAutoPlay();
    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [resetAutoPlay]);

  // ========================================
  // LIGHTBOX HANDLERS
  // ========================================
  const openLightbox = useCallback((index?: number) => {
    if (index !== undefined) {
      setCurrentIndex(index);
    }
    setIsLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
  }, []);

  // ========================================
  // MANEJO DE TECLADO
  // ========================================
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNext();
          break;
        case 'Escape':
          e.preventDefault();
          closeLightbox();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, goToPrevious, goToNext, closeLightbox]);

  // ========================================
  // RENDERIZADO
  // ========================================
  if (validImages.length === 0) {
    return (
      <div className={`bg-gray-100 rounded-lg p-8 text-center ${className}`}>
        <p className="text-gray-500">No hay imágenes disponibles</p>
      </div>
    );
  }

  const currentImage = validImages[currentIndex];

  return (
    <div className={`optimized-gallery ${className}`}>
      
      {/* ========================================
          IMAGEN PRINCIPAL
          ======================================== */}
      <div 
        ref={galleryRef}
        className="relative group"
        onMouseEnter={pauseAutoPlay}
        onMouseLeave={resetAutoPlay}
      >
        <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors">
          
          {/* Imagen actual */}
          <LazyImage
            src={currentImage}
            alt={`Imagen ${currentIndex + 1} de ${validImages.length}`}
            className="w-full h-full cursor-pointer"
            quality="high"
            priority={currentIndex === 0}
            onLoad={() => console.log(`Imagen ${currentIndex + 1} cargada`)}
          />

          {/* Overlay de interacción */}
          <div 
            className="absolute inset-0 cursor-pointer"
            onClick={() => enableLightbox && openLightbox(currentIndex)}
          >
            {/* Botón de pantalla completa */}
            {enableLightbox && (
              <button
                className="absolute top-3 right-3 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  openLightbox(currentIndex);
                }}
                aria-label="Ver en pantalla completa"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            )}

            {/* Contador */}
            <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/50 text-white text-xs rounded">
              {currentIndex + 1} / {validImages.length}
            </div>
          </div>

          {/* Controles de navegación */}
          {validImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                aria-label="Imagen anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                aria-label="Imagen siguiente"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* ========================================
          THUMBNAILS
          ======================================== */}
      {showThumbnails && validImages.length > 1 && (
        <div className="mt-3">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {validImages.map((image, index) => (
              <button
                key={`thumb-${index}`}
                onClick={() => goToIndex(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                  index === currentIndex
                    ? 'border-red-500 ring-2 ring-red-200'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                aria-label={`Ver imagen ${index + 1}`}
              >
                <LazyImage
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full"
                  quality="low"
                  priority={Math.abs(index - currentIndex) <= 2} // Prioridad para thumbnails cercanos
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ========================================
          LIGHTBOX SIMPLE
          ======================================== */}
      {isLightboxOpen && enableLightbox && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative max-w-full max-h-full p-4">
            
            {/* Imagen en lightbox */}
            <LazyImage
              src={currentImage}
              alt={`Imagen ${currentIndex + 1} ampliada`}
              className="max-w-full max-h-full object-contain"
              quality="high"
              priority={true}
            />

            {/* Botón cerrar */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
              aria-label="Cerrar lightbox"
            >
              <span className="w-5 h-5 block">✕</span>
            </button>

            {/* Navegación en lightbox */}
            {validImages.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70"
                  aria-label="Imagen siguiente"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Contador en lightbox */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/50 text-white text-sm rounded">
              {currentIndex + 1} / {validImages.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OptimizedGallery;