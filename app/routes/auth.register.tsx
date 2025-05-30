import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node"
import { Form, useActionData, Link, useNavigation } from "@remix-run/react"
import { UserModel } from "~/models/User"
import { createUserSession, getUserId } from "~/lib/session.server"
import { Eye, EyeOff, ArrowRight, Loader2, Check } from 'lucide-react'
import { useState } from 'react'

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await getUserId(request)
  if (userId) return redirect("/")
  return null
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData()
  const name = formData.get("name") as string
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string
  
  // Validaciones
  if (!name || !email || !password || !confirmPassword) {
    return json({ error: "Todos los campos son requeridos" }, { status: 400 })
  }
  
  if (name.length < 2) {
    return json({ error: "El nombre debe tener al menos 2 caracteres" }, { status: 400 })
  }
  
  if (!email.includes('@')) {
    return json({ error: "Email inválido" }, { status: 400 })
  }
  
  if (password.length < 6) {
    return json({ error: "La contraseña debe tener al menos 6 caracteres" }, { status: 400 })
  }
  
  if (password !== confirmPassword) {
    return json({ error: "Las contraseñas no coinciden" }, { status: 400 })
  }
  
  try {
    // Verificar si el email ya existe
    const existingUser = await UserModel.findByEmail(email)
    if (existingUser) {
      return json({ error: "Este email ya está registrado" }, { status: 400 })
    }
    
    // Crear usuario
    const user = await UserModel.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password
    })
    
    return createUserSession(user._id!.toString(), "/")
  } catch (error) {
    console.error(error)
    return json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export default function Register() {
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  
  const isSubmitting = navigation.state === "submitting"

  const passwordRequirements = [
    { text: "Al menos 6 caracteres", met: formData.password.length >= 6 },
    { text: "Las contraseñas coinciden", met: formData.password === formData.confirmPassword && formData.confirmPassword.length > 0 }
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - Image/Gradient */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="h-full flex items-center justify-center p-12">
          <div className="text-center">
            <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-8"></div>
            <h2 className="text-2xl font-light text-gray-800 mb-4">
              Únete a nuestra comunidad
            </h2>
            <p className="text-gray-600 max-w-md">
              Publica tus autos, encuentra compradores y realiza transacciones seguras.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
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
              Crear cuenta
            </h1>
            <p className="text-gray-600">
              Comienza a vender y comprar autos
            </p>
          </div>

          <Form method="post" className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre completo
              </label>
              <input
                type="text"
                name="name"
                required
                autoComplete="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                placeholder="Tu nombre"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
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
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar contraseña
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            {formData.password && (
              <div className="space-y-2">
                {passwordRequirements.map((req, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      req.met ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      {req.met && <Check className="w-3 h-3 text-green-600" />}
                    </div>
                    <span className={req.met ? 'text-green-600' : 'text-gray-500'}>
                      {req.text}
                    </span>
                  </div>
                ))}
              </div>
            )}

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
                  <span>Crear cuenta</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </Form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              ¿Ya tienes cuenta?{" "}
              <Link 
                to="/auth/login" 
                className="text-gray-900 hover:text-gray-700 transition-colors font-medium"
              >
                Iniciar sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}