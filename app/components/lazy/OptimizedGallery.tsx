import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { LazyImage } from './LazyImage';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ZoomIn, Download, Share2 } from 'lucide-react';

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

interface GalleryState {
  currentIndex: number;
  loadedImages: Set<number>;
  isLightboxOpen: boolean;
  preloadQueue: number[];
  touchStartX: number | null;
  touchEndX: number | null;
}

const VIRTUALIZATION_CONFIG = {
  defaultMaxVisible: 8,
  preloadBuffer: 2,
  touchThreshold: 50,
  autoPlayDefault: 5000,
  transitionDuration: 300
};

export function OptimizedGallery({
  images,
  className = "",
  maxVisible = VIRTUALIZATION_CONFIG.defaultMaxVisible,
  enableVirtualization = true,
  enableLightbox = true,
  autoPlay = false,
  autoPlayInterval = VIRTUALIZATION_CONFIG.autoPlayDefault,
  showThumbnails = true,
  thumbnailsPosition = 'bottom'
}: OptimizedGalleryProps) {

  // ========================================
  // ESTADO DEL COMPONENTE
  // ========================================
  const [galleryState, setGalleryState] = useState<GalleryState>({
    currentIndex: 0,
    loadedImages: new Set([0]),
    isLightboxOpen: false,
    preloadQueue: [],
    touchStartX: null,
    touchEndX: null
  });

  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const mainImageRef = useRef<HTMLDivElement>(null);

  // ========================================
  // LÓGICA DE VIRTUALIZACIÓN
  // ========================================
  const virtualizedThumbnails = useMemo(() => {
    if (!enableVirtualization || images.length <= maxVisible) {
      return images.map((src, index) => ({ src, originalIndex: index }));
    }

    const { currentIndex } = galleryState;
    const halfVisible = Math.floor(maxVisible / 2);
    
    // Calcular rango visible centrado en la imagen actual
    let start = Math.max(0, currentIndex - halfVisible);
    let end = Math.min(images.length, start + maxVisible);
    
    // Ajustar si estamos cerca del final
    if (end === images.length) {
      start = Math.max(0, end - maxVisible);
    }

    return images.slice(start, end).map((src, index) => ({
      src,
      originalIndex: start + index
    }));
  }, [images, galleryState.currentIndex, maxVisible, enableVirtualization]);

  // ========================================
  // PRELOAD DE IMÁGENES ADYACENTES
  // ========================================
  const preloadAdjacentImages = useCallback((centerIndex: number) => {
    const { loadedImages } = galleryState;
    const newLoadedImages = new Set(loadedImages);
    
    // Precargar imágenes en un rango alrededor de la actual
    const preloadRange = VIRTUALIZATION_CONFIG.preloadBuffer;
    for (let i = -preloadRange; i <= preloadRange; i++) {
      const targetIndex = centerIndex + i;
      if (targetIndex >= 0 && targetIndex < images.length) {
        newLoadedImages.add(targetIndex);
      }
    }

    setGalleryState(prev => ({
      ...prev,
      loadedImages: newLoadedImages
    }));
  }, [galleryState.loadedImages, images.length]);

  // ========================================
  // NAVEGACIÓN DE IMÁGENES
  // ========================================
  const navigateToImage = useCallback((newIndex: number, source: 'click' | 'auto' | 'swipe' = 'click') => {
    if (newIndex < 0 || newIndex >= images.length || newIndex === galleryState.currentIndex) {
      return;
    }

    setGalleryState(prev => ({
      ...prev,
      currentIndex: newIndex
    }));

    preloadAdjacentImages(newIndex);

    // Reiniciar autoplay si la navegación fue manual
    if (source !== 'auto' && autoPlay) {
      resetAutoPlay();
    }
  }, [images.length, galleryState.currentIndex, preloadAdjacentImages, autoPlay]);

  const goToPrevious = useCallback(() => {
    const newIndex = galleryState.currentIndex === 0 
      ? images.length - 1 
      : galleryState.currentIndex - 1;
    navigateToImage(newIndex, 'click');
  }, [galleryState.currentIndex, images.length, navigateToImage]);

  const goToNext = useCallback(() => {
    const newIndex = galleryState.currentIndex === images.length - 1 
      ? 0 
      : galleryState.currentIndex + 1;
    navigateToImage(newIndex, 'click');
  }, [galleryState.currentIndex, images.length, navigateToImage]);

  // ========================================
  // AUTOPLAY FUNCTIONALITY
  // ========================================
  const resetAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    
    if (autoPlay) {
      autoPlayRef.current = setInterval(() => {
        setGalleryState(prev => {
          const nextIndex = prev.currentIndex === images.length - 1 ? 0 : prev.currentIndex + 1;
          navigateToImage(nextIndex, 'auto');
          return prev;
        });
      }, autoPlayInterval);
    }
  }, [autoPlay, autoPlayInterval, images.length, navigateToImage]);

  // ========================================
  // MANEJO DE GESTOS TÁCTILES
  // ========================================
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setGalleryState(prev => ({
      ...prev,
      touchStartX: e.touches[0].clientX,
      touchEndX: null
    }));
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    setGalleryState(prev => ({
      ...prev,
      touchEndX: e.touches[0].clientX
    }));
  }, []);

  const handleTouchEnd = useCallback(() => {
    const { touchStartX, touchEndX } = galleryState;
    
    if (!touchStartX || !touchEndX) return;
    
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > VIRTUALIZATION_CONFIG.touchThreshold;
    const isRightSwipe = distance < -VIRTUALIZATION_CONFIG.touchThreshold;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }

    setGalleryState(prev => ({
      ...prev,
      touchStartX: null,
      touchEndX: null
    }));
  }, [galleryState.touchStartX, galleryState.touchEndX, goToNext, goToPrevious]);

  // ========================================
  // LIGHTBOX FUNCTIONALITY
  // ========================================
  const openLightbox = useCallback(() => {
    if (enableLightbox) {
      setGalleryState(prev => ({ ...prev, isLightboxOpen: true }));
      document.body.style.overflow = 'hidden'; // Prevenir scroll
    }
  }, [enableLightbox]);

  const closeLightbox = useCallback(() => {
    setGalleryState(prev => ({ ...prev, isLightboxOpen: false }));
    document.body.style.overflow = 'unset';
  }, []);

  // ========================================
  // EFECTOS Y LIFECYCLE
  // ========================================
  useEffect(() => {
    preloadAdjacentImages(0);
    resetAutoPlay();

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    resetAutoPlay();
  }, [resetAutoPlay]);

  // ========================================
  // MANEJO DE TECLADO
  // ========================================
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (galleryState.isLightboxOpen) {
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
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [galleryState.isLightboxOpen, goToPrevious, goToNext, closeLightbox]);

  // ========================================
  // RENDERIZADO DEL COMPONENTE
  // ========================================
  if (images.length === 0) {
    return (
      <div className={`bg-gray-100 rounded-lg p-8 text-center ${className}`}>
        <p className="text-gray-500">No hay imágenes para mostrar</p>
      </div>
    );
  }

  return (
    <div className={`optimized-gallery ${className}`}>
      
      {/* ========================================
          IMAGEN PRINCIPAL
          ======================================== */}
      <div 
        ref={mainImageRef}
        className="main-image-container relative mb-4 group cursor-pointer"
        onClick={openLightbox}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <motion.div
          key={galleryState.currentIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <LazyImage
            src={images[galleryState.currentIndex]}
            alt={`Imagen ${galleryState.currentIndex + 1} de ${images.length}`}
            className="w-full h-96 object-cover rounded-lg"
            quality="high"
            priority={true}
          />

          {/* Overlay con controles */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
              {enableLightbox && (
                <button 
                  aria-label="Ampliar imagen" 
                  className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all duration-200"
                >
                  <ZoomIn className="w-5 h-5 text-gray-700" />
                </button>
              )}
              <button 
                aria-label="Compartir imagen"
                className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all duration-200"
              >
                <Share2 className="w-5 h-5 text-gray-700" />
              </button>
              <button 
                aria-label="Descargar imagen"
                className="p-2 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 transition-all duration-200"
              >
                <Download className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Controles de navegación */}
          {images.length > 1 && (
            <>
              <button
                aria-label="Imagen anterior"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-all duration-200 opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <button
                aria-label="Imagen siguiente"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-all duration-200 opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Contador de imágenes */}
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
            {galleryState.currentIndex + 1} / {images.length}
          </div>
        </motion.div>
      </div>

      {/* ========================================
          THUMBNAILS VIRTUALIZADOS
          ======================================== */}
      {showThumbnails && images.length > 1 && (
        <div className={`thumbnails-container ${
          thumbnailsPosition === 'bottom' ? 'w-full' : 'h-96'
        }`}>
          <div className={`flex ${
            thumbnailsPosition === 'bottom' 
              ? 'space-x-2 overflow-x-auto pb-2' 
              : 'flex-col space-y-2 overflow-y-auto pr-2'
          }`}>
            {virtualizedThumbnails.map(({ src, originalIndex }) => (
              <motion.button
                key={originalIndex}
                onClick={() => navigateToImage(originalIndex)}
                className={`relative flex-shrink-0 ${
                  thumbnailsPosition === 'bottom' ? 'w-20 h-20' : 'w-full h-20'
                } rounded-md overflow-hidden border-2 transition-all duration-200 ${
                  originalIndex === galleryState.currentIndex
                    ? 'border-blue-500 shadow-md ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <LazyImage
                  src={src}
                  alt={`Thumbnail ${originalIndex + 1}`}
                  className="w-full h-full object-cover"
                  quality="low"
                  priority={galleryState.loadedImages.has(originalIndex)}
                />
                
                {/* Overlay activo */}
                {originalIndex === galleryState.currentIndex && (
                  <motion.div
                    className="absolute inset-0 bg-blue-500 bg-opacity-20 border border-blue-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}

                {/* Indicador de carga */}
                {!galleryState.loadedImages.has(originalIndex) && (
                  <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                )}
              </motion.button>
            ))}
          </div>

          {/* Indicadores de paginación para virtualización */}
          {enableVirtualization && images.length > maxVisible && (
            <div className="flex justify-center mt-4 space-x-2">
              {Array.from({ 
                length: Math.ceil(images.length / maxVisible) 
              }).map((_, pageIndex) => (
                <button
                  key={pageIndex}
                  aria-label={`Ir a página ${pageIndex + 1} de miniaturas`}
                  onClick={() => navigateToImage(pageIndex * maxVisible)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    Math.floor(galleryState.currentIndex / maxVisible) === pageIndex
                      ? 'bg-blue-500 w-6'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================
          LIGHTBOX MODAL
          ======================================== */}
      <AnimatePresence>
        {galleryState.isLightboxOpen && enableLightbox && (
          <motion.div
            className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <div className="relative max-w-7xl max-h-full p-4">
              <button
                aria-label="Cerrar vista ampliada"
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-all duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                onClick={(e) => e.stopPropagation()}
              >
                <LazyImage
                  src={images[galleryState.currentIndex]}
                  alt={`Imagen ${galleryState.currentIndex + 1} en lightbox`}
                  className="max-w-full max-h-[90vh] object-contain"
                  quality="high"
                  priority={true}
                />
              </motion.div>

              {/* Controles de navegación en lightbox */}
              {images.length > 1 && (
                <>
                  <button
                    aria-label="Imagen anterior"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToPrevious();
                    }}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-all duration-200"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  
                  <button
                    aria-label="Imagen siguiente"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToNext();
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-all duration-200"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}