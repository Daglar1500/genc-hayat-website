FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install --include=dev
ARG VITE_API_URL=http://localhost:3001/api
ENV VITE_API_URL=$VITE_API_URL
COPY . .
RUN ./node_modules/.bin/vite build

# Production: nginx ile serve et
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
