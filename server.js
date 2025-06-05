// Load environment variables from .env file
import 'dotenv/config';

import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import compression from 'compression';
import morgan from 'morgan';
import { createRequestHandler } from '@remix-run/express';
import * as fs from 'fs';

// Convert ESM __dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BUILD_DIR = path.join(__dirname, "build");

// Check if build directory exists
if (!fs.existsSync(BUILD_DIR)) {
  console.error(`Build directory does not exist: ${BUILD_DIR}`);
  console.error("Please run 'npm run build' before starting the server");
  process.exit(1);
}

// Create express app
const app = express();

// Set port from environment variable or default to 3000
const port = process.env.PORT || 3000;

// Enable for production
app.use(compression());

// HTTP request logger
app.use(morgan('tiny'));

// Static files - serve public directory only
// Remix handles asset imports through its own mechanisms
app.use(express.static('public', { maxAge: '1h' }));

// Create request handler for all routes
app.all(
  '*',
  createRequestHandler({
    build: BUILD_DIR,
    mode: process.env.NODE_ENV || 'production',
    getLoadContext(req, res) {
      return {};
    },
  })
);

// Start server with explicit error handling
app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
}).on('error', (err) => {
  console.error('Server failed to start:');
  console.error(err);
  process.exit(1);
});