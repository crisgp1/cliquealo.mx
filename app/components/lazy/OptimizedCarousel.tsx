import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import LazyImage from './LazyImage';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Image as ImageIcon, ZoomIn } from 'lucide-react';

// ========================================
// TIPOS Y INTERFACES
// ========================================
export interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  title?: string;
  alt?: string;
  thumbnail?: string;
}

interface OptimizedCarouselProps {
  medias: MediaItem[];
  className?: string;
  onMediaClick?: (index: number) => void;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showThumbnails?: boolean;
  maxVisibleThumbnails?: number;
  preloadCount?: number;
  imageQuality?: 'low' | 'medium' | 'high' | 'auto';
  thumbnailsPosition?: 'bottom' | 'right' | 'left';
  showControls?: boolean;
  showIndicators?: boolean;
  loop?: boolean;
  aspectRatio?: string;
}

// ========================================
// CONFIGURACIÓN DEL CAROUSEL
// ========================================
const CAROUSEL_CONFIG = {
  defaultAutoPlayInterval: 5000,
  defaultPreloadCount: 2,
  touchThreshold: 50,
  transitionDuration: 300,
  defaultMaxVisibleThumbnails: 8,
  defaultAspectRatio: '16/9'
};

export function OptimizedCarousel({
  medias,
  className = "",
  onMediaClick,
  autoPlay = false,
  autoPlayInterval = CAROUSEL_CONFIG.defaultAutoPlayInterval,
  showThumbnails = true,
  maxVisibleThumbnails = CAROUSEL_CONFIG.defaultMaxVisibleThumbnails,
  preloadCount = CAROUSEL_CONFIG.defaultPreloadCount,
  imageQuality = 'high',
  thumbnailsPosition = 'bottom',
  showControls = true,
  showIndicators = true,
  loop = true,
  aspectRatio = CAROUSEL_CONFIG.defaultAspectRatio
}: OptimizedCarouselProps) {

  // ========================================
  // ESTADO Y REFERENCIAS ESTABLES
  // ========================================
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const loadedMediasRef = useRef<Set<number>>(new Set([0]));
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const isAutoPlayingRef = useRef(autoPlay);
  
  // Lista filtrada de medios válidos
  const validMedias = useMemo(() => {
    return medias.filter(media => 
      media && 
      typeof media.url === 'string' && 
      media.url.trim() !== '' && 
      (media.type === 'image' || media.type === 'video')
    );
  }, [medias]);

  // ========================================
  // PRELOAD DE MEDIOS ADYACENTES
  // ========================================
  const preloadAdjacentMedias = useCallback((centerIndex: number): void => {
    const newLoadedMedias = new Set(loadedMediasRef.current);
    
    // Precargar medios en un rango alrededor del actual
    for (let i = -preloadCount; i <= preloadCount; i++) {
      const targetIndex = centerIndex + i;
      
      // Manejar índices circulares si el loop está activado
      if (loop) {
        let wrappedIndex = targetIndex;
        if (wrappedIndex < 0) wrappedIndex = validMedias.length + wrappedIndex;
        if (wrappedIndex >= validMedias.length) wrappedIndex = wrappedIndex % validMedias.length;
        newLoadedMedias.add(wrappedIndex);
      } else {
        // Sin loop, solo precargar índices válidos
        if (targetIndex >= 0 && targetIndex < validMedias.length) {
          newLoadedMedias.add(targetIndex);
        }
      }
    }

    loadedMediasRef.current = newLoadedMedias;
  }, [validMedias.length, preloadCount, loop]);

  // ========================================
  // FUNCIÓN PARA ACTUALIZAR ÍNDICE
  // ========================================
  // Esta función es independiente y no crea dependencias circulares
  const updateCurrentIndex = useCallback((newIndex: number): void => {
    setCurrentIndex(newIndex);
    setIsTransitioning(true);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, CAROUSEL_CONFIG.transitionDuration);
    
    preloadAdjacentMedias(newIndex);
  }, [preloadAdjacentMedias]);

  // ========================================
  // AUTOPLAY CONTROLADO
  // ========================================
  const handleAutoPlayUpdate = useCallback((): void => {
    // Calcular el siguiente índice
    const nextIndex = currentIndex + 1;
    let targetIndex = nextIndex;
    
    // Manejar navegación circular
    if (loop) {
      if (nextIndex >= validMedias.length) targetIndex = 0;
    } else if (nextIndex >= validMedias.length) {
      return; // No hacer nada si llegamos al final sin loop
    }
    
    updateCurrentIndex(targetIndex);
  }, [currentIndex, loop, validMedias.length, updateCurrentIndex]);

  const resetAutoPlay = useCallback((): void => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }
    
    if (autoPlay && isAutoPlayingRef.current) {
      autoPlayRef.current = setInterval(handleAutoPlayUpdate, autoPlayInterval);
    }
  }, [autoPlay, autoPlayInterval, handleAutoPlayUpdate]);

  // ========================================
  // NAVEGACIÓN DEL CAROUSEL
  // ========================================
  const navigateToSlide = useCallback((newIndex: number, source: 'click' | 'auto' | 'swipe' = 'click'): void => {
    let targetIndex = newIndex;
    
    // Manejar navegación circular si loop está activado
    if (loop) {
      if (newIndex < 0) targetIndex = validMedias.length - 1;
      if (newIndex >= validMedias.length) targetIndex = 0;
    } else {
      // Sin loop, restringir al rango válido
      if (newIndex < 0 || newIndex >= validMedias.length || newIndex === currentIndex) {
        return;
      }
    }

    // Prevenir navegación durante transiciones
    if (isTransitioning) return;

    updateCurrentIndex(targetIndex);

    // Reiniciar autoplay si la navegación fue manual
    if (source !== 'auto' && autoPlay) {
      resetAutoPlay();
    }
  }, [validMedias.length, currentIndex, isTransitioning, updateCurrentIndex, autoPlay, loop, resetAutoPlay]);

  const goToPrevious = useCallback((): void => {
    navigateToSlide(currentIndex - 1, 'click');
  }, [currentIndex, navigateToSlide]);

  const goToNext = useCallback((): void => {
    navigateToSlide(currentIndex + 1, 'click');
  }, [currentIndex, navigateToSlide]);

  // ========================================
  // MANEJO DE GESTOS TÁCTILES
  // ========================================
  const handleTouchStart = useCallback((e: React.TouchEvent): void => {
    touchStartXRef.current = e.touches[0].clientX;
    touchEndXRef.current = null;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent): void => {
    touchEndXRef.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((): void => {
    const touchStartX = touchStartXRef.current;
    const touchEndX = touchEndXRef.current;
    
    if (!touchStartX || !touchEndX) return;
    
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > CAROUSEL_CONFIG.touchThreshold;
    const isRightSwipe = distance < -CAROUSEL_CONFIG.touchThreshold;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }

    touchStartXRef.current = null;
    touchEndXRef.current = null;
  }, [goToNext, goToPrevious]);

  // ========================================
  // EFECTOS PRINCIPALES
  // ========================================
  // Efecto para inicializar autoplay y preload
  useEffect(() => {
    // Inicializar autoplay
    if (autoPlay) {
      isAutoPlayingRef.current = true;
      resetAutoPlay();
    }
    
    // Precargar medios iniciales
    preloadAdjacentMedias(0);

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
    };
  }, [autoPlay, preloadAdjacentMedias, resetAutoPlay]);

  // Efecto para actualizar cuando cambian las props críticas
  useEffect(() => {
    isAutoPlayingRef.current = autoPlay;
    resetAutoPlay();
  }, [autoPlay, resetAutoPlay]);

  // ========================================
  // MANEJO DE TECLADO
  // ========================================
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      switch (e.key) {
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrevious, goToNext]);

  // ========================================
  // THUMBNAILS VIRTUALIZADOS
  // ========================================
  const virtualizedThumbnails = useMemo(() => {
    if (validMedias.length <= maxVisibleThumbnails) {
      return validMedias.map((media, index) => ({ media, originalIndex: index }));
    }

    const halfVisible = Math.floor(maxVisibleThumbnails / 2);
    
    // Calcular rango visible centrado en el medio actual
    let start = Math.max(0, currentIndex - halfVisible);
    let end = Math.min(validMedias.length, start + maxVisibleThumbnails);
    
    // Ajustar si estamos cerca del final
    if (end === validMedias.length) {
      start = Math.max(0, end - maxVisibleThumbnails);
    }

    return validMedias.slice(start, end).map((media, index) => ({
      media,
      originalIndex: start + index
    }));
  }, [validMedias, currentIndex, maxVisibleThumbnails]);

  // ========================================
  // RENDERIZADO DEL MEDIO ACTUAL
  // ========================================
  const renderMedia = useCallback((media: MediaItem, index: number) => {
    const isVisible = index === currentIndex;
    const shouldLoad = loadedMediasRef.current.has(index);
    
    if (media.type === 'video') {
      return (
        <div
          key={media.id}
          className={`carousel-media-container absolute inset-0 transition-opacity duration-300 ${
            isVisible ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {shouldLoad && (
            <video
              src={media.url}
              className="w-full h-full object-cover"
              controls={isVisible}
              preload="metadata"
              poster={media.thumbnail}
              title={media.title}
              onClick={() => isVisible && onMediaClick?.(index)}
            />
          )}
        </div>
      );
    }
    
    return (
      <div
        key={media.id}
        className={`carousel-media-container absolute inset-0 transition-opacity duration-300 ${
          isVisible ? 'opacity-100 z-10' : 'opacity-0 z-0'
        }`}
      >
        {shouldLoad && (
          <LazyImage
            src={media.url}
            alt={media.alt || media.title || `Imagen ${index + 1}`}
            className="w-full h-full object-cover"
            quality={isVisible ? imageQuality : 'low'}
            priority={isVisible}
            loading={isVisible ? 'eager' : 'lazy'}
            onLoad={() => {
              // Marcar como cargado
              if (!loadedMediasRef.current.has(index)) {
                const newSet = new Set(loadedMediasRef.current);
                newSet.add(index);
                loadedMediasRef.current = newSet;
              }
            }}
            onError={() => {
              console.warn(`Error loading image at index ${index}`);
            }}
          />
        )}
      </div>
    );
  }, [currentIndex, imageQuality, onMediaClick]);

  // ========================================
  // RENDERIZADO DEL COMPONENTE
  // ========================================
  if (validMedias.length === 0) {
    return (
      <div className={`bg-gray-100 rounded-lg p-8 text-center ${className}`}>
        <p className="text-gray-500">No hay medios para mostrar</p>
      </div>
    );
  }

  return (
    <div 
      ref={mainContainerRef}
      className={`optimized-carousel relative ${className}`}
    >
      {/* ========================================
          CONTENEDOR PRINCIPAL DE MEDIOS
          ======================================== */}
      <div 
        className="main-media-container relative overflow-hidden rounded-lg bg-gray-100"
        style={{ aspectRatio }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Renderizar todos los medios */}
        {validMedias.map((media, index) => renderMedia(media, index))}

        {/* Media type indicator */}
        <div className="absolute top-2 left-2 z-20 bg-black bg-opacity-50 text-white rounded-full p-1">
          {validMedias[currentIndex].type === 'video' ? (
            <Play className="w-4 h-4" />
          ) : (
            <ImageIcon className="w-4 h-4" />
          )}
        </div>

        {/* Indicador de medios */}
        <div className="absolute bottom-2 right-2 z-20 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
          {currentIndex + 1} / {validMedias.length}
        </div>

        {/* Botones de navegación */}
        {showControls && validMedias.length > 1 && (
          <>
            <button
              aria-label="Anterior"
              onClick={goToPrevious}
              disabled={!loop && currentIndex === 0}
              className={`absolute left-2 top-1/2 transform -translate-y-1/2 z-20 p-2 bg-black bg-opacity-50 text-white rounded-full transition-all duration-200 ${
                !loop && currentIndex === 0 
                  ? 'opacity-30 cursor-not-allowed' 
                  : 'hover:bg-opacity-70'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <button
              aria-label="Siguiente"
              onClick={goToNext}
              disabled={!loop && currentIndex === validMedias.length - 1}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 z-20 p-2 bg-black bg-opacity-50 text-white rounded-full transition-all duration-200 ${
                !loop && currentIndex === validMedias.length - 1 
                  ? 'opacity-30 cursor-not-allowed' 
                  : 'hover:bg-opacity-70'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Botón de zoom/click si hay handler */}
            {onMediaClick && (
              <button
                aria-label="Ver detalle"
                onClick={() => onMediaClick(currentIndex)}
                className="absolute right-2 top-2 z-20 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all duration-200"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
            )}
          </>
        )}

        {/* Indicadores de posición */}
        {showIndicators && validMedias.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-1">
            {validMedias.map((_, index) => (
              <button
                key={index}
                aria-label={`Ir al medio ${index + 1}`}
                onClick={() => navigateToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? 'bg-white w-4'
                    : 'bg-white bg-opacity-50 hover:bg-opacity-70'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ========================================
          THUMBNAILS
          ======================================== */}
      {showThumbnails && validMedias.length > 1 && (
        <div className={`thumbnails-container mt-2 overflow-hidden ${
          thumbnailsPosition === 'bottom' ? 'w-full' : 'h-96'
        }`}>
          <div className={`flex ${
            thumbnailsPosition === 'bottom' 
              ? 'space-x-2 overflow-x-auto pb-2' 
              : 'flex-col space-y-2 overflow-y-auto pr-2'
          }`}>
            {virtualizedThumbnails.map(({ media, originalIndex }) => (
              <motion.button
                key={media.id}
                onClick={() => navigateToSlide(originalIndex)}
                className={`relative flex-shrink-0 ${
                  thumbnailsPosition === 'bottom' ? 'w-20 h-20' : 'w-full h-20'
                } rounded-md overflow-hidden border-2 transition-all duration-200 ${
                  originalIndex === currentIndex
                    ? 'border-blue-500 shadow-md ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {media.type === 'video' ? (
                  <div className="relative w-full h-full bg-gray-200">
                    {media.thumbnail ? (
                      <img
                        src={media.thumbnail}
                        alt={`Miniatura de video ${originalIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Play className="w-6 h-6 text-gray-500" />
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                      <Play className="w-6 h-6 text-white" />
                    </div>
                  </div>
                ) : (
                  <LazyImage
                    src={media.url}
                    alt={`Miniatura ${originalIndex + 1}`}
                    className="w-full h-full object-cover"
                    quality="low"
                    priority={loadedMediasRef.current.has(originalIndex)}
                  />
                )}
                
                {/* Overlay activo */}
                {originalIndex === currentIndex && (
                  <motion.div
                    className="absolute inset-0 bg-blue-500 bg-opacity-20 border border-blue-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default OptimizedCarousel;