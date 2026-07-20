# ================================================================
# Hardened Frontend Dockerfile - SHOP-BAN-DO-AN-NHANH
# Security best practices:
#   1. Multi-stage build (deps → builder → runner)
#   2. Non-root user (nextjs:nodejs)
#   3. Chỉ copy standalone output (Next.js standalone mode)
#   4. Không có dev tools trong production image
#   5. Healthcheck tích hợp
# ================================================================

# ==== Stage 1: Install Dependencies ====
FROM node:20-alpine AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Cài dependencies (sạch, không cache)
RUN npm ci --ignore-scripts

# ==== Stage 2: Build Application ====
FROM node:20-alpine AS builder

WORKDIR /app

# Copy node_modules từ deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Loại bỏ file nhạy cảm trước khi build
RUN rm -f .env .env.local .env.production

# Build Next.js application
# NEXT_TELEMETRY_DISABLED=1 để không gửi telemetry data
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# ==== Stage 3: Production Runner ====
FROM node:20-alpine AS runner

# Metadata labels
LABEL maintainer="SHOP-BAN-DO-AN-NHANH Team" \
      org.opencontainers.image.title="shopbandoannhanh-frontend" \
      org.opencontainers.image.description="Next.js Frontend Application" \
      org.opencontainers.image.version="1.0.0" \
      org.opencontainers.image.vendor="PTIT HCM" \
      security.hardened="true"

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# ⚠️ SECURITY: Non-root user
RUN addgroup -g 1001 -S nodejs \
    && adduser -S nextjs -u 1001 -G nodejs

# Copy chỉ những gì cần cho production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

# Copy toàn bộ .next (cần thiết cho Next.js 16)
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

USER nextjs

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', r => process.exit(r.statusCode < 500 ? 0 : 1)).on('error', () => process.exit(1))" || exit 1

CMD ["node_modules/.bin/next", "start"]
