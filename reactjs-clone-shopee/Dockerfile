# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

# Copy package.json để cache layer install
COPY package*.json ./

# Install dependencies (trong container, đảm bảo tương thích)
RUN npm install

# Copy toàn bộ source code
COPY . .

# Build app (có ARG từ docker-compose)
ARG VITE_BASE_URL
ENV VITE_BASE_URL=$VITE_BASE_URL
RUN npm run build

# Stage 2: Serve với nginx
FROM nginx:alpine

# Copy build output sang nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy file nginx.conf custom (proxy API)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
