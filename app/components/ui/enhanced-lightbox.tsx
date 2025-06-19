import { useState, useCallback, useEffect } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import Captions from 'yet-another-react-lightbox/plugins/captions'
import Counter from 'yet-another-react-lightbox/plugins/counter'
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import Video from 'yet-another-react-lightbox/plugins/video'
import 'yet-another-react-lightbox/styles.css'
import 'yet-another-react-lightbox/plugins/captions.css'
import 'yet-another-react-lightbox/plugins/counter.css'
import 'yet-another-react-lightbox/plugins/thumbnails.css'

export interface MediaItem {
  src: string
  type: 'image' | 'video'
  title?: string
  description?: string
  poster?: string // Para videos
  width?: number
  height?: number
}

interface EnhancedLightboxProps {
  isOpen: boolean
  onClose: () => void
  slides: MediaItem[]
  index: number
  onIndexChange?: (index: number) => void
  enableDragToReorder?: boolean
  onReorder?: (newOrder: MediaItem[]) => void
}

export function EnhancedLightbox({
  isOpen,
  onClose,
  slides,
  index,
  onIndexChange,
  enableDragToReorder = false,
  onReorder
}: EnhancedLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(index)

  // Convertir MediaItem[] a formato de yet-another-react-lightbox
  const lightboxSlides = (slides || []).map((item) => {
    if (item.type === 'video') {
      return {
        type: 'video' as const,
        sources: [
          {
            src: item.src,
            type: item.src.includes('.mp4') ? 'video/mp4' : 
                  item.src.includes('.webm') ? 'video/webm' :
                  item.src.includes('.ogg') ? 'video/ogg' : 'video/mp4'
          }
        ],
        poster: item.poster,
        width: item.width || 1920,
        height: item.height || 1080,
        title: item.title,
        description: item.description
      }
    } else {
      return {
        src: item.src,
        title: item.title,
        description: item.description,
        width: item.width,
        height: item.height
      }
    }
  })

  useEffect(() => {
    setCurrentIndex(index)
  }, [index])

  const handleIndexChange = useCallback((newIndex: number) => {
    setCurrentIndex(newIndex)
    onIndexChange?.(newIndex)
  }, [onIndexChange])

  // Configuración de plugins
  const plugins = [
    Captions,
    Counter,
    Fullscreen,
    Thumbnails,
    Zoom,
    Video
  ]

  return (
    <Lightbox
      open={isOpen}
      close={onClose}
      slides={lightboxSlides}
      index={currentIndex}
      on={{
        view: ({ index: newIndex }) => handleIndexChange(newIndex)
      }}
      plugins={plugins}
      captions={{
        showToggle: true,
        descriptionTextAlign: 'center'
      }}
      counter={{
        container: { style: { top: 'unset', bottom: 0 } }
      }}
      thumbnails={{
        position: 'bottom',
        width: 120,
        height: 80,
        border: 2,
        borderRadius: 8,
        padding: 4,
        gap: 16,
        imageFit: 'cover'
      }}
      zoom={{
        maxZoomPixelRatio: 3,
        zoomInMultiplier: 2,
        doubleTapDelay: 300,
        doubleClickDelay: 300,
        doubleClickMaxStops: 2,
        keyboardMoveDistance: 50,
        wheelZoomDistanceFactor: 100,
        pinchZoomDistanceFactor: 100,
        scrollToZoom: true
      }}
      video={{
        controls: true,
        playsInline: true
      }}
      animation={{
        fade: 250,
        swipe: 500
      }}
      controller={{
        closeOnPullDown: true,
        closeOnBackdropClick: true,
        preventDefaultWheelX: true,
        preventDefaultWheelY: true
      }}
      styles={{
        container: {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          backdropFilter: 'blur(8px)'
        },
        slide: {
          padding: '20px'
        }
      }}
      render={{
        buttonPrev: () => (
          <button
            type="button"
            className="yarl__button yarl__button_prev"
            style={{
              background: 'rgba(0, 0, 0, 0.5)',
              border: 'none',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)'
              e.currentTarget.style.transform = 'scale(1.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.5)'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            ‹
          </button>
        ),
        buttonNext: () => (
          <button
            type="button"
            className="yarl__button yarl__button_next"
            style={{
              background: 'rgba(0, 0, 0, 0.5)',
              border: 'none',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)'
              e.currentTarget.style.transform = 'scale(1.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.5)'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            ›
          </button>
        )
      }}
    />
  )
}

// Hook para manejar el lightbox
export function useLightbox(initialSlides: MediaItem[] = []) {
  const [isOpen, setIsOpen] = useState(false)
  const [slides, setSlides] = useState<MediaItem[]>(initialSlides)
  const [currentIndex, setCurrentIndex] = useState(0)

  const openLightbox = useCallback((index: number = 0) => {
    setCurrentIndex(index)
    setIsOpen(true)
    // Prevenir scroll del body
    document.body.style.overflow = 'hidden'
  }, [])

  const closeLightbox = useCallback(() => {
    setIsOpen(false)
    // Restaurar scroll del body
    document.body.style.overflow = 'unset'
  }, [])

  const updateSlides = useCallback((newSlides: MediaItem[]) => {
    setSlides(newSlides)
  }, [])

  const reorderSlides = useCallback((newOrder: MediaItem[]) => {
    setSlides(newOrder)
  }, [])

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  return {
    isOpen,
    slides,
    currentIndex,
    openLightbox,
    closeLightbox,
    updateSlides,
    reorderSlides,
    setCurrentIndex
  }
}