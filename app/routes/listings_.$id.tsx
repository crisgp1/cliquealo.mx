import { json, redirect, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node"
import { useLoaderData, Link, Form, useNavigation, useFetcher } from "@remix-run/react"
type ActionResponse = { success?: boolean; action?: 'liked' | 'unliked'; error?: string }
import { ListingModel } from "~/models/Listing.server"
import { UserModel } from "~/models/User.server"
import { getUser } from "~/lib/session.server"
import { requireUser, Auth } from "~/lib/auth.server"
import { toast } from "~/components/ui/toast"
import { getHotStatus, type Listing } from "~/models/Listing"
import {
  ArrowLeft,
  Heart,
  Share2,
  Eye,
  Calendar,
  MapPin,
  Phone,
  MessageCircle,
  Edit,
  Trash2,
  Car,
  Fuel,
  Gauge,
  Palette,
  Settings,
  Star,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Calculator,
  CreditCard,
  DollarSign,
  TrendingUp,
  FileText,
  Home,
  Receipt,
  CheckCircle,
  ArrowRight,
  X
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { Splide } from '@splidejs/splide'

export async function loader({ params, request }: LoaderFunctionArgs) {
  const listingId = params.id
  console.log('🎯 LOADER - Listing ID:', listingId)
  
  if (!listingId) {
    console.log('❌ No hay listingId en params')
    throw new Response("Not Found", { status: 404 })
  }

  const user = await getUser(request)
  console.log('👤 Usuario actual:', user?.name || 'No logueado')
  
  // Buscar el listing con información del dueño
  const listing = await ListingModel.findByIdWithUser(listingId)
  console.log('📄 Listing encontrado:', !!listing)
  
  if (!listing) {
    console.log('❌ Listing no encontrado para ID:', listingId)
    throw new Response("Listing no encontrado", { status: 404 })
  }

  // Add hot status to the listing on the server side
  const listingWithHotStatus = {
    ...listing,
    hotStatus: getHotStatus(listing as Listing)
  }

  console.log('📝 Título del listing:', listing.title)
  console.log('👨‍💼 Propietario:', listing.owner?.name)

  // Incrementar contador de vistas (solo si no es el dueño)
  if (!user || listing.user.toString() !== user._id?.toString()) {
    await ListingModel.incrementViews(listingId)
  }

  // Verificar si el usuario le dio like (solo si está logueado)
  const hasLiked = user ? await UserModel.hasLiked(user._id!.toString(), listingId) : false
  
  // Obtener autos similares
  const similarListings = await ListingModel.findSimilar(listingId, 4)
  
  // Verificar permisos de edición
  const canEdit = user ? Auth.canEditListing(user, listing) : false

  console.log('🔍 Loader debug:')
  console.log('- Usuario:', user?.name || 'No logueado')
  console.log('- Has liked:', hasLiked)
  console.log('- Can edit:', canEdit)

  return json({
    listing: listingWithHotStatus,
    similarListings,
    user,
    hasLiked,
    canEdit
  })
}

export async function action({ params, request }: ActionFunctionArgs) {
  const listingId = params.id
  console.log('🎯 ACTION EJECUTADO - Listing ID:', listingId)
  
  if (!listingId) {
    console.log('❌ No listing ID')
    throw new Response("Not Found", { status: 404 })
  }

  // Verificar si hay usuario autenticado
  let user
  try {
    user = await requireUser(request)
    console.log('✅ Usuario autenticado:', user.name, 'ID:', user._id)
  } catch (error) {
    console.log('❌ Usuario NO autenticado')
    return json({ error: "Debes iniciar sesión para dar like" }, { status: 401 })
  }

  const formData = await request.formData()
  const intent = formData.get("intent") as string
  console.log('🎯 Intent recibido:', intent)

  try {
    switch (intent) {
      case "like": {
        console.log('➕ Procesando LIKE...')
        const success = await UserModel.likeListing(user._id!.toString(), listingId)
        console.log('✅ Resultado LIKE:', success)
        
        if (success) {
          return json({ success: true, action: "liked" })
        } else {
          console.log('❌ No se pudo dar like (posiblemente es el dueño)')
          return json({ error: "No puedes dar like a tu propio auto" }, { status: 400 })
        }
      }
      
      case "unlike": {
        console.log('➖ Procesando UNLIKE...')
        const success = await UserModel.unlikeListing(user._id!.toString(), listingId)
        console.log('✅ Resultado UNLIKE:', success)
        
        if (success) {
          return json({ success: true, action: "unliked" })
        } else {
          return json({ error: "No se pudo quitar el like" }, { status: 400 })
        }
      }
      
      case "delete": {
        const listing = await ListingModel.findById(listingId)
        if (!listing || !Auth.canEditListing(user, listing)) {
          throw new Response("No autorizado", { status: 403 })
        }
        
        await ListingModel.delete(listingId)
        return redirect("/?message=listing-deleted")
      }
      
      default:
        console.log('❌ Intent no válido:', intent)
        throw new Response("Acción no válida", { status: 400 })
    }
  } catch (error) {
    console.error("💥 Error en action:", error)
    return json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

type LoaderData = {
  listing: Listing & { hotStatus: string }
  similarListings: Listing[]
  user: any
  hasLiked: boolean
  canEdit: boolean
}

export default function ListingDetail() {
  const { listing, similarListings, user, hasLiked, canEdit } = useLoaderData<LoaderData>()
  const navigation = useNavigation()
  const likeFetcher = useFetcher()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [activeTab, setActiveTab] = useState('info')
  const [showCreditModal, setShowCreditModal] = useState(false)
  const [creditStep, setCreditStep] = useState(1)
  
  // Referencias para Splide
  const mainSplideRef = useRef<HTMLDivElement>(null)
  const thumbnailSplideRef = useRef<HTMLDivElement>(null)
  
  // Estados para calculadora de crédito
  const [creditData, setCreditData] = useState({
    downPayment: Math.round(listing.price * 0.3), // 30% de enganche mínimo por defecto
    loanTerm: 48, // 48 meses por defecto
    interestRate: 12.5 // 12.5% anual por defecto
  })
  
  // Estado para el valor de display del enganche (con formato)
  const [downPaymentDisplay, setDownPaymentDisplay] = useState(
    Math.round(listing.price * 0.3).toLocaleString()
  )

  // Calcular el enganche mínimo (30%)
  const minDownPayment = Math.round(listing.price * 0.3)
  
  const isLiking = likeFetcher.state !== "idle"
  const isDeleting = navigation.state === "submitting" && navigation.formData?.get("intent") === "delete"

  // 🔥 SOLUCIÓN: Estado optimista REAL - ARREGLADO TYPESCRIPT
  const getCurrentlyLiked = (): boolean => {
    // 1. Si hay FormData pendiente (estado optimista)
    if (likeFetcher.formData) {
      const intent = likeFetcher.formData.get("intent")
      const intentStr = typeof intent === 'string' ? intent : ''
      console.log('🔄 Estado optimista - Intent:', intentStr)
      return intentStr === "like"
    }
    
    // 2. Si hay respuesta del servidor
    if (likeFetcher.data) {
      const data = likeFetcher.data as ActionResponse | undefined
      console.log('📡 Respuesta servidor - Action:', data?.action)
      if (data?.action === "liked") return true
      if (data?.action === "unliked") return false
      if (data?.error) return hasLiked // Mantener estado original en error
    }
    
    // 3. Estado inicial del loader
    return hasLiked
  }

  const currentlyLiked = getCurrentlyLiked()

  // Mostrar feedback del fetcher
  useEffect(() => {
    if (likeFetcher.data) {
      const data = likeFetcher.data as ActionResponse | undefined
      
      if (data?.error) {
        console.error('❌ Error en like:', data.error)
        toast.error(data.error)
      } else if (data?.success) {
        if (data.action === "liked") {
          console.log('✅ Like exitoso')
          toast.success("Agregado a favoritos ❤️")
        } else if (data.action === "unliked") {
          console.log('✅ Unlike exitoso')
          toast.success("Removido de favoritos")
        }
      }
    }
  }, [likeFetcher.data])

  const images = listing.images || []
  const hasImages = images.length > 0

  // Navegación de imágenes
  const nextImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }
  }

  const prevImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
    }
  }

  // Keyboard navigation para imágenes
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevImage()
      if (e.key === 'ArrowRight') nextImage()
    }
    
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [images.length])

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: listing.title,
          text: `${listing.brand} ${listing.model} ${listing.year} - $${listing.price.toLocaleString()}`,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback: copiar al clipboard
      navigator.clipboard.writeText(window.location.href)
      toast.success('¡Enlace copiado al portapapeles!')
    }
  }

  // 🔧 HELPER para obtener intent de forma segura
  const getCurrentIntent = (): string => {
    if (!likeFetcher.formData) return 'none'
    const intent = likeFetcher.formData.get('intent')
    return typeof intent === 'string' ? intent : 'unknown'
  }

  // 🔧 HELPER para formatear datos del fetcher de forma segura
  const getFetcherDataString = (): string => {
    if (!likeFetcher.data) return 'null'
    try {
      return JSON.stringify(likeFetcher.data)
    } catch {
      return 'error-serializing'
    }
  }

  // Función para calcular el pago mensual del crédito
  const calculateMonthlyPayment = () => {
    // Validar que el enganche sea al menos el 30%
    if (creditData.downPayment < minDownPayment) {
      return 0
    }
    
    const principal = listing.price - creditData.downPayment
    const monthlyRate = creditData.interestRate / 100 / 12
    const numPayments = creditData.loanTerm
    
    if (monthlyRate === 0) {
      return principal / numPayments
    }
    
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
                          (Math.pow(1 + monthlyRate, numPayments) - 1)
    
    return monthlyPayment
  }

  // Función para calcular el total a pagar
  const calculateTotalPayment = () => {
    return creditData.downPayment + (calculateMonthlyPayment() * creditData.loanTerm)
  }

  // Función para calcular los intereses totales
  const calculateTotalInterest = () => {
    return calculateTotalPayment() - listing.price
  }

  // Función para generar el mensaje de WhatsApp con la información del crédito
  const generateWhatsAppMessage = () => {
    const message = `🚗 *Solicitud de Crédito Automotriz*

*Vehículo:* ${listing.title}
*Precio:* $${listing.price.toLocaleString()} MXN
*ID:* ${listing._id?.slice(-8).toUpperCase() || 'N/A'}

💰 *Detalles del Crédito:*
• Enganche: $${creditData.downPayment.toLocaleString()}
• Plazo: ${creditData.loanTerm} meses
• Tasa de interés: ${creditData.interestRate}% anual
• Pago mensual: $${calculateMonthlyPayment().toLocaleString()}

📋 *Documentos que tengo listos:*
✅ INE (Identificación oficial)
✅ Comprobante de domicilio
✅ Últimos 6 estados de cuenta/nóminas

🙋‍♂️ Estoy interesado en solicitar el crédito para este vehículo. ¿Podrías enviarme la carta de crédito y los siguientes pasos?

¡Gracias!`

    return encodeURIComponent(message)
  }

  // Función para abrir WhatsApp con el mensaje
  const handleWhatsAppContact = () => {
    const whatsappNumber = listing.contactInfo?.whatsapp?.replace(/\D/g, '') || ''
    const message = generateWhatsAppMessage()
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`
    window.open(whatsappUrl, '_blank')
    setShowCreditModal(false)
    setCreditStep(1)
  }

  // Función para avanzar al siguiente paso del modal
  const nextStep = () => {
    if (creditStep < 4) {
      setCreditStep(creditStep + 1)
    }
  }

  // Función para retroceder al paso anterior
  const prevStep = () => {
    if (creditStep > 1) {
      setCreditStep(creditStep - 1)
    }
  }

  // Inicializar Splide cuando las imágenes estén disponibles
  useEffect(() => {
    if (images.length > 1) {
      // Inicializar el carousel principal
      if (mainSplideRef.current) {
        const mainSplide = new Splide(mainSplideRef.current, {
          type: 'fade',
          rewind: true,
          pagination: false,
          arrows: false,
          cover: true,
          height: '400px',
        })

        // Inicializar el carousel de thumbnails
        if (thumbnailSplideRef.current) {
          const thumbnailSplide = new Splide(thumbnailSplideRef.current, {
            fixedWidth: 80,
            fixedHeight: 80,
            gap: 10,
            rewind: true,
            pagination: false,
            arrows: false,
            cover: true,
            focus: 'center',
            isNavigation: true,
            drag: true,
            snap: true,
            slideFocus: true,
          })

          // Sincronizar ambos carousels
          mainSplide.sync(thumbnailSplide)
          
          // Montar ambos carousels
          mainSplide.mount()
          thumbnailSplide.mount()

          // Actualizar el índice actual cuando cambie la imagen
          mainSplide.on('moved', (newIndex) => {
            setCurrentImageIndex(newIndex)
          })

          // Cleanup
          return () => {
            mainSplide.destroy()
            thumbnailSplide.destroy()
          }
        }
      }
    }
  }, [images.length])

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Header */}
      <header className="border-b border-red-100 sticky top-0 bg-white z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 min-w-0">
            <Link
              to="/"
              className="flex items-center space-x-2 sm:space-x-3 text-gray-600 hover:text-gray-900 transition-colors min-w-0"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span className="font-medium text-sm sm:text-base truncate">Volver al Catálogo</span>
            </Link>


            <div className="flex items-center space-x-1 sm:space-x-2 min-w-0">
              {/* 🔥 SOLUCIÓN: Botón de Like Corregido - SIN ERRORES TYPESCRIPT */}
              {user && (
                <likeFetcher.Form method="post" style={{ display: 'inline' }}>
                  <input 
                    type="hidden" 
                    name="intent" 
                    value={currentlyLiked ? "unlike" : "like"} 
                  />
                  <button
                    type="submit"
                    disabled={isLiking}
                    className={`p-2 rounded-full transition-all duration-200 ${
                      currentlyLiked
                        ? 'bg-red-100 text-red-600 hover:bg-red-200 scale-110'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    } ${isLiking ? 'opacity-50 cursor-not-allowed animate-pulse' : 'hover:scale-105'}`}
                    title={currentlyLiked ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                    onClick={() => {
                      console.log('💗 Click en corazón - Estado actual:', currentlyLiked)
                      console.log('👤 Usuario:', user.name)
                      console.log('🔄 Fetcher state:', likeFetcher.state)
                      console.log('📤 Enviando intent:', currentlyLiked ? 'unlike' : 'like')
                    }}
                  >
                    <Heart 
                      className={`w-5 h-5 transition-all duration-200 ${
                        currentlyLiked ? 'fill-current text-red-600' : 'text-gray-600'
                      }`} 
                    />
                  </button>
                </likeFetcher.Form>
              )}
              
              {/* Si no hay usuario, mostrar corazón clickeable que invita a registrarse */}
              {!user && (
                <button
                  onClick={() => {
                    toast.error("¡Inicia sesión para dar like! 💖", {
                      description: "Regístrate o inicia sesión para guardar tus autos favoritos",
                      action: {
                        label: "Registrarse",
                        onClick: () => window.location.href = "/auth/register"
                      }
                    })
                  }}
                  className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600 transition-all duration-200 hover:scale-105 cursor-pointer"
                  title="Haz clic para registrarte y dar like"
                >
                  <Heart className="w-5 h-5 hover:fill-current" />
                </button>
              )}
              
              <button
                onClick={handleShare}
                className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>

              {canEdit && (
                <div className="flex items-center space-x-1 sm:space-x-2 ml-2 sm:ml-4 pl-2 sm:pl-4 border-l border-gray-200">
                    <Link
                      to={`/listings/${listing._id}/edit`}
                      className="p-1.5 sm:p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors flex items-center gap-1 sm:gap-2"
                      title="Editar Listing"
                    >
                      <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="hidden md:inline text-sm">Editar</span>
                  </Link>
                  
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="p-1.5 sm:p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-12">
          {/* Columna principal - Imágenes e info */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-8 min-w-0">
            {/* Galería de imágenes con Splide */}
            <div className="space-y-4">
              {hasImages ? (
                <>
                  {/* Carousel principal */}
                  <div className="relative">
                    <div
                      ref={mainSplideRef}
                      className="splide border-2 border-red-500/20 hover:border-red-500/40 transition-colors rounded-2xl overflow-hidden"
                    >
                      <div className="splide__track">
                        <ul className="splide__list">
                          {images.map((image: string, index: number) => (
                            <li key={index} className="splide__slide">
                              <img
                                src={image}
                                alt={`${listing.title} - Imagen ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Thumbnails con Splide */}
                  {images.length > 1 && (
                    <div className="relative">
                      <div
                        ref={thumbnailSplideRef}
                        className="splide splide--thumbnails"
                      >
                        <div className="splide__track">
                          <ul className="splide__list">
                            {images.map((image: string, index: number) => (
                              <li key={index} className="splide__slide">
                                <img
                                  src={image}
                                  alt={`Thumbnail ${index + 1}`}
                                  className="w-full h-full object-cover rounded-lg border-2 border-transparent hover:border-red-300 transition-colors cursor-pointer"
                                />
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      {/* Indicador de touch */}
                      <div className="mt-2 text-center">
                        <div className="inline-flex items-center gap-2 text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                          <span>👆 Desliza para ver más fotos</span>
                          <div className="flex gap-1">
                            <div className="w-1 h-1 bg-gray-300 rounded-full animate-pulse"></div>
                            <div className="w-1 h-1 bg-gray-300 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-1 h-1 bg-gray-300 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="aspect-[4/3] bg-gray-100 rounded-2xl flex items-center justify-center">
                  <Car className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>

            {/* Información principal */}
            <div className="space-y-4 sm:space-y-6 border-l-4 border-red-500 pl-4 sm:pl-6">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-light text-gray-900 tracking-tight">
                      {listing.title}
                    </h1>
                    {/* 🔥 Hot Badge para página de detalle */}
                    {(() => {
                      const hotStatus = listing.hotStatus
                      if (hotStatus === 'super-hot') {
                        return (
                          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-1 animate-bounce">
                            <span>🔥🔥</span>
                            <span>Super Hot</span>
                          </div>
                        )
                      } else if (hotStatus === 'hot') {
                        return (
                          <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-1 animate-pulse">
                            <span>🔥</span>
                            <span>Hot</span>
                          </div>
                        )
                      }
                      return null
                    })()}
                  </div>
                  
                  {/* ID único del vehículo */}
                  <div className="bg-gray-100 px-2 sm:px-3 py-1 rounded-lg border border-gray-200 self-start">
                    <span className="text-xs text-gray-500 font-medium">ID:</span>
                    <span className="text-xs sm:text-sm font-mono text-gray-700 ml-1">
                      {listing._id?.slice(-8).toUpperCase() || 'N/A'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-gray-600">
                  <span className="text-base sm:text-lg">{listing.brand} {listing.model}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{listing.year}</span>
                </div>
              </div>

              <div className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900 bg-red-50 px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-red-200">
                ${listing.price.toLocaleString()} <span className="text-sm sm:text-lg text-red-600 font-medium">MXN</span>
              </div>

              {/* Características principales */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
                <div className="bg-gray-50 rounded-xl p-2 sm:p-4 text-center">
                  <Calendar className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Año</div>
                  <div className="font-medium">{listing.year}</div>
                </div>
                
                {listing.fuelType && (
                  <div className="bg-gray-50 rounded-xl p-2 sm:p-4 text-center">
                    <Fuel className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">Combustible</div>
                    <div className="font-medium capitalize">{listing.fuelType}</div>
                  </div>
                )}
                
                {listing.transmission && (
                  <div className="bg-gray-50 rounded-xl p-2 sm:p-4 text-center">
                    <Settings className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">Transmisión</div>
                    <div className="font-medium capitalize">{listing.transmission}</div>
                  </div>
                )}
                
                {listing.mileage && (
                  <div className="bg-gray-50 rounded-xl p-2 sm:p-4 text-center">
                    <Gauge className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">Kilometraje</div>
                    <div className="font-medium">{listing.mileage.toLocaleString()} km</div>
                  </div>
                )}
              </div>

              {/* Descripción */}
              {listing.description && (
                <div className="space-y-3">
                  <h2 className="text-xl font-medium text-gray-900">Descripción</h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {listing.description}
                  </p>
                </div>
              )}

              {/* Características adicionales */}
              {(listing.color || listing.bodyType || listing.features?.length) && (
                <div className="space-y-3">
                  <h2 className="text-xl font-medium text-gray-900">Características</h2>
                  <div className="grid grid-cols-2 gap-4">
                    {listing.color && (
                      <div className="flex items-center space-x-3">
                        <Palette className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-600">Color: {listing.color}</span>
                      </div>
                    )}
                    
                    {listing.bodyType && (
                      <div className="flex items-center space-x-3">
                        <Car className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-600">Tipo: {listing.bodyType}</span>
                      </div>
                    )}
                  </div>
                  
                  {listing.features && listing.features.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {listing.features.map((feature: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Tabulador con Contacto y Crédito */}
          <div className="space-y-4 sm:space-y-6 min-w-0">
            {/* Tabulador */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
              {/* Tabs Header */}
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`flex-1 px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium transition-colors ${
                    activeTab === 'info'
                      ? 'bg-red-50 text-red-600 border-b-2 border-red-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center justify-center gap-1 sm:gap-2">
                    <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Contacto</span>
                    <span className="sm:hidden">Info</span>
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('credit')}
                  className={`flex-1 px-2 sm:px-4 py-3 text-xs sm:text-sm font-medium transition-colors ${
                    activeTab === 'credit'
                      ? 'bg-red-50 text-red-600 border-b-2 border-red-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center justify-center gap-1 sm:gap-2">
                    <Calculator className="w-3 h-3 sm:w-4 sm:h-4" />
                    Crédito
                  </span>
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-4 sm:p-6">
                {activeTab === 'info' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Información de contacto</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {listing.owner?.name?.charAt(0).toUpperCase() || 'V'}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{listing.owner?.name || 'Vendedor'}</div>
                          <div className="text-sm text-gray-600">
                            {listing.owner?.role === 'admin' ? 'Vendedor Verificado' : 'Vendedor'}
                          </div>
                        </div>
                      </div>

                      {listing.contactInfo?.phone && (
                        <a
                          href={`tel:${listing.contactInfo.phone}`}
                          className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                          <Phone className="w-5 h-5 text-gray-600" />
                          <span className="text-gray-900">{listing.contactInfo.phone}</span>
                        </a>
                      )}

                      {listing.contactInfo?.whatsapp && (
                        <a
                          href={`https://wa.me/${listing.contactInfo.whatsapp.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-3 p-3 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors"
                        >
                          <MessageCircle className="w-5 h-5" />
                          <span>WhatsApp</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}

                      <button className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]">
                        <span className="flex items-center justify-center space-x-2">
                          <Phone className="w-4 h-4" />
                          <span>Contactar Vendedor</span>
                        </span>
                      </button>
                    </div>

                    {/* Detalles del vehículo */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Detalles</h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            Vistas
                          </span>
                          <span className="text-gray-900">{listing.viewsCount || 0}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            Me gusta
                          </span>
                          <span className="text-gray-900">{listing.likesCount || 0}</span>
                        </div>

                        {listing.location && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600 flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              Ubicación
                            </span>
                            <span className="text-gray-900 text-right">
                              {listing.location.city}, {listing.location.state}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'credit' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-4">
                      <CreditCard className="w-5 h-5 text-red-600" />
                      <h3 className="text-lg font-medium text-gray-900">Calculadora de Crédito</h3>
                    </div>

                    {/* Controles de la calculadora */}
                    <div className="space-y-4">
                      {/* Enganche */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Enganche
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            value={downPaymentDisplay}
                            onChange={(e) => {
                              const rawValue = e.target.value.replace(/[^\d]/g, '') // Solo números
                              const numericValue = rawValue === '' ? 0 : parseFloat(rawValue)
                              
                              // Actualizar el valor numérico
                              setCreditData({
                                ...creditData,
                                downPayment: numericValue
                              })
                              
                              // Actualizar el display (con formato si hay valor, vacío si no)
                              if (rawValue === '') {
                                setDownPaymentDisplay('')
                              } else {
                                setDownPaymentDisplay(numericValue.toLocaleString())
                              }
                            }}
                            onBlur={(e) => {
                              const rawValue = e.target.value.replace(/[^\d]/g, '')
                              const numericValue = rawValue === '' ? 0 : parseFloat(rawValue)
                              
                              // Apply constraints only when user finishes editing
                              const constrainedValue = Math.max(minDownPayment, Math.min(listing.price, numericValue))
                              
                              setCreditData({
                                ...creditData,
                                downPayment: constrainedValue
                              })
                              
                              // Actualizar display con valor restringido (siempre con formato)
                              setDownPaymentDisplay(constrainedValue.toLocaleString())
                            }}
                            onFocus={(e) => {
                              // Si está vacío al hacer focus, no mostrar nada
                              if (creditData.downPayment === 0) {
                                setDownPaymentDisplay('')
                              }
                            }}
                            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                              creditData.downPayment < minDownPayment || creditData.downPayment > listing.price
                                ? 'border-red-300 bg-red-50'
                                : 'border-gray-300'
                            }`}
                            placeholder={`${minDownPayment.toLocaleString()} (mínimo)`}
                          />
                        </div>
                        <div className="mt-1 space-y-1">
                          <div className="text-xs text-gray-500">
                            {creditData.downPayment > 0
                              ? `${((creditData.downPayment / listing.price) * 100).toFixed(1)}% del precio total`
                              : 'Ingresa el monto del enganche'
                            }
                          </div>
                          {creditData.downPayment > listing.price ? (
                            <div className="text-xs text-red-600">
                              ⚠️ No es posible un enganche mayor al 100% del precio
                            </div>
                          ) : (
                            <div className="text-xs text-red-600">
                              Mínimo: ${minDownPayment.toLocaleString()} (30%)
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Plazo */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Plazo (meses)
                        </label>
                        <select
                          value={creditData.loanTerm}
                          onChange={(e) => setCreditData({
                            ...creditData,
                            loanTerm: parseInt(e.target.value)
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        >
                          <option value={12}>12 meses</option>
                          <option value={24}>24 meses</option>
                          <option value={36}>36 meses</option>
                          <option value={48}>48 meses</option>
                          <option value={60}>60 meses</option>
                          <option value={72}>72 meses</option>
                        </select>
                      </div>

                      {/* Tasa de interés */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tasa de interés anual (%)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={creditData.interestRate}
                          onChange={(e) => setCreditData({
                            ...creditData,
                            interestRate: Math.max(0, Math.min(50, parseFloat(e.target.value) || 0))
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          placeholder="12.5"
                        />
                      </div>
                    </div>

                    {/* Resultados */}
                    <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 border border-red-200">
                      <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-red-600" />
                        Resumen del Crédito
                      </h4>
                      
                      {creditData.downPayment < minDownPayment ? (
                        <div className="bg-red-100 border border-red-300 rounded-lg p-3 mb-3">
                          <p className="text-sm text-red-700 font-medium">
                            ⚠️ Enganche insuficiente
                          </p>
                          <p className="text-xs text-red-600 mt-1">
                            El enganche mínimo requerido es del 30% (${minDownPayment.toLocaleString()})
                          </p>
                        </div>
                      ) : creditData.downPayment > listing.price ? (
                        <div className="bg-red-100 border border-red-300 rounded-lg p-3 mb-3">
                          <p className="text-sm text-red-700 font-medium">
                            ⚠️ Enganche excesivo
                          </p>
                          <p className="text-xs text-red-600 mt-1">
                            No es posible un enganche mayor al 100% del precio del vehículo
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Pago mensual:</span>
                            <span className="text-lg font-semibold text-red-600">
                              ${calculateMonthlyPayment().toLocaleString('es-MX', { maximumFractionDigits: 0 })}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Total a pagar:</span>
                            <span className="text-sm font-medium text-gray-900">
                              ${calculateTotalPayment().toLocaleString('es-MX', { maximumFractionDigits: 0 })}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Intereses totales:</span>
                            <span className="text-sm font-medium text-gray-900">
                              ${calculateTotalInterest().toLocaleString('es-MX', { maximumFractionDigits: 0 })}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Botón de contacto para crédito */}
                    <button
                      onClick={() => {
                        if (creditData.downPayment >= minDownPayment && creditData.downPayment <= listing.price) {
                          setShowCreditModal(true)
                          setCreditStep(1)
                        } else if (creditData.downPayment < minDownPayment) {
                          toast.error("Ajusta el enganche al mínimo del 30% para continuar")
                        } else {
                          toast.error("El enganche no puede ser mayor al 100% del precio del vehículo")
                        }
                      }}
                      disabled={creditData.downPayment < minDownPayment || creditData.downPayment > listing.price}
                      className={`w-full py-3 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] ${
                        creditData.downPayment >= minDownPayment && creditData.downPayment <= listing.price
                          ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <span className="flex items-center justify-center space-x-2">
                        <CreditCard className="w-4 h-4" />
                        <span>Solicitar Crédito</span>
                      </span>
                    </button>

                    <div className="text-xs text-gray-500 text-center">
                      * Los cálculos son estimados. Las condiciones finales pueden variar según la institución financiera.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Autos similares */}
        {similarListings.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-light text-gray-900 mb-8 border-l-4 border-red-500 pl-4">Autos similares</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarListings.map((similarListing: any) => (
                <Link
                  key={similarListing._id}
                  to={`/listings/${similarListing._id}`}
                  className="group"
                >
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-red-300 transition-all duration-200">
                    <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                      {similarListing.images?.[0] ? (
                        <img
                          src={similarListing.images[0]}
                          alt={similarListing.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Car className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                        {similarListing.title}
                      </h3>
                      <p className="text-lg font-light text-gray-900">
                        ${similarListing.price.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {similarListing.brand} {similarListing.model} • {similarListing.year}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal de Solicitud de Crédito Step-by-Step */}
      {showCreditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto mx-2">
            {/* Header del Modal */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  Solicitud de Crédito
                </h3>
                <button
                  onClick={() => {
                    setShowCreditModal(false)
                    setCreditStep(1)
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                  <span>Paso {creditStep} de 4</span>
                  <span>{Math.round((creditStep / 4) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(creditStep / 4) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Contenido del Modal */}
            <div className="p-6">
              {/* Paso 1: Información del Crédito */}
              {creditStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CreditCard className="w-8 h-8 text-green-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Resumen de tu Crédito
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Revisa los detalles de tu solicitud de crédito
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vehículo:</span>
                      <span className="font-medium text-gray-900">{listing.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Precio:</span>
                      <span className="font-medium text-gray-900">${listing.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Enganche:</span>
                      <span className="font-medium text-green-600">${creditData.downPayment.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Plazo:</span>
                      <span className="font-medium text-gray-900">{creditData.loanTerm} meses</span>
                    </div>
                    <div className="flex justify-between border-t pt-3">
                      <span className="text-gray-600">Pago mensual:</span>
                      <span className="font-bold text-green-600 text-lg">${calculateMonthlyPayment().toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Paso 2: Documentos Requeridos */}
              {creditStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8 text-blue-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Documentos Necesarios
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Asegúrate de tener estos documentos listos
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h5 className="font-medium text-gray-900">INE</h5>
                        <p className="text-sm text-gray-600">Identificación oficial vigente (ambos lados)</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                      <Home className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <h5 className="font-medium text-gray-900">Comprobante de Domicilio</h5>
                        <p className="text-sm text-gray-600">No mayor a 3 meses (CFE, agua, teléfono, etc.)</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                      <Receipt className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h5 className="font-medium text-gray-900">Estados de Cuenta o Nóminas</h5>
                        <p className="text-sm text-gray-600">Últimos 6 meses para comprobar ingresos</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Paso 3: Confirmación */}
              {creditStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-yellow-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      Confirma tu Solicitud
                    </h4>
                    <p className="text-gray-600 text-sm">
                      ¿Tienes todos los documentos listos?
                    </p>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <h5 className="font-medium text-yellow-800 mb-2">📋 Lista de verificación:</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-gray-700">INE (identificación oficial)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-gray-700">Comprobante de domicilio</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-gray-700">6 estados de cuenta/nóminas</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Al continuar, se enviará tu solicitud al vendedor junto con los detalles del crédito.
                    </p>
                  </div>
                </div>
              )}

              {/* Paso 4: Contacto con Vendedor */}
              {creditStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      ¡Listo para Contactar!
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Contacta al vendedor para solicitar la carta de crédito
                    </p>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <h5 className="font-medium text-green-800 mb-2">📱 Qué sucederá:</h5>
                    <div className="space-y-2 text-sm text-green-700">
                      <p>• Se abrirá WhatsApp con un mensaje pre-escrito</p>
                      <p>• Incluirá todos los detalles de tu crédito</p>
                      <p>• El vendedor te enviará la carta de crédito</p>
                      <p>• Podrás proceder con la documentación</p>
                    </div>
                  </div>

                  <div className="text-center">
                  <div className="flex items-center space-x-3 justify-center mb-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {listing.owner?.name?.charAt(0).toUpperCase() || 'V'}
                      </span>
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-gray-900">{listing.owner?.name || 'Vendedor'}</div>
                      <div className="text-sm text-gray-600">
                        {listing.owner?.role === 'admin' ? 'Vendedor Verificado' : 'Vendedor'}
                      </div>
                    </div>
                  </div>
                </div>
                </div>
              )}
            </div>

            {/* Footer con botones */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-2xl">
              <div className="flex space-x-3">
                {creditStep > 1 && (
                  <button
                    onClick={prevStep}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  >
                    Anterior
                  </button>
                )}
                
                {creditStep < 4 ? (
                  <button
                    onClick={nextStep}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium flex items-center justify-center space-x-2"
                  >
                    <span>Continuar</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleWhatsAppContact}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium flex items-center justify-center space-x-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Contactar por WhatsApp</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-2xl p-4 sm:p-6 max-w-md w-full mx-2">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              ¿Eliminar este auto?
            </h3>
            <p className="text-gray-600 mb-6">
              Esta acción no se puede deshacer. El listing será eliminado permanentemente.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              
              <Form method="post" className="flex-1">
                <input type="hidden" name="intent" value="delete" />
                <button
                  type="submit"
                  disabled={isDeleting}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? 'Eliminando...' : 'Eliminar'}
                </button>
              </Form>
            </div>
          </div>
        </div>
      )}

    
    </div>
  )
}