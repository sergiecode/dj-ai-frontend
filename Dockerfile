# DJ AI Frontend - Dockerfile
# Author: Sergie Code - Software Engineer & YouTube Programming Educator
# Purpose: AI tools for musicians - DJ AI frontend service

FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies for audio processing
RUN apk add --no-cache \
    curl \
    git

# Copy package files first for better Docker layer caching
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership of app directory
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3000 || exit 1

# Start the application
CMD ["npm", "start"]
