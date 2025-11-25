# Multi-stage Docker build for Next.js 16 app
# --- Base image for building ---
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies first (better layer caching)
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the app source
COPY . .

# Build the Next.js app
ENV NODE_ENV=production
RUN npm run build

# Remove dev dependencies to shrink final image
RUN npm prune --omit=dev

# --- Runtime image ---
FROM node:22-alpine AS runner

WORKDIR /app

# Set environment
ENV NODE_ENV=production
# Default port Next.js listens on
ENV PORT=3000

# Copy only necessary files from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.* ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

# Expose the port the app runs on
EXPOSE 3000

# Start the Next.js server
CMD ["npm", "start"]
