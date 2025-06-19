import { useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'

interface Brand {
  name: string
  logo: string
}

const premiumBrands: Brand[] = [
  {
    name: 'Mercedes-Benz',
    logo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/optimized/mercedes-benz.png'
  },
  {
    name: 'BMW',
    logo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/optimized/bmw.png'
  },
  {
    name: 'Audi',
    logo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/optimized/audi.png'
  },
  {
    name: 'Lexus',
    logo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/optimized/lexus.png'
  },
  {
    name: 'Porsche',
    logo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/optimized/porsche.png'
  },
  {
    name: 'Jaguar',
    logo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/optimized/jaguar.png'
  },
  {
    name: 'Land Rover',
    logo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/optimized/land-rover.png'
  },
  {
    name: 'Volvo',
    logo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/optimized/volvo.png'
  },
  {
    name: 'Infiniti',
    logo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/optimized/infiniti.png'
  },
  {
    name: 'Acura',
    logo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/optimized/acura.png'
  },
  {
    name: 'Cadillac',
    logo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/optimized/cadillac.png'
  },
  {
    name: 'Genesis',
    logo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/optimized/genesis.png'
  },
  {
    name: 'Tesla',
    logo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/optimized/tesla.png'
  },
  {
    name: 'Ferrari',
    logo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/optimized/ferrari.png'
  },
  {
    name: 'Lamborghini',
    logo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/optimized/lamborghini.png'
  },
  {
    name: 'Maserati',
    logo: 'https://raw.githubusercontent.com/filippofilip95/car-logos-dataset/master/logos/optimized/maserati.png'
  }
]

export default function PremiumBrandsCarousel() {
  const swiperRef = useRef<any>(null)

  return (
    <div className="w-full py-8 overflow-hidden relative">
      {/* Gradientes difuminados en los bordes */}
      <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
      
      <div className="w-full">
        <div className="premium-brands-swiper overflow-hidden">
          <div className="flex animate-scroll">
            {/* Duplicamos las marcas para crear el efecto infinito */}
            {[...premiumBrands, ...premiumBrands, ...premiumBrands].map((brand, index) => (
              <div key={`${brand.name}-${index}`} className="flex-shrink-0 mx-8">
                <div className="flex items-center justify-center h-20">
                  <div className="w-16 h-16 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0">
                    <img
                      src={brand.logo}
                      alt={`${brand.name} logo`}
                      className="max-w-full max-h-full object-contain filter"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        const parent = target.parentElement
                        if (parent) {
                          parent.innerHTML = `<span class="text-gray-400 font-bold text-xs text-center">${brand.name}</span>`
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .animate-scroll {
            animation: scroll 30s linear infinite;
            will-change: transform;
          }
          
          .premium-brands-swiper:hover .animate-scroll {
            animation-play-state: paused;
          }
          
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-33.333%);
            }
          }
        `
      }} />
    </div>
  )
}