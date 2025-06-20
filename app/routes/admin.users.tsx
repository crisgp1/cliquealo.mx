import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node"
import { Form, Link, useLoaderData, useNavigation, useSearchParams, useSubmit } from "@remix-run/react"
import { requireSuperAdmin } from "~/lib/auth.server"
import { UserModel } from "~/models/User.server"
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  UserIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  XMarkIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'
import { 
  UserIcon as UserIconSolid,
  ShieldCheckIcon as ShieldCheckIconSolid,
  ShieldExclamationIcon as ShieldExclamationIconSolid
} from '@heroicons/react/24/solid'
import { useState } from 'react'

export async function loader({ request }: LoaderFunctionArgs) {
  await requireSuperAdmin(request)
  
  const url = new URL(request.url)
  const search = url.searchParams.get("search") || ""
  const role = url.searchParams.get("role") || ""
  const isActive = url.searchParams.get("isActive")
  const page = parseInt(url.searchParams.get("page") || "1")
  const limit = 20
  const skip = (page - 1) * limit
  
  const filters: any = {
    search,
    limit,
    skip
  }
  
  if (role) filters.role = role as any
  if (isActive !== null) filters.isActive = isActive === "true"
  
  const users = await UserModel.findAll(filters)
  const stats = await UserModel.getStats()
  
  return json({ 
    users, 
    stats,
    currentPage: page,
    totalPages: Math.ceil(stats.total / limit),
    filters: { search, role, isActive }
  })
}

export async function action({ request }: ActionFunctionArgs) {
  await requireSuperAdmin(request)
  
  const formData = await request.formData()
  const intent = formData.get("intent") as string
  const userId = formData.get("userId") as string
  
  if (!userId) {
    return json({ error: "ID del usuario es requerido" }, { status: 400 })
  }
  
  try {
    switch (intent) {
      case "promote-to-admin": {
        const success = await UserModel.promoteToAdmin(userId)
        if (!success) {
          return json({ error: "Error al promover usuario" }, { status: 500 })
        }
        return json({ success: true, message: "Usuario promovido a admin" })
      }
      
      case "demote-to-user": {
        const success = await UserModel.demoteToUser(userId)
        if (!success) {
          return json({ error: "Error al degradar usuario" }, { status: 500 })
        }
        return json({ success: true, message: "Usuario degradado a usuario normal" })
      }
      
      case "deactivate": {
        const success = await UserModel.deactivateUser(userId)
        if (!success) {
          return json({ error: "Error al desactivar usuario" }, { status: 500 })
        }
        return json({ success: true, message: "Usuario desactivado" })
      }
      
      case "reactivate": {
        const success = await UserModel.reactivateUser(userId)
        if (!success) {
          return json({ error: "Error al reactivar usuario" }, { status: 500 })
        }
        return json({ success: true, message: "Usuario reactivado" })
      }
      
      default:
        return json({ error: "Acción no válida" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error en action:", error)
    return json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export default function AdminUsers() {
  const { users, stats, currentPage, totalPages, filters } = useLoaderData<typeof loader>()
  const navigation = useNavigation()
  const submit = useSubmit()
  const [searchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  const [actionUserId, setActionUserId] = useState<string | null>(null)
  
  const isSubmitting = navigation.state === "submitting"
  
  const roleOptions = [
    { value: "", label: "Todos los roles" },
    { value: "user", label: "Usuarios" },
    { value: "admin", label: "Administradores" },
    { value: "superadmin", label: "Super Administradores" }
  ]
  
  const statusOptions = [
    { value: "", label: "Todos los estados" },
    { value: "true", label: "Activos" },
    { value: "false", label: "Inactivos" }
  ]
  
  const clearFilters = () => {
    submit({}, { method: "get" })
  }
  
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'superadmin':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
            <ShieldCheckIconSolid className="w-3 h-3" />
            Super Admin
          </span>
        )
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
            <ShieldExclamationIconSolid className="w-3 h-3" />
            Admin
          </span>
        )
      case 'user':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
            <UserIconSolid className="w-3 h-3" />
            Usuario
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
            <UserIconSolid className="w-3 h-3" />
            Desconocido
          </span>
        )
    }
  }
  
  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
        <CheckCircleIcon className="w-3 h-3" />
        Activo
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
        <XCircleIcon className="w-3 h-3" />
        Inactivo
      </span>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-light text-gray-900 mb-2">
              Gestión de Usuarios
            </h1>
            <p className="text-gray-600">
              {stats.total} usuarios en total
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <Link
              to="/admin"
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Volver al Dashboard
            </Link>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center">
              <UserIcon className="w-8 h-8 text-gray-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Usuarios</p>
                <p className="text-2xl font-light text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center">
              <UserIconSolid className="w-8 h-8 text-gray-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Usuarios Normales</p>
                <p className="text-2xl font-light text-gray-900">{stats.byRole.user || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center">
              <ShieldExclamationIcon className="w-8 h-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Administradores</p>
                <p className="text-2xl font-light text-gray-900">{stats.byRole.admin || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center">
              <ShieldCheckIcon className="w-8 h-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Super Admins</p>
                <p className="text-2xl font-light text-gray-900">{stats.byRole.superadmin || 0}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Form method="get" className="flex-1 flex flex-col sm:flex-row gap-4">
              <div className="flex-1 flex gap-2">
                <div className="flex-1 relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="search"
                    name="search"
                    defaultValue={filters.search}
                    placeholder="Buscar por nombre, email, teléfono..."
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
                  <FunnelIcon className="w-5 h-5" />
                </button>
              </div>
              
              {showFilters && (
                <div className="flex flex-wrap gap-3">
                  <select
                    name="role"
                    defaultValue={filters.role}
                    className="px-3 py-2 border border-gray-200 rounded-lg"
                  >
                    {roleOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  
                  <select
                    name="isActive"
                    defaultValue={filters.isActive || ""}
                    className="px-3 py-2 border border-gray-200 rounded-lg"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  
                  {(filters.search || filters.role || filters.isActive) && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="flex items-center gap-1 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <XMarkIcon className="w-4 h-4" />
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
        
        {/* Users Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {users.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contacto
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rol
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha de Registro
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user: any) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 mr-3">
                            {user.avatar ? (
                              <img
                                className="h-10 w-10 rounded-full object-cover"
                                src={user.avatar}
                                alt={user.name}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                <UserIcon className="h-5 w-5 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              @{user.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                        <div className="text-sm text-gray-500">{user.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(user.isActive)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            to={`/admin/users/${user._id}`}
                            className="p-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                            title="Ver detalles"
                          >
                            <EyeIcon className="w-4 h-4" />
                          </Link>
                          
                          <div className="relative">
                            <button
                              onClick={() => setActionUserId(actionUserId === user._id ? null : user._id)}
                              className="p-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                              title="Gestionar privilegios"
                            >
                              <Cog6ToothIcon className="w-4 h-4" />
                            </button>
                            
                            {actionUserId === user._id && (
                              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                                <div className="py-1">
                                  {user.role === "user" && (
                                    <Form method="post" className="block">
                                      <input type="hidden" name="userId" value={user._id} />
                                      <input type="hidden" name="intent" value="promote-to-admin" />
                                      <button
                                        type="submit"
                                        className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                      >
                                        <ShieldExclamationIcon className="w-4 h-4 text-blue-600" />
                                        Promover a Admin
                                      </button>
                                    </Form>
                                  )}
                                  
                                  {user.role === "admin" && (
                                    <Form method="post" className="block">
                                      <input type="hidden" name="userId" value={user._id} />
                                      <input type="hidden" name="intent" value="demote-to-user" />
                                      <button
                                        type="submit"
                                        className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                      >
                                        <UserIcon className="w-4 h-4 text-gray-600" />
                                        Degradar a Usuario
                                      </button>
                                    </Form>
                                  )}
                                  
                                  <div className="border-t border-gray-100 my-1"></div>
                                  
                                  {user.isActive ? (
                                    <Form method="post" className="block">
                                      <input type="hidden" name="userId" value={user._id} />
                                      <input type="hidden" name="intent" value="deactivate" />
                                      <button
                                        type="submit"
                                        className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 flex items-center gap-2"
                                        onClick={(e) => {
                                          if (!confirm("¿Estás seguro de desactivar este usuario?")) {
                                            e.preventDefault()
                                          }
                                        }}
                                      >
                                        <XCircleIcon className="w-4 h-4" />
                                        Desactivar Usuario
                                      </button>
                                    </Form>
                                  ) : (
                                    <Form method="post" className="block">
                                      <input type="hidden" name="userId" value={user._id} />
                                      <input type="hidden" name="intent" value="reactivate" />
                                      <button
                                        type="submit"
                                        className="w-full px-4 py-2 text-sm text-left text-green-600 hover:bg-green-50 flex items-center gap-2"
                                      >
                                        <CheckCircleIcon className="w-4 h-4" />
                                        Reactivar Usuario
                                      </button>
                                    </Form>
                                  )}
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
              <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay usuarios</h3>
              <p className="mt-1 text-sm text-gray-500">
                No se encontraron usuarios con los filtros aplicados.
              </p>
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Mostrando <span className="font-medium">{(currentPage - 1) * 20 + 1}</span> a <span className="font-medium">
                      {Math.min(currentPage * 20, stats.total)}
                    </span> de <span className="font-medium">{stats.total}</span> resultados
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
                      <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                    </Link>
                    
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let page;
                      if (totalPages <= 5) {
                        page = i + 1;
                      } else if (currentPage <= 3) {
                        page = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        page = totalPages - 4 + i;
                      } else {
                        page = currentPage - 2 + i;
                      }
                      
                      return (
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
                      );
                    })}
                    
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
                      <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                    </Link>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}