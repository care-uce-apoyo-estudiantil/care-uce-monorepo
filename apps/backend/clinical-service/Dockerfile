FROM node:22-alpine AS builder

WORKDIR /app

# Copiamos archivos de dependencias
COPY package*.json ./
# Aplicamos el fix: instalar todo para asegurar consistencia del lockfile
RUN npm install --legacy-peer-deps

COPY . .
# Construimos con Nx
RUN npx nx build clinical-service --configuration=production

FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./

# FIX: Usamos install + prune en lugar de ci para evitar el error de inconsistencia
# 1. Instalar todas las dependencias para que el lockfile sea válido
# 2. Prune para limpiar las devDependencies y dejar la imagen ligera
RUN npm install --legacy-peer-deps && npm prune --production

# Copiamos la compilación generada por Nx
COPY --from=builder /app/apps/backend/clinical-service/dist ./dist

CMD ["node", "dist/main.js"]