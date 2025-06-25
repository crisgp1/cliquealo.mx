import { ClerkRoles } from '~/lib/clerk-roles.server'
import { UserModel } from '~/models/User.server'

/**
 * Script simple para asignar rol de admin a un usuario por email
 * Uso: npm run tsx app/scripts/assign-admin-role.ts user@example.com admin
 */

async function assignRole() {
  const args = process.argv.slice(2)
  const email = args[0]
  const role = args[1] as 'user' | 'admin' | 'superadmin'

  if (!email || !role) {
    console.log('❌ Uso: npm run tsx app/scripts/assign-admin-role.ts <email> <role>')
    console.log('   Roles disponibles: user, admin, superadmin')
    process.exit(1)
  }

  if (!['user', 'admin', 'superadmin'].includes(role)) {
    console.log('❌ Rol inválido. Usa: user, admin, o superadmin')
    process.exit(1)
  }

  try {
    console.log(`🔍 Buscando usuario con email: ${email}`)
    
    // Buscar usuario por email
    const user = await UserModel.findByEmail(email)
    
    if (!user) {
      console.log(`❌ Usuario con email ${email} no encontrado`)
      console.log('💡 El usuario debe registrarse primero con Clerk')
      process.exit(1)
    }

    console.log(`✅ Usuario encontrado: ${user.name}`)
    console.log(`📋 Rol actual: ${user.role}`)
    
    if (user.role === role) {
      console.log(`✅ El usuario ya tiene el rol ${role}`)
      process.exit(0)
    }

    // Actualizar rol en la base de datos
    console.log(`🔄 Actualizando rol a: ${role}`)
    const dbSuccess = await UserModel.syncRoleWithClerk(user._id!.toString(), role)
    
    if (!dbSuccess) {
      console.log(`❌ Error actualizando rol en la base de datos`)
      process.exit(1)
    }

    // Si tiene Clerk ID, sincronizar con Clerk
    if (user.clerkId) {
      console.log(`🔄 Sincronizando con Clerk...`)
      const clerkSuccess = await ClerkRoles.syncRoleToClerk(user.clerkId, role)
      
      if (clerkSuccess) {
        console.log(`✅ Rol actualizado exitosamente a ${role}`)
        console.log(`🎉 ${user.name} ahora es ${role}`)
      } else {
        console.log(`⚠️  Rol actualizado en DB pero error sincronizando con Clerk`)
        console.log(`💡 El usuario puede necesitar cerrar sesión y volver a entrar`)
      }
    } else {
      console.log(`✅ Rol actualizado en la base de datos`)
      console.log(`⚠️  Usuario no tiene Clerk ID - necesita iniciar sesión con Clerk`)
    }

  } catch (error) {
    console.error('💥 Error asignando rol:', error)
    process.exit(1)
  }
}

// Ejecutar script
assignRole()