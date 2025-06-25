import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node"
import { Form, Link, useLoaderData, useNavigation, useSearchParams, useSubmit } from "@remix-run/react"
import { requireAdmin } from "~/lib/auth.server"
import { db } from "~/lib/db.server"
import { ListingModel } from "~/models/Listing.server"
import { 
  Search, 
  Filter, 
  Plus, 
  Edit,
  Trash2,
  Eye,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ListFilter,
  X,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Loader2,
  MoreHorizontal,
  Car
} from 'lucide-react'
import { useState } from 'react'
import { TicketCatalog } from "~/components/ui/ticket-catalog"

export async function loader({ request }: LoaderFunctionArgs) {
  // Ensure user is admin
  await requireAdmin(request)
  
  // Parse URL params for filtering and pagination
  const url = new URL(request.url)
  const search = url.searchParams.get("search") || ""
  const brand = url.searchParams.get("brand") || ""
  const status = url.searchParams.get("status") || ""
  const sortBy = url.searchParams.get("sortBy") || "recent"
  const page = parseInt(url.searchParams.get("page") || "1")
  const limit = 15
  const skip = (page - 1) * limit
  
  // Fetch listings with filters
  const listings = await ListingModel.findMany({
    search,
    brand,
    status: status ? (status as 'active' | 'sold' | 'reserved' | 'inactive') : undefined, // Si no hay status, mostrar todos
    sortBy: sortBy as any,
    limit,
    skip
  })
  
  // Get total count for pagination
  const totalCount = await ListingModel.getStats()
  
  // Get brands for filter dropdown (todas las marcas, no solo activas)
  const brands = await ListingModel.getAllBrandStats()
  
  return json({ 
    listings, 
    totalCount: totalCount.total,
    currentPage: page,
    totalPages: Math.ceil(totalCount.total / limit),
    brands: brands.map(b => b._id),
    filters: { search, brand, status, sortBy }
  })
}

export async function action({ request }: ActionFunctionArgs) {
  // Ensure user is admin
  const user = await requireAdmin(request)
  
  const formData = await request.formData()
  const intent = formData.get("intent") as string
  const listingId = formData.get("listingId") as string
  
  if (!listingId) {
    return json({ error: "ID del listing es requerido" }, { status: 400 })
  }
  
  try {
    switch (intent) {
      case "delete": {
        const success = await ListingModel.delete(listingId)
        if (!success) {
          return json({ error: "Error al eliminar el listing" }, { status: 500 })
        }
        return json({ success: true })
      }
      
      case "activate": {
        const success = await ListingModel.updateStatus(listingId, "active")
        if (!success) {
          return json({ error: "Error al actualizar el status" }, { status: 500 })
        }
        return json({ success: true })
      }
      
      case "deactivate": {
        const success = await ListingModel.updateStatus(listingId, "inactive")
        if (!success) {
          return json({ error: "Error al actualizar el status" }, { status: 500 })
        }
        return json({ success: true })
      }
      
      case "mark-sold": {
        const success = await ListingModel.updateStatus(listingId, "sold", new Date())
        if (!success) {
          return json({ error: "Error al actualizar el status" }, { status: 500 })
        }
        return json({ success: true })
      }
      
      case "mark-reserved": {
        const success = await ListingModel.updateStatus(listingId, "reserved")
        if (!success) {
          return json({ error: "Error al actualizar el status" }, { status: 500 })
        }
        return json({ success: true })
      }
      
      case "toggle-featured": {
        const success = await ListingModel.toggleFeatured(listingId)
        if (!success) {
          return json({ error: "Error al actualizar el listing" }, { status: 500 })
        }
        return json({ success: true })
      }
      
      default:
        return json({ error: "Acción no válida" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error en action:", error)
    return json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export default function AdminListings() {
  const { 
    listings, 
    totalCount, 
    currentPage, 
    totalPages, 
    brands,
    filters 
  } = useLoaderData<typeof loader>()
  
  const navigation = useNavigation()
  const submit = useSubmit()
  const [searchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  const [actionListingId, setActionListingId] = useState<string | null>(null)
  
  const isSubmitting = navigation.state === "submitting"
  
  const statusOptions = [
    { value: "", label: "Todos" },
    { value: "active", label: "Activos" },
    { value: "inactive", label: "Inactivos" },
    { value: "sold", label: "Vendidos" },
    { value: "reserved", label: "Reservados" }
  ]
  
  const sortOptions = [
    { value: "recent", label: "Más recientes" },
    { value: "price_low", label: "Menor precio" },
    { value: "price_high", label: "Mayor precio" },
    { value: "views", label: "Más vistas" },
    { value: "popular", label: "Más gustados" }
  ]
  
  const clearFilters = () => {
    submit({}, { method: "get" })
  }
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
            <CheckCircle className="w-3 h-3" />
            Activo
          </span>
        )
      case 'inactive':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
            <XCircle className="w-3 h-3" />
            Inactivo
          </span>
        )
      case 'sold':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
            <CheckCircle className="w-3 h-3" />
            Vendido
          </span>
        )
      case 'reserved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
            <Clock className="w-3 h-3" />
            Reservado
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
            <AlertCircle className="w-3 h-3" />
            Desconocido
          </span>
        )
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-light text-gray-900 mb-2">
              Gestión de Listings
            </h1>
            <p className="text-gray-600">
              {totalCount} listings en total
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <TicketCatalog />
            
            <Link
              to="/listings/new"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Listing</span>
            </Link>
            
            <Link
              to="/admin"
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Volver
            </Link>
          </div>
        </div>
        
        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Form method="get" className="flex-1 flex flex-col sm:flex-row gap-4">
              <div className="flex-1 flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="search"
                    name="search"
                    defaultValue={filters.search}
                    placeholder="Buscar por título, marca, modelo..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
                
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-2 rounded-lg border transition-colors ${
                    showFilters ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Filter className="w-5 h-5" />
                </button>
              </div>
              
              {showFilters && (
                <div className="flex flex-wrap gap-3">
                  <select
                    name="brand"
                    defaultValue={filters.brand}
                    className="px-3 py-2 border border-gray-200 rounded-lg"
                  >
                    <option value="">Todas las marcas</option>
                    {brands.map((brand) => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                  
                  <select
                    name="status"
                    defaultValue={filters.status}
                    className="px-3 py-2 border border-gray-200 rounded-lg"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  
                  <select
                    name="sortBy"
                    defaultValue={filters.sortBy}
                    className="px-3 py-2 border border-gray-200 rounded-lg"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  
                  {(filters.search || filters.brand || filters.status !== "" || filters.sortBy !== "recent") && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="flex items-center gap-1 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Limpiar</span>
                    </button>
                  )}
                </div>
              )}
              
              <button
                type="submit"
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Buscar
              </button>
            </Form>
          </div>
        </div>
        
        {/* Listings Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {listings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Listing
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estadísticas
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {listings.map((listing: any) => (
                    <tr key={listing._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 mr-3">
                            {listing.images && listing.images[0] ? (
                              <img
                                className="h-10 w-10 rounded-md object-cover"
                                src={listing.images[0]}
                                alt={listing.title}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center">
                                <Car className="h-5 w-5 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 line-clamp-1 max-w-xs">
                              {listing.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {listing.brand} {listing.model} • {listing.year}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ${listing.price?.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(listing.status)}
                        {listing.isFeatured && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                            Destacado
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {listing.viewsCount || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            ❤️
                            {listing.likesCount || 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(listing.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            to={`/listings/${listing._id}`}
                            className="p-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                            title="Ver"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          
                          <Link
                            to={`/listings/${listing._id}/edit`}
                            className="p-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          
                          <div className="relative">
                            <button
                              onClick={() => setActionListingId(actionListingId === listing._id ? null : listing._id)}
                              className="p-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                              title="Más acciones"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                            
                            {actionListingId === listing._id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                                <div className="py-1">
                                  {listing.status !== "active" && (
                                    <Form method="post" className="block">
                                      <input type="hidden" name="listingId" value={listing._id} />
                                      <input type="hidden" name="intent" value="activate" />
                                      <button
                                        type="submit"
                                        className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                                      >
                                        Activar
                                      </button>
                                    </Form>
                                  )}
                                  
                                  {listing.status !== "inactive" && (
                                    <Form method="post" className="block">
                                      <input type="hidden" name="listingId" value={listing._id} />
                                      <input type="hidden" name="intent" value="deactivate" />
                                      <button
                                        type="submit"
                                        className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                                      >
                                        Desactivar
                                      </button>
                                    </Form>
                                  )}
                                  
                                  {listing.status !== "sold" && (
                                    <Form method="post" className="block">
                                      <input type="hidden" name="listingId" value={listing._id} />
                                      <input type="hidden" name="intent" value="mark-sold" />
                                      <button
                                        type="submit"
                                        className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                                      >
                                        Marcar como vendido
                                      </button>
                                    </Form>
                                  )}
                                  
                                  {listing.status !== "reserved" && (
                                    <Form method="post" className="block">
                                      <input type="hidden" name="listingId" value={listing._id} />
                                      <input type="hidden" name="intent" value="mark-reserved" />
                                      <button
                                        type="submit"
                                        className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                                      >
                                        Marcar como reservado
                                      </button>
                                    </Form>
                                  )}
                                  
                                  <Form method="post" className="block">
                                    <input type="hidden" name="listingId" value={listing._id} />
                                    <input type="hidden" name="intent" value="toggle-featured" />
                                    <button
                                      type="submit"
                                      className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                                    >
                                      {listing.isFeatured ? "Quitar destacado" : "Destacar"}
                                    </button>
                                  </Form>
                                  
                                  <div className="border-t border-gray-100 my-1"></div>
                                  
                                  <Form method="post" className="block" onSubmit={(e) => {
                                    if (!confirm("¿Estás seguro de eliminar este listing? Esta acción no se puede deshacer.")) {
                                      e.preventDefault()
                                    }
                                  }}>
                                    <input type="hidden" name="listingId" value={listing._id} />
                                    <input type="hidden" name="intent" value="delete" />
                                    <button
                                      type="submit"
                                      className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50"
                                    >
                                      Eliminar
                                    </button>
                                  </Form>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-16 text-center">
              <ListFilter className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay listings</h3>
              <p className="mt-1 text-sm text-gray-500">
                No se encontraron listings con los filtros aplicados.
              </p>
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Mostrando <span className="font-medium">{(currentPage - 1) * 15 + 1}</span> a <span className="font-medium">
                      {Math.min(currentPage * 15, totalCount)}
                    </span> de <span className="font-medium">{totalCount}</span> resultados
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <Link
                      to={`?${new URLSearchParams({
                        ...Object.fromEntries(searchParams.entries()),
                        page: (currentPage - 1).toString()
                      })}`}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
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
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Link
                        key={page}
                        to={`?${new URLSearchParams({
                          ...Object.fromEntries(searchParams.entries()),
                          page: page.toString()
                        })}`}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          page === currentPage
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </Link>
                    ))}
                    
                    <Link
                      to={`?${new URLSearchParams({
                        ...Object.fromEntries(searchParams.entries()),
                        page: (currentPage + 1).toString()
                      })}`}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
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
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Loading overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl flex items-center space-x-4">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            <p className="text-lg text-gray-700">Procesando...</p>
          </div>
        </div>
      )}
    </div>
  )
}