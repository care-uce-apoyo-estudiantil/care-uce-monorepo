FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx nx build clinical-service --configuration=production

FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --only=production

# Copiamos la compilación generada por Nx
COPY --from=builder /app/dist/apps/backend/clinical-service ./dist

CMD ["node", "dist/main.js"]