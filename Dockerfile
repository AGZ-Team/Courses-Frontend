# Multi-stage Docker build for Next.js 16 app
# --- Base image for building ---
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci --prefer-offline --no-audit

# Copy the rest of the app source
COPY . .

# Build the Next.js app
ENV NODE_ENV=production
RUN npm run build

# Remove dev dependencies to shrink final image
RUN npm prune --omit=dev

# --- Runtime image ---
FROM node:20-alpine AS runner

WORKDIR /app

# Set environment
ENV NODE_ENV=production
# Default port Next.js listens on
ENV PORT=3000

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy only necessary files from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/messages ./messages

# Change ownership
RUN chown -R nextjs:nodejs /app

USER nextjs

# Expose the port the app runs on
EXPOSE 3000

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start the Next.js server
CMD ["npm", "start"]
