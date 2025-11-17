# Multi-stage build for MealSync API

# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/
COPY tsoa.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY src ./src
COPY prisma.config.ts ./

# Generate Prisma Client
RUN npm run prisma:generate

# Generate TSOA routes and spec
RUN npm run tsoa:routes && npm run tsoa:spec

# Build TypeScript (build script already includes tsoa and prisma)
RUN npx tsc

# Stage 2: Production
FROM node:18-alpine AS production

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy built files from builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src/generated ./src/generated

# Create logs directory
RUN mkdir -p logs

# Expose port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["node", "build/src/server.js"]

