# Guía de Despliegue en DigitalOcean

Esta guía explica cómo desplegar la aplicación Cliquéalo.mx en DigitalOcean usando Docker.

## Prerrequisitos

- Cuenta en [DigitalOcean](https://cloud.digitalocean.com/)
- [Docker](https://www.docker.com/get-started) instalado en tu máquina local
- [doctl](https://docs.digitalocean.com/reference/doctl/how-to/install/) (CLI de DigitalOcean)
- Git instalado

## Opciones de Despliegue

Hay dos opciones principales para desplegar con Docker en DigitalOcean:

1. **App Platform** - Solución PaaS completamente administrada (recomendada para facilidad)
2. **Droplets con Docker** - Más control pero requiere más configuración

## Opción 1: Despliegue con App Platform

### Paso 1: Preparar el repositorio

Asegúrate de que tu repositorio incluya:
- El Dockerfile
- .dockerignore
- server.js

Sube estos cambios a tu repositorio Git:

```bash
git add Dockerfile .dockerignore server.js package.json
git commit -m "Añadir configuración para Docker"
git push
```

### Paso 2: Crear una nueva App en DigitalOcean

1. Inicia sesión en [DigitalOcean](https://cloud.digitalocean.com/)
2. Ve a "Apps" en el menú lateral
3. Haz clic en "Create App"
4. Selecciona "Source from GitHub" (o GitLab/BitBucket)
5. Autoriza DigitalOcean para acceder a tu repositorio
6. Selecciona el repositorio de Cliquéalo.mx
7. Asegúrate de que la rama sea `main` (o la que estés usando)
8. DigitalOcean detectará automáticamente el Dockerfile
9. Configura el plan ($12/mes es un buen inicio)

### Paso 3: Configurar Variables de Entorno

1. En la sección "Environment Variables", agrega todas las variables necesarias:
   - `NODE_ENV=production`
   - `MONGODB_URI=mongodb+srv://...` (usa el mismo que tienes en .env)
   - `SESSION_SECRET=...` (usar un valor diferente al desarrollo)
   - `JWT_SECRET=...` (usar un valor diferente al desarrollo)
   - Configuración de Cloudinary
   - Cualquier otra variable de entorno necesaria

2. Asegúrate de marcar como "Encrypted" los secretos sensibles

### Paso 4: Desplegar

1. Revisa la configuración y haz clic en "Create Resources"
2. DigitalOcean construirá y desplegará automáticamente tu aplicación
3. Una vez completado, obtendrás una URL para acceder a tu aplicación

## Opción 2: Despliegue con Droplets

### Paso 1: Crear un Droplet con Docker

1. Ve a "Droplets" en el menú lateral
2. Haz clic en "Create Droplet"
3. Selecciona "Marketplace" y busca "Docker"
4. Elige la región más cercana a tus usuarios
5. Selecciona un plan (2GB/1CPU es un buen inicio)
6. Configura SSH o contraseña
7. Haz clic en "Create Droplet"

### Paso 2: Conectarse al Droplet

```bash
ssh root@TU_IP_DEL_DROPLET
```

### Paso 3: Configurar el Entorno

```bash
# Crear directorio para la aplicación
mkdir -p /opt/cliquealo

# Crear archivo .env
nano /opt/cliquealo/.env
```

Añade todas las variables de entorno necesarias:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
SESSION_SECRET=...
JWT_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### Paso 4: Construir y Desplegar con Docker

Hay dos opciones:

#### 4A: Construir y ejecutar localmente, luego desplegar

```bash
# En tu máquina local
docker build -t cliquealo-mx:latest .
docker tag cliquealo-mx:latest registry.digitalocean.com/tu-nombre/cliquealo-mx:latest

# Autenticar con doctl
doctl auth init
doctl registry login

# Subir la imagen
docker push registry.digitalocean.com/tu-nombre/cliquealo-mx:latest

# En el Droplet
docker pull registry.digitalocean.com/tu-nombre/cliquealo-mx:latest
docker run -d -p 80:3000 --env-file /opt/cliquealo/.env --name cliquealo registry.digitalocean.com/tu-nombre/cliquealo-mx:latest
```

#### 4B: Construir directamente en el Droplet

```bash
# En el Droplet
git clone URL_DE_TU_REPO /opt/cliquealo-src
cd /opt/cliquealo-src
docker build -t cliquealo-mx:latest .
docker run -d -p 80:3000 --env-file /opt/cliquealo/.env --name cliquealo cliquealo-mx:latest
```

### Paso 5: Configurar Firewall y Dominio

1. En DigitalOcean, ve a "Networking" y configura el firewall para permitir tráfico HTTP/HTTPS
2. Configura tu dominio para apuntar a la IP del Droplet

## Monitoreo y Mantenimiento

### Ver Logs

```bash
# Para App Platform
En el panel de App Platform, ve a la sección "Logs"

# Para Droplets
docker logs cliquealo
```

### Reiniciar la Aplicación

```bash
# Para App Platform
En el panel de App Platform, usa el botón "Restart App"

# Para Droplets
docker restart cliquealo
```

### Actualizar la Aplicación

```bash
# Para App Platform
Simplemente haz push de tus cambios al repositorio conectado

# Para Droplets
git pull  # Si usaste la opción 4B
docker build -t cliquealo-mx:latest .
docker stop cliquealo
docker rm cliquealo
docker run -d -p 80:3000 --env-file /opt/cliquealo/.env --name cliquealo cliquealo-mx:latest
```

## Solución de Problemas

Si la aplicación no se inicia correctamente:

1. Verifica los logs para identificar errores
2. Asegúrate de que todas las variables de entorno estén configuradas correctamente
3. Confirma que MongoDB sea accesible desde DigitalOcean
4. Verifica que el puerto 3000 esté expuesto en el Dockerfile
5. Para Droplets, asegúrate de que el firewall permita tráfico en el puerto 80

## Optimizaciones Adicionales

- Configura un balanceador de carga si esperas alto tráfico
- Implementa CI/CD para automatizar el proceso de despliegue
- Configura copias de seguridad automáticas
- Añade un proxy inverso como Nginx para manejar SSL