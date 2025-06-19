import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node"
import { Form, useActionData, Link, useNavigation, useLoaderData, useSubmit } from "@remix-run/react"
import { ListingModel } from "~/models/Listing.server"
import { requireAdmin } from "~/lib/auth.server"
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { 
  ArrowLeft, 
  Camera, 
  Plus, 
  X,
  Car,
  DollarSign,
  Calendar,
  Save,
  Eye,
  Phone,
  Mail,
  MessageCircle,
  FileText,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Edit3,
  Home
} from 'lucide-react'
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  Chip,
  Progress,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Breadcrumbs,
  BreadcrumbItem,
  Divider,
  Spacer,
  Avatar,
  Badge
} from "@heroui/react"
import { AnimationProvider } from "~/components/AnimationProvider"
import { toast } from "~/components/ui/toast"

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
  
  // Verificar que el usuario sea el dueño del listing O sea admin/superadmin
  const isOwner = await ListingModel.isOwner(listingId, user._id!.toString())
  const isAdminOrSuperAdmin = user.role === 'admin' || user.role === 'superadmin'
  
  if (!isOwner && !isAdminOrSuperAdmin) {
    throw new Response("No autorizado", { status: 403 })
  }
  
  return json({ listing, user })
}

export async function action({ params, request }: ActionFunctionArgs) {
  const user = await requireAdmin(request)
  const listingId = params.id
  
  if (!listingId) {
    throw new Response("Not Found", { status: 404 })
  }
  
  // Verificar que el usuario sea el dueño del listing O sea admin/superadmin
  const isOwner = await ListingModel.isOwner(listingId, user._id!.toString())
  const isAdminOrSuperAdmin = user.role === 'admin' || user.role === 'superadmin'
  
  if (!isOwner && !isAdminOrSuperAdmin) {
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
  const contactPhone = formData.get("contactPhone") as string
  const contactEmail = formData.get("contactEmail") as string
  const contactWhatsapp = formData.get("contactWhatsapp") as string
  
  // Validaciones
  if (!title || !brand || !model || !year || !price || !contactPhone || !contactEmail || !contactWhatsapp) {
    return json({ error: "Título, marca, modelo, año, precio y información de contacto son requeridos" }, { status: 400 })
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
      images: imageUrls,
      contactInfo: {
        phone: contactPhone.trim(),
        email: contactEmail.trim(),
        whatsapp: contactWhatsapp.trim()
      }
    })
    
    if (!success) {
      return json({ error: "Error al actualizar la publicación" }, { status: 500 })
    }
    
    return json({ 
      success: true, 
      message: "¡Listing actualizado exitosamente!",
      listingId 
    })
  } catch (error) {
    console.error(error)
    return json({ error: "Error al actualizar la publicación" }, { status: 500 })
  }
}

export default function EditListing() {
  const { listing, user } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()
  const submit = useSubmit()
  const { isOpen, onOpen, onClose } = useDisclosure()
  
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [imageInput, setImageInput] = useState("")
  const [formProgress, setFormProgress] = useState(0)
  
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

  // Manejar respuesta del action
  useEffect(() => {
    if (actionData) {
      if ('success' in actionData && actionData.success) {
        onOpen()
        toast.success("¡Listing actualizado exitosamente!")
      } else if ('error' in actionData) {
        toast.error(actionData.error || "Error al actualizar")
      }
    }
  }, [actionData, onOpen])

  // Calcular progreso del formulario
  useEffect(() => {
    const fields = [
      listing.title,
      listing.brand,
      listing.model,
      listing.year,
      listing.price,
      listing.contactInfo?.phone,
      listing.contactInfo?.email,
      listing.contactInfo?.whatsapp
    ]
    const filledFields = fields.filter(field => field && field.toString().trim()).length
    setFormProgress((filledFields / fields.length) * 100)
  }, [listing])

  const addImageUrl = () => {
    if (imageInput.trim() && !imageUrls.includes(imageInput.trim())) {
      setImageUrls([...imageUrls, imageInput.trim()])
      setImageInput("")
      toast.success("Imagen agregada")
    }
  }

  const removeImageUrl = (index: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index))
    toast.success("Imagen eliminada")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addImageUrl()
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.set('images', imageUrls.join(','))
    submit(formData, { method: 'post' })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <AnimationProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Enhanced Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm sticky top-0 z-40"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Breadcrumbs */}
              <Breadcrumbs 
                size="lg"
                classNames={{
                  list: "gap-2",
                }}
              >
                <BreadcrumbItem 
                  href="/"
                  startContent={<Home className="w-4 h-4" />}
                >
                  Inicio
                </BreadcrumbItem>
                <BreadcrumbItem href={`/listings/${listing._id}`}>
                  Listing
                </BreadcrumbItem>
                <BreadcrumbItem>
                  Editar
                </BreadcrumbItem>
              </Breadcrumbs>

              {/* User info */}
              <div className="flex items-center space-x-3">
                <Chip 
                  color={user.role === "admin" ? "primary" : "secondary"}
                  variant="flat"
                  size="sm"
                  startContent={<Edit3 className="w-3 h-3" />}
                >
                  Editando
                </Chip>
                <Avatar
                  size="sm"
                  name={user.name}
                  classNames={{
                    base: "bg-gradient-to-br from-blue-500 to-purple-500",
                    name: "text-white font-medium"
                  }}
                />
              </div>
            </div>
          </div>
        </motion.header>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl shadow-xl">
                  <Edit3 className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Editar Vehículo
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
              Actualiza la información de tu anuncio para atraer más compradores
            </p>

            {/* Progress Bar */}
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Completado</span>
                <span>{Math.round(formProgress)}%</span>
              </div>
              <Progress 
                value={formProgress} 
                color="primary"
                className="mb-4"
                classNames={{
                  track: "drop-shadow-md border border-default",
                  indicator: "bg-gradient-to-r from-blue-500 to-purple-500",
                  label: "tracking-wider font-medium text-default-600",
                  value: "text-foreground/60"
                }}
              />
            </div>
          </motion.div>

          {/* Error Message */}
          <AnimatePresence>
            {actionData && 'error' in actionData && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mb-6"
              >
                <Card className="bg-danger-50 border-danger-200">
                  <CardBody className="flex flex-row items-center gap-3 p-4">
                    <AlertCircle className="w-5 h-5 text-danger-600 flex-shrink-0" />
                    <p className="text-danger-700 font-medium">{actionData.error}</p>
                  </CardBody>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Form */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Form method="post" onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information Card */}
              <motion.div variants={itemVariants}>
                <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Car className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">Información Básica</h2>
                        <p className="text-sm text-gray-600">Detalles principales del vehículo</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody className="space-y-6">
                    {/* Título */}
                    <Input
                      name="title"
                      label="Título del anuncio"
                      placeholder="ej: Nissan Sentra 2020 Automático Excelente Estado"
                      defaultValue={listing.title}
                      isRequired
                      maxLength={100}
                      variant="bordered"
                      size="lg"
                      startContent={<FileText className="w-4 h-4 text-gray-400" />}
                      description="Incluye marca, modelo, año y características principales"
                      classNames={{
                        input: "text-lg",
                        inputWrapper: "border-gray-200 hover:border-blue-400 focus-within:border-blue-500"
                      }}
                    />

                    {/* Marca y Modelo */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Select
                        name="brand"
                        label="Marca"
                        placeholder="Seleccionar marca"
                        defaultSelectedKeys={[listing.brand]}
                        isRequired
                        variant="bordered"
                        size="lg"
                        startContent={<Car className="w-4 h-4 text-gray-400" />}
                        classNames={{
                          trigger: "border-gray-200 hover:border-blue-400 focus-within:border-blue-500"
                        }}
                      >
                        {popularBrands.map(brand => (
                          <SelectItem key={brand}>
                            {brand}
                          </SelectItem>
                        ))}
                      </Select>

                      <Input
                        name="model"
                        label="Modelo"
                        placeholder="ej: Sentra, Civic, Corolla"
                        defaultValue={listing.model}
                        isRequired
                        maxLength={50}
                        variant="bordered"
                        size="lg"
                        classNames={{
                          inputWrapper: "border-gray-200 hover:border-blue-400 focus-within:border-blue-500"
                        }}
                      />
                    </div>

                    {/* Año y Precio */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Select
                        name="year"
                        label="Año"
                        placeholder="Seleccionar año"
                        defaultSelectedKeys={[listing.year.toString()]}
                        isRequired
                        variant="bordered"
                        size="lg"
                        startContent={<Calendar className="w-4 h-4 text-gray-400" />}
                        classNames={{
                          trigger: "border-gray-200 hover:border-blue-400 focus-within:border-blue-500"
                        }}
                      >
                        {years.map(year => (
                          <SelectItem key={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </Select>

                      <Input
                        name="price"
                        type="number"
                        label="Precio (MXN)"
                        placeholder="250000"
                        defaultValue={listing.price.toString()}
                        isRequired
                        min="1000"
                        max="5000000"
                        step="1000"
                        variant="bordered"
                        size="lg"
                        startContent={<DollarSign className="w-4 h-4 text-gray-400" />}
                        description="Precio sin comas ni símbolos"
                        classNames={{
                          inputWrapper: "border-gray-200 hover:border-blue-400 focus-within:border-blue-500"
                        }}
                      />
                    </div>
                  </CardBody>
                </Card>
              </motion.div>

              {/* Description Card */}
              <motion.div variants={itemVariants}>
                <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <FileText className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">Descripción</h2>
                        <p className="text-sm text-gray-600">Describe las características del vehículo</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <Textarea
                      name="description"
                      placeholder="Describe las características, estado, historia del mantenimiento, extras incluidos, razón de venta, etc."
                      defaultValue={listing.description || ""}
                      maxLength={1000}
                      variant="bordered"
                      size="lg"
                      minRows={6}
                      description="Una buena descripción ayuda a vender más rápido"
                      classNames={{
                        inputWrapper: "border-gray-200 hover:border-green-400 focus-within:border-green-500"
                      }}
                    />
                  </CardBody>
                </Card>
              </motion.div>

              {/* Contact Information Card */}
              <motion.div variants={itemVariants}>
                <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Phone className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">Información de Contacto</h2>
                        <p className="text-sm text-gray-600">Datos para que los compradores te contacten</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        name="contactPhone"
                        type="tel"
                        label="Teléfono"
                        placeholder="ej: 5512345678"
                        defaultValue={listing.contactInfo?.phone || ""}
                        isRequired
                        variant="bordered"
                        size="lg"
                        startContent={<Phone className="w-4 h-4 text-gray-400" />}
                        classNames={{
                          inputWrapper: "border-gray-200 hover:border-purple-400 focus-within:border-purple-500"
                        }}
                      />

                      <Input
                        name="contactEmail"
                        type="email"
                        label="Email"
                        placeholder="ej: vendedor@email.com"
                        defaultValue={listing.contactInfo?.email || ""}
                        isRequired
                        variant="bordered"
                        size="lg"
                        startContent={<Mail className="w-4 h-4 text-gray-400" />}
                        classNames={{
                          inputWrapper: "border-gray-200 hover:border-purple-400 focus-within:border-purple-500"
                        }}
                      />
                    </div>

                    <Input
                      name="contactWhatsapp"
                      type="tel"
                      label="WhatsApp"
                      placeholder="ej: 5512345678"
                      defaultValue={listing.contactInfo?.whatsapp || ""}
                      isRequired
                      variant="bordered"
                      size="lg"
                      startContent={<MessageCircle className="w-4 h-4 text-gray-400" />}
                      description="Número de WhatsApp para contacto directo con compradores"
                      classNames={{
                        inputWrapper: "border-gray-200 hover:border-purple-400 focus-within:border-purple-500"
                      }}
                    />
                  </CardBody>
                </Card>
              </motion.div>

              {/* Images Card */}
              <motion.div variants={itemVariants}>
                <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Camera className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">Fotografías</h2>
                        <p className="text-sm text-gray-600">Las fotos aumentan las posibilidades de venta hasta en 5x</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody className="space-y-6">
                    {/* Add Image Input */}
                    <div className="flex gap-3">
                      <Input
                        type="url"
                        placeholder="https://ejemplo.com/foto-del-auto.jpg"
                        value={imageInput}
                        onChange={(e) => setImageInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        variant="bordered"
                        size="lg"
                        startContent={<ImageIcon className="w-4 h-4 text-gray-400" />}
                        classNames={{
                          inputWrapper: "border-gray-200 hover:border-orange-400 focus-within:border-orange-500"
                        }}
                      />
                      <Button
                        type="button"
                        onClick={addImageUrl}
                        color="primary"
                        variant="solid"
                        size="lg"
                        isIconOnly
                        className="bg-gradient-to-r from-orange-500 to-red-500"
                      >
                        <Plus className="w-5 h-5" />
                      </Button>
                    </div>

                    {/* Image Gallery */}
                    <AnimatePresence>
                      {imageUrls.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                        >
                          {imageUrls.map((url, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="relative group"
                            >
                              <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200 hover:border-orange-300 transition-colors">
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
                              <Button
                                type="button"
                                onClick={() => removeImageUrl(index)}
                                isIconOnly
                                size="sm"
                                color="danger"
                                variant="solid"
                                className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                              <Badge
                                color="primary"
                                className="absolute top-2 left-2"
                              >
                                {index + 1}
                              </Badge>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <input type="hidden" name="images" value={imageUrls.join(',')} />
                  </CardBody>
                </Card>
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={itemVariants} className="pt-4">
                <Card className="shadow-xl border-0 bg-gradient-to-r from-blue-500 to-purple-600">
                  <CardBody className="p-6">
                    <Button
                      type="submit"
                      size="lg"
                      isLoading={isSubmitting}
                      className="w-full bg-white text-gray-900 font-semibold text-lg hover:bg-gray-50 transition-colors"
                      startContent={!isSubmitting && <Save className="w-5 h-5" />}
                    >
                      {isSubmitting ? "Guardando cambios..." : "Guardar cambios"}
                    </Button>
                  </CardBody>
                </Card>
              </motion.div>
            </Form>
          </motion.div>

          {/* Tips Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12"
          >
            <Card className="shadow-lg border-0 bg-gradient-to-br from-gray-50 to-blue-50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Consejos para una mejor venta
                  </h3>
                </div>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Incluye fotos desde diferentes ángulos (exterior, interior, motor)",
                    "Menciona el kilometraje y historial de mantenimiento",
                    "Sé honesto sobre el estado del vehículo",
                    "Indica si tiene algún detalle o reparación necesaria",
                    "Responde rápido a los mensajes de compradores interesados",
                    "Actualiza el precio si no recibes contactos en una semana"
                  ].map((tip, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-700">{tip}</p>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </main>

        {/* Success Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="lg" placement="center">
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">¡Actualización Exitosa!</h3>
                  <p className="text-sm text-gray-600">Tu listing ha sido actualizado correctamente</p>
                </div>
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-green-800 font-medium">
                    Los cambios se han guardado exitosamente. Tu anuncio actualizado ya está disponible para los compradores.
                  </p>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-700">Ver listing actualizado</span>
                  </div>
                  <Button
                    as={Link}
                    to={`/listings/${listing._id}`}
                    color="primary"
                    variant="flat"
                    size="sm"
                  >
                    Ver ahora
                  </Button>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onClose} className="w-full">
                Continuar editando
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </AnimationProvider>
  )
}