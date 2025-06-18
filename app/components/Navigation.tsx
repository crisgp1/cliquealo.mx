import { Link } from "@remix-run/react"
import { User, Plus, Shield } from 'lucide-react'
import {
  Button,
  Avatar,
  Chip,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link as HeroLink
} from "@heroui/react"

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
    <NavbarContent justify="end" className="gap-3">
      {/* Logo con HeroUI */}
      <NavbarBrand className="mr-4">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-6 h-6 bg-gradient-to-br from-gray-900 to-gray-700 rounded-full transform group-hover:scale-110 transition-all duration-300 group-hover:rotate-12"></div>
          <span className="text-lg font-light tracking-tight text-gray-900 group-hover:text-gray-700 transition-colors duration-300">
            Cliquéalo.mx
          </span>
        </Link>
      </NavbarBrand>

      {/* Solo admins ven el botón de crear */}
      {isAdmin && (
        <NavbarItem className="hidden md:flex">
          <Button
            as={Link}
            to="/listings/new"
            color="primary"
            variant="solid"
            startContent={<Plus className="w-4 h-4" />}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Crear Listing
          </Button>
        </NavbarItem>
      )}
      
      {/* Solo superadmins ven panel de administración */}
      {isSuperAdmin && (
        <NavbarItem>
          <Button
            as={Link}
            to="/admin"
            isIconOnly
            variant="light"
            aria-label="Panel de Administración"
          >
            <Shield className="w-5 h-5" />
          </Button>
        </NavbarItem>
      )}
      
      {user ? (
        <NavbarItem className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm text-gray-600 font-medium">
              {user.name}
            </span>
            {isAdmin && (
              <Chip
                size="sm"
                color="primary"
                variant="flat"
                className="text-xs"
              >
                {user.role}
              </Chip>
            )}
          </div>
          <Avatar
            size="sm"
            icon={<User className="w-4 h-4" />}
            classNames={{
              base: "bg-gradient-to-br from-gray-100 to-gray-200",
              icon: "text-gray-600"
            }}
          />
        </NavbarItem>
      ) : (
        <NavbarItem className="flex items-center gap-2">
          <Button
            as={Link}
            to="/auth/login"
            variant="light"
            size="sm"
          >
            Entrar
          </Button>
          <Button
            as={Link}
            to="/auth/register"
            color="default"
            variant="solid"
            size="sm"
            className="bg-black text-white hover:bg-gray-800"
          >
            Registrarse
          </Button>
        </NavbarItem>
      )}
    </NavbarContent>
  )
}