FROM node:20-alpine as build
WORKDIR /app

# Copy package info
COPY package*.json ./

# Copy node_modules từ local (build nhanh)
COPY node_modules ./node_modules

# Copy source code
COPY . .

ARG VITE_BASE_URL
ENV VITE_BASE_URL=$VITE_BASE_URL

# Fix quyền cho các file .bin (vite, eslint, prettier…)
RUN chmod +x node_modules/.bin/*

# Build
RUN npm run build && rm -rf node_modules

# Stage 2: Serve với Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
