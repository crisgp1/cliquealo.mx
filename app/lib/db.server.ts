import { MongoClient, Db } from 'mongodb'

// Variables de entorno check
if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI no definida');
}

let client: MongoClient | null = null;

export function getDB(): Db {
  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI!, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });
  }
  return client.db('cliquealo');
}

// Export db as well for backwards compatibility
export const db = getDB();

// Cleanup en desarrollo
if (process.env.NODE_ENV === 'development') {
  process.on('SIGINT', async () => {
    if (client) {
      await client.close();
    }
    process.exit(0);
  });
}