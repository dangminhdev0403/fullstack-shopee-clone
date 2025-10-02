# Stage 1: Build
FROM node:20 AS build

WORKDIR /app

# Copy package.json trước để cache
COPY package*.json ./

# Cài dependencies
RUN npm install

# Fix quyền cho vite và các bin khác
RUN chmod +x node_modules/.bin/*

# Copy source code
COPY . .

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
