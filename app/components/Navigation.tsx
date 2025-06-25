import { Link } from "@remix-run/react"
import { User, Plus, Shield, Settings, Calculator } from 'lucide-react'
import { SignInButton, SignUpButton, SignOutButton, useUser } from "@clerk/remix"
import { useClerkRole } from "~/hooks/useClerkRole"
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
  // Clerk maneja el usuario internamente
}

export function Navigation({}: NavigationProps) {
  const { isSignedIn, user } = useUser()
  const { role, isAdmin, isSuperAdmin, canCreateListings, canAccessAdminPanel, label } = useClerkRole()

  return (
    <NavbarContent justify="end" className="gap-3">
      {/* Logo con HeroUI */}
      <NavbarBrand className="mr-4">
        <Link to="/" className="flex items-center space-x-3 group">
          <img src="/assets/logo.webp" alt="Cliquéalo.mx" className="w-screen"  />
        </Link>
      </NavbarBrand>

      {/* Solo admins ven el botón de crear */}
      {canCreateListings && (
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
      {canAccessAdminPanel && (
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
      
      {isSignedIn ? (
        <NavbarItem className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm text-gray-600 font-medium">
              {user?.firstName || user?.emailAddresses?.[0]?.emailAddress || 'Usuario'}
            </span>
            {isSignedIn && (
              <Chip
                size="sm"
                color={role === 'superadmin' ? 'warning' : role === 'admin' ? 'primary' : 'default'}
                variant="flat"
                className="text-xs"
              >
                {label}
              </Chip>
            )}
          </div>
          
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                size="sm"
                src={user?.imageUrl}
                icon={<User className="w-4 h-4" />}
                classNames={{
                  base: "bg-gradient-to-br from-gray-100 to-gray-200 cursor-pointer",
                  icon: "text-gray-600"
                }}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions">
              <DropdownItem
                key="applications"
                startContent={<Settings className="w-4 h-4" />}
              >
                <Link to="/credit/my-applications" className="w-full block">
                  Mis Solicitudes
                </Link>
              </DropdownItem>
              <DropdownItem
                key="logout"
                color="danger"
                startContent={<User className="w-4 h-4" />}
              >
                <SignOutButton>
                  <span className="w-full block cursor-pointer">
                    Cerrar Sesión
                  </span>
                </SignOutButton>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      ) : (
        <NavbarItem className="flex items-center gap-2">
          <SignInButton mode="modal">
            <Button
              variant="light"
              size="sm"
            >
              Entrar
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button
              color="default"
              variant="solid"
              size="sm"
              className="bg-black text-white hover:bg-gray-800"
            >
              Registrarse
            </Button>
          </SignUpButton>
        </NavbarItem>
      )}
    </NavbarContent>
  )
}