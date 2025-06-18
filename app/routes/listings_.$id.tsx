import { json, redirect, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node"
import { useLoaderData, Link, Form, useNavigation, useFetcher } from "@remix-run/react"
type ActionResponse = { success?: boolean; action?: 'liked' | 'unliked'; error?: string }
import { ListingModel } from "~/models/Listing.server"
import { UserModel } from "~/models/User.server"
import { getUser } from "~/lib/session.server"
import { requireUser, Auth } from "~/lib/auth.server"
import { toast } from "~/components/ui/toast"
import { getHotStatus } from "~/models/Listing"
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
  ExternalLink
} from 'lucide-react'
import { useState, useEffect } from 'react'

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
    hotStatus: getHotStatus(listing)
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

export default function ListingDetail() {
  const { listing, similarListings, user, hasLiked, canEdit } = useLoaderData<typeof loader>()
  const navigation = useNavigation()
  const likeFetcher = useFetcher()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  
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

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-red-100 sticky top-0 bg-white z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              to="/"
              className="flex items-center space-x-3 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Volver al Catálogo</span>
            </Link>

            <Link to="/" className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-black rounded-full"></div>
              <span className="text-lg font-light tracking-tight text-gray-900">
                Cliquealo
              </span>
            </Link>

            <div className="flex items-center space-x-2">
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
                <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-gray-200">
                    <Link
                      to={`/listings/${listing._id}/edit`}
                      className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors flex items-center gap-2"
                      title="Editar Listing"
                    >
                      <Edit className="w-5 h-5" />
                      <span className="hidden sm:inline text-sm">Editar</span>
                  </Link>
                  
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Columna principal - Imágenes e info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Galería de imágenes */}
            <div className="space-y-4">
              {hasImages ? (
                <div className="relative aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden group border-2 border-red-500/20 hover:border-red-500/40 transition-colors">
                  <img
                    src={images[currentImageIndex]}
                    alt={`${listing.title} - Imagen ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {images.map((_: string, index: number) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="aspect-[4/3] bg-gray-100 rounded-2xl flex items-center justify-center">
                  <Car className="w-16 h-16 text-gray-400" />
                </div>
              )}
              
              {/* Thumbnails */}
              {images.length > 1 && (
                <>
                  {images.length <= 5 ? (
                    // Grid estático para 5 fotos o menos
                    <div className="grid grid-cols-4 gap-2">
                      {images.slice(0, 4).map((image: string, index: number) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                            index === currentImageIndex ? 'border-gray-900' : 'border-transparent'
                          }`}
                        >
                          <img
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                      {images.length > 4 && (
                        <button
                          onClick={() => setCurrentImageIndex(4)}
                          className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                            currentImageIndex === 4 ? 'border-gray-900' : 'border-transparent'
                          }`}
                        >
                          <img
                            src={images[4]}
                            alt={`Thumbnail 5`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      )}
                    </div>
                  ) : (
                    // Carousel horizontal para más de 5 fotos
                    <div className="relative">
                      <div
                        className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1"
                        style={{
                          scrollbarWidth: 'none',
                          msOverflowStyle: 'none',
                          WebkitOverflowScrolling: 'touch'
                        }}
                      >
                        {images.map((image: string, index: number) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`flex-shrink-0 w-12 h-12 rounded-md overflow-hidden border-2 transition-colors ${
                              index === currentImageIndex ? 'border-gray-900' : 'border-transparent'
                            }`}
                          >
                            <img
                              src={image}
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                      
                      {/* Indicador de scroll */}
                      <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 flex items-center gap-1">
                        <span className="text-xs">Desliza</span>
                        <div className="flex gap-0.5">
                          <div className="w-0.5 h-0.5 bg-gray-300 rounded-full"></div>
                          <div className="w-0.5 h-0.5 bg-gray-300 rounded-full"></div>
                          <div className="w-0.5 h-0.5 bg-gray-300 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Información principal */}
            <div className="space-y-6 border-l-4 border-red-500 pl-6">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-light text-gray-900 tracking-tight">
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
                <div className="flex items-center space-x-4 text-gray-600">
                  <span className="text-lg">{listing.brand} {listing.model}</span>
                  <span>•</span>
                  <span>{listing.year}</span>
                </div>
              </div>

              <div className="text-4xl font-light text-gray-900 bg-red-50 px-4 py-3 rounded-xl border border-red-200">
                ${listing.price.toLocaleString()} <span className="text-lg text-red-600 font-medium">MXN</span>
              </div>

              {/* Características principales */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <Calendar className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Año</div>
                  <div className="font-medium">{listing.year}</div>
                </div>
                
                {listing.fuelType && (
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <Fuel className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">Combustible</div>
                    <div className="font-medium capitalize">{listing.fuelType}</div>
                  </div>
                )}
                
                {listing.transmission && (
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <Settings className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">Transmisión</div>
                    <div className="font-medium capitalize">{listing.transmission}</div>
                  </div>
                )}
                
                {listing.mileage && (
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
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
                  
                  {listing.features?.length > 0 && (
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

          {/* Sidebar - Contacto e info */}
          <div className="space-y-6">
            {/* Card de contacto */}
            <div className="bg-gradient-to-br from-red-50 to-gray-50 rounded-2xl p-6 space-y-4 border border-red-200">
              <h3 className="text-lg font-medium text-gray-900">Información de contacto</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {listing.owner.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{listing.owner.name}</div>
                    <div className="text-sm text-gray-600">
                      {listing.owner.role === 'admin' ? 'Vendedor Verificado' : 'Vendedor'}
                    </div>
                  </div>
                </div>

                {listing.contactInfo?.phone && (
                  <a
                    href={`tel:${listing.contactInfo.phone}`}
                    className="flex items-center space-x-3 p-3 bg-white rounded-xl hover:bg-gray-50 transition-colors"
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
            </div>

            {/* Detalles adicionales */}
            <div className="bg-gray-50 rounded-2xl p-6 space-y-4 border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Detalles</h3>
              
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
                    <span className="text-gray-900">
                      {listing.location.city}, {listing.location.state}
                    </span>
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

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
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