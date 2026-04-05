# Build stage
FROM node:20-slim AS builder

WORKDIR /app

# Add build arguments for environment variables
ARG VITE_API_URL
ARG VITE_KEYCLOAK_URL
ARG VITE_KEYCLOAK_REALM
ARG VITE_APP_NAME=WormLabs

# Set environment variables for Vite
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_KEYCLOAK_URL=$VITE_KEYCLOAK_URL
ENV VITE_KEYCLOAK_REALM=$VITE_KEYCLOAK_REALM
ENV VITE_APP_NAME=$VITE_APP_NAME

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Build BOTH modes
RUN npm run build:public && npm run build:dashboard

# Runtime stage
FROM nginx:alpine

# Copy the built applications to their respective directories
COPY --from=builder /app/dist/public /usr/share/nginx/html/public
COPY --from=builder /app/dist/dashboard /usr/share/nginx/html/dashboard

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
