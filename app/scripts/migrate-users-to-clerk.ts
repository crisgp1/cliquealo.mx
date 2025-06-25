import { UserModel } from '~/models/User.server'
import { ClerkRoles } from '~/lib/clerk-roles.server'

/**
 * Script para migrar usuarios existentes y sincronizar roles con Clerk
 * 
 * Este script debe ejecutarse después de que los usuarios se registren con Clerk
 * para sincronizar sus roles desde la base de datos a Clerk metadata
 */

async function migrateUsersToClerk() {
  console.log('🚀 Iniciando migración de usuarios a Clerk...')
  
  try {
    // Obtener todos los usuarios que tienen clerkId
    const users = await UserModel.findAll({ limit: 1000 })
    const usersWithClerkId = users.filter(user => user.clerkId)
    
    console.log(`📊 Encontrados ${usersWithClerkId.length} usuarios con Clerk ID`)
    
    let successCount = 0
    let errorCount = 0
    
    for (const user of usersWithClerkId) {
      try {
        console.log(`🔄 Sincronizando usuario: ${user.name} (${user.email}) - Rol: ${user.role}`)
        
        // Sincronizar rol con Clerk
        const success = await ClerkRoles.syncRoleToClerk(user.clerkId!, user.role)
        
        if (success) {
          successCount++
          console.log(`✅ Usuario ${user.name} sincronizado correctamente`)
        } else {
          errorCount++
          console.log(`❌ Error sincronizando usuario ${user.name}`)
        }
        
        // Pequeña pausa para no sobrecargar la API de Clerk
        await new Promise(resolve => setTimeout(resolve, 100))
        
      } catch (error) {
        errorCount++
        console.error(`❌ Error procesando usuario ${user.name}:`, error)
      }
    }
    
    console.log('\n📈 Resumen de migración:')
    console.log(`✅ Usuarios sincronizados exitosamente: ${successCount}`)
    console.log(`❌ Errores: ${errorCount}`)
    console.log(`📊 Total procesados: ${usersWithClerkId.length}`)
    
    if (errorCount === 0) {
      console.log('🎉 ¡Migración completada exitosamente!')
    } else {
      console.log('⚠️  Migración completada con algunos errores')
    }
    
  } catch (error) {
    console.error('💥 Error fatal durante la migración:', error)
    process.exit(1)
  }
}

/**
 * Script para crear un super administrador inicial
 */
async function createInitialSuperAdmin(email: string) {
  console.log(`🔧 Creando super administrador inicial para: ${email}`)
  
  try {
    // Buscar usuario por email
    const user = await UserModel.findByEmail(email)
    
    if (!user) {
      console.log(`❌ Usuario con email ${email} no encontrado`)
      return
    }
    
    if (user.role === 'superadmin') {
      console.log(`✅ El usuario ${email} ya es super administrador`)
      return
    }
    
    // Actualizar rol en la base de datos
    const dbSuccess = await UserModel.syncRoleWithClerk(user._id!.toString(), 'superadmin')
    
    if (!dbSuccess) {
      console.log(`❌ Error actualizando rol en la base de datos`)
      return
    }
    
    // Si tiene Clerk ID, sincronizar con Clerk
    if (user.clerkId) {
      const clerkSuccess = await ClerkRoles.syncRoleToClerk(user.clerkId, 'superadmin')
      
      if (clerkSuccess) {
        console.log(`✅ Usuario ${email} promovido a super administrador exitosamente`)
      } else {
        console.log(`⚠️  Usuario promovido en DB pero error sincronizando con Clerk`)
      }
    } else {
      console.log(`✅ Usuario ${email} promovido a super administrador (sin Clerk ID)`)
    }
    
  } catch (error) {
    console.error('💥 Error creando super administrador:', error)
  }
}

// Ejecutar script si se llama directamente
if (require.main === module) {
  const args = process.argv.slice(2)
  const command = args[0]
  
  if (command === 'migrate') {
    migrateUsersToClerk()
  } else if (command === 'create-superadmin') {
    const email = args[1]
    if (!email) {
      console.log('❌ Debes proporcionar un email: npm run migrate-users create-superadmin user@example.com')
      process.exit(1)
    }
    createInitialSuperAdmin(email)
  } else {
    console.log('📖 Uso:')
    console.log('  npm run migrate-users migrate           # Migrar todos los usuarios')
    console.log('  npm run migrate-users create-superadmin <email>  # Crear super admin')
  }
}

export { migrateUsersToClerk, createInitialSuperAdmin }