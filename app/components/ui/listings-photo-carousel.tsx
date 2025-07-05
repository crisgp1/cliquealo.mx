import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from '@remix-run/react'
import { Car, Sparkles, Star, TrendingUp } from 'lucide-react'

interface Listing {
  _id: string
  title: string
  images?: string[]
  price?: number
  brand?: string
  model?: string
  year?: number
}

interface ListingsPhotoCarouselProps {
  listings: Listing[]
}

export default function ListingsPhotoCarousel({ listings }: ListingsPhotoCarouselProps) {

  // Una imagen por listing (la primera disponible)
  const listingImages = listings
    .filter(listing => listing.images && listing.images.length > 0)
    .map(listing => ({
      src: listing.images![0],
      title: listing.title,
      price: listing.price,
      brand: listing.brand,
      model: listing.model,
      year: listing.year,
      listingId: listing._id
    }))

  // Dividir las imágenes en dos grupos para las dos cintas
  const midPoint = Math.ceil(listingImages.length / 2)
  const topImages = listingImages.slice(0, midPoint)
  const bottomImages = listingImages.slice(midPoint)

  // Duplicar para scroll infinito
  const infiniteTopImages = [...topImages, ...topImages, ...topImages]
  const infiniteBottomImages = [...bottomImages, ...bottomImages, ...bottomImages]

  // Estados para la animación con Framer Motion
  const [topX, setTopX] = useState(0)
  const [bottomX, setBottomX] = useState(0)

  useEffect(() => {
    if (listingImages.length === 0) return

    const scrollSpeed = 1.2
    const imageWidth = 320 + 24 // Ancho de imagen + gap
    const topTotalWidth = topImages.length * imageWidth
    const bottomTotalWidth = bottomImages.length * imageWidth

    // Inicializar posición inferior desde el final
    setBottomX(-bottomTotalWidth)

    const animate = () => {
      setTopX(prev => {
        const next = prev - scrollSpeed
        return next <= -topTotalWidth ? 0 : next
      })

      setBottomX(prev => {
        const next = prev + scrollSpeed
        return next >= 0 ? -bottomTotalWidth : next
      })

      requestAnimationFrame(animate)
    }

    const animationFrame = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [listingImages.length, topImages.length, bottomImages.length])

  if (listingImages.length === 0) {
    return null
  }

  const renderCarouselBand = (images: typeof infiniteTopImages, isTop: boolean) => (
    <div className="relative overflow-hidden px-4 sm:px-6 md:px-8 lg:px-12">
      <motion.div
        className="flex gap-6"
        animate={{
          x: isTop ? topX : bottomX
        }}
        transition={{
          type: "tween",
          ease: "linear",
          duration: 0
        }}
      >
        {images.map((listing, index) => {
          // Calcular efecto de escala basado en posición
          const itemPosition = (index * 344) + (isTop ? topX : bottomX) // 320px + 24px gap
          const viewportCenter = typeof window !== 'undefined' ? window.innerWidth / 2 : 800
          const distanceFromCenter = Math.abs(itemPosition + 160 - viewportCenter) // +160 para centrar la imagen
          const maxDistance = typeof window !== 'undefined' ? window.innerWidth / 2 : 400
          
          // Calcular escala y opacidad
          const normalizedDistance = Math.min(distanceFromCenter / maxDistance, 1)
          const scale = Math.max(0.7, 1 - normalizedDistance * 0.3)
          const opacity = Math.max(0.6, 1 - normalizedDistance * 0.4)
          const translateY = normalizedDistance * 15

          return (
            <motion.div
              key={`${listing.listingId}-${index}-${isTop ? 'top' : 'bottom'}`}
              className="flex-shrink-0"
              style={{ width: '320px' }}
              animate={{
                scale,
                opacity,
                y: translateY
              }}
              transition={{
                type: "tween",
                ease: "easeOut",
                duration: 0.1
              }}
              whileHover={{
                scale: scale * 1.05,
                y: translateY - 5,
                transition: { duration: 0.3 }
              }}
            >
              <Link 
                to={`/listings/${listing.listingId}`}
                className="block group cursor-pointer"
              >
                {/* Imagen */}
                <motion.div 
                  className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 shadow-xl"
                  whileHover={{
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                  }}
                >
                  <motion.img
                    src={listing.src}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    whileHover={{
                      scale: 1.1
                    }}
                    transition={{ duration: 0.7 }}
                  />
                  
                  {/* Overlay con indicador de click */}
                  <motion.div
                    className="absolute inset-0 bg-black/20 opacity-0 flex items-center justify-center"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      className="bg-white/90 backdrop-blur-sm rounded-full p-3"
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1 }}
                      transition={{ duration: 0.2, delay: 0.1 }}
                    >
                      <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </motion.div>
                  </motion.div>
                </motion.div>

                {/* Información del auto */}
                <motion.div 
                  className="mt-4 px-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h4 className="font-medium text-lg text-gray-900 mb-2 truncate group-hover:text-red-600 transition-colors">
                    {listing.brand} {listing.model}
                  </h4>
                  <div className="flex items-center justify-between">
                    {listing.year && (
                      <motion.span 
                        className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full group-hover:bg-red-50 group-hover:text-red-600 transition-colors"
                        whileHover={{ scale: 1.05 }}
                      >
                        {listing.year}
                      </motion.span>
                    )}
                    {listing.price && (
                      <motion.span 
                        className="text-lg font-bold text-red-600 group-hover:text-red-700"
                        whileHover={{ scale: 1.1 }}
                      >
                        ${listing.price.toLocaleString()}
                      </motion.span>
                    )}
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )

  return (
    <div className="mt-16 mb-16 w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">

      <div className="text-center mb-12 px-4 max-w-4xl mx-auto">
        {/* Título destacado con animaciones */}
        <motion.div 
          className="relative inline-block mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Fondo decorativo animado */}
          <motion.div
            className="absolute -inset-4 bg-gradient-to-r from-red-500/10 via-orange-500/10 to-red-500/10 rounded-2xl blur-lg"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Iconos flotantes */}
          <motion.div
            className="absolute -top-2 -left-6"
            animate={{
              y: [0, -8, 0],
              rotate: [0, 5, 0]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Star className="w-6 h-6 text-yellow-500 fill-yellow-400" />
          </motion.div>

          <motion.div
            className="absolute -top-3 -right-6"
            animate={{
              y: [0, -6, 0],
              rotate: [0, -5, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          >
            <Sparkles className="w-5 h-5 text-red-500" />
          </motion.div>

          <motion.div
            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.6, 1, 0.6]
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          >
            <Car className="w-6 h-6 text-blue-600" />
          </motion.div>

          {/* Título principal */}
          <motion.h3 
            className="text-4xl font-light text-gray-900 relative z-10 bg-white px-6 py-3 rounded-xl"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ 
              duration: 0.6, 
              ease: "easeOut",
              delay: 0.2 
            }}
          >
            <span className="bg-gradient-to-r from-red-600 via-orange-500 to-red-600 bg-clip-text text-transparent">
              Autos Destacados
            </span>
          </motion.h3>
        </motion.div>

        {/* Subtítulo animado */}
        <motion.div
          className="flex items-center justify-center gap-2 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <TrendingUp className="w-5 h-5 text-red-500" />
          </motion.div>
          <p className="text-gray-600 text-lg font-medium">
            Explora nuestra selección de vehículos disponibles
          </p>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-5 h-5 text-orange-500" />
          </motion.div>
        </motion.div>

        {/* Línea decorativa animada */}
        <motion.div
          className="w-24 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto rounded-full"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        />
      </div>

      <div className="relative overflow-hidden py-8">
        {/* Difuminados más sutiles para el efecto de escala */}
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-32 md:w-40 lg:w-48 bg-gradient-to-r from-gray-50/90 via-white/60 via-white/30 via-white/15 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-32 md:w-40 lg:w-48 bg-gradient-to-l from-gray-50/90 via-white/60 via-white/30 via-white/15 to-transparent z-10 pointer-events-none"></div>

        {/* Cinta superior - movimiento hacia la derecha */}
        <div className="mb-12">
          {renderCarouselBand(infiniteTopImages, true)}
        </div>

        {/* Cinta inferior - movimiento hacia la izquierda */}
        <div className="mt-12">
          {renderCarouselBand(infiniteBottomImages, false)}
        </div>
      </div>
    </div>
  )
}