import { createClerkClient } from '@clerk/remix/api.server'
import { MongoClient } from 'mongodb'
import 'dotenv/config'

async function syncClerkUser(clerkUserId: string) {
  console.log(`🔄 Sincronizando usuario de Clerk: ${clerkUserId}\n`)

  // Verificar variables de entorno
  const clerkSecretKey = process.env.CLERK_SECRET_KEY
  const mongoUri = process.env.MONGODB_URI

  if (!clerkSecretKey || !mongoUri) {
    console.error('❌ ERROR: Variables de entorno faltantes')
    process.exit(1)
  }

  // Inicializar Clerk client
  const clerkClient = createClerkClient({
    secretKey: clerkSecretKey,
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY!
  })

  // Conectar a MongoDB
  const mongoClient = new MongoClient(mongoUri)
  
  try {
    await mongoClient.connect()
    const db = mongoClient.db()
    console.log('✅ Conectado a MongoDB')

    // Obtener usuario de Clerk
    console.log('📋 Obteniendo usuario de Clerk...')
    const clerkUser = await clerkClient.users.getUser(clerkUserId)
    
    console.log(`👤 Usuario encontrado en Clerk:`)
    console.log(`   📧 Email: ${clerkUser.emailAddresses[0]?.emailAddress}`)
    console.log(`   👤 Nombre: ${clerkUser.firstName} ${clerkUser.lastName}`)
    console.log(`   🎭 Rol en metadata: ${clerkUser.publicMetadata?.role || 'Sin rol'}`)

    // Verificar si ya existe en la base de datos
    const existingUser = await db.collection('users').findOne({ clerkId: clerkUserId })
    
    if (existingUser) {
      console.log(`\n✅ Usuario ya existe en la base de datos`)
      console.log(`   🎭 Rol actual en DB: ${existingUser.role}`)
      
      // Actualizar rol si es diferente
      const clerkRole = clerkUser.publicMetadata?.role || 'user'
      if (existingUser.role !== clerkRole) {
        console.log(`🔄 Actualizando rol de ${existingUser.role} a ${clerkRole}...`)
        
        await db.collection('users').updateOne(
          { _id: existingUser._id },
          {
            $set: {
              role: clerkRole,
              updatedAt: new Date()
            }
          }
        )
        
        console.log(`✅ Rol actualizado exitosamente`)
      } else {
        console.log(`✅ Rol ya está sincronizado`)
      }
      
      return existingUser
    }

    // Crear usuario en la base de datos
    console.log(`\n🆕 Creando usuario en la base de datos...`)
    
    const email = clerkUser.emailAddresses[0]?.emailAddress
    if (!email) {
      throw new Error('Email requerido')
    }

    const name = `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Usuario'
    const phone = clerkUser.phoneNumbers?.[0]?.phoneNumber || ''
    
    // Generate username from email
    const emailUsername = email.toLowerCase().trim().split('@')[0]
    const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    const username = `${emailUsername}_${randomSuffix}`
    
    // Usar el rol de Clerk metadata, no el por defecto
    const role = (clerkUser.publicMetadata?.role as 'user' | 'admin' | 'superadmin') || 'user'
    
    const newUser = {
      name,
      email: email.toLowerCase().trim(),
      phone,
      username,
      passwordHash: '', // No password needed for Clerk users
      role, // Usar el rol de Clerk
      likedListings: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      avatar: clerkUser.imageUrl,
      clerkId: clerkUser.id
    }
    
    const result = await db.collection('users').insertOne(newUser)
    
    console.log(`\n🎉 Usuario creado exitosamente:`)
    console.log(`   🆔 ID: ${result.insertedId}`)
    console.log(`   📧 Email: ${email}`)
    console.log(`   👤 Nombre: ${name}`)
    console.log(`   🎭 Rol: ${role}`)
    console.log(`   🔗 Clerk ID: ${clerkUser.id}`)

    return { ...newUser, _id: result.insertedId }

  } catch (error) {
    console.error('❌ Error durante la sincronización:', error)
    throw error
  } finally {
    await mongoClient.close()
    console.log('\n🔌 Conexión cerrada')
  }
}

// Obtener el Clerk User ID desde argumentos de línea de comandos
const clerkUserId = process.argv[2]

if (!clerkUserId) {
  console.error('❌ ERROR: Debes proporcionar el Clerk User ID')
  console.log('💡 Uso: npx tsx app/scripts/sync-clerk-user.ts <CLERK_USER_ID>')
  console.log('💡 Ejemplo: npx tsx app/scripts/sync-clerk-user.ts user_2yz29ShGWdmiqVxewX5aTQF8nQY')
  process.exit(1)
}

// Ejecutar sincronización
syncClerkUser(clerkUserId)
  .then(() => {
    console.log('\n✅ Sincronización completada exitosamente')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Error en sincronización:', error)
    process.exit(1)
  })