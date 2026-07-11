# Etapa 1: Construcción (mismo patrón que los microservicios backend)
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
# Construimos solo el frontend web usando Nx (target "build" del plugin @nx/vite,
# inferido automáticamente; vite build ya genera un bundle de producción por defecto)
RUN npx nx build care-uce-web

# Etapa 2: Servir los estáticos con Nginx
FROM nginx:alpine
# Config propia del contenedor web (SPA fallback), NO la del API Gateway
COPY apps/care-uce-web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/care-uce-web/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
