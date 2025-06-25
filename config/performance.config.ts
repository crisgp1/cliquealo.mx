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