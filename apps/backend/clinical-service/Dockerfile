# --- Etapa 1: Builder ---
FROM node:22-alpine AS builder

WORKDIR /app

# Copiamos archivos de dependencias
COPY package*.json nx.json tsconfig.base.json ./
# Copiamos código fuente necesario para el build
COPY apps ./apps
COPY libs ./libs

# Instalamos todo (incluyendo devDeps para el build de Nx)
RUN npm install --legacy-peer-deps

# Construimos
RUN npx nx build clinical-service --configuration=production

# --- Etapa 2: Runner (Producción) ---
FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Copiamos solo los archivos de dependencias
COPY package*.json ./

# FIX: Usamos npm install seguido de prune para evitar el error de "Missing"
# Al instalar todo primero, npm no se queja de inconsistencias en el lockfile
# Luego eliminamos lo que no es de producción.
RUN npm install --legacy-peer-deps && npm prune --production

# Copiamos la compilación generada por Nx desde el builder
COPY --from=builder /app/dist/apps/backend/clinical-service ./dist

# CMD para ejecutar la app
CMD ["node", "dist/main.js"]