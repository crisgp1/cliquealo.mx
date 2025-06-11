import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  Link,
  Form, // ← IMPORT AGREGADO
} from "@remix-run/react";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useState } from "react";
import { getUser } from "~/lib/session.server";
import { Auth } from "~/lib/auth.server";
import { X, Plus, User, LogOut, Shield, Heart } from "lucide-react"; // 🔥 AGREGADO Heart

import { Toaster } from "~/components/ui/toast";
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

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-50 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-black rounded-full"></div>
              <span className="text-lg font-light tracking-tight text-gray-900">
                Cliquéalo.mx
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/listings" className="text-gray-600 hover:text-black transition-colors text-sm">
                Explorar
              </Link>
              
              {/* Enlace a favoritos (solo si hay usuario) */}
              {user && (
                <Link 
                  to="/favorites"
                  className="text-gray-600 hover:text-black transition-colors text-sm flex items-center gap-1"
                >
                  <Heart className="w-3.5 h-3.5" />
                  <span>Favoritos</span>
                </Link>
              )}
              
              <Link to="/about" className="text-gray-600 hover:text-black transition-colors text-sm">
                Nosotros
              </Link>
              
              {/* Admin links in main nav for cleaner look */}
              {user && canCreateListings && (
                <Link 
                  to="/listings/new"
                  className="text-gray-600 hover:text-black transition-colors text-sm flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Crear</span>
                </Link>
              )}
              
              {user?.role === 'superadmin' && (
                <Link 
                  to="/admin"
                  className="text-gray-600 hover:text-black transition-colors text-sm flex items-center gap-1"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </Link>
              )}
            </nav>

            <div className="flex items-center">
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="hidden sm:block text-sm text-gray-600">
                    {user.name}
                    {(user.role === 'admin' || user.role === 'superadmin') && (
                      <span className="ml-1 text-xs text-gray-400">
                        ({user.role})
                      </span>
                    )}
                  </span>
                  
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                    {/* LOGOUT DESKTOP */}
                    <Form method="post" action="/auth/logout" className="inline">
                      <button
                        type="submit"
                        className="ml-2 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Cerrar Sesión"
                        aria-label="Cerrar sesión"
                      >
                        <LogOut className="w-4 h-4" />
                      </button>
                    </Form>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link 
                    to="/auth/login"
                    className="text-gray-600 hover:text-black transition-colors text-sm"
                  >
                    Entrar
                  </Link>
                  <Link 
                    to="/auth/register"
                    className="px-3 py-1.5 border border-gray-200 text-sm rounded-full hover:border-gray-400 transition-colors"
                  >
                    Registrarse
                  </Link>
                </div>
              )}
              
              {/* Mobile menu button */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                className="md:hidden ml-2 p-2"
                aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-gray-900" />
                ) : (
                  <>
                    <div className="w-5 h-0.5 bg-gray-900 mb-1"></div>
                    <div className="w-5 h-0.5 bg-gray-900 mb-1"></div>
                    <div className="w-5 h-0.5 bg-gray-900"></div>
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-50">
              <nav className="flex flex-col space-y-4">
                <Link 
                  to="/listings" 
                  className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Explorar Catálogo
                </Link>
                
                {/*Enlace a favoritos en móvil (solo si hay usuario) */}
                {user && (
                  <Link 
                    to="/favorites"
                    className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium py-2 flex items-center gap-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Heart className="w-4 h-4" />
                    Mis Favoritos
                  </Link>
                )}
                
                <Link 
                  to="/about" 
                  className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Nosotros
                </Link>
                {user?.role === 'admin' || user?.role === 'superadmin' ? (
                  <Link 
                    to="/listings/new"
                    className="text-gray-600 hover:text-gray-900 transition-colors text-sm flex items-center gap-1 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Crear Listing
                  </Link>
                ) : null}
                {user?.role === 'superadmin' && (
                  <Link 
                    to="/admin"
                    className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Panel de Administración
                  </Link>
                )}
                {/* LOGOUT */}
                {user && (
                  <Form method="post" action="/auth/logout" className="block">
                    <button
                      type="submit"
                      className="w-full text-left text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium py-2"
                      onClick={() => setMobileMenuOpen(false)}
                      aria-label="Cerrar sesión"
                    >
                      Cerrar Sesión
                    </button>
                  </Form>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Error - Cliquéalo.mx</title>
        <Links />
      </head>
      <body>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-light text-gray-900 mb-4">
              Algo salió mal
            </h1>
            <p className="text-gray-600 mb-8">
              Ocurrió un error inesperado. Por favor, intenta recargar la página o regresa al inicio.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors font-medium"
              >
                Recargar página
              </button>
              <Link
                to="/"
                className="block w-full text-gray-600 hover:text-gray-900 transition-colors py-2"
              >
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  );
}