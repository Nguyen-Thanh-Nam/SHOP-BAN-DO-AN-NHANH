# ================================================================
# Hardened Backend Dockerfile - SHOP-BAN-DO-AN-NHANH
# Security best practices:
#   1. Multi-stage build (giảm attack surface)
#   2. Non-root user (ngăn privilege escalation)
#   3. Chỉ copy production dependencies
#   4. Dùng node:alpine (image nhỏ, ít vulnerabilities)
#   5. Healthcheck tích hợp
#   6. Security labels đầy đủ
# ================================================================

# ==== Stage 1: Dependencies (Builder) ====
FROM node:20-alpine AS builder

# Cài đặt các package cần thiết cho build
RUN apk add --no-cache dumb-init

WORKDIR /app

# Copy package files trước (tận dụng Docker layer cache)
COPY package*.json ./

# Cài đặt TẤT CẢ dependencies (bao gồm devDependencies)
RUN npm ci --ignore-scripts

# Copy source code
COPY . .

# Loại bỏ các file nhạy cảm không nên vào image
RUN rm -f .env .env.* *.md

# ==== Stage 2: Production Runner ====
FROM node:20-alpine AS production

# Metadata labels
LABEL maintainer="SHOP-BAN-DO-AN-NHANH Team" \
      org.opencontainers.image.title="shopbandoannhanh-backend" \
      org.opencontainers.image.description="Express.js Backend API" \
      org.opencontainers.image.version="1.0.0" \
      org.opencontainers.image.vendor="PTIT HCM" \
      security.hardened="true"

# Cài dumb-init để xử lý signals đúng cách (tránh zombie processes)
RUN apk add --no-cache dumb-init

WORKDIR /app

# Copy dumb-init từ builder stage
COPY --from=builder /usr/bin/dumb-init /usr/bin/dumb-init

# Copy chỉ production dependencies
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production --ignore-scripts && npm cache clean --force

# Copy source code từ builder
COPY --from=builder /app/server.js ./
COPY --from=builder /app/src ./src/

# Tạo thư mục uploads và set permissions
RUN mkdir -p uploads && chmod 755 uploads

# ⚠️ SECURITY: Chạy với non-root user
# Không dùng root để giảm thiểu thiệt hại nếu bị RCE
RUN addgroup -g 1001 -S nodejs \
    && adduser -S nodeuser -u 1001 -G nodejs \
    && chown -R nodeuser:nodejs /app

USER nodeuser

# Expose port
EXPOSE 4000

# Health check — GitLab/Kubernetes dùng để kiểm tra service
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:4000/api/health', r => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))" || exit 1

# Sử dụng dumb-init làm PID 1 để xử lý signals đúng
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
