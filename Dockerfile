# Build stage
FROM node:20-slim AS builder

WORKDIR /app

# Add build arguments for environment variables
ARG VITE_API_URL
ARG VITE_KEYCLOAK_URL
ARG VITE_KEYCLOAK_REALM
ARG VITE_APP_MODE=public

# Set environment variables for Vite
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_KEYCLOAK_URL=$VITE_KEYCLOAK_URL
ENV VITE_KEYCLOAK_REALM=$VITE_KEYCLOAK_REALM
ENV VITE_APP_MODE=$VITE_APP_MODE

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Build the application
RUN if [ "$VITE_APP_MODE" = "dashboard" ]; then npm run build:dashboard; else npm run build:public; fi

# Runtime stage
FROM nginx:alpine

# Copy the built application from the builder stage
# The build output is in dist/public or dist/dashboard
ARG VITE_APP_MODE=public
COPY --from=builder /app/dist/${VITE_APP_MODE} /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
