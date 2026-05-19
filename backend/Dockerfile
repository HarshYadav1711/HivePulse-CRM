FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
COPY packages/shared/package.json ./packages/shared/
COPY backend/package.json ./backend/

RUN npm ci --workspace=@hivepulse/shared --workspace=backend 2>/dev/null || npm install

COPY packages/shared ./packages/shared
COPY backend ./backend

RUN npm run build -w @hivepulse/shared && npm run build -w backend

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/shared ./packages/shared
COPY --from=builder /app/backend/package.json ./backend/
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/node_modules ./backend/node_modules

WORKDIR /app/backend
CMD ["node", "dist/index.js"]
