# Etapa de construcción
FROM node:20-alpine As build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npx nx build triage-service --prod

# Etapa de producción
FROM node:20-alpine As production
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production --legacy-peer-deps
COPY --from=build /usr/src/app/apps/backend/triage-service/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main.js"]