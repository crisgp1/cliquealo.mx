import { useState, useRef, useEffect } from 'react'
import { Form, useNavigate, useSubmit, useFetcher } from '@remix-run/react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  ArrowRight,
  X,
  Filter,
  Clock,
  TrendingUp,
  Star
} from 'lucide-react'
import {
  Card,
  CardBody,
  Button,
  Input,
  Chip,
  Divider,
  Badge
} from "@heroui/react"

interface Brand {
  name: string
  logo: string
}

interface SearchSuggestion {
  id: string
  type: 'brand' | 'model' | 'recent' | 'hot' | 'super-hot'
  text: string
  icon?: any
  brand?: string
  count?: number
  hotStatus?: 'hot' | 'super-hot' | 'normal'
  viewsCount?: number
}

// Marcas populares con logos
const popularBrands: Brand[] = [
  {
    name: 'Toyota',
    logo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/optimized/toyota.png'
  },
  {
    name: 'Honda',
    logo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/optimized/honda.png'
  },
  {
    name: 'Nissan',
    logo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/optimized/nissan.png'
  },
  {
    name: 'Ford',
    logo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/optimized/ford.png'
  },
  {
    name: 'Chevrolet',
    logo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/optimized/chevrolet.png'
  },
  {
    name: 'Volkswagen',
    logo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/optimized/volkswagen.png'
  },
  {
    name: 'Hyundai',
    logo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/optimized/hyundai.png'
  },
  {
    name: 'Kia',
    logo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/optimized/kia.png'
  },
  {
    name: 'BMW',
    logo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/optimized/bmw.png'
  },
  {
    name: 'Mercedes-Benz',
    logo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/optimized/mercedes-benz.png'
  },
  {
    name: 'Audi',
    logo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/optimized/audi.png'
  },
  {
    name: 'Mazda',
    logo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/optimized/mazda.png'
  }
]

// Función para procesar listings y generar sugerencias hot
const generateHotSuggestions = (listings: any[]): SearchSuggestion[] => {
  if (!listings || listings.length === 0) return [];
  
  // Primero obtener los hot y super-hot
  const hotListings = listings
    .filter((listing: any) => listing.hotStatus === 'hot' || listing.hotStatus === 'super-hot')
    .slice(0, 6); // Máximo 6 hot/super-hot
  
  // Si no hay suficientes hot, agregar los más populares por vistas
  const popularListings = listings
    .filter((listing: any) => listing.hotStatus !== 'hot' && listing.hotStatus !== 'super-hot')
    .sort((a: any, b: any) => (b.viewsCount || 0) - (a.viewsCount || 0))
    .slice(0, 8 - hotListings.length); // Completar hasta 8 total
  
  const allSuggestions = [...hotListings, ...popularListings];
  
  return allSuggestions.map((listing: any, index: number) => ({
    id: listing._id || `suggestion-${index}`,
    type: listing.hotStatus === 'super-hot' ? 'super-hot' : 
          listing.hotStatus === 'hot' ? 'hot' : 'recent',
    text: `${listing.brand} ${listing.model} ${listing.year}`,
    hotStatus: listing.hotStatus || 'normal',
    viewsCount: listing.viewsCount || 0,
    count: listing.viewsCount || 0
  }));
}

interface UltraResponsiveSearchProps {
  defaultValue?: string
  type?: 'home' | 'listings'
  onBrandClick?: (brand: string) => void
  className?: string
  listings?: any[] // Listings para generar sugerencias hot
}

export default function UltraResponsiveSearch({ 
  defaultValue = "", 
  type = 'home',
  onBrandClick,
  className = "",
  listings = []
}: UltraResponsiveSearchProps) {
  const [searchValue, setSearchValue] = useState(defaultValue)
  const [isFocused, setIsFocused] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const submit = useSubmit()
  
  // Generar sugerencias hot dinámicamente
  const hotSuggestions = generateHotSuggestions(listings)
  
  // Debug: console log para verificar que los datos lleguen
  useEffect(() => {
    if (listings.length > 0) {
      console.log('🔥 Listings recibidos en search:', listings.length)
      console.log('🔥 Hot suggestions generadas:', hotSuggestions.length)
    }
  }, [listings, hotSuggestions])

  // Cargar búsquedas recientes del localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recent-car-searches')
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved))
      } catch (error) {
        console.log('Error loading recent searches:', error)
      }
    }
  }, [])

  // Guardar búsqueda en el historial
  const saveSearch = (query: string) => {
    if (query.trim() && !recentSearches.includes(query.trim())) {
      const updated = [query.trim(), ...recentSearches.slice(0, 4)]
      setRecentSearches(updated)
      localStorage.setItem('recent-car-searches', JSON.stringify(updated))
    }
  }

  // Manejar envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchValue.trim()) {
      saveSearch(searchValue)
      setShowSuggestions(false)
      setIsFocused(false)
      
      // Navegar según el tipo de página
      if (type === 'home') {
        navigate(`/?search=${encodeURIComponent(searchValue.trim())}`)
      } else {
        navigate(`/listings?search=${encodeURIComponent(searchValue.trim())}`)
      }
    }
  }

  // Manejar clic en marca
  const handleBrandClick = (brandName: string) => {
    setSearchValue(brandName)
    saveSearch(brandName)
    setShowSuggestions(false)
    setIsFocused(false)
    
    if (onBrandClick) {
      onBrandClick(brandName)
    } else {
      if (type === 'home') {
        navigate(`/?search=${encodeURIComponent(brandName)}`)
      } else {
        navigate(`/listings?search=${encodeURIComponent(brandName)}`)
      }
    }
  }

  // Manejar clic en sugerencia
  const handleSuggestionClick = (suggestion: string) => {
    setSearchValue(suggestion)
    saveSearch(suggestion)
    setShowSuggestions(false)
    setIsFocused(false)
    
    if (type === 'home') {
      navigate(`/?search=${encodeURIComponent(suggestion)}`)
    } else {
      navigate(`/listings?search=${encodeURIComponent(suggestion)}`)
    }
  }

  // Limpiar búsqueda
  const clearSearch = () => {
    setSearchValue("")
    setShowSuggestions(false)
    if (searchRef.current) {
      searchRef.current.focus()
    }
  }

  // Filtrar marcas basado en la búsqueda
  const filteredBrands = popularBrands.filter(brand =>
    brand.name.toLowerCase().includes(searchValue.toLowerCase())
  )

  return (
    <div className={`relative w-full ${className}`}>
      <Form onSubmit={handleSubmit} className="relative">
        <motion.div
          layout
          className="relative"
          animate={{ 
            scale: isFocused ? 1.02 : 1,
            y: isFocused ? -2 : 0
          }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30 
          }}
        >
          <Card className={`
            bg-white/90 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transition-all duration-300
            ${isFocused ? 'ring-4 ring-red-500/20' : ''}
          `}>
            <CardBody className="p-6 sm:p-8">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Input
                    ref={searchRef}
                    type="search"
                    name="search"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onFocus={() => {
                      setIsFocused(true)
                      setShowSuggestions(true)
                    }}
                    onBlur={() => {
                      // Delay to allow clicks on suggestions
                      setTimeout(() => {
                        setIsFocused(false)
                        setShowSuggestions(false)
                      }, 200)
                    }}
                    placeholder="Buscar por marca, modelo, año..."
                    startContent={
                      <motion.div
                        animate={{ 
                          scale: isFocused ? 1.1 : 1,
                          rotate: isFocused ? 5 : 0
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <Search className={`w-5 h-5 transition-colors ${
                          isFocused ? 'text-red-500' : 'text-gray-400'
                        }`} />
                      </motion.div>
                    }
                    endContent={
                      searchValue && (
                        <motion.button
                          type="button"
                          onClick={clearSearch}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                        >
                          <X className="w-4 h-4 text-gray-400" />
                        </motion.button>
                      )
                    }
                    size="lg"
                    variant="flat"
                    className="w-full"
                    classNames={{
                      input: "text-lg",
                      inputWrapper: `
                        bg-gray-50 border-0 hover:bg-gray-100 
                        focus-within:bg-white transition-colors
                        ${isFocused ? 'bg-white shadow-md' : ''}
                      `
                    }}
                  />
                </div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    type="submit"
                    color="danger"
                    size="lg"
                    className="px-8 font-medium shadow-md hover:shadow-lg transition-all duration-300"
                    endContent={
                      <motion.div
                        animate={{ x: isFocused ? 3 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ArrowRight className="w-5 h-5" />
                      </motion.div>
                    }
                  >
                    Buscar
                  </Button>
                </motion.div>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </Form>

      {/* Suggestions Dropdown with Framer Motion */}
      <AnimatePresence>
        {showSuggestions && (isFocused || searchValue) && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 30,
              duration: 0.3
            }}
            className="absolute top-full left-0 right-0 z-[100] mt-2"
          >
            <Card className="bg-white/95 backdrop-blur-lg border-0 shadow-2xl max-h-96 sm:max-h-[28rem] overflow-y-auto">
              <CardBody className="p-6">
                
                {/* Brand Carousel Section */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="mb-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      Marcas Populares
                    </h4>
                    <Badge color="primary" variant="flat" size="sm">
                      {filteredBrands.length}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {filteredBrands.slice(0, 12).map((brand, index) => (
                      <motion.button
                        key={brand.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ 
                          scale: 1.05, 
                          y: -2,
                          boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleBrandClick(brand.name)}
                        className="p-3 rounded-xl bg-gray-50 hover:bg-white border border-gray-100 hover:border-red-200 transition-all duration-200 group"
                      >
                        <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                          <img
                            src={brand.logo}
                            alt={`${brand.name} logo`}
                            className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                              const parent = target.parentElement
                              if (parent) {
                                parent.innerHTML = `<span class="text-gray-400 font-bold text-xs">${brand.name.substring(0, 3).toUpperCase()}</span>`
                              }
                            }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-600 group-hover:text-gray-900 transition-colors block truncate">
                          {brand.name}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                <Divider className="my-4" />

                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-4"
                  >
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      Búsquedas Recientes
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((search, index) => (
                        <motion.div
                          key={search}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Chip
                            onClick={() => handleSuggestionClick(search)}
                            variant="flat"
                            color="primary"
                            className="cursor-pointer hover:bg-blue-100 transition-colors"
                            startContent={<Clock className="w-3 h-3" />}
                          >
                            {search}
                          </Chip>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Trending Suggestions - Basado en algoritmo hot y popularidad */}
                {hotSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-red-500" />
                      Tendencias y Populares 🔥
                    </h4>
                    <div className="space-y-2">
                      {hotSuggestions.map((suggestion, index) => {
                        const isHot = suggestion.hotStatus === 'hot' || suggestion.hotStatus === 'super-hot';
                        const isSuperHot = suggestion.hotStatus === 'super-hot';
                        
                        return (
                          <motion.button
                            key={suggestion.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ 
                              x: 5,
                              backgroundColor: isSuperHot 
                                ? "rgba(254, 242, 242, 0.8)" 
                                : isHot
                                ? "rgba(255, 247, 237, 0.8)"
                                : "rgba(239, 246, 255, 0.8)"
                            }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSuggestionClick(suggestion.text)}
                            className={`w-full p-3 rounded-lg transition-all duration-200 flex items-center justify-between group ${
                              isSuperHot 
                                ? 'hover:bg-red-50 border border-red-100' 
                                : isHot
                                ? 'hover:bg-orange-50 border border-orange-100'
                                : 'hover:bg-blue-50 border border-blue-100'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                                isSuperHot
                                  ? 'bg-red-100 group-hover:bg-red-200'
                                  : isHot
                                  ? 'bg-orange-100 group-hover:bg-orange-200'
                                  : 'bg-blue-100 group-hover:bg-blue-200'
                              }`}>
                                {isSuperHot ? (
                                  <span className="text-xs">🔥🔥</span>
                                ) : isHot ? (
                                  <span className="text-xs">🔥</span>
                                ) : (
                                  <TrendingUp className="w-4 h-4 text-blue-600" />
                                )}
                              </div>
                              <span className="font-medium text-gray-700 group-hover:text-gray-900">
                                {suggestion.text}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {isHot && (
                                <Badge 
                                  color={isSuperHot ? "danger" : "warning"} 
                                  variant="flat" 
                                  size="sm"
                                  className={isSuperHot ? 'animate-pulse' : ''}
                                >
                                  {isSuperHot ? 'Super Hot' : 'Hot'}
                                </Badge>
                              )}
                              <Badge color="default" variant="flat" size="sm">
                                {suggestion.viewsCount} vistas
                              </Badge>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </CardBody>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}