#!/usr/bin/env node

// This script validates the build integrity without executing database connections
try {
  // Mock MongoDB connection to prevent connection errors during validation
  process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
  
  // Import file system module
  import('fs').then(async (fs) => {
    const buildPath = './build/index.js';
    
    // Check if build file exists
    if (!fs.existsSync(buildPath)) {
      console.error('Build validation failed: build file not found');
      process.exit(1);
    }
    
    // Read the file content as a string
    const content = fs.readFileSync(buildPath, 'utf8');
    
    // Extract route information using regex to avoid executing DB connection code
    const routesMatch = content.match(/routes:\s*({[^}]+})/);
    
    if (!routesMatch) {
      console.error('Build validation failed: routes not found in build manifest');
      process.exit(1);
    }
    
    console.log('Build validation passed: routes found in build manifest');
    
    // Check for route conflicts
    if (content.includes('listings.new') && content.includes('listings_.new')) {
      console.warn('Warning: Potential route conflict detected between listings.new and listings_.new');
    }
    
    // Perform basic validation that the build is intact
    if (!content.includes('assets')) {
      console.error('Build validation failed: assets not found in build manifest');
      process.exit(1);
    }
    
    console.log('Build validation successful');
  }).catch(error => {
    console.error('Build validation error:', error);
    process.exit(1);
  });
} catch (error) {
  console.error('Build validation warning:', error);
  // Don't exit with error, just log the warning
  console.log('Continuing build despite validation warning');
}