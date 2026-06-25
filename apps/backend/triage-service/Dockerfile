# Etapa de construcción
FROM node:20-alpine As build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npx nx build triage-service --prod

# Etapa de producción
FROM node:20-alpine As production
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=build /usr/src/app/dist/apps/backend/triage-service ./dist
EXPOSE 3000
CMD ["node", "dist/main.js"]