import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  Link,
  Form, // ← IMPORT AGREGADO
  useRouteError,
  isRouteErrorResponse,
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useState, useEffect } from "react";
import { getUser } from "~/lib/session.server";
import { Auth } from "~/lib/auth.server";
import { X, Plus, User, LogOut, Shield, Heart, Menu } from "lucide-react"; // 🔥 AGREGADO Heart y Menu

import { Toaster } from "~/components/ui/toast";
import { Preloader } from "~/components/ui/preloader";
import styles from "./tailwind.css";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getUser(request);
  const canCreateListings = user ? Auth.canCreateListings(user) : false;
  return json({ user, canCreateListings });
};

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
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
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <Toaster />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { user, canCreateListings } = useLoaderData<typeof loader>();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
      
      {/* Enhanced Header with scroll effects */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm'
          : 'bg-white border-b border-gray-50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo with enhanced animation */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-6 h-6 bg-gradient-to-br from-gray-900 to-gray-700 rounded-full transform group-hover:scale-110 transition-all duration-300 group-hover:rotate-12"></div>
              <span className="text-lg font-light tracking-tight text-gray-900 group-hover:text-gray-700 transition-colors duration-300">
                Cliquéalo.mx
              </span>
            </Link>

            {/* Enhanced Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link
                to="/listings"
                className="relative px-4 py-2 text-gray-600 hover:text-black transition-all duration-300 text-sm font-medium rounded-lg hover:bg-gray-50 group"
              >
                <span className="relative z-10">Explorar</span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              
              {/* Enhanced Favoritos link */}
              {user && (
                <Link
                  to="/favorites"
                  className="relative px-4 py-2 text-gray-600 hover:text-black transition-all duration-300 text-sm font-medium rounded-lg hover:bg-gray-50 group flex items-center gap-2"
                >
                  <Heart className="w-3.5 h-3.5 group-hover:text-red-500 transition-colors duration-300" />
                  <span className="relative z-10">Favoritos</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              )}
              
              <Link
                to="/about"
                className="relative px-4 py-2 text-gray-600 hover:text-black transition-all duration-300 text-sm font-medium rounded-lg hover:bg-gray-50 group"
              >
                <span className="relative z-10">Nosotros</span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              
              {/* Enhanced Admin links */}
              {user && canCreateListings && (
                <Link
                  to="/listings/new"
                  className="relative px-4 py-2 text-gray-600 hover:text-black transition-all duration-300 text-sm font-medium rounded-lg hover:bg-blue-50 group flex items-center gap-2"
                >
                  <Plus className="w-3.5 h-3.5 group-hover:text-blue-600 transition-colors duration-300 group-hover:rotate-90" />
                  <span className="relative z-10">Crear</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              )}
              
              {user?.role === 'superadmin' && (
                <Link
                  to="/admin"
                  className="relative px-4 py-2 text-gray-600 hover:text-black transition-all duration-300 text-sm font-medium rounded-lg hover:bg-purple-50 group flex items-center gap-2"
                >
                  <Shield className="w-3.5 h-3.5 group-hover:text-purple-600 transition-colors duration-300" />
                  <span className="relative z-10">Admin</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              )}
            </nav>

            {/* Enhanced User Section */}
            <div className="flex items-center">
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="hidden sm:block text-sm text-gray-600 font-medium">
                    {user.name}
                    {(user.role === 'admin' || user.role === 'superadmin') && (
                      <span className="ml-2 px-2 py-0.5 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 text-xs rounded-full font-medium">
                        {user.role}
                      </span>
                    )}
                  </span>
                  
                  <div className="flex items-center gap-1">
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center hover:from-gray-200 hover:to-gray-300 transition-all duration-300 cursor-pointer">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                    
                    {/* Enhanced Logout Button */}
                    <Form method="post" action="/auth/logout" className="inline">
                      <button
                        type="submit"
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-300 group"
                        title="Cerrar Sesión"
                        aria-label="Cerrar sesión"
                      >
                        <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                      </button>
                    </Form>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/auth/login"
                    className="text-gray-600 hover:text-black transition-all duration-300 text-sm font-medium px-3 py-2 rounded-lg hover:bg-gray-50"
                  >
                    Entrar
                  </Link>
                  <Link
                    to="/auth/register"
                    className="px-4 py-2 bg-gradient-to-r from-gray-900 to-gray-800 text-white text-sm font-medium rounded-lg hover:from-gray-800 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  >
                    Registrarse
                  </Link>
                </div>
              )}
              
              {/* Enhanced Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden ml-3 p-2 rounded-lg hover:bg-gray-100 transition-all duration-300 group"
                aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              >
                <div className="relative w-5 h-5">
                  {mobileMenuOpen ? (
                    <X className="w-5 h-5 text-gray-900 transform group-hover:rotate-90 transition-transform duration-300" />
                  ) : (
                    <Menu className="w-5 h-5 text-gray-900 group-hover:scale-110 transition-transform duration-300" />
                  )}
                </div>
              </button>
            </div>
          </div>
          
          {/* Enhanced Mobile Menu with animations */}
          <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen
              ? 'max-h-96 opacity-100 border-t border-gray-100'
              : 'max-h-0 opacity-0'
          }`}>
            <nav className="py-4 space-y-1">
              <Link
                to="/listings"
                className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-300 text-sm font-medium rounded-lg mx-2 transform hover:translate-x-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Explorar Catálogo
              </Link>
              
              {user && (
                <Link
                  to="/favorites"
                  className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-red-50 transition-all duration-300 text-sm font-medium rounded-lg mx-2 flex items-center gap-3 transform hover:translate-x-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Heart className="w-4 h-4 text-red-500" />
                  Mis Favoritos
                </Link>
              )}
              
              <Link
                to="/about"
                className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-300 text-sm font-medium rounded-lg mx-2 transform hover:translate-x-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Nosotros
              </Link>
              
              {user && canCreateListings && (
                <Link
                  to="/listings/new"
                  className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-blue-50 transition-all duration-300 text-sm font-medium rounded-lg mx-2 flex items-center gap-3 transform hover:translate-x-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Plus className="w-4 h-4 text-blue-500" />
                  Crear Listing
                </Link>
              )}
              
              {user?.role === 'superadmin' && (
                <Link
                  to="/admin"
                  className="block px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-purple-50 transition-all duration-300 text-sm font-medium rounded-lg mx-2 flex items-center gap-3 transform hover:translate-x-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Shield className="w-4 h-4 text-purple-500" />
                  Panel de Administración
                </Link>
              )}
              
              {user && (
                <div className="mx-2 mt-4 pt-4 border-t border-gray-100">
                  <Form method="post" action="/auth/logout">
                    <button
                      type="submit"
                      className="w-full text-left px-4 py-3 text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-300 text-sm font-medium rounded-lg flex items-center gap-3 transform hover:translate-x-1"
                      onClick={() => setMobileMenuOpen(false)}
                      aria-label="Cerrar sesión"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar Sesión
                    </button>
                  </Form>
                </div>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Desarrollado por{" "}
              <a
                href="https://hyrk.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-black transition-colors font-medium"
              >
                hyrk.io
              </a>
            </p>
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
                  <div className="w-4 h-4 bg-slate-400 rounded-full"></div>
                  <span className="text-sm font-light tracking-wide">Cliquéalo.mx</span>
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