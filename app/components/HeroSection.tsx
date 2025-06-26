import { Form, Link } from "@remix-run/react";
import {
  Search,
  ArrowRight,
  Star,
  TrendingUp,
  Users,
  Shield
} from 'lucide-react';
import {
  Card,
  CardBody,
  Button,
  Input,
  Chip,
  Badge,
  Divider
} from "@heroui/react";
import PremiumBrandsCarousel from "~/components/ui/premium-brands-carousel";

type HeroSectionProps = {
  type: 'home' | 'listings';
  search?: string;
  totalCount?: number;
  brandsCount?: number;
};

export default function HeroSection({ type, search = "", totalCount = 0, brandsCount = 0 }: HeroSectionProps) {
  return (
    <section className="bg-gradient-to-br from-gray-50 via-white to-red-50/30 border-b border-gray-100">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Content */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          {type === 'home' ? (
            <div className="mb-8">
              <div className="inline-block relative">
                <div className="absolute -top-7 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  Nuevo
                </div>
                <Chip
                  startContent={<Star className="w-4 h-4" />}
                  variant="flat"
                  color="warning"
                >
                  Plataforma Confiable
                </Chip>
              </div>
            </div>
          ) : (
            <div className="mb-8">
              <div className="inline-block relative">
                <div className="absolute -top-6 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  Actualizado
                </div>
                <Chip
                  startContent={<TrendingUp className="w-4 h-4" />}
                  variant="flat"
                  color="primary"
                >
                  Catálogo Completo
                </Chip>
              </div>
            </div>
          )}
          
          <h1 className="text-4xl sm:text-6xl font-light text-gray-900 mb-6 tracking-tight">
            {type === 'home' ? (
              <>
                Encuentra tu{" "}
                <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent font-medium">
                  auto ideal
                </span>
              </>
            ) : (
              <>
                Explorar{" "}
                <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent font-medium">
                  Catálogo
                </span>
              </>
            )}
          </h1>
          
          <p className="text-xl text-gray-600 font-light mb-8 leading-relaxed">
            {type === 'home' ? (
              "Catálogo seleccionado de autos certificados por nuestro equipo de expertos"
            ) : (
              `Encuentra tu auto ideal entre nuestras ${totalCount} opciones disponibles`
            )}
          </p>

          {type === 'home' ? (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 max-w-2xl mx-auto">
                <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm">
                  <CardBody className="text-center py-4">
                    <div className="flex items-center justify-center mb-2">
                      <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                      <span className="text-2xl font-bold text-gray-900">500+</span>
                    </div>
                    <p className="text-sm text-gray-600">Autos Disponibles</p>
                  </CardBody>
                </Card>
                
                <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm">
                  <CardBody className="text-center py-4">
                    <div className="flex items-center justify-center mb-2">
                      <Users className="w-5 h-5 text-blue-600 mr-2" />
                      <span className="text-2xl font-bold text-gray-900">1,200+</span>
                    </div>
                    <p className="text-sm text-gray-600">Clientes Felices</p>
                  </CardBody>
                </Card>
                
                <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm">
                  <CardBody className="text-center py-4">
                    <div className="flex items-center justify-center mb-2">
                      <Shield className="w-5 h-5 text-purple-600 mr-2" />
                      <span className="text-2xl font-bold text-gray-900">100%</span>
                    </div>
                    <p className="text-sm text-gray-600">Verificados</p>
                  </CardBody>
                </Card>
              </div>

              {/* Premium Brands Carousel */}
              <PremiumBrandsCarousel />
            </>
          ) : (
            <>
              {/* Quick Stats for Listings */}
              <div className="flex justify-center items-center gap-6 mb-8">
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

        {/* Enhanced Search Form */}
        <Form method="get" className="max-w-4xl mx-auto">
          <Card className="bg-white/80 backdrop-blur-md border-0 shadow-xl">
            <CardBody className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    type="search"
                    name="search"
                    defaultValue={search}
                    placeholder="Buscar por marca, modelo, año..."
                    startContent={<Search className="w-5 h-5 text-gray-400" />}
                    size="lg"
                    variant="flat"
                    className="w-full"
                    classNames={{
                      input: "text-lg",
                      inputWrapper: "bg-gray-50 border-0 hover:bg-gray-100 focus-within:bg-white"
                    }}
                  />
                </div>
                <Button
                  type="submit"
                  color="danger"
                  size="lg"
                  className="px-8 font-medium"
                  endContent={<ArrowRight className="w-5 h-5" />}
                >
                  Buscar Autos
                </Button>
              </div>
            </CardBody>
          </Card>
        </Form>
      </div>
    </section>
  );
}