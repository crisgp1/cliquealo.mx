import { createClerkClient } from '@clerk/remix/api.server'
import { MongoClient } from 'mongodb'
import 'dotenv/config'

async function linkExistingUserToClerk(email: string, clerkUserId: string) {
  console.log(`🔗 Vinculando usuario existente con Clerk...`)
  console.log(`   📧 Email: ${email}`)
  console.log(`   🔗 Clerk ID: ${clerkUserId}\n`)

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

    // Buscar usuario existente por email
    console.log(`\n🔍 Buscando usuario existente por email...`)
    const existingUser = await db.collection('users').findOne({ 
      email: email.toLowerCase().trim() 
    })
    
    if (!existingUser) {
      console.error(`❌ No se encontró usuario con email: ${email}`)
      process.exit(1)
    }

    console.log(`✅ Usuario encontrado en la base de datos:`)
    console.log(`   🆔 ID: ${existingUser._id}`)
    console.log(`   👤 Nombre: ${existingUser.name}`)
    console.log(`   🎭 Rol actual: ${existingUser.role}`)
    console.log(`   🔗 Clerk ID actual: ${existingUser.clerkId || 'Sin Clerk ID'}`)

    // Verificar si ya está vinculado
    if (existingUser.clerkId) {
      if (existingUser.clerkId === clerkUserId) {
        console.log(`✅ Usuario ya está vinculado con este Clerk ID`)
      } else {
        console.log(`⚠️  Usuario ya está vinculado con otro Clerk ID: ${existingUser.clerkId}`)
        console.log(`❓ ¿Quieres actualizar la vinculación? (Esto podría causar problemas)`)
        // En un script real, podrías pedir confirmación aquí
      }
    }

    // Obtener el rol de Clerk metadata
    const clerkRole = (clerkUser.publicMetadata?.role as 'user' | 'admin' | 'superadmin') || 'user'
    
    // Actualizar usuario con Clerk ID y sincronizar rol
    console.log(`\n🔄 Actualizando usuario...`)
    console.log(`   🔗 Vinculando con Clerk ID: ${clerkUserId}`)
    console.log(`   🎭 Actualizando rol a: ${clerkRole}`)
    
    const updateResult = await db.collection('users').updateOne(
      { _id: existingUser._id },
      {
        $set: {
          clerkId: clerkUserId,
          role: clerkRole,
          avatar: clerkUser.imageUrl || existingUser.avatar,
          updatedAt: new Date()
        }
      }
    )

    if (updateResult.modifiedCount === 0) {
      console.error(`❌ No se pudo actualizar el usuario`)
      process.exit(1)
    }

    console.log(`\n🎉 Usuario vinculado exitosamente:`)
    console.log(`   🆔 ID: ${existingUser._id}`)
    console.log(`   📧 Email: ${email}`)
    console.log(`   👤 Nombre: ${existingUser.name}`)
    console.log(`   🎭 Rol: ${clerkRole}`)
    console.log(`   🔗 Clerk ID: ${clerkUserId}`)

    // Verificar que Clerk también tenga el rol correcto
    if (clerkUser.publicMetadata?.role !== clerkRole) {
      console.log(`\n🔄 Sincronizando rol en Clerk metadata...`)
      await clerkClient.users.updateUser(clerkUserId, {
        publicMetadata: {
          role: clerkRole
        }
      })
      console.log(`✅ Rol sincronizado en Clerk`)
    }

  } catch (error) {
    console.error('❌ Error durante la vinculación:', error)
    throw error
  } finally {
    await mongoClient.close()
    console.log('\n🔌 Conexión cerrada')
  }
}

// Obtener argumentos de línea de comandos
const email = process.argv[2]
const clerkUserId = process.argv[3]

if (!email || !clerkUserId) {
  console.error('❌ ERROR: Debes proporcionar email y Clerk User ID')
  console.log('💡 Uso: npx tsx app/scripts/link-existing-user-to-clerk.ts <EMAIL> <CLERK_USER_ID>')
  console.log('💡 Ejemplo: npx tsx app/scripts/link-existing-user-to-clerk.ts cristiangp2001@gmail.com user_2yz29ShGWdmiqVxewX5aTQF8nQY')
  process.exit(1)
}

// Ejecutar vinculación
linkExistingUserToClerk(email, clerkUserId)
  .then(() => {
    console.log('\n✅ Vinculación completada exitosamente')
    console.log('🎯 Ahora deberías poder acceder al panel de administración')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Error en vinculación:', error)
    process.exit(1)
  })