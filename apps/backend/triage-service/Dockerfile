# Etapa de construcción
FROM node:20-alpine AS build
WORKDIR /usr/src/app

# 1. Copiamos archivos de configuración base desde la raíz del monorepo
COPY package*.json nx.json tsconfig.base.json ./
RUN cp tsconfig.base.json tsconfig.json

# 2. Copiamos la carpeta completa de librerías globales compartidas
COPY packages/ ./packages/

# 3. Copiamos la subcarpeta específica de este microservicio
COPY apps/backend/triage-service/ ./apps/backend/triage-service/

# 4. Instalamos todas las dependencias (necesarias para compilar)
RUN npm ci --legacy-peer-deps

# 5. Sincronizamos el grafo de Nx y compilamos el servicio
RUN npx nx sync && npx nx build triage-service --prod


# Etapa de producción
FROM node:20-alpine AS production
WORKDIR /usr/src/app

# Copiamos package y configuraciones básicas para producción
COPY package*.json nx.json tsconfig.base.json ./
RUN cp tsconfig.base.json tsconfig.json

# Copiamos packages en producción por si el dist requiere resolución en runtime
COPY packages/ ./packages/

# Instalamos solo dependencias de producción
RUN npm ci --only=production --legacy-peer-deps

# Copiamos los artefactos compilados desde el build (Ruta estándar de salida de Nx)
COPY --from=build /usr/src/app/dist/apps/backend/triage-service ./dist
EXPOSE 3000
CMD ["node", "dist/main.js"]