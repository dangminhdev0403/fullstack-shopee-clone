# Stage 1: Build
FROM node:20 AS build

WORKDIR /app

# Copy package.json trước để cache layer
COPY package*.json ./

# Cài dependencies dự án
RUN npm install

# Cài vite global để tránh lỗi permission
RUN npm install -g vite

# Copy toàn bộ source code
COPY . .

# Build ra dist (dùng vite global)
RUN vite build --mode production

# Stage 2: Serve với nginx
FROM nginx:alpine

# Copy build output sang nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config để proxy API
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
