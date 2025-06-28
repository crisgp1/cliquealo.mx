// app/lib/webp-converter.server.ts
// Sistema Enterprise de Conversión Automática JPG/PNG → WebP
import sharp from "sharp";
import { v2 as cloudinary } from "cloudinary";

// ===============================================
// CONFIGURACIÓN OPTIMIZADA DE CALIDAD
// ===============================================
export const IMAGE_QUALITY_MATRIX = {
  // Perfil Ultra-High Quality para imágenes principales
  ultraHigh: {
    webp: {
      quality: 92,
      effort: 6,
      smartSubsample: false
    },
    fallback: {
      quality: 95,
      progressive: true,
      mozjpeg: true
    },
    dimensions: {
      width: 1920,
      height: 1440,
      fit: 'inside' as const
    }
  },
  // Perfil High Quality para carruseles (RECOMENDADO)
  high: {
    webp: {
      quality: 88,
      effort: 6,
      smartSubsample: true
    },
    fallback: {
      quality: 90,
      progressive: true,
      mozjpeg: true
    },
    dimensions: {
      width: 1200,
      height: 900,
      fit: 'inside' as const
    }
  },
  // Perfil Medium Quality para listados
  medium: {
    webp: {
      quality: 82,
      effort: 6,
      smartSubsample: true
    },
    fallback: {
      quality: 85,
      progressive: true,
      mozjpeg: true
    },
    dimensions: {
      width: 800,
      height: 600,
      fit: 'inside' as const
    }
  },
  // Perfil Thumbnail optimizado
  thumbnail: {
    webp: {
      quality: 75,
      effort: 6,
      smartSubsample: true
    },
    fallback: {
      quality: 80,
      progressive: true,
      mozjpeg: true
    },
    dimensions: {
      width: 300,
      height: 200,
      fit: 'cover' as const
    }
  }
} as const;

export type QualityProfile = keyof typeof IMAGE_QUALITY_MATRIX;

// ===============================================
// INTERFAZ DE RESULTADO DE CONVERSIÓN
// ===============================================
export interface ConversionResult {
  webp: {
    buffer: Buffer;
    url?: string;
    size: number;
    quality: number;
  };
  fallback: {
    buffer: Buffer;
    url?: string;
    size: number;
    quality: number;
  };
  metadata: {
    originalFormat: string;
    originalSize: number;
    dimensions: {
      width: number;
      height: number;
    };
    compressionRatio: number;
    processingTime: number;
  };
}

// ===============================================
// FUNCIÓN PRINCIPAL DE CONVERSIÓN
// ===============================================
export async function convertToWebPAutomatically(
  inputBuffer: Buffer,
  profile: QualityProfile = 'high',
  originalFileName?: string
): Promise<ConversionResult> {
  const startTime = Date.now();
  const config = IMAGE_QUALITY_MATRIX[profile];
  try {
    // ===============================================
    // ANÁLISIS DE IMAGEN ORIGINAL
    // ===============================================
    const originalMetadata = await sharp(inputBuffer).metadata();
    const originalFormat = originalMetadata.format || 'unknown';
    const originalSize = inputBuffer.length;

    // Log de diagnóstico
    console.log(`🔄 Procesando imagen: ${originalFileName || 'unknown'}`);
    console.log(`📊 Original: ${originalFormat.toUpperCase()} - ${(originalSize / 1024).toFixed(1)}KB - ${originalMetadata.width}x${originalMetadata.height}`);

    // ===============================================
    // CONVERSIÓN A WEBP (CALIDAD PREMIUM)
    // ===============================================
    const webpBuffer = await sharp(inputBuffer)
      // Redimensionamiento inteligente
      .resize(config.dimensions.width, config.dimensions.height, {
        fit: config.dimensions.fit,
        withoutEnlargement: true,
        position: 'center'
      })
      // Optimizaciones de calidad
      .sharpen(0.3, 1, 0.3) // Sharpening sutil para claridad
      .normalise({ lower: 1, upper: 99 }) // Normalización de contraste
      // Conversión WebP con parámetros premium
      .webp({
        quality: config.webp.quality,
        effort: config.webp.effort,
        smartSubsample: config.webp.smartSubsample,
        // Configuraciones avanzadas para máxima calidad
        nearLossless: config.webp.quality > 90,
        preset: 'photo',
        alphaQuality: 100
      })
      .toBuffer();

    // ===============================================
    // IMAGEN FALLBACK (JPEG OPTIMIZADO)
    // ===============================================
    const fallbackBuffer = await sharp(inputBuffer)
      .resize(config.dimensions.width, config.dimensions.height, {
        fit: config.dimensions.fit,
        withoutEnlargement: true,
        position: 'center'
      })
      .sharpen(0.3, 1, 0.3)
      .normalise({ lower: 1, upper: 99 })
      .jpeg({
        quality: config.fallback.quality,
        progressive: config.fallback.progressive,
        mozjpeg: config.fallback.mozjpeg,
        // Configuraciones avanzadas JPEG optimizado
        optimiseScans: true,
        overshootDeringing: true,
        trellisQuantisation: true
      })
      .toBuffer();

    // ===============================================
    // MÉTRICAS DE COMPRESIÓN
    // ===============================================
    const compressionRatio = ((originalSize - webpBuffer.length) / originalSize) * 100;
    const processingTime = Date.now() - startTime;

    // Log de resultados
    console.log(`✅ WebP: ${(webpBuffer.length / 1024).toFixed(1)}KB (${compressionRatio.toFixed(1)}% ahorro)`);
    console.log(`⏱️ Procesamiento: ${processingTime}ms`);

    return {
      webp: {
        buffer: webpBuffer,
        size: webpBuffer.length,
        quality: config.webp.quality
      },
      fallback: {
        buffer: fallbackBuffer,
        size: fallbackBuffer.length,
        quality: config.fallback.quality
      },
      metadata: {
        originalFormat,
        originalSize,
        dimensions: {
          width: originalMetadata.width || 0,
          height: originalMetadata.height || 0
        },
        compressionRatio: Math.round(compressionRatio * 100) / 100,
        processingTime
      }
    };
  } catch (error) {
    console.error('❌ Error en conversión WebP:', error);
    throw new Error(`WebP conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// ===============================================
// UPLOAD OPTIMIZADO A CLOUDINARY
// ===============================================
export async function uploadOptimizedToCloudinary(
  conversionResult: ConversionResult,
  folder: string = 'car-listings-optimized',
  publicId?: string
): Promise<{
  webpUrl: string;
  fallbackUrl: string;
  responsiveUrls: Record<string, string>;
}> {
  try {
    // ===============================================
    // UPLOAD WEBP (IMAGEN PRINCIPAL)
    // ===============================================
    const webpUpload = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: publicId ? `${publicId}_webp` : undefined,
          resource_type: 'image',
          format: 'webp',
          // Configuraciones de entrega optimizada
          fetch_format: 'webp',
          flags: ['progressive', 'immutable_cache'],
          // Generar versiones responsivas automáticamente
          eager: [
            { width: 400, height: 300, crop: 'limit', quality: 'auto:good', format: 'webp' },
            { width: 800, height: 600, crop: 'limit', quality: 'auto:best', format: 'webp' },
            { width: 1200, height: 900, crop: 'limit', quality: 'auto:best', format: 'webp' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(conversionResult.webp.buffer);
    });

    // ===============================================
    // UPLOAD FALLBACK (JPEG)
    // ===============================================
    const fallbackUpload = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: `${folder}/fallback`,
          public_id: publicId ? `${publicId}_jpg` : undefined,
          resource_type: 'image',
          format: 'jpg',
          flags: ['progressive', 'immutable_cache']
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(conversionResult.fallback.buffer);
    });

    // ===============================================
    // GENERAR URLs RESPONSIVAS
    // ===============================================
    const responsiveUrls = {
      mobile: cloudinary.url(webpUpload.public_id, {
        transformation: 'w_400,h_300,c_limit,q_auto:good,f_webp',
        secure: true
      }),
      tablet: cloudinary.url(webpUpload.public_id, {
        transformation: 'w_800,h_600,c_limit,q_auto:best,f_webp',
        secure: true
      }),
      desktop: cloudinary.url(webpUpload.public_id, {
        transformation: 'w_1200,h_900,c_limit,q_auto:best,f_webp',
        secure: true
      }),
      retina: cloudinary.url(webpUpload.public_id, {
        transformation: 'w_2400,h_1800,c_limit,q_auto:best,f_webp',
        secure: true
      })
    };

    return {
      webpUrl: webpUpload.secure_url,
      fallbackUrl: fallbackUpload.secure_url,
      responsiveUrls
    };
  } catch (error) {
    console.error('❌ Error en upload a Cloudinary:', error);
    throw error;
  }
}

// ===============================================
// FUNCIÓN COMPLETA DE PROCESAMIENTO
// ===============================================
export async function processImageToWebP(
  inputBuffer: Buffer,
  options: {
    profile?: QualityProfile;
    folder?: string;
    publicId?: string;
    originalFileName?: string;
  } = {}
): Promise<{
  urls: {
    webp: string;
    fallback: string;
    responsive: Record<string, string>;
  };
  metadata: ConversionResult['metadata'];
}> {
  const { profile = 'high', folder = 'car-listings-optimized', publicId, originalFileName } = options;

  // Conversión a WebP
  const conversionResult = await convertToWebPAutomatically(
    inputBuffer,
    profile,
    originalFileName
  );

  // Upload a Cloudinary
  const uploadResult = await uploadOptimizedToCloudinary(
    conversionResult,
    folder,
    publicId
  );

  return {
    urls: {
      webp: uploadResult.webpUrl,
      fallback: uploadResult.fallbackUrl,
      responsive: uploadResult.responsiveUrls
    },
    metadata: conversionResult.metadata
  };
}

// ===============================================
// UTILIDADES DE ANÁLISIS
// ===============================================
export async function analyzeImageQuality(buffer: Buffer): Promise<{
  shouldConvert: boolean;
  recommendedProfile: QualityProfile;
  estimatedSavings: string;
  analysis: string[];
}> {
  const metadata = await sharp(buffer).metadata();
  const analysis: string[] = [];
  let recommendedProfile: QualityProfile = 'medium';

  // Análisis de formato
  if (metadata.format === 'png' && !metadata.hasAlpha) {
    analysis.push('PNG sin transparencia detectado - conversión a WebP recomendada');
    recommendedProfile = 'high';
  }

  // Análisis de dimensiones
  const width = metadata.width || 0;
  const height = metadata.height || 0;
  if (width >= 1200 || height >= 900) {
    analysis.push('Imagen de alta resolución - usar perfil ultra-high');
    recommendedProfile = 'ultraHigh';
  } else if (width <= 400 && height <= 300) {
    analysis.push('Imagen pequeña - usar perfil thumbnail');
    recommendedProfile = 'thumbnail';
  }

  // Análisis de peso
  const sizeKB = buffer.length / 1024;
  if (sizeKB > 500) {
    analysis.push('Imagen pesada detectada - conversión crítica');
  }

  const estimatedSavings = metadata.format === 'png' ? '50-70%' : '30-50%';

  return {
    shouldConvert: metadata.format !== 'webp',
    recommendedProfile,
    estimatedSavings,
    analysis
  };
}