import { createClerkClient } from '@clerk/remix/api.server'
import { MongoClient } from 'mongodb'
import 'dotenv/config'

async function debugUserRole() {
  console.log('🔍 Iniciando diagnóstico de roles de usuario...\n')

  // Verificar variables de entorno
  const clerkSecretKey = process.env.CLERK_SECRET_KEY
  const mongoUri = process.env.MONGODB_URI

  if (!clerkSecretKey) {
    console.error('❌ ERROR: CLERK_SECRET_KEY no está configurado')
    process.exit(1)
  }

  if (!mongoUri) {
    console.error('❌ ERROR: MONGODB_URI no está configurado')
    process.exit(1)
  }

  console.log('✅ Variables de entorno encontradas')

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
    console.log('✅ Conectado a MongoDB\n')

    // Obtener todos los usuarios de Clerk
    console.log('📋 Obteniendo usuarios de Clerk...')
    const clerkUsers = await clerkClient.users.getUserList({ limit: 100 })
    
    console.log(`📊 Total de usuarios en Clerk: ${clerkUsers.totalCount}`)
    console.log('═══════════════════════════════════════\n')

    for (const clerkUser of clerkUsers.data) {
      console.log(`👤 Usuario Clerk: ${clerkUser.id}`)
      console.log(`   📧 Email: ${clerkUser.emailAddresses[0]?.emailAddress || 'Sin email'}`)
      console.log(`   👤 Nombre: ${clerkUser.firstName} ${clerkUser.lastName}`)
      console.log(`   🎭 Rol en Clerk metadata: ${clerkUser.publicMetadata?.role || 'Sin rol'}`)
      
      // Buscar usuario correspondiente en MongoDB
      const dbUser = await db.collection('users').findOne({ clerkId: clerkUser.id })
      
      if (dbUser) {
        console.log(`   🗄️  Usuario en DB encontrado:`)
        console.log(`      🆔 ID: ${dbUser._id}`)
        console.log(`      🎭 Rol en DB: ${dbUser.role}`)
        console.log(`      ✅ Activo: ${dbUser.isActive}`)
        
        // Verificar si los roles coinciden
        const clerkRole = clerkUser.publicMetadata?.role || 'user'
        if (clerkRole !== dbUser.role) {
          console.log(`   ⚠️  DESINCRONIZACIÓN DETECTADA:`)
          console.log(`      Clerk: ${clerkRole} vs DB: ${dbUser.role}`)
        } else {
          console.log(`   ✅ Roles sincronizados`)
        }
      } else {
        console.log(`   ❌ Usuario NO encontrado en la base de datos`)
        console.log(`   💡 Necesita sincronización`)
      }
      
      console.log('───────────────────────────────────────')
    }

    // Buscar usuarios superadmin en la base de datos
    console.log('\n🔍 Buscando superadmins en la base de datos...')
    const superAdmins = await db.collection('users').find({ role: 'superadmin' }).toArray()
    
    console.log(`📊 Total superadmins en DB: ${superAdmins.length}`)
    
    for (const admin of superAdmins) {
      console.log(`👑 Superadmin en DB:`)
      console.log(`   🆔 ID: ${admin._id}`)
      console.log(`   📧 Email: ${admin.email}`)
      console.log(`   👤 Nombre: ${admin.name}`)
      console.log(`   🔗 Clerk ID: ${admin.clerkId || 'Sin Clerk ID'}`)
      console.log(`   ✅ Activo: ${admin.isActive}`)
      
      if (admin.clerkId) {
        try {
          const correspondingClerkUser = await clerkClient.users.getUser(admin.clerkId)
          const clerkRole = correspondingClerkUser.publicMetadata?.role
          console.log(`   🎭 Rol en Clerk: ${clerkRole}`)
          
          if (clerkRole !== 'superadmin') {
            console.log(`   ⚠️  PROBLEMA: Clerk rol (${clerkRole}) != DB rol (superadmin)`)
          }
        } catch (error) {
          console.log(`   ❌ Error obteniendo usuario de Clerk: ${error}`)
        }
      }
      console.log('───────────────────────────────────────')
    }

  } catch (error) {
    console.error('❌ Error durante el diagnóstico:', error)
  } finally {
    await mongoClient.close()
    console.log('\n🔌 Conexión cerrada')
  }
}

// Ejecutar diagnóstico
debugUserRole()
  .then(() => {
    console.log('\n✅ Diagnóstico completado')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Error en diagnóstico:', error)
    process.exit(1)
  })