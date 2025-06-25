import { Link } from "@remix-run/react"
import { User, Plus, Shield, Settings, Calculator } from 'lucide-react'
import {
  Button,
  Avatar,
  Chip,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link as HeroLink,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
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
          <img src="/assets/logo.webp" alt="Cliquéalo.mx" className="w-screen"  />
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
      
      {/* Simulador de Crédito - visible para todos */}
      <NavbarItem className="hidden md:flex">
        <Button
          as={Link}
          to="/credit/simulator"
          variant="light"
          startContent={<Calculator className="w-4 h-4" />}
          className="text-gray-600 hover:text-blue-600"
        >
          Simulador
        </Button>
      </NavbarItem>
      
      {/* Admins y superadmins ven panel de administración */}
      {isAdmin && (
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
          
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                size="sm"
                icon={<User className="w-4 h-4" />}
                classNames={{
                  base: "bg-gradient-to-br from-gray-100 to-gray-200 cursor-pointer",
                  icon: "text-gray-600"
                }}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions">
              {isAdmin ? (
                <DropdownItem
                  key="profile"
                  startContent={<Settings className="w-4 h-4" />}
                >
                  <Link to="/profile/edit" className="w-full block">
                    Editar Perfil
                  </Link>
                </DropdownItem>
              ) : null}
              <DropdownItem
                key="logout"
                color="danger"
                startContent={<User className="w-4 h-4" />}
              >
                <Link to="/auth/logout" className="w-full block">
                  Cerrar Sesión
                </Link>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
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