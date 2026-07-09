# Etapa 1: Construcción
FROM node:22-alpine AS builder
WORKDIR /app

# 1. Copiamos los archivos de configuración globales de la raíz
COPY package*.json nx.json tsconfig.base.json ./

# === AQUÍ EL TRUCO ===
# Duplicamos el tsconfig.base.json como tsconfig.json en la raíz para calmar a Nx Sync
RUN cp tsconfig.base.json tsconfig.json

# 2. Copiamos TODAS las librerías compartidas (la carpeta packages completa)
# Esto es vital para que las referencias a @org/shared-auth funcionen
COPY packages/ ./packages/

# 3. Copiamos la aplicación específica que queremos compilar
COPY apps/backend/auth-service/ ./apps/backend/auth-service/

# 4. Instalamos las dependencias en un entorno limpio
RUN npm ci

# 5. Construimos el microservicio usando el contexto completo
RUN npx nx sync && npx nx build auth-service --prod

# Etapa 2: Producción
FROM node:22-alpine
WORKDIR /app

# Copiamos los artefactos generados desde el builder
# Nx por defecto compila en la raíz dentro de la carpeta /dist/apps/...
COPY --from=builder /app/apps/backend/auth-service/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 3000

CMD ["node", "dist/main.js"]