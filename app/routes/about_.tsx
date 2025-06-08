import { json, type LoaderFunctionArgs } from "@remix-run/node"
import { useLoaderData, Link } from "@remix-run/react"
import { getUser } from "~/lib/session.server"
import { 
  Heart, 
  Lightbulb, 
  Shield, 
  Users, 
  Target, 
  TrendingUp,
  Star,
  Zap,
  Globe,
  Award
} from 'lucide-react'

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request)
  return json({ user })
}

export default function About() {
  const { user } = useLoaderData<typeof loader>()

  const valores = [
    {
      title: "Confianza",
      description: "Operamos con integridad, transparencia y compromiso en cada trato y cada entrega.",
      icon: Shield,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Innovación", 
      description: "Creamos soluciones únicas en tecnología, marketing y comercio para mantenernos siempre un paso adelante.",
      icon: Lightbulb,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Versatilidad",
      description: "Nos adaptamos al cambio, combinando creatividad, análisis y acción en diferentes áreas de negocio.",
      icon: Zap,
      color: "from-orange-500 to-orange-600"
    },
    {
      title: "Pasión por el cliente",
      description: "Escuchamos, entendemos y resolvemos, poniendo al cliente en el centro de todo.",
      icon: Heart,
      color: "from-red-500 to-red-600"
    },
    {
      title: "Excelencia",
      description: "Nos enfocamos en hacer las cosas bien, desde una cotización de auto hasta una línea de código.",
      icon: Award,
      color: "from-green-500 to-green-600"
    },
    {
      title: "Crecimiento compartido",
      description: "Generamos alianzas y oportunidades para todos los que forman parte de nuestra comunidad.",
      icon: TrendingUp,
      color: "from-indigo-500 to-indigo-600"
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-100 via-transparent to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="inline-block">
                <span className="text-sm font-medium text-gray-500 tracking-wider uppercase">
                  ⸻ Conoce Nuestra Historia ⸻
                </span>
              </div>
              <h1 className="text-5xl sm:text-7xl font-light text-gray-900 tracking-tight">
                CLIQUEALO
                <span className="block text-2xl sm:text-3xl font-normal text-gray-600 mt-2">
                  DE MÉXICO
                </span>
              </h1>
              <p className="text-xl sm:text-2xl font-light text-gray-600 max-w-4xl mx-auto leading-relaxed">
                "Creando no solo una marca, sino un estilo de vida."
              </p>
            </div>
            
            <div className="flex items-center justify-center space-x-8 pt-8">
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
              <Globe className="w-8 h-8 text-gray-400" />
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-3">
                  <Target className="w-8 h-8 text-blue-600" />
                  <span className="text-sm font-medium text-gray-500 tracking-wider uppercase">
                    ⸻ Nuestra Visión ⸻
                  </span>
                </div>
                <h2 className="text-4xl sm:text-5xl font-light text-gray-900 leading-tight">
                  Transformando
                  <span className="block text-blue-600">experiencias</span>
                </h2>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                Ser una marca mexicana referente en innovación y confianza, que transforma la experiencia de compra-venta de autos, el desarrollo tecnológico y la creación de contenido, conectando a las personas con soluciones digitales, seguras y creativas.
              </p>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 flex items-center justify-center">
                <div className="text-center space-y-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mx-auto flex items-center justify-center">
                    <Star className="w-12 h-12 text-white" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-medium text-gray-900">Innovación</h3>
                    <p className="text-gray-600">Líder en transformación digital</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="lg:order-2 space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-3">
                  <Users className="w-8 h-8 text-green-600" />
                  <span className="text-sm font-medium text-gray-500 tracking-wider uppercase">
                    ⸻ Nuestra Misión ⸻
                  </span>
                </div>
                <h2 className="text-4xl sm:text-5xl font-light text-gray-900 leading-tight">
                  Impulsando
                  <span className="block text-green-600">crecimiento</span>
                </h2>
              </div>
              <div className="space-y-6">
                <p className="text-lg text-gray-600 leading-relaxed">
                  Impulsar el crecimiento de nuestros clientes mediante servicios integrales en tres pilares fundamentales:
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-3 flex-shrink-0"></div>
                    <p className="text-gray-600">
                      <span className="font-medium text-gray-900">Venta de autos</span> con procesos transparentes, confiables y adaptados a las necesidades reales del mercado.
                    </p>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-3 flex-shrink-0"></div>
                    <p className="text-gray-600">
                      <span className="font-medium text-gray-900">Creación de contenidos</span> que informan, inspiran y generan valor.
                    </p>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-3 flex-shrink-0"></div>
                    <p className="text-gray-600">
                      <span className="font-medium text-gray-900">Desarrollo de software</span> que automatiza, optimiza y transforma digitalmente negocios y experiencias.
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-600 font-medium">
                  Todo esto con un enfoque humano, profesional y centrado en la calidad.
                </p>
              </div>
            </div>
            
            <div className="lg:order-1 relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="aspect-square bg-gradient-to-br from-green-100 to-green-200 rounded-2xl p-6 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-600 rounded-xl mx-auto mb-3 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">🚗</span>
                      </div>
                      <p className="text-sm font-medium text-green-900">Autos</p>
                    </div>
                  </div>
                  <div className="aspect-square bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl p-6 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-600 rounded-xl mx-auto mb-3 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">📱</span>
                      </div>
                      <p className="text-sm font-medium text-purple-900">Software</p>
                    </div>
                  </div>
                </div>
                <div className="pt-8">
                  <div className="aspect-square bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl p-6 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-orange-600 rounded-xl mx-auto mb-3 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">✨</span>
                      </div>
                      <p className="text-sm font-medium text-orange-900">Contenido</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <span className="text-sm font-medium text-gray-500 tracking-wider uppercase">
              ⸻ Nuestros Valores ⸻
            </span>
            <h2 className="text-4xl sm:text-5xl font-light text-gray-900">
              Lo que nos
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                define
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {valores.map((valor, index) => {
              const IconComponent = valor.icon
              return (
                <div
                  key={valor.title}
                  className="group relative bg-white rounded-2xl p-8 border border-gray-100 hover:border-gray-200 transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="space-y-6">
                    <div className="relative">
                      <div className={`w-16 h-16 bg-gradient-to-br ${valor.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <div className={`absolute inset-0 w-16 h-16 bg-gradient-to-br ${valor.color} rounded-2xl opacity-20 scale-125 group-hover:scale-150 transition-transform duration-500`}></div>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                        {valor.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {valor.description}
                      </p>
                    </div>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute top-4 right-4 w-6 h-6 text-gray-200 group-hover:text-gray-300 transition-colors">
                    <span className="text-lg font-light">0{index + 1}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl sm:text-5xl font-light text-white">
                ¿Listo para ser parte de
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  la experiencia?
                </span>
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                Únete a nosotros y descubre cómo podemos transformar tu manera de ver los negocios digitales.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/listings"
                className="inline-flex items-center space-x-2 bg-white text-gray-900 px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors font-medium"
              >
                <span>Explorar Catálogo</span>
              </Link>
              
              <Link
                to="/auth/register"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-medium"
              >
                <span>Comenzar Ahora</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}