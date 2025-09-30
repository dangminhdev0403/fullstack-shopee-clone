FROM node:20-alpine as build
WORKDIR /app

# copy code và node_modules từ local
COPY package*.json ./
COPY node_modules ./node_modules
COPY . .

ARG VITE_BASE_URL
ENV VITE_BASE_URL=$VITE_BASE_URL

RUN npm run build && rm -rf node_modules

# Stage 2: Serve với Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
