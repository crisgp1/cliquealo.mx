import { MongoClient, ObjectId } from 'mongodb'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cliquealo'

async function createAdminAndTestListing() {
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    console.log('Conectado a MongoDB')
    
    const db = client.db()
    
    // 1. Crear usuario admin
    const adminEmail = 'admin@cliquealo.mx'
    const adminPassword = 'admin123'
    
    // Verificar si el admin ya existe
    const existingAdmin = await db.collection('users').findOne({ email: adminEmail })
    
    let adminId
    if (existingAdmin) {
      console.log('Usuario admin ya existe')
      adminId = existingAdmin._id
    } else {
      const passwordHash = await bcrypt.hash(adminPassword, 10)
      
      const adminUser = {
        email: adminEmail,
        passwordHash,
        role: 'admin',
        name: 'Administrador',
        isVerified: true,
        likedListings: [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      const result = await db.collection('users').insertOne(adminUser)
      adminId = result.insertedId
      console.log('Usuario admin creado:', adminId)
    }
    
    // 2. Crear listing de prueba con información de contacto completa
    const testListing = {
      user: adminId,
      title: 'Nissan Sentra 2020 Automático Excelente Estado',
      description: 'Vehículo en excelente estado, mantenimiento al día, llantas nuevas, aire acondicionado funcionando perfectamente.',
      brand: 'Nissan',
      model: 'Sentra',
      year: 2020,
      price: 280000,
      images: [
        'https://images.unsplash.com/photo-1549399736-8e3c8b8b8b8b?w=800',
        'https://images.unsplash.com/photo-1549399736-8e3c8b8b8b8c?w=800'
      ],
      likesCount: 0,
      viewsCount: 0,
      status: 'active',
      contactInfo: {
        phone: '5512345678',
        email: 'vendedor@example.com',
        whatsapp: '5512345678'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const listingResult = await db.collection('listings').insertOne(testListing)
    console.log('Listing de prueba creado:', listingResult.insertedId)
    
    console.log('\n=== DATOS CREADOS ===')
    console.log('Admin Email:', adminEmail)
    console.log('Admin Password:', adminPassword)
    console.log('Listing ID:', listingResult.insertedId.toString())
    console.log('WhatsApp en listing:', testListing.contactInfo.whatsapp)
    
    return {
      adminId,
      listingId: listingResult.insertedId
    }
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await client.close()
  }
}

createAdminAndTestListing()