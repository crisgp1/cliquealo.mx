import { generateOrganizationJsonLd, generateWebsiteJsonLd, DEFAULT_SEO } from "~/lib/seo"

interface AdvancedSEOProps {
  includeOrganization?: boolean
  includeWebsite?: boolean
  includeBreadcrumbs?: boolean
  breadcrumbs?: Array<{
    name: string
    item: string
  }>
}

export default function AdvancedSEO({ 
  includeOrganization = true,
  includeWebsite = true,
  includeBreadcrumbs = false,
  breadcrumbs = []
}: AdvancedSEOProps) {
  return (
    <>
      {/* Google Search Console Verification */}
      <meta name="google-site-verification" content="tu-codigo-de-verificacion-aqui" />
      
      {/* Bing Webmaster Tools Verification */}
      <meta name="msvalidate.01" content="tu-codigo-de-verificacion-bing-aqui" />
      
      {/* Enhanced Meta Tags para autos seminuevos */}
      <meta name="geo.region" content="MX" />
      <meta name="geo.country" content="Mexico" />
      <meta name="geo.placename" content="México" />
      <meta name="ICBM" content="19.4326, -99.1332" />
      <meta name="DC.title" content={DEFAULT_SEO.title} />
      <meta name="DC.subject" content="Autos seminuevos, vehículos usados certificados" />
      <meta name="DC.description" content={DEFAULT_SEO.description} />
      <meta name="DC.language" content="es" />
      <meta name="DC.coverage" content="México" />
      
      {/* Robots Meta Tags Avanzados */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="bingbot" content="index, follow" />
      
      {/* Mobile & PWA Meta Tags */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Cliquéalo.mx" />
      <meta name="format-detection" content="telephone=yes" />
      <meta name="HandheldFriendly" content="true" />
      <meta name="MobileOptimized" content="width" />
      
      {/* Theme Colors */}
      <meta name="theme-color" content="#dc2626" />
      <meta name="msapplication-TileColor" content="#dc2626" />
      <meta name="msapplication-navbutton-color" content="#dc2626" />
      <meta name="apple-mobile-web-app-status-bar-style" content="#dc2626" />
      
      {/* Preconnect to external domains para performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://res.cloudinary.com" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      
      {/* Alternate Links para SEO internacional */}
      <link rel="alternate" href="https://cliquealo.mx" hrefLang="es-mx" />
      <link rel="alternate" href="https://cliquealo.mx" hrefLang="es" />
      <link rel="alternate" href="https://cliquealo.mx" hrefLang="x-default" />
      
      {/* Organization JSON-LD */}
      {includeOrganization && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: generateOrganizationJsonLd()
          }}
        />
      )}
      
      {/* Website JSON-LD */}
      {includeWebsite && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: generateWebsiteJsonLd()
          }}
        />
      )}
      
      {/* BreadcrumbList JSON-LD */}
      {includeBreadcrumbs && breadcrumbs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": breadcrumbs.map((crumb, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": crumb.name,
                "item": crumb.item
              }))
            })
          }}
        />
      )}
      
      {/* LocalBusiness JSON-LD para SEO local */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "@id": "https://cliquealo.mx/#localbusiness",
            "name": "Cliquéalo.mx",
            "description": "Agencia de autos seminuevos certificados en México",
            "url": "https://cliquealo.mx",
            "telephone": "+52-XXX-XXX-XXXX",
            "priceRange": "$$",
            "image": "https://cliquealo.mx/assets/og-autos-seminuevos.jpg",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Tu dirección aquí",
              "addressLocality": "Ciudad de México",
              "addressRegion": "CDMX",
              "postalCode": "XXXXX",
              "addressCountry": "MX"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "19.4326",
              "longitude": "-99.1332"
            },
            "sameAs": [
              "https://www.facebook.com/cliquealo",
              "https://www.instagram.com/cliquealo_mx",
              "https://twitter.com/cliquealo_mx",
              "https://www.linkedin.com/company/cliquealo"
            ],
            "openingHoursSpecification": [
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday",
                  "Tuesday", 
                  "Wednesday",
                  "Thursday",
                  "Friday"
                ],
                "opens": "09:00",
                "closes": "18:00"
              },
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": "Saturday",
                "opens": "09:00",
                "closes": "15:00"
              }
            ],
            "serviceArea": {
              "@type": "Country",
              "name": "México"
            }
          })
        }}
      />
      
      {/* FAQ JSON-LD para aparecer en featured snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "¿Qué es un auto seminuevo?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Un auto seminuevo es un vehículo que ha sido usado por poco tiempo, generalmente de 1 a 3 años, con bajo kilometraje y en excelente condición. En Cliquéalo.mx todos nuestros autos seminuevos están certificados y verificados."
                }
              },
              {
                "@type": "Question", 
                "name": "¿Ofrecen financiamiento para autos seminuevos?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Sí, ofrecemos diferentes opciones de financiamiento con enganches desde el 30% y plazos de hasta 72 meses. Trabajamos con diversos bancos y financieras para obtener las mejores tasas."
                }
              },
              {
                "@type": "Question",
                "name": "¿Los autos seminuevos tienen garantía?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Todos nuestros autos seminuevos incluyen garantía limitada y están respaldados por nuestro proceso de certificación de 100+ puntos de inspección."
                }
              },
              {
                "@type": "Question",
                "name": "¿Puedo intercambiar mi auto actual?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Sí, aceptamos tu auto actual como parte de pago. Realizamos una evaluación gratuita para determinar el valor de intercambio de tu vehículo."
                }
              }
            ]
          })
        }}
      />
    </>
  )
}