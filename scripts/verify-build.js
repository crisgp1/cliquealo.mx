#!/usr/bin/env node

/**
 * 🔍 Script de Validación de Build para Vercel
 * Verifica que la configuración esté correcta antes del deployment
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

console.log('🔍 Verificando configuración de Vercel...\n')

// Verificaciones
const checks = []

// 1. Verificar vercel.json
try {
  const vercelConfig = JSON.parse(fs.readFileSync(path.join(projectRoot, 'vercel.json'), 'utf8'))
  if (vercelConfig.framework === 'remix') {
    checks.push({ name: 'vercel.json framework', status: '✅', details: 'Framework configurado como "remix"' })
  } else {
    checks.push({ name: 'vercel.json framework', status: '❌', details: `Framework: ${vercelConfig.framework || 'undefined'}` })
  }
  
  if (vercelConfig.buildCommand === 'npm run build') {
    checks.push({ name: 'vercel.json buildCommand', status: '✅', details: 'Build command correcto' })
  } else {
    checks.push({ name: 'vercel.json buildCommand', status: '❌', details: `Build command: ${vercelConfig.buildCommand}` })
  }
} catch (error) {
  checks.push({ name: 'vercel.json', status: '❌', details: 'Archivo no encontrado o inválido' })
}

// 2. Verificar remix.config.js
try {
  const remixConfigContent = fs.readFileSync(path.join(projectRoot, 'remix.config.js'), 'utf8')
  
  if (remixConfigContent.includes('serverBuildTarget: "vercel"')) {
    checks.push({ name: 'remix.config.js serverBuildTarget', status: '✅', details: 'Target configurado para Vercel' })
  } else {
    checks.push({ name: 'remix.config.js serverBuildTarget', status: '❌', details: 'Target no configurado para Vercel' })
  }
  
  if (remixConfigContent.includes('serverModuleFormat: "esm"')) {
    checks.push({ name: 'remix.config.js serverModuleFormat', status: '✅', details: 'ESM configurado' })
  } else {
    checks.push({ name: 'remix.config.js serverModuleFormat', status: '⚠️', details: 'ESM no configurado (recomendado)' })
  }
} catch (error) {
  checks.push({ name: 'remix.config.js', status: '❌', details: 'Archivo no encontrado' })
}

// 3. Verificar package.json
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'))
  
  if (packageJson.scripts?.build === 'remix build') {
    checks.push({ name: 'package.json build script', status: '✅', details: 'Script de build correcto' })
  } else {
    checks.push({ name: 'package.json build script', status: '❌', details: `Build script: ${packageJson.scripts?.build}` })
  }
  
  if (packageJson.type === 'module') {
    checks.push({ name: 'package.json type', status: '✅', details: 'Configurado como módulo ES' })
  } else {
    checks.push({ name: 'package.json type', status: '⚠️', details: 'No configurado como módulo ES' })
  }
} catch (error) {
  checks.push({ name: 'package.json', status: '❌', details: 'Archivo no encontrado o inválido' })
}

// 4. Verificar estructura de directorios
const requiredDirs = ['app', 'public']
requiredDirs.forEach(dir => {
  if (fs.existsSync(path.join(projectRoot, dir))) {
    checks.push({ name: `Directorio ${dir}`, status: '✅', details: 'Existe' })
  } else {
    checks.push({ name: `Directorio ${dir}`, status: '❌', details: 'No encontrado' })
  }
})

// 5. Verificar archivos críticos
const requiredFiles = [
  'app/entry.client.tsx',
  'app/entry.server.tsx',
  'app/root.tsx'
]

requiredFiles.forEach(file => {
  if (fs.existsSync(path.join(projectRoot, file))) {
    checks.push({ name: `Archivo ${file}`, status: '✅', details: 'Existe' })
  } else {
    checks.push({ name: `Archivo ${file}`, status: '❌', details: 'No encontrado' })
  }
})

// Mostrar resultados
console.log('📋 Resultados de la verificación:\n')

checks.forEach(check => {
  console.log(`${check.status} ${check.name}: ${check.details}`)
})

// Resumen
const passed = checks.filter(c => c.status === '✅').length
const warnings = checks.filter(c => c.status === '⚠️').length
const failed = checks.filter(c => c.status === '❌').length

console.log('\n📊 Resumen:')
console.log(`✅ Pasaron: ${passed}`)
console.log(`⚠️ Advertencias: ${warnings}`)
console.log(`❌ Fallaron: ${failed}`)

if (failed > 0) {
  console.log('\n🚨 Hay problemas críticos que deben resolverse antes del deployment.')
  process.exit(1)
} else if (warnings > 0) {
  console.log('\n⚠️ Hay algunas advertencias, pero el deployment debería funcionar.')
} else {
  console.log('\n🎉 ¡Configuración perfecta! Listo para deployment en Vercel.')
}

console.log('\n📖 Para más información, consulta: VERCEL-DEPLOYMENT-GUIDE.md')