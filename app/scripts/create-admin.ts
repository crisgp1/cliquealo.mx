import { MongoClient } from 'mongodb'
import bcrypt from 'bcryptjs'
import 'dotenv/config' // Carga variables de entorno desde .env

// Función principal
async function createSuperAdmin() {
  console.log('🚀 Iniciando creación de superadmin...')

  // Verificar variables de entorno
  const mongoUri = process.env.MONGODB_URI
  if (!mongoUri) {
    console.error('❌ ERROR: MONGODB_URI no está configurado')
    console.log('💡 Agrega MONGODB_URI a tu archivo .env')
    console.log('💡 Ejemplo: MONGODB_URI=mongodb://localhost:27017/cliquealo')
    process.exit(1)
  }

  console.log('✅ MONGODB_URI encontrado')
  console.log(`🔗 Conectando a: ${mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')}`)

  const client = new MongoClient(mongoUri)
  
  try {
    // Conectar a MongoDB
    await client.connect()
    console.log('✅ Conectado a MongoDB exitosamente')
    
    const db = client.db()
    console.log(`✅ Base de datos seleccionada: ${db.databaseName}`)
    
    // Datos del superadmin - CAMBIAR ESTOS VALORES
    const adminData = {
      email: 'admin@cliquealo.mx',
      password: 'Cliquealo2024!', // Contraseña más segura
      name: 'Super Administrador'
    }
    
    console.log('🔍 Verificando si ya existe un superadmin...')
    
    // Verificar si ya existe un superadmin
    const existingAdmin = await db.collection('users').findOne({ 
      $or: [
        { email: adminData.email },
        { role: 'superadmin' }
      ]
    })
    
    if (existingAdmin) {
      console.log('⚠️  Ya existe un superadmin en el sistema:')
      console.log(`   📧 Email: ${existingAdmin.email}`)
      console.log(`   👤 Nombre: ${existingAdmin.name}`)
      console.log(`   🎭 Rol: ${existingAdmin.role}`)
      console.log(`   🆔 ID: ${existingAdmin._id}`)
      
      console.log('\n❓ ¿Quieres continuar de todas formas? (Si ya existe, este script no hará nada)')
      return
    }
    
    console.log('✅ No existe superadmin, procediendo a crear...')
    
    // Hash de la contraseña
    console.log('🔐 Hasheando contraseña...')
    const hashedPassword = await bcrypt.hash(adminData.password, 12) // Más rondas para mayor seguridad
    console.log('✅ Contraseña hasheada exitosamente')
    
    // Generate a username from the email
    const emailUsername = adminData.email.toLowerCase().trim().split('@')[0]
    // Add a random suffix to ensure uniqueness
    const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    const username = `${emailUsername}_${randomSuffix}`
    
    // Crear el documento del superadmin
    const superAdmin = {
      name: adminData.name,
      email: adminData.email.toLowerCase().trim(),
      username: username, // Add unique username
      passwordHash: hashedPassword,
      role: 'superadmin',
      likedListings: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    }
    
    console.log('💾 Insertando superadmin en la base de datos...')
    
    // Insertar en la base de datos
    const result = await db.collection('users').insertOne(superAdmin)
    
    if (!result.insertedId) {
      throw new Error('No se pudo insertar el usuario')
    }
    
    console.log('\n🎉 ¡SUPERADMIN CREADO EXITOSAMENTE!')
    console.log('═══════════════════════════════════════')
    console.log(`📧 Email: ${adminData.email}`)
    console.log(`🔑 Password: ${adminData.password}`)
    console.log(`🆔 ID: ${result.insertedId}`)
    console.log(`🎭 Rol: superadmin`)
    console.log('═══════════════════════════════════════')
    console.log('')
    console.log('⚠️  PASOS IMPORTANTES:')
    console.log('   1. 🔐 Cambia la contraseña después del primer login')
    console.log('   2. 🔒 No compartas estas credenciales')
    console.log('   3. 🌐 Accede en: http://localhost:3000/auth/login')
    console.log('   4. 👥 Usa este usuario para crear más admins')
    console.log('')
    
    // Verificar que se creó correctamente
    const createdUser = await db.collection('users').findOne({ _id: result.insertedId })
    if (createdUser) {
      console.log('✅ Verificación: Usuario creado correctamente en la base de datos')
    } else {
      console.log('❌ Error en verificación: No se encontró el usuario creado')
    }
    
  } catch (error: unknown) {
    console.error('❌ ERROR CRÍTICO:')
    console.error('═══════════════════════════════════════')
    
    // Manejo seguro de errores con comprobación de tipo
    const err = error as Record<string, any>
    
    if (err.code === 'ENOTFOUND') {
      console.error('🔌 Error de conexión: No se puede conectar a MongoDB')
      console.error('💡 Verifica que MongoDB esté corriendo')
      console.error('💡 Verifica la URL en MONGODB_URI')
    } else if (err.code === 'ECONNREFUSED') {
      console.error('🚫 Conexión rechazada: MongoDB no está disponible')
      console.error('💡 Asegúrate de que MongoDB esté corriendo en el puerto correcto')
    } else if (err.name === 'MongoServerError') {
      console.error('🗄️  Error del servidor MongoDB:', err.message)
    } else {
      console.error('🐛 Error desconocido:', err.message || 'Error sin mensaje')
    }
    
    console.error('═══════════════════════════════════════')
    console.error('🔧 Posibles soluciones:')
    console.error('   1. Verificar que MongoDB esté corriendo')
    console.error('   2. Verificar MONGODB_URI en .env')
    console.error('   3. Verificar permisos de la base de datos')
    console.error('   4. Instalar dependencias: npm install mongodb bcryptjs')
    
    process.exit(1)
  } finally {
    try {
      await client.close()
      console.log('🔌 Conexión a MongoDB cerrada')
    } catch (closeError: unknown) {
      const err = closeError as Record<string, any>
      console.error('⚠️  Error al cerrar conexión:', err.message || 'Error sin mensaje')
    }
  }
}

// Auto-ejecutar si es llamado directamente (compatible con ES modules)
// En ES modules, no existe require.main === module, así que ejecutamos directamente
console.log('🎯 Script de creación de superadmin para Cliquealo.mx')
console.log('══════════════════════════════════════════════════════\n')

createSuperAdmin()
  .then(() => {
    console.log('\n✅ Script completado exitosamente')
    process.exit(0)
  })
  .catch((error: unknown) => {
    const err = error as Error
    console.error('\n💥 Script falló:', err.message || 'Error sin mensaje')
    process.exit(1)
  })

export { createSuperAdmin }