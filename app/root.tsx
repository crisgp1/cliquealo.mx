import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  Link,
  Form,
  useRouteError,
  isRouteErrorResponse,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  DEFAULT_SEO,
  generateBasicMeta,
  generateOrganizationJsonLd,
  generateWebsiteJsonLd
} from "~/lib/seo";
import { useState, useEffect } from "react";
// Import Clerk
import { rootAuthLoader } from '@clerk/remix/ssr.server'
import { ClerkApp, SignedIn, SignedOut, SignInButton, SignUpButton, UserButton, useUser } from '@clerk/remix'
import { X, Plus, User, LogOut, Shield, Heart, Menu, Search, Info, Home, LogIn, UserPlus, CreditCard, Crown } from "lucide-react"; // 🔥 AGREGADO más iconos
import {
  HeroUIProvider,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarMenuItem,
  Button,
  Avatar,
  Chip,
  Link as HeroLink
} from "@heroui/react";

import { Toaster } from "~/components/ui/toast";
import { Preloader } from "~/components/ui/preloader";
import styles from "./tailwind.css";

// Meta function para SEO por defecto en toda la aplicación
export const meta: MetaFunction = () => {
  return generateBasicMeta({
    title: DEFAULT_SEO.title,
    description: DEFAULT_SEO.description,
    url: DEFAULT_SEO.url,
  });
};

// Export rootAuthLoader as the root route loader with proper error handling
export const loader = async (args: LoaderFunctionArgs) => {
  try {
    return await rootAuthLoader(args);
  } catch (error) {
    console.error('Clerk authentication error:', error);
    
    // Check if it's a configuration error
    if (error instanceof Error && error.message?.includes('CLERK_')) {
      console.warn('⚠️ Clerk configuration issue detected. Running in fallback mode.');
    }
    
    // Return a basic response if Clerk fails
    return json({
      user: null,
      userId: null,
      sessionId: null,
      orgId: null,
      orgRole: null,
      orgSlug: null,
      __clerk_ssr_state: null,
      __clerk_error: true // Flag to indicate Clerk error
    });
  }
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  { rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/@splidejs/splide@4.1.4/dist/css/splide.min.css" },
  { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
  { rel: "shortcut icon", href: "/favicon.ico", type: "image/x-icon" },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        {/* JSON-LD para Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: generateOrganizationJsonLd()
          }}
        />
        {/* JSON-LD para Website */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: generateWebsiteJsonLd()
          }}
        />
      </head>
      <body>
        <HeroUIProvider>
          {children}
          <Toaster />
        </HeroUIProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function App() {
  const { user } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Determine user role and permissions from Clerk metadata
  const userRole = user?.publicMetadata?.role as 'user' | 'admin' | 'superadmin' || 'user';
  const canCreateListings = userRole === 'admin' || userRole === 'superadmin';

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuOpen && !(event.target as Element).closest('header')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Preloader />
      
      {/* HeroUI Navbar */}
      <Navbar
        isBlurred
        className={`transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm'
            : 'bg-white border-b border-gray-50'
        }`}
        maxWidth="full"
        height="4rem"
      >
        {/* Logo */}
        <NavbarBrand>
          <Link to="/" className="flex items-center space-x-3 group">
            <img src="/assets/logo.webp" alt="Cliquéalo.mx" className="w-48" />
          </Link>
        </NavbarBrand>

        {/* Desktop Navigation */}
        <NavbarContent className="hidden md:flex gap-1" justify="center">
          <NavbarItem>
            <Button
              as={Link}
              to="/listings"
              variant="light"
              startContent={<Search className="w-3.5 h-3.5" />}
              className="text-gray-600 hover:text-black"
            >
              Explorar
            </Button>
          </NavbarItem>
          
          {user && (
            <NavbarItem>
              <Button
                as={Link}
                to="/favorites"
                variant="light"
                startContent={<Heart className="w-3.5 h-3.5" />}
                className="text-gray-600 hover:text-red-500"
              >
                Favoritos
              </Button>
            </NavbarItem>
          )}
          
          {user && (
            <NavbarItem>
              <Button
                as={Link}
                to="/credit/my-applications"
                variant="light"
                startContent={<CreditCard className="w-3.5 h-3.5" />}
                className="text-gray-600 hover:text-green-600"
              >
                Mis Créditos
              </Button>
            </NavbarItem>
          )}
          
          <NavbarItem>
            <Button
              as={Link}
              to="/about"
              variant="light"
              startContent={<Info className="w-3.5 h-3.5" />}
              className="text-gray-600 hover:text-black"
            >
              Nosotros
            </Button>
          </NavbarItem>
          
          {/* Lounge Club - Link discreto pero lujoso */}
          <NavbarItem>
            <Button
              as={Link}
              to="/lounge-club"
              variant="light"
              startContent={<Crown className="w-3.5 h-3.5 text-amber-500" />}
              className="text-gray-800 font-medium hover:text-black"
            >
              Lounge Club
            </Button>
          </NavbarItem>
          
          {user && canCreateListings && (
            <NavbarItem>
              <Button
                as={Link}
                to="/listings/new"
                color="primary"
                variant="light"
                startContent={<Plus className="w-3.5 h-3.5" />}
                className="text-gray-600 hover:text-blue-600"
              >
                Crear
              </Button>
            </NavbarItem>
          )}
          
          {userRole === 'superadmin' && (
            <NavbarItem>
              <Button
                as={Link}
                to="/admin"
                variant="light"
                startContent={<Shield className="w-3.5 h-3.5" />}
                className="text-gray-600 hover:text-purple-600"
              >
                Admin
              </Button>
            </NavbarItem>
          )}
        </NavbarContent>

        {/* User Section */}
        <NavbarContent justify="end">
          <SignedIn>
            <NavbarItem className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm text-gray-600 font-medium">
                  {user?.fullName || user?.firstName || user?.emailAddresses[0]?.emailAddress}
                </span>
                {(userRole === 'admin' || userRole === 'superadmin') && (
                  <Chip
                    size="sm"
                    color="primary"
                    variant="flat"
                    className="text-xs"
                  >
                    {userRole}
                  </Chip>
                )}
              </div>
              
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8"
                  }
                }}
              />
            </NavbarItem>
          </SignedIn>
          
          <SignedOut>
            <NavbarItem className="flex items-center gap-2">
              <SignInButton
                mode="modal"
                fallbackRedirectUrl="/"
                signUpFallbackRedirectUrl="/"
              >
                <Button
                  variant="light"
                  size="sm"
                  className="hidden sm:flex"
                >
                  Entrar
                </Button>
              </SignInButton>
              
              <SignUpButton
                mode="modal"
                fallbackRedirectUrl="/"
                signInFallbackRedirectUrl="/"
              >
                <Button
                  color="default"
                  variant="solid"
                  size="sm"
                  className="bg-black text-white hover:bg-gray-800 hidden sm:flex"
                >
                  Registrarse
                </Button>
              </SignUpButton>
              
              {/* Mobile auth buttons */}
              <SignInButton
                mode="modal"
                fallbackRedirectUrl="/"
                signUpFallbackRedirectUrl="/"
              >
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  className="flex sm:hidden"
                  aria-label="Entrar"
                >
                  <LogIn className="w-5 h-5" />
                </Button>
              </SignInButton>
              
              <SignUpButton
                mode="modal"
                fallbackRedirectUrl="/"
                signInFallbackRedirectUrl="/"
              >
                <Button
                  isIconOnly
                  color="default"
                  variant="solid"
                  size="sm"
                  className="bg-black text-white hover:bg-gray-800 flex sm:hidden"
                  aria-label="Registrarse"
                >
                  <UserPlus className="w-5 h-5" />
                </Button>
              </SignUpButton>
            </NavbarItem>
          </SignedOut>
          
          {/* Mobile menu toggle */}
          <NavbarMenuToggle
            className="md:hidden"
            aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          />
        </NavbarContent>

        {/* Mobile Menu */}
        <NavbarMenu className="pt-6">
          <NavbarMenuItem>
            <Button
              as={Link}
              to="/listings"
              variant="light"
              startContent={<Search className="w-4 h-4" />}
              className="w-full justify-start text-gray-600"
              onPress={() => setMobileMenuOpen(false)}
            >
              Explorar Catálogo
            </Button>
          </NavbarMenuItem>
          
          <SignedIn>
            <NavbarMenuItem>
              <Button
                as={Link}
                to="/favorites"
                variant="light"
                startContent={<Heart className="w-4 h-4 text-red-500" />}
                className="w-full justify-start text-gray-600"
                onPress={() => setMobileMenuOpen(false)}
              >
                Mis Favoritos
              </Button>
            </NavbarMenuItem>
            
            <NavbarMenuItem>
              <Button
                as={Link}
                to="/credit/my-applications"
                variant="light"
                startContent={<CreditCard className="w-4 h-4 text-green-500" />}
                className="w-full justify-start text-gray-600"
                onPress={() => setMobileMenuOpen(false)}
              >
                Mis Solicitudes de Crédito
              </Button>
            </NavbarMenuItem>
          </SignedIn>
          
          <NavbarMenuItem>
            <Button
              as={Link}
              to="/about"
              variant="light"
              startContent={<Info className="w-4 h-4" />}
              className="w-full justify-start text-gray-600"
              onPress={() => setMobileMenuOpen(false)}
            >
              Nosotros
            </Button>
          </NavbarMenuItem>
          
          {/* Lounge Club en menú móvil */}
          <NavbarMenuItem>
            <Button
              as={Link}
              to="/lounge-club"
              variant="light"
              startContent={<Crown className="w-4 h-4 text-amber-500" />}
              className="w-full justify-start text-gray-800 font-medium"
              onPress={() => setMobileMenuOpen(false)}
            >
              The Lounge Club
            </Button>
          </NavbarMenuItem>
          
          <SignedIn>
            {canCreateListings && (
              <NavbarMenuItem>
                <Button
                  as={Link}
                  to="/listings/new"
                  variant="flat"
                  startContent={
                    <div className="relative">
                      <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-full p-1">
                        <Plus className="w-3 h-3 text-white" />
                      </div>
                      <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full animate-ping opacity-75"></div>
                    </div>
                  }
                  className="w-full justify-start bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 hover:from-red-100 hover:to-orange-100 transition-all duration-300"
                  onPress={() => setMobileMenuOpen(false)}
                >
                  <span className="font-semibold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                    ¡Crear Listing!
                  </span>
                </Button>
              </NavbarMenuItem>
            )}
          </SignedIn>
          
          {userRole === 'superadmin' && (
            <NavbarMenuItem>
              <Button
                as={Link}
                to="/admin"
                variant="light"
                startContent={<Shield className="w-4 h-4 text-purple-500" />}
                className="w-full justify-start text-gray-600"
                onPress={() => setMobileMenuOpen(false)}
              >
                Panel de Administración
              </Button>
            </NavbarMenuItem>
          )}
          
          <SignedIn>
            <NavbarMenuItem className="mt-4 pt-4 border-t border-gray-100">
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-8 h-8",
                    userButtonPopoverCard: "bg-white shadow-lg border border-gray-200",
                    userButtonPopoverActionButton: "text-gray-700 hover:bg-gray-50"
                  }
                }}
                showName
              />
            </NavbarMenuItem>
          </SignedIn>
        </NavbarMenu>
      </Navbar>

      {/* Main Content */}
      <main className="flex-1 pb-20 md:pb-0">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex items-center justify-around py-2">
          <Link
            to="/"
            className="flex flex-col items-center py-2 px-1 text-gray-600 hover:text-gray-900 transition-colors min-w-0"
            title="Inicio"
          >
            <Home className="w-6 h-6 sm:w-5 sm:h-5 sm:mb-1" />
            <span className="hidden sm:block text-xs font-medium">Inicio</span>
          </Link>
          
          <Link
            to="/listings"
            className="flex flex-col items-center py-2 px-1 text-gray-600 hover:text-gray-900 transition-colors min-w-0"
            title="Explorar"
          >
            <Search className="w-6 h-6 sm:w-5 sm:h-5 sm:mb-1" />
            <span className="hidden sm:block text-xs font-medium">Explorar</span>
          </Link>
          
          <SignedIn>
            <Link
              to="/favorites"
              className="flex flex-col items-center py-2 px-1 text-gray-600 hover:text-red-600 transition-colors min-w-0"
              title="Favoritos"
            >
              <Heart className="w-6 h-6 sm:w-5 sm:h-5 sm:mb-1" />
              <span className="hidden sm:block text-xs font-medium">Favoritos</span>
            </Link>
            
            <Link
              to="/credit/my-applications"
              className="flex flex-col items-center py-2 px-1 text-gray-600 hover:text-green-600 transition-colors min-w-0"
              title="Mis Créditos"
            >
              <CreditCard className="w-6 h-6 sm:w-5 sm:h-5 sm:mb-1" />
              <span className="hidden sm:block text-xs font-medium">Créditos</span>
            </Link>
            
            {canCreateListings && (
              <Link
                to="/listings/new"
                className="relative flex flex-col items-center py-2 px-1 min-w-0 group"
                title="Crear Listing"
              >
                {/* Fondo animado */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl opacity-0 group-hover:opacity-20 transition-all duration-300 transform group-hover:scale-110"></div>
                
                {/* Círculo de fondo para el ícono */}
                <div className="relative bg-gradient-to-r from-red-500 to-orange-500 rounded-full p-2 shadow-lg transform group-hover:scale-110 transition-all duration-300 group-hover:shadow-xl">
                  <Plus className="w-5 h-5 text-white animate-pulse" />
                </div>
                
                {/* Texto con gradiente */}
                <span className="hidden sm:block text-xs font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mt-1">
                  Crear
                </span>
                
                {/* Indicador de pulso */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping opacity-75"></div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </Link>
            )}
          </SignedIn>
          
          {userRole === 'superadmin' && (
            <Link
              to="/admin"
              className="flex flex-col items-center py-2 px-1 text-gray-600 hover:text-purple-600 transition-colors min-w-0"
              title="Admin"
            >
              <Shield className="w-6 h-6 sm:w-5 sm:h-5 sm:mb-1" />
              <span className="hidden sm:block text-xs font-medium">Admin</span>
            </Link>
          )}
          
          <Link
            to="/about"
            className="flex flex-col items-center py-2 px-1 text-gray-600 hover:text-gray-900 transition-colors min-w-0"
            title="Información"
          >
            <Info className="w-6 h-6 sm:w-5 sm:h-5 sm:mb-1" />
            <span className="hidden sm:block text-xs font-medium">Info</span>
          </Link>
          
          {/* Lounge Club en navegación inferior móvil */}
          <Link
            to="/lounge-club"
            className="flex flex-col items-center py-2 px-1 text-gray-800 hover:text-black transition-colors min-w-0"
            title="Lounge Club"
          >
            <Crown className="w-6 h-6 sm:w-5 sm:h-5 sm:mb-1 text-amber-500" />
            <span className="hidden sm:block text-xs font-medium">Club</span>
          </Link>
        </div>
      </nav>

      {/* Modern Responsive Footer */}
      <footer className="bg-gradient-to-br from-gray-50 to-gray-100 border-t border-gray-200 mt-auto">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer Content */}
          <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img src="/assets/logo.webp" alt="Cliquéalo.mx" className="w-32 h-auto" />
             

      
              </div>
              <p className="text-gray-600 mb-6 max-w-md leading-relaxed">
                Tu plataforma confiable para encontrar el auto perfecto. Conectamos compradores y vendedores con la mejor experiencia del mercado.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-900 hover:text-white transition-all duration-300 shadow-sm"
                  title="Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-900 hover:text-white transition-all duration-300 shadow-sm"
                  title="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C3.85 14.81 3.85 12.939 4.126 11.987c.276-.952.952-1.628 1.904-1.904.952-.276 1.823-.276 2.775 0 .952.276 1.628.952 1.904 1.904.276.952.276 1.823 0 2.775-.276.952-.952 1.628-1.904 1.904-.476.138-.952.207-1.428.207-.476 0-.952-.069-1.428-.207z"/>
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-900 hover:text-white transition-all duration-300 shadow-sm"
                  title="WhatsApp"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.864 3.488"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Navigation Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Navegación
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link to="/listings" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                    Explorar Autos
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                    Nosotros
                  </Link>
                </li>
                <li>
                  <Link to="/lounge-club" className="text-gray-800 hover:text-black transition-colors text-sm font-medium">
                    Lounge Club <span className="inline-block ml-1 text-amber-500">★</span>
                  </Link>
                </li>
                <SignedIn>
                  <li>
                    <Link to="/favorites" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                      Mis Favoritos
                    </Link>
                  </li>
                  <li>
                    <Link to="/credit/my-applications" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                      Mis Créditos
                    </Link>
                  </li>
                </SignedIn>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                Soporte
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                    Centro de Ayuda
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                    Términos de Uso
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                    Política de Privacidad
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                    Contacto
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="py-6 border-t border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-gray-500">
                <span>© 2025 Cliquéalo.mx. Todos los derechos reservados.</span>
                <span className="hidden sm:inline text-gray-300">•</span>
                <span>Hecho en México 🇲🇽</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-500">Desarrollado por</span>
                <a
                  href="https://hyrk.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-all duration-300 font-medium"
                >
                  <span>hyrk.io</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8" style={{
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)'
        }}>
          <style dangerouslySetInnerHTML={{
            __html: `
              .floating-animation {
                animation: float 6s ease-in-out infinite;
              }
              
              .floating-animation:nth-child(2) {
                animation-delay: -2s;
              }
              
              .floating-animation:nth-child(3) {
                animation-delay: -4s;
              }
              
              @keyframes float {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                33% { transform: translateY(-20px) rotate(1deg); }
                66% { transform: translateY(-10px) rotate(-1deg); }
              }
              
              .fade-in {
                animation: fadeIn 1.2s ease-out;
              }
              
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
              }
              
              .slide-in {
                animation: slideIn 1s ease-out 0.3s both;
              }
              
              @keyframes slideIn {
                from { opacity: 0; transform: translateX(-30px); }
                to { opacity: 1; transform: translateX(0); }
              }
              
              .pulse-subtle {
                animation: pulseSubtle 3s ease-in-out infinite;
              }
              
              @keyframes pulseSubtle {
                0%, 100% { opacity: 0.6; }
                50% { opacity: 0.8; }
              }
              
              .nordic-shadow {
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
              }
              
              .text-gradient {
                background: linear-gradient(135deg, #1e293b, #475569);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
              }
            `
          }} />
          
          <div className="max-w-lg w-full text-center">
            
            {/* Floating geometric shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="floating-animation absolute top-1/4 left-1/4 w-16 h-16 bg-slate-200/40 rounded-full pulse-subtle"></div>
              <div className="floating-animation absolute top-1/3 right-1/4 w-8 h-8 bg-slate-300/30 rounded-full pulse-subtle"></div>
              <div className="floating-animation absolute bottom-1/3 left-1/3 w-12 h-12 bg-slate-200/50 rounded-full pulse-subtle"></div>
            </div>

            {/* Main content */}
            <div className="relative z-10">
              
              {/* 404 Number */}
              <div className="fade-in mb-8">
                <h1 className="text-8xl sm:text-9xl font-light text-gradient tracking-tight">
                  404
                </h1>
              </div>

              {/* Icon */}
              <div className="slide-in mb-8 flex justify-center">
                <div className="nordic-shadow bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50">
                  <svg
                    className="w-16 h-16 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              </div>

              {/* Main message */}
              <div className="slide-in mb-6">
                <h2 className="text-2xl sm:text-3xl font-light text-slate-700 mb-3 tracking-tight">
                  Recurso no encontrado
                </h2>
                <p className="text-slate-500 text-lg leading-relaxed max-w-md mx-auto">
                  El contenido que buscas ha sido movido o ya no está disponible.
                </p>
              </div>

              {/* Suggestion */}
              <div className="slide-in mb-8">
                <p className="text-slate-400 text-sm">
                  Te sugerimos regresar al inicio o explorar nuestro catálogo
                </p>
              </div>

              {/* Action buttons */}
              <div className="slide-in flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/"
                  className="nordic-shadow bg-slate-800 text-white px-8 py-3 rounded-xl font-medium hover:bg-slate-700 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 w-full sm:w-auto"
                >
                  Ir al inicio
                </Link>
                <Link
                  to="/listings"
                  className="nordic-shadow bg-white/80 backdrop-blur-sm text-slate-700 px-8 py-3 rounded-xl font-medium border border-slate-200/50 hover:bg-white hover:border-slate-300 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 w-full sm:w-auto"
                >
                  Explorar catálogo
                </Link>
              </div>

              {/* Footer */}
              <div className="slide-in mt-12 pt-8 border-t border-slate-200/50">
                <Link
                  to="/"
                  className="inline-flex items-center space-x-2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <img src="/assets/logo.webp" alt="Cliquéalo.mx" className="w-8 h-8" />
                </Link>
              </div>

            </div>
          </div>
        </div>
      );
    }
    

  // Handle other errors
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">
          Algo salió mal
        </h1>
        <p className="text-gray-600 mb-6">
          Ha ocurrido un error inesperado. Por favor, intenta de nuevo.
        </p>
        <Link
          to="/"
          className="inline-block bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}

// Wrap the App component with ClerkApp
export default ClerkApp(App);