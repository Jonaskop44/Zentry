# Install dependencies only when needed
# Stage 0
FROM node:24-alpine AS deps
WORKDIR /app

COPY package.json ./

RUN npm install
#############################################

# Rebuild the source code only when needed
# Stage 1
FROM node:24-alpine AS builder
WORKDIR /app

COPY . .
COPY --from=deps /app/node_modules ./node_modules

RUN npm run build
#############################################

# Production image, copy only production files
# Stage 2
FROM node:24-alpine AS prod
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

EXPOSE 3000

CMD ["npm", "run", "start"]