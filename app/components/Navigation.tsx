import { Link } from "@remix-run/react"
import { User, Plus, Settings, Shield } from 'lucide-react'

interface NavigationProps {
  user?: {
    name: string
    role: string
  } | null
}

export function Navigation({ user }: NavigationProps) {
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin'
  const isSuperAdmin = user?.role === 'superadmin'

  return (
    <div className="flex items-center gap-2">
      {/* Solo admins ven el botón de crear */}
      {isAdmin && (
        <Link 
          to="/listings/new"
          className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Crear Listing
        </Link>
      )}
      
      {/* Solo superadmins ven panel de administración */}
      {isSuperAdmin && (
        <Link 
          to="/admin"
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
          title="Panel de Administración"
        >
          <Shield className="w-5 h-5" />
        </Link>
      )}
      
      {user ? (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 hidden sm:block">
            {user.name}
            {isAdmin && (
              <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                {user.role}
              </span>
            )}
          </span>
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-gray-600" />
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Link 
            to="/auth/login"
            className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
          >
            Entrar
          </Link>
          <Link 
            to="/auth/register"
            className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Registrarse
          </Link>
        </div>
      )}
    </div>
  )
}