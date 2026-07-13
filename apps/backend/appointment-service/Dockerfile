# Etapa 1: Construcción
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
# Construimos solo el microservicio appointment-service usando Nx
RUN npx nx build appointment-service --prod
 
# Etapa 2: Producción
FROM node:22-alpine
WORKDIR /app
# Solo copiamos el build y dependencias productivas.
# Los .env.* NO se copian nunca: se quedan en la etapa "builder" y se descartan.
COPY --from=builder /app/apps/backend/appointment-service/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
 
EXPOSE 3000
 
CMD ["node", "dist/main.js"]
 