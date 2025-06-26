#!/usr/bin/env tsx

/**
 * Script to check environment variables and Clerk configuration
 */

import { config } from 'dotenv';

// Load environment variables
config();

console.log('🔍 Checking Environment Configuration...\n');

// Check Node.js version
console.log(`📦 Node.js Version: ${process.version}`);
console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}\n`);

// Check Clerk configuration
console.log('🔐 Clerk Configuration:');
console.log(`  CLERK_PUBLISHABLE_KEY: ${process.env.CLERK_PUBLISHABLE_KEY ? '✅ Present' : '❌ Missing'}`);
if (process.env.CLERK_PUBLISHABLE_KEY) {
  console.log(`    Prefix: ${process.env.CLERK_PUBLISHABLE_KEY.substring(0, 20)}...`);
}

console.log(`  CLERK_SECRET_KEY: ${process.env.CLERK_SECRET_KEY ? '✅ Present' : '❌ Missing'}`);
if (process.env.CLERK_SECRET_KEY) {
  console.log(`    Prefix: ${process.env.CLERK_SECRET_KEY.substring(0, 20)}...`);
}

// Check database configuration
console.log('\n💾 Database Configuration:');
console.log(`  MONGODB_URI: ${process.env.MONGODB_URI ? '✅ Present' : '❌ Missing'}`);

// Check other important variables
console.log('\n☁️ Other Configuration:');
console.log(`  CLOUDINARY_CLOUD_NAME: ${process.env.CLOUDINARY_CLOUD_NAME ? '✅ Present' : '❌ Missing'}`);
console.log(`  CLOUDINARY_API_KEY: ${process.env.CLOUDINARY_API_KEY ? '✅ Present' : '❌ Missing'}`);
console.log(`  CLOUDINARY_API_SECRET: ${process.env.CLOUDINARY_API_SECRET ? '✅ Present' : '❌ Missing'}`);

// Summary
const missingVars = [];
if (!process.env.CLERK_PUBLISHABLE_KEY) missingVars.push('CLERK_PUBLISHABLE_KEY');
if (!process.env.CLERK_SECRET_KEY) missingVars.push('CLERK_SECRET_KEY');
if (!process.env.MONGODB_URI) missingVars.push('MONGODB_URI');

console.log('\n📋 Summary:');
if (missingVars.length === 0) {
  console.log('✅ All required environment variables are present!');
} else {
  console.log('❌ Missing required environment variables:');
  missingVars.forEach(varName => {
    console.log(`   - ${varName}`);
  });
  console.log('\n💡 Please add these to your .env file');
}

console.log('\n🚀 Ready to start the application!');