FROM node:20-alpine AS builder
WORKDIR /app

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY package.json package-lock.json* ./
COPY packages/shared/package.json ./packages/shared/
COPY frontend/package.json ./frontend/

RUN npm ci --workspace=@hivepulse/shared --workspace=frontend 2>/dev/null || npm install

COPY packages/shared ./packages/shared
COPY frontend ./frontend

RUN npm run build -w @hivepulse/shared && npm run build -w frontend

FROM nginx:alpine
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/frontend/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
