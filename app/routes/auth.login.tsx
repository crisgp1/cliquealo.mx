import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node"
import { Form, useActionData, Link, useNavigation } from "@remix-run/react"
import { UserModel } from "~/models/User"
import { createUserSession, getUserId } from "~/lib/session.server"
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'
import { useState } from 'react'

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await getUserId(request)
  if (userId) return redirect("/")
  return null
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  
  if (!email || !password) {
    return json({ error: "Email y contraseña son requeridos" }, { status: 400 })
  }
  
  if (!email.includes('@')) {
    return json({ error: "Email inválido" }, { status: 400 })
  }
  
  try {
    const user = await UserModel.findByEmail(email)
    
    if (!user || !await UserModel.verifyPassword(user, password)) {
      return json({ error: "Credenciales incorrectas" }, { status: 400 })
    }
    
    // Redirect based on user role
    let redirectTo = "/"
    if (user.role === 'admin' || user.role === 'superadmin') {
      redirectTo = "/admin"
    }
    
    return createUserSession(user._id!.toString(), redirectTo)
  } catch (error) {
    console.error(error)
    return json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export default function Login() {
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()
  const [showPassword, setShowPassword] = useState(false)
  
  const isSubmitting = navigation.state === "submitting"

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-sm w-full">
          <div className="text-center mb-12">
            <Link to="/" className="inline-flex items-center space-x-3 mb-8">
              <div className="w-8 h-8 bg-black rounded-full"></div>
              <span className="text-xl font-light tracking-tight text-gray-900">
                Cliquealo
              </span>
            </Link>
            
            <h1 className="text-3xl font-light text-gray-900 mb-3">
              Bienvenido
            </h1>
            <p className="text-gray-600">
              Ingresa a tu cuenta para continuar
            </p>
          </div>

          <Form method="post" className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  autoComplete="current-password"
                  className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {actionData?.error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600">{actionData.error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-800 transition-colors font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Iniciar sesión</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </Form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              ¿No tienes cuenta?{" "}
              <Link 
                to="/auth/register" 
                className="text-gray-900 hover:text-gray-700 transition-colors font-medium"
              >
                Crear cuenta
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Image/Gradient */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="h-full flex items-center justify-center p-12">
          <div className="text-center">
            <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-8"></div>
            <h2 className="text-2xl font-light text-gray-800 mb-4">
              Tu marketplace de confianza
            </h2>
            <p className="text-gray-600 max-w-md">
              Conectamos compradores y vendedores de autos usados de forma simple y segura.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}