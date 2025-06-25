import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node"
import { Form, Link, useLoaderData, useNavigation, useActionData } from "@remix-run/react"
import { requireSuperAdmin } from "~/lib/auth.server"
import { UserModel } from "~/models/User.server"
import { ListingModel } from "~/models/Listing.server"
import {
  ArrowLeftIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  CheckCircleIcon,
  XCircleIcon,
  Cog6ToothIcon,
  EyeIcon,
  HeartIcon,
  ExclamationTriangleIcon,
  PencilIcon,
  TrashIcon,
  KeyIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import {
  UserIcon as UserIconSolid,
  ShieldCheckIcon as ShieldCheckIconSolid,
  ShieldExclamationIcon as ShieldExclamationIconSolid
} from '@heroicons/react/24/solid'
import { Car } from 'lucide-react'
import { useState } from 'react'
import { TicketCatalog } from "~/components/ui/ticket-catalog"

export async function loader({ request, params }: LoaderFunctionArgs) {
  await requireSuperAdmin(request)
  
  const userId = params.id
  if (!userId) {
    throw new Response("Usuario no encontrado", { status: 404 })
  }
  
  const user = await UserModel.findByIdForAdmin(userId)
  if (!user) {
    throw new Response("Usuario no encontrado", { status: 404 })
  }
  
  // Get user's listings (todos los status para ver el historial completo del usuario)
  const userListings = await ListingModel.findMany({
    userId: userId,
    limit: 10
  })
  
  // Get user's liked listings
  const likedListings = await UserModel.getLikedListings(userId, 10)
  
  return json({ 
    user, 
    userListings,
    likedListings
  })
}

export async function action({ request, params }: ActionFunctionArgs) {
  await requireSuperAdmin(request)
  
  const userId = params.id
  if (!userId) {
    return json({ error: "ID del usuario es requerido" }, { status: 400 })
  }
  
  const formData = await request.formData()
  const intent = formData.get("intent") as string
  
  try {
    switch (intent) {
      case "promote-to-admin": {
        const success = await UserModel.promoteToAdmin(userId)
        if (!success) {
          return json({ error: "Error al promover usuario" }, { status: 500 })
        }
        return json({ success: true, message: "Usuario promovido a administrador exitosamente" })
      }
      
      case "demote-to-user": {
        const success = await UserModel.demoteToUser(userId)
        if (!success) {
          return json({ error: "Error al degradar usuario" }, { status: 500 })
        }
        return json({ success: true, message: "Usuario degradado a usuario normal exitosamente" })
      }
      
      case "deactivate": {
        const success = await UserModel.deactivateUser(userId)
        if (!success) {
          return json({ error: "Error al desactivar usuario" }, { status: 500 })
        }
        return json({ success: true, message: "Usuario desactivado exitosamente" })
      }
      
      case "reactivate": {
        const success = await UserModel.reactivateUser(userId)
        if (!success) {
          return json({ error: "Error al reactivar usuario" }, { status: 500 })
        }
        return json({ success: true, message: "Usuario reactivado exitosamente" })
      }
      
      case "update-profile": {
        const name = formData.get("name") as string
        const phone = formData.get("phone") as string
        
        if (!name || name.trim().length < 2) {
          return json({ error: "El nombre debe tener al menos 2 caracteres" }, { status: 400 })
        }
        
        if (!phone || phone.trim().length < 10) {
          return json({ error: "El teléfono debe tener al menos 10 dígitos" }, { status: 400 })
        }
        
        const success = await UserModel.updateProfile(userId, {
          name: name.trim(),
          phone: phone.trim()
        })
        
        if (!success) {
          return json({ error: "Error al actualizar el perfil del usuario" }, { status: 500 })
        }
        
        return json({ success: true, message: "Perfil del usuario actualizado exitosamente" })
      }
      
      case "reset-password": {
        const newPassword = formData.get("newPassword") as string
        
        if (!newPassword || newPassword.length < 6) {
          return json({ error: "La nueva contraseña debe tener al menos 6 caracteres" }, { status: 400 })
        }
        
        const success = await UserModel.changePassword(userId, newPassword)
        if (!success) {
          return json({ error: "Error al cambiar la contraseña del usuario" }, { status: 500 })
        }
        
        return json({ success: true, message: "Contraseña del usuario cambiada exitosamente" })
      }
      
      default:
        return json({ error: "Acción no válida" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error en action:", error)
    return json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export default function AdminUserDetail() {
  const { user, userListings, likedListings } = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()
  const [showConfirmDialog, setShowConfirmDialog] = useState<string | null>(null)
  
  const isSubmitting = navigation.state === "submitting"
  
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'superadmin':
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium bg-purple-100 text-purple-800 rounded-full">
            <ShieldCheckIconSolid className="w-4 h-4" />
            Super Administrador
          </span>
        )
      case 'admin':
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
            <ShieldExclamationIconSolid className="w-4 h-4" />
            Administrador
          </span>
        )
      case 'user':
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded-full">
            <UserIconSolid className="w-4 h-4" />
            Usuario
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded-full">
            <UserIconSolid className="w-4 h-4" />
            Desconocido
          </span>
        )
    }
  }
  
  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium bg-green-100 text-green-800 rounded-full">
        <CheckCircleIcon className="w-4 h-4" />
        Activo
      </span>
    ) : (
      <span className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium bg-red-100 text-red-800 rounded-full">
        <XCircleIcon className="w-4 h-4" />
        Inactivo
      </span>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/admin/users"
              className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-light text-gray-900">
                Detalles del Usuario
              </h1>
              <p className="text-gray-600">
                Gestiona los privilegios y estado del usuario
              </p>
            </div>
          </div>
          <div>
            <TicketCatalog />
          </div>
        </div>
        
        {/* Success/Error Messages */}
        {actionData && 'success' in actionData && actionData.success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5 text-green-600" />
              <p className="text-green-800">{actionData.message}</p>
            </div>
          </div>
        )}
        
        {actionData && 'error' in actionData && actionData.error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
              <p className="text-red-800">{actionData.error}</p>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="text-center mb-6">
                <div className="mx-auto h-24 w-24 mb-4">
                  {user.avatar ? (
                    <img
                      className="h-24 w-24 rounded-full object-cover mx-auto"
                      src={user.avatar}
                      alt={user.name}
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
                      <UserIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-medium text-gray-900 mb-2">{user.name}</h2>
                <p className="text-gray-500 mb-4">@{user.username}</p>
                <div className="flex flex-col gap-2 items-center">
                  {getRoleBadge(user.role)}
                  {getStatusBadge(user.isActive)}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900">{user.email}</span>
                </div>
                
                {user.phone && (
                  <div className="flex items-center gap-3 text-sm">
                    <PhoneIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">{user.phone}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-3 text-sm">
                  <CalendarIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900">
                    Registrado el {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                {user.lastLogin && (
                  <div className="flex items-center gap-3 text-sm">
                    <EyeIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-900">
                      Último acceso: {new Date(user.lastLogin).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Privilege Management */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Cog6ToothIcon className="w-5 h-5" />
                Gestión de Privilegios
              </h3>
              
              <div className="space-y-3">
                {user.role === "user" && (
                  <Form method="post">
                    <input type="hidden" name="intent" value="promote-to-admin" />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      onClick={(e) => {
                        if (!confirm("¿Estás seguro de promover este usuario a administrador?")) {
                          e.preventDefault()
                        }
                      }}
                    >
                      <ShieldExclamationIcon className="w-4 h-4" />
                      Promover a Administrador
                    </button>
                  </Form>
                )}
                
                {user.role === "admin" && (
                  <Form method="post">
                    <input type="hidden" name="intent" value="demote-to-user" />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                      onClick={(e) => {
                        if (!confirm("¿Estás seguro de degradar este administrador a usuario normal?")) {
                          e.preventDefault()
                        }
                      }}
                    >
                      <UserIcon className="w-4 h-4" />
                      Degradar a Usuario
                    </button>
                  </Form>
                )}
                
                <div className="border-t border-gray-200 pt-3">
                  {user.isActive ? (
                    <Form method="post">
                      <input type="hidden" name="intent" value="deactivate" />
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                        onClick={(e) => {
                          if (!confirm("¿Estás seguro de desactivar este usuario? No podrá acceder a la plataforma.")) {
                            e.preventDefault()
                          }
                        }}
                      >
                        <XCircleIcon className="w-4 h-4" />
                        Desactivar Usuario
                      </button>
                    </Form>
                  ) : (
                    <Form method="post">
                      <input type="hidden" name="intent" value="reactivate" />
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                      >
                        <CheckCircleIcon className="w-4 h-4" />
                        Reactivar Usuario
                      </button>
                    </Form>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* User Management Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Edit User Profile */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <PencilIcon className="w-5 h-5" />
                Editar Información del Usuario
              </h3>
              
              <Form method="post" className="space-y-4">
                <input type="hidden" name="intent" value="update-profile" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      defaultValue={user.name}
                      required
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nombre completo del usuario"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      defaultValue={user.phone || ""}
                      required
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Número de teléfono"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email (No editable)
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <PencilIcon className="w-4 h-4" />
                  {isSubmitting ? 'Guardando...' : 'Actualizar Información'}
                </button>
              </Form>
            </div>
            
            {/* Reset Password */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <KeyIcon className="w-5 h-5" />
                Restablecer Contraseña
              </h3>
              
              <Form method="post" className="space-y-4">
                <input type="hidden" name="intent" value="reset-password" />
                
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Nueva Contraseña
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    required
                    minLength={6}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nueva contraseña (mínimo 6 caracteres)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    El usuario deberá usar esta nueva contraseña para acceder
                  </p>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  onClick={(e) => {
                    if (!confirm("¿Estás seguro de cambiar la contraseña de este usuario?")) {
                      e.preventDefault()
                    }
                  }}
                >
                  <KeyIcon className="w-4 h-4" />
                  {isSubmitting ? 'Cambiando...' : 'Restablecer Contraseña'}
                </button>
              </Form>
            </div>

            {/* User Activity */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Car className="w-5 h-5" />
                Listings del Usuario ({userListings.length})
              </h3>
              
              {userListings.length > 0 ? (
                <div className="space-y-3">
                  {userListings.map((listing: any) => (
                    <div key={listing._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        {listing.images && listing.images[0] ? (
                          <img
                            className="h-12 w-12 rounded-md object-cover"
                            src={listing.images[0]}
                            alt={listing.title}
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-md bg-gray-100 flex items-center justify-center">
                            <Car className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{listing.title}</p>
                          <p className="text-sm text-gray-500">
                            ${listing.price?.toLocaleString()} • {listing.brand} {listing.model}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          listing.status === 'active' ? 'bg-green-100 text-green-800' :
                          listing.status === 'sold' ? 'bg-blue-100 text-blue-800' :
                          listing.status === 'reserved' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {listing.status}
                        </span>
                        <Link
                          to={`/listings/${listing._id}`}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Car className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    Este usuario no ha creado ningún listing
                  </p>
                </div>
              )}
            </div>
            
            {/* Liked Listings */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <HeartIcon className="w-5 h-5" />
                Listings que le Gustan ({likedListings.length})
              </h3>
              
              {likedListings.length > 0 ? (
                <div className="space-y-3">
                  {likedListings.map((listing: any) => (
                    <div key={listing._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        {listing.images && listing.images[0] ? (
                          <img
                            className="h-12 w-12 rounded-md object-cover"
                            src={listing.images[0]}
                            alt={listing.title}
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-md bg-gray-100 flex items-center justify-center">
                            <Car className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{listing.title}</p>
                          <p className="text-sm text-gray-500">
                            ${listing.price?.toLocaleString()} • {listing.brand} {listing.model}
                          </p>
                        </div>
                      </div>
                      <Link
                        to={`/listings/${listing._id}`}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <HeartIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    Este usuario no ha dado like a ningún listing
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}