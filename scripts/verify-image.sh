#!/bin/bash
# ================================================================
# Script verify chữ ký Docker image với Cosign
# ================================================================
# Mô tả: Kiểm tra xem một Docker image có chữ ký hợp lệ không
#         Đây là bước bắt buộc trước khi deploy vào Kubernetes
#
# Sử dụng:
#   ./scripts/verify-image.sh <image-name:tag>
#   ./scripts/verify-image.sh registry.gitlab.com/user/repo/backend:abc123
#
# Bài thực hành 2 (Mô phỏng bypass):
#   Thử deploy image KHÔNG có chữ ký → Kyverno sẽ block
# ================================================================

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

log_info()    { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[✅ VALID]${NC} $1"; }
log_warn()    { echo -e "${YELLOW}[⚠️  WARN]${NC} $1"; }
log_error()   { echo -e "${RED}[❌ INVALID]${NC} $1"; }

print_banner() {
  echo -e "${CYAN}"
  echo "╔══════════════════════════════════════════════╗"
  echo "║   COSIGN IMAGE VERIFICATION                  ║"
  echo "║   SHOP-BAN-DO-AN-NHANH Security Check        ║"
  echo "╚══════════════════════════════════════════════╝"
  echo -e "${NC}"
}

# ================================================================
# Verify với key-based
# ================================================================
verify_with_key() {
  local IMAGE=$1
  local PUB_KEY=${2:-"cosign.pub"}

  if [ ! -f "$PUB_KEY" ]; then
    log_error "Không tìm thấy public key: $PUB_KEY"
    return 1
  fi

  log_info "Verifying với public key: $PUB_KEY"

  if cosign verify \
      --key "$PUB_KEY" \
      "$IMAGE" 2>/dev/null | python3 -m json.tool; then
    log_success "Chữ ký hợp lệ! Image an toàn để deploy."
    return 0
  else
    log_error "Chữ ký KHÔNG hợp lệ hoặc image chưa được ký!"
    log_error "Image này PHẢI BỊ CHẶN khi deploy vào Kubernetes!"
    return 1
  fi
}

# ================================================================
# Verify với keyless (Fulcio/Rekor)
# ================================================================
verify_keyless() {
  local IMAGE=$1
  local IDENTITY_REGEX=${2:-".*"}
  local OIDC_ISSUER=${3:-"https://gitlab.com"}

  log_info "Verifying với Sigstore keyless (OIDC Issuer: $OIDC_ISSUER)..."

  if COSIGN_EXPERIMENTAL=1 cosign verify \
      --certificate-identity-regexp "$IDENTITY_REGEX" \
      --certificate-oidc-issuer "$OIDC_ISSUER" \
      "$IMAGE" 2>/dev/null | python3 -m json.tool | head -50; then
    log_success "Keyless signature hợp lệ!"
    return 0
  else
    log_error "Signature KHÔNG hợp lệ!"
    return 1
  fi
}

# ================================================================
# Lấy thông tin từ Rekor transparency log
# ================================================================
get_rekor_info() {
  local IMAGE=$1

  log_info "Lấy thông tin từ Rekor transparency log..."

  # Lấy digest của image
  local DIGEST
  DIGEST=$(docker inspect --format='{{index .RepoDigests 0}}' "$IMAGE" 2>/dev/null || echo "")

  if [ -n "$DIGEST" ]; then
    echo "  Image digest: $DIGEST"
    echo "  Rekor search: https://search.sigstore.dev/?hash=$DIGEST"
  fi
}

# ================================================================
# Mô phỏng Bài thực hành 2: Verify một image chưa ký
# ================================================================
simulate_unsigned_image_check() {
  local UNSIGNED_IMAGE=${1:-"mysql:8.0"}

  echo ""
  echo -e "${YELLOW}═══════════════════════════════════════════════${NC}"
  echo -e "${YELLOW}  BÀI THỰC HÀNH 2: Mô phỏng Image Chưa Ký${NC}"
  echo -e "${YELLOW}═══════════════════════════════════════════════${NC}"
  log_info "Thử verify image KHÔNG được ký: $UNSIGNED_IMAGE"
  log_info "Kyverno Policy Engine sẽ chặn image này khi deploy..."
  echo ""

  if COSIGN_EXPERIMENTAL=1 cosign verify \
      --certificate-identity-regexp ".*" \
      --certificate-oidc-issuer "https://gitlab.com" \
      "$UNSIGNED_IMAGE" 2>&1; then
    log_warn "Image này KHÔNG nên có chữ ký nhưng lại có! Kiểm tra lại policy."
  else
    echo ""
    log_error "⛔ Image '$UNSIGNED_IMAGE' CHƯA được ký bởi pipeline!"
    log_error "⛔ Kyverno sẽ TỪ CHỐI deploy image này vào cluster!"
    echo ""
    echo -e "${RED}  Kubernetes Event sẽ hiển thị:${NC}"
    echo -e "${RED}  ───────────────────────────────────────────────${NC}"
    echo -e "${RED}  Error: admission webhook 'kyverno-resource.kyverno.svc' denied${NC}"
    echo -e "${RED}  the request: Image signature verification failed for${NC}"
    echo -e "${RED}  '$UNSIGNED_IMAGE': No valid signatures found${NC}"
    echo -e "${RED}  ───────────────────────────────────────────────${NC}"
    echo ""
    echo "  ✅ Đây là hành vi ĐÚNG — chứng minh policy hoạt động!"
  fi
}

# ================================================================
# Main
# ================================================================
print_banner

IMAGE=${1:-""}
MODE=${2:-"keyless"}
SIMULATE=${3:-""}

if [ -z "$IMAGE" ]; then
  echo "Usage: $0 <image:tag> [key|keyless] [simulate-bypass]"
  echo ""
  echo "Examples:"
  echo "  # Verify image đã ký (keyless)"
  echo "  $0 registry.gitlab.com/mygroup/backend:v1.0.0"
  echo ""
  echo "  # Verify image đã ký (key-based)"
  echo "  $0 registry.gitlab.com/mygroup/backend:v1.0.0 key"
  echo ""
  echo "  # Mô phỏng bypass (Bài thực hành 2)"
  echo "  $0 mysql:8.0 keyless simulate-bypass"
  exit 1
fi

echo ""
log_info "Image cần verify: $IMAGE"
log_info "Mode: $MODE"
echo ""

# Kiểm tra cosign
if ! command -v cosign &> /dev/null; then
  log_error "cosign chưa được cài đặt! https://github.com/sigstore/cosign/releases"
fi

EXIT_CODE=0

# Verify chữ ký
case "$MODE" in
  "key")
    verify_with_key "$IMAGE" || EXIT_CODE=1
    ;;
  "keyless"|*)
    verify_keyless "$IMAGE" || EXIT_CODE=1
    ;;
esac

# Mô phỏng bypass nếu được yêu cầu
if [ "$SIMULATE" = "simulate-bypass" ]; then
  simulate_unsigned_image_check "nginx:latest"
fi

# Lấy Rekor info (không fail pipeline)
get_rekor_info "$IMAGE" || true

echo ""
if [ $EXIT_CODE -eq 0 ]; then
  log_success "🎉 Tất cả kiểm tra passed! Image an toàn để deploy."
else
  log_error "💥 Kiểm tra THẤT BẠI! Không được phép deploy image này!"
  log_error "Kiểm tra xem image đã được ký bởi pipeline chưa."
fi

exit $EXIT_CODE
