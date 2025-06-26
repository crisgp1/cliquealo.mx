#!/bin/bash

# ========================================
# SCRIPT DE CONFIGURACIÓN LAZY LOADING
# ========================================

set -e

echo "🚀 Configurando Lazy Loading para React Remix..."
echo ""

# ========================================
# 1. BACKUP DEL PROYECTO ACTUAL
# ========================================
echo "📦 Creando backup del proyecto..."
if [ ! -d "./backup" ]; then
    mkdir -p backup
fi

current_date=$(date +"%Y%m%d_%H%M%S")
tar -czf "./backup/project_backup_${current_date}.tar.gz" \
    --exclude='./backup' \
    --exclude='./node_modules' \
    --exclude='./public/build' \
    .

echo "✅ Backup creado: ./backup/project_backup_${current_date}.tar.gz"

# ========================================
# 2. ACTUALIZAR DEPENDENCIAS
# ========================================
echo ""
echo "📚 Actualizando dependencias..."

# Dependencias principales
npm install @remix-run/react@latest \
            @remix-run/node@latest \
            react-router@latest

# Dependencias para optimización de imágenes
npm install sharp \
            @cloudinary/react \
            @cloudinary/url-gen

# Dependencias para bundle analysis
npm install --save-dev webpack-bundle-analyzer \
                        source-map-explorer

echo "✅ Dependencias actualizadas"

# ========================================
# 3. CREAR ESTRUCTURA DE DIRECTORIOS
# ========================================
echo ""
echo "📁 Creando estructura de directorios..."

# Directorios principales
mkdir -p app/components/lazy
mkdir -p app/components/admin/widgets
mkdir -p app/components/admin/skeletons
mkdir -p app/components/ui/progressive-loader
mkdir -p app/routes/admin
mkdir -p app/routes/listings/{detail,create,edit}
mkdir -p app/lib/lazy-loading
mkdir -p app/lib/image-optimization
mkdir -p app/lib/performance
mkdir -p app/hooks
mkdir -p app/types
mkdir -p config
mkdir -p scripts
mkdir -p public/images/{placeholders,optimized}

echo "✅ Estructura de directorios creada"

# ========================================
# 4. GENERAR ARCHIVOS DE CONFIGURACIÓN
# ========================================
echo ""
echo "⚙️  Generando archivos de configuración..."

# Configuración de lazy loading
cat > config/lazy-loading.config.ts << 'EOF'
export const LAZY_LOADING_CONFIG = {
  intersectionOptions: {
    rootMargin: '50px 0px',
    threshold: 0.1
  },
  preloadBuffer: 2,
  maxConcurrentLoads: 3,
  retryAttempts: 3,
  retryDelay: 1000
};
EOF

# Configuración de optimización de imágenes
cat > config/image-optimization.config.ts << 'EOF'
export const IMAGE_OPTIMIZATION_CONFIG = {
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || ''
  },
  qualities: {
    low: 'w_400,q_auto:low,f_auto',
    medium: 'w_800,q_auto:good,f_auto',
    high: 'w_1200,q_auto:best,f_auto',
    auto: 'w_auto,q_auto,f_auto'
  },
  formats: ['webp', 'jpg'],
  placeholders: {
    car: '/images/placeholders/car-placeholder.webp',
    user: '/images/placeholders/user-placeholder.webp',
    default: '/images/placeholders/default-placeholder.webp'
  }
};
EOF

# Configuración de performance
cat > config/performance.config.ts << 'EOF'
export const PERFORMANCE_CONFIG = {
  webVitals: {
    enabled: true,
    endpoint: '/api/web-vitals',
    sampleRate: 0.1
  },
  bundleAnalysis: {
    enabled: process.env.NODE_ENV === 'development',
    threshold: {
      maxAssetSize: 500 * 1024, // 500KB
      maxChunkSize: 1024 * 1024 // 1MB
    }
  },
  caching: {
    staticAssets: 86400 * 30, // 30 días
    images: 86400 * 7, // 7 días
    api: 3600, // 1 hora
    dynamic: 60 // 1 minuto
  }
};
EOF

echo "✅ Archivos de configuración generados"

# ========================================
# 5. GENERAR PLACEHOLDERS DE IMÁGENES
# ========================================
echo ""
echo "🖼️  Generando placeholders de imágenes..."

# Generar placeholder base64 para coches
cat > public/images/placeholders/generate-placeholders.js << 'EOF'
const sharp = require('sharp');
const fs = require('fs');

async function generatePlaceholders() {
  // Placeholder para coches
  await sharp({
    create: {
      width: 400,
      height: 300,
      channels: 3,
      background: { r: 243, g: 244, b: 246 }
    }
  })
  .png()
  .toFile('./car-placeholder.png');

  // Placeholder para usuarios  
  await sharp({
    create: {
      width: 200,
      height: 200,
      channels: 3,
      background: { r: 229, g: 231, b: 235 }
    }
  })
  .png()
  .toFile('./user-placeholder.png');

  console.log('✅ Placeholders generados');
}

generatePlaceholders().catch(console.error);
EOF

if command -v node >/dev/null 2>&1; then
    cd public/images/placeholders
    node generate-placeholders.js
    cd - > /dev/null
fi

# ========================================
# 6. CONFIGURAR SCRIPTS NPM
# ========================================
echo ""
echo "📜 Configurando scripts npm..."

# Crear backup del package.json actual
cp package.json package.json.backup

# Agregar scripts específicos
npm pkg set scripts.optimize-images="node scripts/optimize-images.js"
npm pkg set scripts.analyze-bundle="node scripts/analyze-bundle.js"
npm pkg set scripts.performance-audit="node scripts/performance-audit.js"
npm pkg set scripts.lazy-setup="bash setup-lazy-loading.sh"

echo "✅ Scripts npm configurados"

# ========================================
# 7. CONFIGURAR VARIABLES DE ENTORNO
# ========================================
echo ""
echo "🔐 Configurando variables de entorno..."

if [ ! -f ".env.example" ]; then
    cat > .env.example << 'EOF'
# Configuración de Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Configuración de Performance
ENABLE_BUNDLE_ANALYSIS=false
ENABLE_WEB_VITALS=true
PERFORMANCE_SAMPLE_RATE=0.1

# Configuración de Lazy Loading
MAX_CONCURRENT_IMAGE_LOADS=3
IMAGE_PRELOAD_BUFFER=2
INTERSECTION_ROOT_MARGIN=50px
EOF
fi

if [ ! -f ".env" ] && [ -f ".env.example" ]; then
    cp .env.example .env
    echo "⚠️  Recuerda configurar las variables en .env"
fi

echo "✅ Variables de entorno configuradas"

# ========================================
# 8. VERIFICAR INSTALACIÓN
# ========================================
echo ""
echo "🔍 Verificando instalación..."

errors=()

# Verificar dependencias
if ! npm list @remix-run/react >/dev/null 2>&1; then
    errors+=("Remix React no está instalado correctamente")
fi

if ! npm list sharp >/dev/null 2>&1; then
    errors+=("Sharp no está instalado correctamente")
fi

# Verificar estructura de directorios
required_dirs=(
    "app/components/lazy"
    "app/routes/admin"
    "app/lib/lazy-loading"
    "config"
    "scripts"
)

for dir in "${required_dirs[@]}"; do
    if [ ! -d "$dir" ]; then
        errors+=("Directorio faltante: $dir")
    fi
done

# Mostrar resultados
if [ ${#errors[@]} -eq 0 ]; then
    echo "✅ Verificación completada sin errores"
else
    echo "❌ Se encontraron errores:"
    for error in "${errors[@]}"; do
        echo "   • $error"
    done
fi

# ========================================
# 9. RESUMEN FINAL
# ========================================
echo ""
echo "🎉 Configuración de Lazy Loading completada!"
echo ""
echo "📋 Próximos pasos:"
echo "   1. Configurar variables en .env"
echo "   2. Implementar componentes lazy según el plan"
echo "   3. Ejecutar 'npm run optimize-images' para optimizar imágenes"
echo "   4. Ejecutar 'npm run analyze-bundle' para analizar bundles"
echo ""
echo "📚 Documentación y ejemplos en:"
echo "   • ./docs/lazy-loading-guide.md"
echo "   • ./examples/component-examples/"
echo ""
echo "🚀 ¡Disfruta de tu aplicación optimizada!"