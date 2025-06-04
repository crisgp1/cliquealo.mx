import { json, redirect, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node"
import { useLoaderData, Form, useNavigation, Link } from "@remix-run/react"
import { ListingModel } from "~/models/Listing"
import { requireUser } from "~/lib/auth.server"
import { ArrowLeft, Upload, X, Plus } from 'lucide-react'
import { useState } from 'react'

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request)
  
  // Verificar si el usuario puede crear listings (solo admins)
  if (user.role !== 'admin' && user.role !== 'superadmin') {
    throw new Response("No autorizado", { status: 403 })
  }

  return json({ user })
}

export async function action({ request }: ActionFunctionArgs) {
  const user = await requireUser(request)
  
  // Verificar permisos
  if (user.role !== 'admin' && user.role !== 'superadmin') {
    throw new Response("No autorizado", { status: 403 })
  }

  const formData = await request.formData()
  
  try {
    const listingData = {
      user: user._id!,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      brand: formData.get("brand") as string,
      model: formData.get("model") as string,
      year: parseInt(formData.get("year") as string),
      price: parseFloat(formData.get("price") as string),
      images: JSON.parse(formData.get("images") as string || "[]"),
      features: JSON.parse(formData.get("features") as string || "[]"),
      mileage: formData.get("mileage") ? parseInt(formData.get("mileage") as string) : undefined,
      fuelType: formData.get("fuelType") as any,
      transmission: formData.get("transmission") as any,
      bodyType: formData.get("bodyType") as any,
      color: formData.get("color") as string,
      location: {
        city: formData.get("city") as string,
        state: formData.get("state") as string
      },
      contactInfo: {
        phone: formData.get("phone") as string,
        whatsapp: formData.get("whatsapp") as string,
        email: formData.get("email") as string
      }
    }

    console.log("Datos del listing a crear:", listingData)

    // Validaciones básicas
    if (!listingData.title || !listingData.brand || !listingData.model || !listingData.year || !listingData.price) {
      console.log("Validación fallida - campos faltantes")
      return json({ error: "Campos requeridos faltantes" }, { status: 400 })
    }

    console.log("Creando listing...")
    const listing = await ListingModel.create(listingData)
    console.log("Listing creado:", listing)
    
    return redirect(`/listings/${listing._id}`)
    
  } catch (error) {
    console.error("Error creando listing:", error)
    return json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export default function NewListing() {
  const { user } = useLoaderData<typeof loader>()
  const navigation = useNavigation()
  const [images, setImages] = useState<string[]>([])
  const [features, setFeatures] = useState<string[]>([])
  const [newFeature, setNewFeature] = useState("")

  const isSubmitting = navigation.state === "submitting"

  const addImage = () => {
    const url = prompt("URL de la imagen:")
    if (url && url.trim()) {
      setImages([...images, url.trim()])
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures([...features, newFeature.trim()])
      setNewFeature("")
    }
  }

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
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

            <div className="text-sm text-gray-500">
              Crear Nuevo Listing
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">Crear Nuevo Listing</h1>

          <Form method="post" className="space-y-8">
            {/* Información Básica */}
            <div className="border-b border-gray-200 pb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Título *
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Ej: BMW X5 2020 en excelente estado"
                  />
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                    Precio *
                  </label>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="450000"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Describe las características principales del vehículo..."
                  />
                </div>
              </div>
            </div>

            {/* Información del Vehículo */}
            <div className="border-b border-gray-200 pb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Información del Vehículo</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-2">
                    Marca *
                  </label>
                  <input
                    type="text"
                    name="brand"
                    id="brand"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="BMW"
                  />
                </div>

                <div>
                  <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
                    Modelo *
                  </label>
                  <input
                    type="text"
                    name="model"
                    id="model"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="X5"
                  />
                </div>

                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                    Año *
                  </label>
                  <input
                    type="number"
                    name="year"
                    id="year"
                    required
                    min="1900"
                    max="2030"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="2020"
                  />
                </div>

                <div>
                  <label htmlFor="mileage" className="block text-sm font-medium text-gray-700 mb-2">
                    Kilometraje
                  </label>
                  <input
                    type="number"
                    name="mileage"
                    id="mileage"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="50000"
                  />
                </div>

                <div>
                  <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <input
                    type="text"
                    name="color"
                    id="color"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Negro"
                  />
                </div>

                <div>
                  <label htmlFor="fuelType" className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Combustible
                  </label>
                  <select
                    name="fuelType"
                    id="fuelType"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="">Seleccionar</option>
                    <option value="gasolina">Gasolina</option>
                    <option value="diesel">Diesel</option>
                    <option value="hibrido">Híbrido</option>
                    <option value="electrico">Eléctrico</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="transmission" className="block text-sm font-medium text-gray-700 mb-2">
                    Transmisión
                  </label>
                  <select
                    name="transmission"
                    id="transmission"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="">Seleccionar</option>
                    <option value="manual">Manual</option>
                    <option value="automatico">Automático</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="bodyType" className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Carrocería
                  </label>
                  <select
                    name="bodyType"
                    id="bodyType"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="">Seleccionar</option>
                    <option value="sedan">Sedán</option>
                    <option value="suv">SUV</option>
                    <option value="hatchback">Hatchback</option>
                    <option value="pickup">Pickup</option>
                    <option value="coupe">Coupé</option>
                    <option value="convertible">Convertible</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Ubicación */}
            <div className="border-b border-gray-200 pb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Ubicación</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    name="city"
                    id="city"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Ciudad de México"
                  />
                </div>

                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <input
                    type="text"
                    name="state"
                    id="state"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="CDMX"
                  />
                </div>
              </div>
            </div>

            {/* Información de Contacto */}
            <div className="border-b border-gray-200 pb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Información de Contacto</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="55 1234 5678"
                  />
                </div>

                <div>
                  <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    name="whatsapp"
                    id="whatsapp"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="55 1234 5678"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="contacto@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Imágenes */}
            <div className="border-b border-gray-200 pb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Imágenes</h2>
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={addImage}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span>Agregar URL de Imagen</span>
                </button>

                {images.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Imagen ${index + 1}`}
                          className="w-full h-32 object-cover rounded-md border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <input type="hidden" name="images" value={JSON.stringify(images)} />
            </div>

            {/* Características */}
            <div className="pb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Características Especiales</h2>
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Ej: Aire acondicionado, GPS, Cámara de reversa"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {features.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {features.map((feature, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center space-x-2 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                      >
                        <span>{feature}</span>
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="text-gray-500 hover:text-red-500 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <input type="hidden" name="features" value={JSON.stringify(features)} />
            </div>

            {/* Submit Button */}
            <div className="pt-8 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white py-3 px-6 rounded-md font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? "Creando Listing..." : "Crear Listing"}
              </button>
            </div>
          </Form>
        </div>
      </main>
    </div>
  )
}