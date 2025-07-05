import {
  Star,
  TrendingUp,
  Users,
  Shield,
  Sparkles
} from 'lucide-react';
import {
  Card,
  CardBody,
  Divider
} from "@heroui/react";
import PremiumBrandsCarousel from "~/components/ui/premium-brands-carousel";
import UltraResponsiveSearch from "~/components/ui/ultra-responsive-search";

type HeroSectionProps = {
  type: 'home' | 'listings';
  search?: string;
  totalCount?: number;
  brandsCount?: number;
  listings?: any[]; // Para pasar los listings al componente de búsqueda
};

export default function HeroSection({ type, search = "", totalCount = 0, brandsCount = 0, listings = [] }: HeroSectionProps) {
  return (
    <section className="bg-gradient-to-br from-gray-50 via-white to-red-50/30 border-b border-gray-100 relative">
      {/* Background pattern container with overflow hidden for visual effect only */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle background patterns for depth */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none"></div>
      </div>
      
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        {/* Hero Content */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          {type === 'home' ? (
            <div className="mb-10">
              <div className="flex items-center justify-center gap-2 group cursor-pointer">
                <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center space-x-3 hover:bg-red-50 group-hover:scale-105">
                  <div className="w-7 h-7 flex items-center justify-center bg-blue-100 rounded-full text-blue-600 group-hover:bg-blue-200 transition-colors">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-gray-900 font-medium">Calidad Garantizada</span>
                    <span className="text-xs text-gray-500">Autos verificados por expertos</span>
                  </div>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center space-x-3 hover:bg-yellow-50 group-hover:scale-105">
                  <Star className="w-6 h-6 text-amber-500 fill-yellow-400 drop-shadow-[0_0_5px_rgba(245,158,11,0.8)] animate-[shine_2s_ease-in-out_infinite] filter contrast-125 brightness-110" />
                  <div className="flex flex-col">
                    <span className="text-gray-900 font-medium">Plataforma Confiable</span>
                    <span className="text-xs text-gray-500">Experiencia comprobada a su servicio</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-8">
              <div className="inline-block relative">
                <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <div className="flex flex-col">
                    <span className="text-gray-900 font-medium">Catálogo Actualizado</span>
                    <span className="text-xs text-gray-500">Encuentra opciones exclusivas</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <h1 className="text-4xl sm:text-6xl font-light text-gray-900 mb-6 tracking-tight relative">
            {/* Decorative element */}
            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-red-100 opacity-30 text-8xl font-bold select-none hidden sm:block">
              <Sparkles className="w-10 h-10 text-red-300/50" />
            </span>
            {type === 'home' ? (
              <>
                Encuentre Su{" "}
                <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent font-medium relative inline-block">
                  <span className="absolute -inset-1 bg-red-100/20 blur-xl rounded-full"></span>
                  Auto Ideal
                </span>
              </>
            ) : (
              <>
                Explorar{" "}
                <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent font-medium relative inline-block">
                  <span className="absolute -inset-1 bg-red-100/20 blur-xl rounded-full"></span>
                  Catálogo
                </span>
              </>
            )}
          </h1>
          
          <p className="text-xl text-gray-600 font-light mb-10 leading-relaxed max-w-2xl mx-auto">
            {type === 'home' ? (
              "Catálogo seleccionado de autos certificados por nuestro equipo de expertos"
            ) : (
              `Encuentra tu auto ideal entre nuestras ${totalCount} opciones disponibles`
            )}
          </p>

          {type === 'home' ? (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12 max-w-2xl mx-auto">
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group overflow-hidden">
                  <CardBody className="text-center py-5">
                    <div className="flex items-center justify-center mb-3 relative">
                      <div className="absolute -inset-3 bg-green-100/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <TrendingUp className="w-6 h-6 text-green-600 mr-2 relative z-10" />
                      <span className="text-3xl font-bold text-gray-900 relative z-10">500+</span>
                    </div>
                    <p className="text-sm font-medium text-gray-600">Autos Disponibles</p>
                  </CardBody>
                </Card>
                
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group overflow-hidden">
                  <CardBody className="text-center py-5">
                    <div className="flex items-center justify-center mb-3 relative">
                      <div className="absolute -inset-3 bg-blue-100/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <Users className="w-6 h-6 text-blue-600 mr-2 relative z-10" />
                      <span className="text-3xl font-bold text-gray-900 relative z-10">1,200+</span>
                    </div>
                    <p className="text-sm font-medium text-gray-600">Clientes Felices</p>
                  </CardBody>
                </Card>
                
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group overflow-hidden">
                  <CardBody className="text-center py-5">
                    <div className="flex items-center justify-center mb-3 relative">
                      <div className="absolute -inset-3 bg-purple-100/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <Shield className="w-6 h-6 text-purple-600 mr-2 relative z-10" />
                      <span className="text-3xl font-bold text-gray-900 relative z-10">100%</span>
                    </div>
                    <p className="text-sm font-medium text-gray-600">Verificados</p>
                  </CardBody>
                </Card>
              </div>

              {/* Premium Brands Carousel */}
              <PremiumBrandsCarousel />
            </>
          ) : (
            <>
              {/* Quick Stats for Listings */}
              <div className="flex justify-center items-center gap-8 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{totalCount}</div>
                  <div className="text-sm text-gray-600">Autos Disponibles</div>
                </div>
                <Divider orientation="vertical" className="h-12" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{brandsCount}</div>
                  <div className="text-sm text-gray-600">Marcas</div>
                </div>
                <Divider orientation="vertical" className="h-12" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">100%</div>
                  <div className="text-sm text-gray-600">Verificados</div>
                </div>
              </div>

            </>
          )}
        </div>

        {/* Ultra-Responsive Search with Framer Motion */}
        <div className="max-w-4xl mx-auto relative z-20">
          <UltraResponsiveSearch 
            defaultValue={search}
            type={type}
            className="w-full"
            listings={listings}
          />
        </div>
      </div>

      {/* CSS for background pattern and animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .bg-grid-pattern {
            background-image: 
              linear-gradient(to right, rgba(200, 200, 200, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(200, 200, 200, 0.1) 1px, transparent 1px);
            background-size: 40px 40px;
          }
          
          @keyframes shine {
            0% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.1); }
            100% { opacity: 0.4; transform: scale(1); }
          }
        `
      }} />
    </section>
  );
}