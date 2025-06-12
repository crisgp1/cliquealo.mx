import { createRequestHandler } from "@remix-run/vercel";

// Importar el build del servidor
import * as build from "../build/index.js";

export default createRequestHandler({
  build,
  mode: process.env.NODE_ENV,
});