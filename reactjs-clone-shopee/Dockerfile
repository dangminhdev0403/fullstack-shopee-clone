# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

# Copy package.json trước để cache npm install
COPY package*.json ./

# Cài dependencies trong container
RUN npm install

# Copy toàn bộ source code
COPY . .

# Nhận biến từ docker-compose.yml
ARG VITE_BASE_URL
ENV VITE_BASE_URL=$VITE_BASE_URL

# Build ra dist
RUN npm run build

# Stage 2: Serve với nginx
FROM nginx:alpine

# Copy build output sang nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config để proxy API
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
