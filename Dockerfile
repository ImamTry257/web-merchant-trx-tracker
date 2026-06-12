# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies for building
RUN apk add --no-cache curl

COPY package*.json ./
RUN npm ci --only=production

# Build the application
COPY . .
RUN npm run build

# Production image
FROM nginx:alpine AS production

# Copy built files to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Add custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]