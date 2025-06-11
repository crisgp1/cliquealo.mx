import { MongoClient, Db } from 'mongodb'
import { singleton } from './singleton.server'

// Cargar dotenv solo en producción local (no en Vercel)
if (process.env.NODE_ENV === 'production' && !process.env.VERCEL && !process.env.MONGODB_URI) {
  try {
    require('dotenv').config();
    console.log('✅ Variables de entorno cargadas desde .env');
  } catch (error) {
    console.log('⚠️ dotenv no disponible');
  }
}

console.log('🔍 MONGODB_URI existe:', !!process.env.MONGODB_URI);

if (!process.env.MONGODB_URI) {
  throw new Error('❌ MONGODB_URI no está definida');
}

const client = singleton('mongo', () => {
  console.log('🔄 Creando cliente MongoDB...');
  const mongoClient = new MongoClient(process.env.MONGODB_URI!, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });
  
  console.log('✅ Cliente MongoDB creado (conexión lazy)');
  return mongoClient;
});

export const db: Db = client.db('cliquealo');

// Helper para cerrar conexión en desarrollo
if (process.env.NODE_ENV === 'development') {
  process.on('SIGINT', async () => {
    console.log('🔄 Cerrando conexión MongoDB...');
    await client.close();
    console.log('✅ MongoDB desconectado');
    process.exit(0);
  });
}