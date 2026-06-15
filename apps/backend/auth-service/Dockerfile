# Etapa 1: Construcción
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Construimos solo el microservicio auth-service usando Nx
RUN npx nx build auth-service --prod

# Etapa 2: Producción
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist/apps/backend/auth-service ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Exponemos el puerto estándar de NestJS
EXPOSE 3000

# Comando de inicio
CMD ["node", "dist/main.js"]