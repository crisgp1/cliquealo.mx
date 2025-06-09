// Load environment variables from .env file
import 'dotenv/config';

import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import compression from 'compression';
import morgan from 'morgan';
import fs from 'fs';
import { createRequestHandler } from '@remix-run/express';

// Convert __dirname in ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Path to server build
const BUILD_PATH = path.join(__dirname, 'build/index.js');

// Check if build exists
if (!fs.existsSync(BUILD_PATH)) {
  console.error(`Build file not found at: ${BUILD_PATH}`);
  console.error("⛔️ Run 'npm run build' before starting the server");
  process.exit(1);
}

// Import compiled Remix build (must be dynamic in ESM)
const build = await import(`./build/index.js`);

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(compression());             // Gzip compression
app.use(morgan('tiny'));            // Request logging
app.use(express.static('public', { maxAge: '1h' })); // Serve static files

// All routes handled by Remix
app.all(
  '*',
  createRequestHandler({
    build,
    mode: process.env.NODE_ENV || 'production',
    getLoadContext(req, res) {
      return {}; // Puedes pasar contexto si lo necesitas
    }
  })
);

// Start server
app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
  console.log(`NODE_ENV: ${process.env.NODE_ENV || 'production'}`);
}).on('error', (err) => {
  console.error('Server failed to start:');
  console.error(err);
  process.exit(1);
});
