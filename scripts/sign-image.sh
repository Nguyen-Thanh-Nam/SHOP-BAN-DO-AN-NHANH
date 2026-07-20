#!/bin/bash
# ================================================================
# Script ký Docker image với Cosign/Sigstore
# ================================================================
# Mô tả: Ký image sau khi build để đảm bảo tính toàn vẹn
#         Kubernetes (Kyverno/OPA) sẽ từ chối image chưa được ký
#
# Sử dụng:
#   ./scripts/sign-image.sh <image-name:tag>
#   ./scripts/sign-image.sh registry.gitlab.com/user/repo/backend:abc123
#
# Yêu cầu:
#   - cosign đã được cài đặt (https://github.com/sigstore/cosign)
#   - Docker daemon đang chạy
#   - Đã login vào container registry
# ================================================================

set -euo pipefail

# ================================================================
# Colors
# ================================================================
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# ================================================================
# Hàm helper
# ================================================================
log_info()    { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[✅ OK]${NC} $1"; }
log_warn()    { echo -e "${YELLOW}[⚠️  WARN]${NC} $1"; }
log_error()   { echo -e "${RED}[❌ ERROR]${NC} $1"; exit 1; }

print_banner() {
  echo -e "${CYAN}"
  echo "╔══════════════════════════════════════════════╗"
  echo "║   COSIGN IMAGE SIGNING - SHOP-BAN-DO-AN      ║"
  echo "║   Sigstore Transparency Log                   ║"
  echo "╚══════════════════════════════════════════════╝"
  echo -e "${NC}"
}

# ================================================================
# Kiểm tra prerequisites
# ================================================================
check_prerequisites() {
  log_info "Kiểm tra prerequisites..."

  # Kiểm tra cosign
  if ! command -v cosign &> /dev/null; then
    log_error "cosign chưa được cài đặt!\nCài đặt: https://github.com/sigstore/cosign/releases"
  fi
  log_success "cosign $(cosign version 2>/dev/null | head -1)"

  # Kiểm tra docker
  if ! command -v docker &> /dev/null; then
    log_error "Docker chưa được cài đặt!"
  fi
  log_success "Docker $(docker --version)"
}

# ================================================================
# Ký image với key-based signing
# ================================================================
sign_with_key() {
  local IMAGE=$1
  local KEY_FILE=${2:-"cosign.key"}

  log_info "Ký image với private key: $KEY_FILE"

  if [ ! -f "$KEY_FILE" ]; then
    log_warn "Không tìm thấy $KEY_FILE. Tạo key pair mới..."
    cosign generate-key-pair
    log_success "Đã tạo cosign.key và cosign.pub"
  fi

  # Ký image
  cosign sign \
    --key "$KEY_FILE" \
    --annotations "repo=$(git remote get-url origin 2>/dev/null || echo 'unknown')" \
    --annotations "commit=$(git rev-parse HEAD 2>/dev/null || echo 'unknown')" \
    --annotations "branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'unknown')" \
    --annotations "signed-by=cosign-key-based" \
    --annotations "timestamp=$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
    "$IMAGE"

  log_success "Image đã được ký với key-based signing!"
}

# ================================================================
# Ký image với keyless signing (Sigstore Fulcio)
# ================================================================
sign_keyless() {
  local IMAGE=$1

  log_info "Ký image với Keyless signing (Sigstore Fulcio/Rekor)..."
  log_warn "Sẽ mở browser để xác thực OIDC (Google/GitHub/GitLab)..."

  COSIGN_EXPERIMENTAL=1 cosign sign \
    --yes \
    --annotations "repo=$(git remote get-url origin 2>/dev/null || echo 'unknown')" \
    --annotations "commit=$(git rev-parse HEAD 2>/dev/null || echo 'unknown')" \
    --annotations "branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'unknown')" \
    --annotations "signed-by=keyless" \
    --annotations "timestamp=$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
    "$IMAGE"

  log_success "Image đã được ký với keyless signing!"
  log_info "Chữ ký đã được ghi vào Rekor transparency log (https://rekor.sigstore.dev)"
}

# ================================================================
# Hiển thị thông tin image sau khi ký
# ================================================================
show_signature_info() {
  local IMAGE=$1

  log_info "Thông tin chữ ký của image:"
  echo ""
  echo "  Image: $IMAGE"
  echo "  Rekor URL: https://rekor.sigstore.dev"
  echo ""

  # Kiểm tra signature (có thể fail nếu chưa verify được)
  if COSIGN_EXPERIMENTAL=1 cosign verify "$IMAGE" 2>/dev/null | python3 -m json.tool 2>/dev/null | head -30; then
    log_success "Chữ ký hợp lệ!"
  else
    log_warn "Không thể hiển thị thông tin chữ ký (thử verify riêng với verify-image.sh)"
  fi
}

# ================================================================
# Main
# ================================================================
print_banner
check_prerequisites

# Đọc arguments
IMAGE=${1:-""}
MODE=${2:-"keyless"}  # "key" hoặc "keyless"

if [ -z "$IMAGE" ]; then
  echo "Usage: $0 <image:tag> [key|keyless]"
  echo ""
  echo "Examples:"
  echo "  $0 registry.gitlab.com/mygroup/backend:v1.0.0"
  echo "  $0 registry.gitlab.com/mygroup/backend:v1.0.0 key"
  echo "  $0 registry.gitlab.com/mygroup/backend:v1.0.0 keyless"
  exit 1
fi

echo ""
log_info "Image: $IMAGE"
log_info "Mode: $MODE"
echo ""

case "$MODE" in
  "key")
    sign_with_key "$IMAGE"
    ;;
  "keyless"|*)
    sign_keyless "$IMAGE"
    ;;
esac

echo ""
show_signature_info "$IMAGE"
echo ""
log_success "✨ Hoàn thành! Image đã được ký và sẵn sàng deploy vào Kubernetes."
echo ""
echo "  Tiếp theo:"
echo "  1. Verify image: ./scripts/verify-image.sh $IMAGE"
echo "  2. Deploy: kubectl apply -f k8s/"
echo "  3. Kyverno sẽ tự động verify chữ ký trước khi cho phép deploy"
