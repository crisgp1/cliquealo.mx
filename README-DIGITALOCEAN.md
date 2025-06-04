# Despliegue en DigitalOcean con Docker

Guía rápida para desplegar Cliquéalo.mx en DigitalOcean usando Docker.

## Pasos para Desplegar en DigitalOcean App Platform

1. **Confirma que tienes estos archivos en tu proyecto**:
   - `Dockerfile`
   - `.dockerignore`
   - `server.js`
   - `.env` (actualizado con `NODE_ENV=production`)

2. **Sube tus cambios a Git**:
   ```bash
   git add Dockerfile .dockerignore server.js package.json .env
   git commit -m "Configuración para Docker"
   git push
   ```

3. **Crea una App en DigitalOcean**:
   - Inicia sesión en [DigitalOcean](https://cloud.digitalocean.com/)
   - Ve a "Apps" en el menú lateral
   - Haz clic en "Create App"
   - Selecciona "GitHub" (o GitLab/BitBucket)
   - Autoriza y selecciona el repositorio de Cliquéalo.mx
   - DigitalOcean detectará el Dockerfile automáticamente
   - Selecciona la rama principal (normalmente `main`)

4. **Configura tu App**:
   - Nombre: `cliquealo-mx`
   - Región: Selecciona la más cercana a México
   - Plan: Básico ($12/mes)
   - Añade variables de entorno:
     - `NODE_ENV=production`
     - `MONGODB_URI=mongodb+srv://...` (copia de tu .env)
     - `SESSION_SECRET=...` (usa un valor seguro)
     - `JWT_SECRET=...` (usa un valor seguro)
     - `CLOUDINARY_CLOUD_NAME=...`
     - `CLOUDINARY_API_KEY=...`
     - `CLOUDINARY_API_SECRET=...`
   - Marca como "Encrypted" los secretos sensibles

5. **Finaliza el Despliegue**:
   - Revisa la configuración
   - Haz clic en "Create Resources"
   - Espera a que se complete el despliegue (~5 minutos)
   - Obtendrás una URL para acceder a tu aplicación (por ejemplo, `https://cliquealo-mx-abcd1234.ondigitalocean.app`)

## Actualizar tu Aplicación

Para actualizar tu aplicación después de hacer cambios:

1. Sube tus cambios a Git:
   ```bash
   git add .
   git commit -m "Actualización"
   git push
   ```

2. DigitalOcean detectará el cambio y volverá a desplegar automáticamente.

## Solución de Problemas

Si tu aplicación no se despliega correctamente:

1. Ve a "Apps" > Tu App > "Logs" para ver los logs de error
2. Verifica que todas las variables de entorno estén configuradas correctamente
3. Asegúrate de que tu aplicación se ejecute correctamente en modo producción
4. Confirma que el puerto 3000 esté expuesto en el Dockerfile

## Recursos Adicionales

- [Documentación oficial de DigitalOcean App Platform](https://docs.digitalocean.com/products/app-platform/)
- [Despliegue de contenedores Docker en DigitalOcean](https://docs.digitalocean.com/products/app-platform/languages-frameworks/dockerfiles/)
- [Guía completa en DEPLOYMENT.md](./DEPLOYMENT.md) (instrucciones más detalladas incluyendo el método de Droplets)