import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node"
import { Form, useActionData, Link, useNavigation, useLoaderData } from "@remix-run/react"
import { ListingModel } from "~/models/Listing"
import { requireAdmin } from "~/lib/auth.server"
import { 
  ArrowLeft, 
  Camera, 
  Plus, 
  X,
  Loader2,
  Car,
  DollarSign,
  Calendar,
  Hash
} from 'lucide-react'
import { useState, useEffect } from 'react'

export async function loader({ params, request }: LoaderFunctionArgs) {
  const user = await requireAdmin(request)
  
  const listingId = params.id
  if (!listingId) {
    throw new Response("Not Found", { status: 404 })
  }
  
  const listing = await ListingModel.findById(listingId)
  if (!listing) {
    throw new Response("Listing no encontrado", { status: 404 })
  }
  
  // Verificar que el usuario sea el dueño del listing
  const isOwner = await ListingModel.isOwner(listingId, user._id!.toString())
  if (!isOwner) {
    throw new Response("No autorizado", { status: 403 })
  }
  
  return json({ listing })
}

export async function action({ params, request }: ActionFunctionArgs) {
  const user = await requireAdmin(request)
  const listingId = params.id
  
  if (!listingId) {
    throw new Response("Not Found", { status: 404 })
  }
  
  // Verificar que el usuario sea el dueño del listing
  const isOwner = await ListingModel.isOwner(listingId, user._id!.toString())
  if (!isOwner) {
    throw new Response("No autorizado", { status: 403 })
  }
  
  const formData = await request.formData()
  
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const brand = formData.get("brand") as string
  const model = formData.get("model") as string
  const year = parseInt(formData.get("year") as string)
  const price = parseFloat(formData.get("price") as string)
  const images = formData.get("images") as string
  
  // Validaciones
  if (!title || !brand || !model || !year || !price) {
    return json({ error: "Título, marca, modelo, año y precio son requeridos" }, { status: 400 })
  }
  
  if (title.length < 5) {
    return json({ error: "El título debe tener al menos 5 caracteres" }, { status: 400 })
  }
  
  if (year < 1980 || year > new Date().getFullYear() + 1) {
    return json({ error: "Año inválido" }, { status: 400 })
  }
  
  if (price < 1000) {
    return json({ error: "El precio debe ser mayor a $1,000" }, { status: 400 })
  }
  
  if (price > 5000000) {
    return json({ error: "El precio debe ser menor a $5,000,000" }, { status: 400 })
  }
  
  try {
    const imageUrls = images 
      ? images.split(',').map(url => url.trim()).filter(Boolean)
      : []
    
    const success = await ListingModel.update(listingId, {
      title: title.trim(),
      description: description?.trim() || "",
      brand: brand.trim(),
      model: model.trim(),
      year,
      price,
      images: imageUrls
    })
    
    if (!success) {
      return json({ error: "Error al actualizar la publicación" }, { status: 500 })
    }
    
    return redirect(`/listings/${listingId}`)
  } catch (error) {
    console.error(error)
    return json({ error: "Error al actualizar la publicación" }, { status: 500 })
  }
}

export default function EditListing() {
  const { listing } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [imageInput, setImageInput] = useState("")
  
  const isSubmitting = navigation.state === "submitting"
  
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 1979 }, (_, i) => currentYear - i)
  
  const popularBrands = [
    'Nissan', 'Volkswagen', 'Chevrolet', 'Ford', 'Toyota', 'Honda', 
    'Hyundai', 'Kia', 'Mazda', 'Suzuki', 'BMW', 'Mercedes-Benz', 
    'Audi', 'SEAT', 'Renault', 'Peugeot', 'Mitsubishi', 'Jeep'
  ]

  // Inicializar los campos con los valores actuales del listing
  useEffect(() => {
    if (listing.images && listing.images.length > 0) {
      setImageUrls(listing.images)
    }
  }, [listing])

  const addImageUrl = () => {
    if (imageInput.trim() && !imageUrls.includes(imageInput.trim())) {
      setImageUrls([...imageUrls, imageInput.trim()])
      setImageInput("")
    }
  }

  const removeImageUrl = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addImageUrl()
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              to={`/listings/${listing._id}`}
              className="flex items-center space-x-3 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Volver al Listing</span>
            </Link>

            <Link to="/" className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-black rounded-full"></div>
              <span className="text-lg font-light tracking-tight text-gray-900">
                Cliquealo
              </span>
            </Link>

            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-gray-900 mb-4 tracking-tight">
            Editar Auto
          </h1>
          <p className="text-lg text-gray-600">
            Actualiza la información de tu anuncio
          </p>
        </div>

        <Form method="post" className="space-y-8">
          {/* Título */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Título del anuncio *
            </label>
            <input
              type="text"
              name="title"
              required
              maxLength={100}
              defaultValue={listing.title}
              placeholder="ej: Nissan Sentra 2020 Automático Excelente Estado"
              className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-lg"
            />
            <p className="text-sm text-gray-500">
              Incluye marca, modelo, año y características principales
            </p>
          </div>

          {/* Marca y Modelo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <Car className="w-4 h-4 inline mr-2" />
                Marca *
              </label>
              <select
                name="brand"
                required
                defaultValue={listing.brand}
                className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              >
                <option value="">Seleccionar marca</option>
                {popularBrands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
                <option value="Otra">Otra marca</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Modelo *
              </label>
              <input
                type="text"
                name="model"
                required
                maxLength={50}
                defaultValue={listing.model}
                placeholder="ej: Sentra, Civic, Corolla"
                className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Año y Precio */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <Calendar className="w-4 h-4 inline mr-2" />
                Año *
              </label>
              <select
                name="year"
                required
                defaultValue={listing.year}
                className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              >
                <option value="">Seleccionar año</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <DollarSign className="w-4 h-4 inline mr-2" />
                Precio (MXN) *
              </label>
              <input
                type="number"
                name="price"
                required
                min="1000"
                max="5000000"
                step="1000"
                defaultValue={listing.price}
                placeholder="250000"
                className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              />
              <p className="text-sm text-gray-500">
                Precio sin comas ni símbolos
              </p>
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              name="description"
              rows={6}
              maxLength={1000}
              defaultValue={listing.description || ""}
              placeholder="Describe las características, estado, historia del mantenimiento, extras incluidos, razón de venta, etc."
              className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all resize-none"
            />
            <p className="text-sm text-gray-500">
              Una buena descripción ayuda a vender más rápido
            </p>
          </div>

          {/* Imágenes */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              <Camera className="w-4 h-4 inline mr-2" />
              Fotografías
            </label>
            
            <div className="space-y-3">
              <div className="flex space-x-2">
                <input
                  type="url"
                  value={imageInput}
                  onChange={(e) => setImageInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="https://ejemplo.com/foto-del-auto.jpg"
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={addImageUrl}
                  className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {imageUrls.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
                        <img
                          src={url}
                          alt={`Foto ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            e.currentTarget.nextElementSibling?.classList.remove('hidden')
                          }}
                        />
                        <div className="hidden w-full h-full flex items-center justify-center text-gray-400">
                          <Camera className="w-8 h-8" />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImageUrl(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <input
                type="hidden"
                name="images"
                value={imageUrls.join(',')}
              />

              <p className="text-sm text-gray-500">
                Las fotos aumentan las posibilidades de venta hasta en 5x
              </p>
            </div>
          </div>

          {/* Error Message */}
          {actionData?.error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600">{actionData.error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gray-900 text-white py-4 rounded-xl hover:bg-gray-800 transition-colors font-medium text-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <span>Guardar cambios</span>
                    <Hash className="w-5 h-5" />
                  </>
                )}
              </button>
          </div>
        </Form>

        {/* Tips */}
        <div className="mt-12 p-6 bg-gray-50 rounded-2xl">
          <h3 className="font-medium text-gray-900 mb-4">
            Consejos para una mejor venta
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Incluye fotos desde diferentes ángulos (exterior, interior, motor)</li>
            <li>• Menciona el kilometraje y historial de mantenimiento</li>
            <li>• Sé honesto sobre el estado del vehículo</li>
            <li>• Indica si tiene algún detalle o reparación necesaria</li>
            <li>• Responde rápido a los mensajes de compradores interesados</li>
          </ul>
        </div>
      </div>
    </div>
  )
}