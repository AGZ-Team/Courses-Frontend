# Hybrid Docker build: Nginx + Node.js for Next.js with full SSR support
# Nginx handles static files & caching, Node.js handles SSR & dynamic content

# --- Stage 1: Build the Next.js app ---
FROM node:20-alpine AS builder

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

# --- Stage 2: Production runtime with Nginx + Node.js ---
FROM node:20-alpine AS runner

# Install nginx and supervisor
RUN apk add --no-cache nginx supervisor

WORKDIR /app

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy built app from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/messages ./messages

# Copy nginx and supervisor configs
COPY nginx.conf /etc/nginx/http.d/default.conf
COPY supervisord.conf /etc/supervisord.conf

# Create nginx cache directories
RUN mkdir -p /var/cache/nginx /var/run/nginx /var/log/nginx && \
    chown -R nextjs:nodejs /var/cache/nginx /var/run/nginx /var/log/nginx

# Set ownership
RUN chown -R nextjs:nodejs /app

# Expose port 80 (nginx)
EXPOSE 80

# Health check via nginx
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start both nginx and node via supervisor
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
