import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

export interface MediaItem {
  src: string;
  type: 'image' | 'video';
  title?: string;
  description?: string;
  poster?: string;
  width?: number;
  height?: number;
}

interface SimpleLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  slides: MediaItem[];
  index: number;
  onIndexChange?: (index: number) => void;
}

export function SimpleLightbox({
  isOpen,
  onClose,
  slides,
  index,
  onIndexChange
}: SimpleLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(index);
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Sincronizar índice externo
  useEffect(() => {
    setCurrentIndex(index);
    setIsZoomed(false);
    setImageLoaded(false);
  }, [index]);

  // Manejar teclas
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNext();
          break;
        case ' ':
          e.preventDefault();
          toggleZoom();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, slides.length]);

  // Prevenir scroll del body cuando está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const goToPrevious = useCallback(() => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : slides.length - 1;
    setCurrentIndex(newIndex);
    onIndexChange?.(newIndex);
    setIsZoomed(false);
    setImageLoaded(false);
  }, [currentIndex, slides.length, onIndexChange]);

  const goToNext = useCallback(() => {
    const newIndex = currentIndex < slides.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    onIndexChange?.(newIndex);
    setIsZoomed(false);
    setImageLoaded(false);
  }, [currentIndex, slides.length, onIndexChange]);

  const toggleZoom = useCallback(() => {
    setIsZoomed(!isZoomed);
  }, [isZoomed]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  if (!isOpen || !slides.length) return null;

  const currentSlide = slides[currentIndex];
  const hasMultipleSlides = slides.length > 1;

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-black bg-opacity-95 flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      {/* Header con controles */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div className="text-white">
            <h3 className="text-lg font-medium">{currentSlide.title}</h3>
            {currentSlide.description && (
              <p className="text-sm text-gray-300">{currentSlide.description}</p>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Contador */}
            <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentIndex + 1} / {slides.length}
            </div>
            
            {/* Botón de zoom (solo para imágenes) */}
            {currentSlide.type === 'image' && (
              <button
                onClick={toggleZoom}
                className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                title={isZoomed ? 'Reducir zoom' : 'Hacer zoom'}
              >
                {isZoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
              </button>
            )}
            
            {/* Botón cerrar */}
            <button
              onClick={onClose}
              className="bg-black/50 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
              title="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="relative w-full h-full flex items-center justify-center p-4 pt-20 pb-16">
        {currentSlide.type === 'image' ? (
          <img
            src={currentSlide.src}
            alt={currentSlide.title || `Imagen ${currentIndex + 1}`}
            className={`max-w-full max-h-full object-contain transition-all duration-300 cursor-pointer ${
              isZoomed ? 'scale-150' : 'scale-100'
            } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onClick={toggleZoom}
            onLoad={() => setImageLoaded(true)}
            style={{
              transformOrigin: 'center center'
            }}
          />
        ) : (
          <video
            src={currentSlide.src}
            poster={currentSlide.poster}
            controls
            className="max-w-full max-h-full"
            style={{
              maxWidth: currentSlide.width || '90vw',
              maxHeight: currentSlide.height || '80vh'
            }}
          />
        )}

        {/* Loading indicator */}
        {currentSlide.type === 'image' && !imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      {/* Controles de navegación */}
      {hasMultipleSlides && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors z-10"
            title="Imagen anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors z-10"
            title="Imagen siguiente"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Thumbnails en la parte inferior */}
      {hasMultipleSlides && (
        <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/50 to-transparent p-4">
          <div className="flex justify-center gap-2 overflow-x-auto pb-2">
            {slides.map((slide, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentIndex(idx);
                  onIndexChange?.(idx);
                  setIsZoomed(false);
                  setImageLoaded(false);
                }}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  idx === currentIndex
                    ? 'border-white ring-2 ring-white/50'
                    : 'border-gray-400 hover:border-gray-200'
                }`}
              >
                {slide.type === 'image' ? (
                  <img
                    src={slide.src}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <div className="w-0 h-0 border-l-[6px] border-l-gray-800 border-y-[4px] border-y-transparent ml-0.5"></div>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Instrucciones de uso */}
      <div className="absolute bottom-4 left-4 text-white text-xs bg-black/50 px-3 py-1 rounded-full">
        <span className="hidden sm:inline">
          Usa ← → para navegar • Espacio para zoom • Esc para cerrar
        </span>
        <span className="sm:hidden">
          Toca para zoom • Desliza para navegar
        </span>
      </div>
    </div>
  );
}

// Hook para manejar el lightbox
export function useSimpleLightbox(initialSlides: MediaItem[] = []) {
  const [isOpen, setIsOpen] = useState(false);
  const [slides, setSlides] = useState<MediaItem[]>(initialSlides);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = useCallback((index: number = 0) => {
    setCurrentIndex(index);
    setIsOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setIsOpen(false);
  }, []);

  const updateSlides = useCallback((newSlides: MediaItem[]) => {
    setSlides(newSlides);
  }, []);

  return {
    isOpen,
    slides,
    currentIndex,
    openLightbox,
    closeLightbox,
    updateSlides,
    setCurrentIndex
  };
}