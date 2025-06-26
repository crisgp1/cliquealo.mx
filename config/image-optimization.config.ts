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