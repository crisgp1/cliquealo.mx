import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node"
import { useLoaderData, Link, Form, useSearchParams, useFetcher } from "@remix-run/react"
import { ListingModel } from "~/models/Listing"
import { UserModel } from "~/models/User"
import { getUser, requireUser } from "~/lib/session.server"
import { toast } from "~/components/ui/toast"
import { 
  Search, 
  Heart, 
  Eye,
  Filter,
  Grid,
  List,
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useState, useEffect } from 'react'

// Tipo para la respuesta del action
type ActionResponse = { success?: boolean; action?: 'liked' | 'unliked'; error?: string; listingId?: string }

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url)
  const search = url.searchParams.get("search") || ""
  const brand = url.searchParams.get("brand") || ""
  const minPrice = url.searchParams.get("minPrice") ? parseInt(url.searchParams.get("minPrice") || "") : undefined
  const maxPrice = url.searchParams.get("maxPrice") ? parseInt(url.searchParams.get("maxPrice") || "") : undefined
  const minYear = url.searchParams.get("minYear") ? parseInt(url.searchParams.get("minYear") || "") : undefined
  const maxYear = url.searchParams.get("maxYear") ? parseInt(url.searchParams.get("maxYear") || "") : undefined
  const page = parseInt(url.searchParams.get("page") || "1")
  const limit = 12
  const skip = (page - 1) * limit
  
  // Get total count for pagination
  const totalCount = await ListingModel.getStats()
  
  const listings = await ListingModel.findMany({
    search,
    brand,
    minPrice,
    maxPrice,
    minYear,
    maxYear,
    limit,
    skip
  })
  
  const user = await getUser(request)

  // Get brands for filter dropdown
  const brands = await ListingModel.getBrandStats()
  
  //  Verificar qué listings tienen like del usuario actual
  let likedListings: string[] = []
  if (user) {
    // Obtener los IDs de listings que el usuario ha marcado como favoritos
    const userLikes = await UserModel.findById(user._id!.toString())
    if (userLikes?.likedListings) {
      likedListings = userLikes.likedListings.map(id => id.toString())
    }
  }
  
  return json({ 
    listings, 
    search, 
    brand, 
    minPrice, 
    maxPrice, 
    minYear, 
    maxYear, 
    user,
    currentPage: page,
    totalPages: Math.ceil(totalCount.total / limit),
    totalCount: totalCount.total,
    brands: brands.map(b => b._id),
    likedListings 
  })
}

// Action para manejar likes/unlikes
export async function action({ request }: ActionFunctionArgs) {
  // Verificar si hay usuario autenticado
  let user
  try {
    user = await requireUser(request)
  } catch (error) {
    return json({ error: "Debes iniciar sesión para dar like" }, { status: 401 })
  }

  const formData = await request.formData()
  const intent = formData.get("intent") as string
  const listingId = formData.get("listingId") as string

  if (!listingId) {
    return json({ error: "ID del listing requerido" }, { status: 400 })
  }

  try {
    switch (intent) {
      case "like": {
        const success = await UserModel.likeListing(user._id!.toString(), listingId)
        if (success) {
          return json({ success: true, action: "liked", listingId })
        } else {
          return json({ error: "No puedes dar like a tu propio auto" }, { status: 400 })
        }
      }
      
      case "unlike": {
        const success = await UserModel.unlikeListing(user._id!.toString(), listingId)
        if (success) {
          return json({ success: true, action: "unliked", listingId })
        } else {
          return json({ error: "No se pudo quitar el like" }, { status: 400 })
        }
      }
      
      default:
        return json({ error: "Acción no válida" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error en action:", error)
    return json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// Componente para el botón de like
function LikeButton({ listing, isLiked: initialLiked, user }: { 
  listing: any, 
  isLiked: boolean, 
  user: any 
}) {
  const fetcher = useFetcher()
  const isLoading = fetcher.state !== "idle"

  // Estado optimista para mostrar el like inmediatamente
  const getCurrentlyLiked = (): boolean => {
    // Si hay FormData pendiente (estado optimista)
    if (fetcher.formData) {
      const intent = fetcher.formData.get("intent")
      const fetcherListingId = fetcher.formData.get("listingId")
      const intentStr = typeof intent === 'string' ? intent : ''
      const listingIdStr = typeof fetcherListingId === 'string' ? fetcherListingId : ''
      
      // Solo aplicar estado optimista si es para este listing
      if (listingIdStr === listing._id) {
        return intentStr === "like"
      }
    }
    
    // Si hay respuesta del servidor
    if (fetcher.data) {
      const data = fetcher.data as ActionResponse | undefined
      // Solo aplicar si es para este listing
      if (data?.listingId === listing._id) {
        if (data?.action === "liked") return true
        if (data?.action === "unliked") return false
        if (data?.error) return initialLiked // Mantener estado original en error
      }
    }
    
    // Estado inicial del loader
    return initialLiked
  }

  const currentlyLiked = getCurrentlyLiked()

  // Mostrar feedback del fetcher
  useEffect(() => {
    if (fetcher.data) {
      const data = fetcher.data as ActionResponse | undefined
      
      // Solo mostrar toast si es para este listing
      if (data?.listingId === listing._id) {
        if (data?.error) {
          toast.error(data.error)
        } else if (data?.success) {
          if (data.action === "liked") {
            toast.success("Agregado a favoritos ❤️")
          } else if (data.action === "unliked") {
            toast.success("Removido de favoritos")
          }
        }
      }
    }
  }, [fetcher.data, listing._id])

  // Si no hay usuario, mostrar corazón deshabilitado
  if (!user) {
    return (
      <button
        disabled
        className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center cursor-not-allowed opacity-60"
        title="Inicia sesión para dar like"
      >
        <Heart className="w-5 h-5 text-gray-400" />
      </button>
    )
  }

  return (
    <fetcher.Form method="post" style={{ display: 'inline' }}>
      <input type="hidden" name="intent" value={currentlyLiked ? "unlike" : "like"} />
      <input type="hidden" name="listingId" value={listing._id} />
      <button
        type="submit"
        disabled={isLoading}
        className={`absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 ${
          currentlyLiked
            ? 'hover:bg-red-50 scale-110'
            : 'hover:bg-white'
        } ${isLoading ? 'opacity-50 cursor-not-allowed animate-pulse' : 'hover:scale-105'}`}
        title={currentlyLiked ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      >
        <Heart 
          className={`w-5 h-5 transition-all duration-200 ${
            currentlyLiked 
              ? 'fill-red-500 text-red-500' 
              : 'text-gray-600'
          }`} 
        />
      </button>
    </fetcher.Form>
  )
}

export default function ListingsIndex() {
  const { 
    listings, 
    search, 
    brand, 
    minPrice, 
    maxPrice, 
    minYear, 
    maxYear, 
    user,
    currentPage,
    totalPages,
    totalCount,
    brands,
    likedListings 
  } = useLoaderData<typeof loader>()
  const [searchParams] = useSearchParams()
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)

  const hasActiveFilters = brand || minPrice || maxPrice || minYear || maxYear

  return (
    <div className="min-h-screen bg-white">
      {/* Search and Filters Section */}
      <section className="border-b border-gray-100 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-light text-gray-900 mb-4 tracking-tight">
              Explorar Catálogo
            </h1>
            <p className="text-lg text-gray-600 font-light">
              Encuentra tu auto ideal entre nuestras opciones
            </p>
          </div>

          <Form method="get" className="max-w-4xl mx-auto">
            <div className="relative">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="search"
                name="search"
                defaultValue={search}
                placeholder="Buscar por marca, modelo..."
                className="w-full pl-14 pr-6 py-4 bg-white border border-gray-200 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-6 py-2 rounded-xl hover:bg-gray-800 transition-colors text-sm font-medium"
              >
                Buscar
              </button>
            </div>
          </Form>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters and View Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-12 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl border transition-colors ${
                hasActiveFilters || showFilters
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filtros</span>
              {hasActiveFilters && !showFilters && (
                <div className="w-2 h-2 bg-white rounded-full"></div>
              )}
            </button>

            {listings.length > 0 && (
              <span className="text-sm text-gray-600">
                {listings.length} resultado{listings.length !== 1 ? 's' : ''} de {totalCount}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mb-12 p-6 bg-gray-50 rounded-2xl">
            <Form method="get" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <input type="hidden" name="search" value={search} />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marca
                </label>
                <select
                  name="brand"
                  defaultValue={brand}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                  <option value="">Todas</option>
                  {brands.map((brand: string) => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Año mínimo
                </label>
                <input
                  type="number"
                  name="minYear"
                  defaultValue={minYear || ''}
                  placeholder="2010"
                  min="1990"
                  max="2024"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio mínimo
                </label>
                <input
                  type="number"
                  name="minPrice"
                  defaultValue={minPrice || ''}
                  placeholder="50,000"
                  step="10000"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio máximo
                </label>
                <input
                  type="number"
                  name="maxPrice"
                  defaultValue={maxPrice || ''}
                  placeholder="500,000"
                  step="10000"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-4 flex items-center space-x-4 pt-4">
                <button
                  type="submit"
                  className="bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors font-medium"
                >
                  Aplicar filtros
                </button>
                {hasActiveFilters && (
                  <Link
                    to="/listings"
                    className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
                  >
                    Limpiar filtros
                  </Link>
                )}
              </div>
            </Form>
          </div>
        )}

        {/* Results */}
        {listings.length > 0 ? (
          <div className={`grid gap-8 ${
            viewMode === 'grid'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1 max-w-4xl mx-auto'
          }`}>
            {listings.map((listing) => {
              //  Verificar si este listing tiene like del usuario
              const isLiked = likedListings.includes(listing._id)
              
              return (
                <article
                  key={listing._id}
                  className={`group ${
                    viewMode === 'list' ? 'flex space-x-6' : ''
                  }`}
                >
                  <div className={`relative overflow-hidden rounded-2xl bg-gray-100 ${
                    viewMode === 'list' ? 'w-80 h-60 flex-shrink-0' : 'aspect-[4/3]'
                  }`}>
                    {listing.images && listing.images.length > 0 ? (
                      <img
                        src={listing.images[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                      </div>
                    )}
                    
                    {listing.year && (
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                        {listing.year}
                      </div>
                    )}

                    {/* Botón de like funcional */}
                    <LikeButton 
                      listing={listing} 
                      isLiked={isLiked} 
                      user={user} 
                    />
                  </div>

                  <div className={`${viewMode === 'list' ? 'flex-1 py-2' : 'pt-6'}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 mb-1 group-hover:text-gray-600 transition-colors">
                          {listing.title}
                        </h3>
                        {listing.brand && listing.model && (
                          <p className="text-sm text-gray-500">
                            {listing.brand} {listing.model}
                          </p>
                        )}
                      </div>
                    </div>

                    {listing.description && viewMode === 'list' && (
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {listing.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-light text-gray-900">
                        ${listing.price ? listing.price.toLocaleString() : 0}
                      </span>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        {listing.likesCount && listing.likesCount > 0 && (
                          <span className="flex items-center space-x-1">
                            <Heart className="w-4 h-4" />
                            <span>{listing.likesCount}</span>
                          </span>
                        )}
                        <span className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{listing.viewsCount || Math.floor(Math.random() * 200) + 20}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        <div className="flex items-center space-x-1 mb-1">
                          <Calendar className="w-3 h-3" />
                          <span>{listing.createdAt ? new Date(listing.createdAt).toLocaleDateString() : 'Fecha no disponible'}</span>
                        </div>
                        {listing.owner?.name && (
                          <div>Por {listing.owner.name}</div>
                        )}
                      </div>

                      <Link
                        to={`/listings/${listing._id}`}
                        className="flex items-center space-x-2 text-gray-900 hover:text-gray-600 transition-colors font-medium group"
                      >
                        <span>Ver detalles</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-8 flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-light text-gray-900 mb-4">
              {search || hasActiveFilters ? 'Sin resultados' : 'No hay autos disponibles'}
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {search || hasActiveFilters
                ? 'Intenta ajustar tus filtros de búsqueda'
                : 'Estamos preparando increíbles autos para ti'
              }
            </p>
            
            <Link
              to="/"
              className="inline-flex items-center space-x-2 bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors font-medium"
            >
              <span>Volver al inicio</span>
            </Link>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <Link
                to={`?${new URLSearchParams({
                  ...Object.fromEntries(searchParams.entries()),
                  page: (currentPage - 1).toString()
                })}`}
                className={`relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === 1
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
                aria-disabled={currentPage === 1}
                tabIndex={currentPage === 1 ? -1 : 0}
              >
                <span className="sr-only">Anterior</span>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </Link>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => {
                  // Show first page, last page, and pages around current page
                  return page === 1 || 
                         page === totalPages || 
                         (page >= currentPage - 1 && page <= currentPage + 1);
                })
                .map((page, index, array) => {
                  // Add ellipsis where there are gaps
                  const showEllipsisBefore = index > 0 && array[index - 1] !== page - 1;
                  const showEllipsisAfter = index < array.length - 1 && array[index + 1] !== page + 1;
                  
                  return (
                    <div key={page}>
                      {showEllipsisBefore && (
                        <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                          ...
                        </span>
                      )}
                      
                      <Link
                        to={`?${new URLSearchParams({
                          ...Object.fromEntries(searchParams.entries()),
                          page: page.toString()
                        })}`}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          page === currentPage
                            ? 'z-10 bg-gray-900 border-gray-900 text-white'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </Link>
                      
                      {showEllipsisAfter && (
                        <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                          ...
                        </span>
                      )}
                    </div>
                  );
                })}
              
              <Link
                to={`?${new URLSearchParams({
                  ...Object.fromEntries(searchParams.entries()),
                  page: (currentPage + 1).toString()
                })}`}
                className={`relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === totalPages
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
                aria-disabled={currentPage === totalPages}
                tabIndex={currentPage === totalPages ? -1 : 0}
              >
                <span className="sr-only">Siguiente</span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </Link>
            </nav>
          </div>
        )}
      </div>
    </div>
  )
}