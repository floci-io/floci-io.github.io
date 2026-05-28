#!/usr/bin/env sh
# Floci CLI installer — curl -fsSL https://floci.io/install.sh | sh
set -e

VERSION="${FLOCI_CLI_VERSION:-latest}"
INSTALL_DIR="${FLOCI_INSTALL_DIR:-/usr/local/bin}"
BINARY="floci"
REPO="floci-io/floci-cli"

detect_platform() {
    OS=$(uname -s | tr '[:upper:]' '[:lower:]')
    ARCH=$(uname -m)
    case "$ARCH" in
        x86_64)  ARCH="amd64" ;;
        aarch64|arm64) ARCH="arm64" ;;
        *) echo "Unsupported architecture: $ARCH" >&2; exit 1 ;;
    esac
    case "$OS" in
        linux)  PLATFORM="linux-${ARCH}" ;;
        darwin) PLATFORM="darwin-${ARCH}" ;;
        *) echo "Unsupported OS: $OS" >&2; exit 1 ;;
    esac
    echo "$PLATFORM"
}

fetch_latest_version() {
    curl -fsSL "https://api.github.com/repos/${REPO}/releases/latest" \
        | grep '"tag_name"' | sed 's/.*"tag_name": "\(.*\)".*/\1/'
}

main() {
    echo "Installing Floci CLI..."

    PLATFORM=$(detect_platform)
    if [ "$VERSION" = "latest" ]; then
        VERSION=$(fetch_latest_version)
    fi

    DOWNLOAD_URL="https://github.com/${REPO}/releases/download/${VERSION}/floci-${PLATFORM}"
    TMP=$(mktemp)

    echo "Downloading floci ${VERSION} for ${PLATFORM}..."
    curl -fsSL "$DOWNLOAD_URL" -o "$TMP"
    chmod +x "$TMP"

    # Verify checksum if sha256sum is available
    if command -v sha256sum >/dev/null 2>&1; then
        SUMS_URL="https://github.com/${REPO}/releases/download/${VERSION}/sha256sums.txt"
        EXPECTED=$(curl -fsSL "$SUMS_URL" | grep "floci-${PLATFORM}" | awk '{print $1}')
        ACTUAL=$(sha256sum "$TMP" | awk '{print $1}')
        if [ "$EXPECTED" != "$ACTUAL" ]; then
            echo "Checksum mismatch! Expected: $EXPECTED  Got: $ACTUAL" >&2
            rm -f "$TMP"
            exit 1
        fi
        echo "Checksum verified."
    fi

    # Install
    if [ -w "$INSTALL_DIR" ]; then
        mv "$TMP" "${INSTALL_DIR}/${BINARY}"
    else
        echo "Installing to ${INSTALL_DIR} requires sudo..."
        sudo mv "$TMP" "${INSTALL_DIR}/${BINARY}"
    fi

    echo ""
    echo "Floci CLI ${VERSION} installed to ${INSTALL_DIR}/${BINARY}"
    echo ""
    echo "Quick start:"
    echo "  floci start            # launch Floci"
    echo "  floci doctor           # check your environment"
    echo "  export AWS_ENDPOINT_URL=http://localhost:4566"
    echo "  aws s3 mb s3://my-bucket  # use the AWS CLI against Floci"
}

main "$@"
