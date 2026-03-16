#!/bin/sh
# LLMTrust CLI Installer
# Usage: curl -fsSL https://llmtrust.dev/install | sh
set -e

REPO="smcroissant/llmtrust"
BINARY_NAME="llmtrust"
INSTALL_DIR="${INSTALL_DIR:-/usr/local/bin}"

# Detect OS and architecture
OS="$(uname -s)"
ARCH="$(uname -m)"

case "$OS" in
  Darwin) OS="darwin" ;;
  Linux) OS="linux" ;;
  *)
    echo "Error: Unsupported OS: $OS"
    exit 1
    ;;
esac

case "$ARCH" in
  x86_64|amd64) ARCH="amd64" ;;
  arm64|aarch64) ARCH="arm64" ;;
  *)
    echo "Error: Unsupported architecture: $ARCH"
    exit 1
    ;;
esac

PLATFORM="${OS}-${ARCH}"

# Get latest release tag
echo "Fetching latest release..."
LATEST_URL="https://api.github.com/repos/${REPO}/releases/latest"
TAG=$(curl -fsSL "$LATEST_URL" | grep '"tag_name"' | sed -E 's/.*"tag_name": *"([^"]+)".*/\1/')

if [ -z "$TAG" ]; then
  echo "Error: Could not fetch latest release tag."
  exit 1
fi

echo "Latest version: $TAG"

# Download URL
DOWNLOAD_URL="https://github.com/${REPO}/releases/download/${TAG}/${BINARY_NAME}-${PLATFORM}"

echo "Downloading ${BINARY_NAME} for ${PLATFORM}..."
TMPFILE=$(mktemp)
curl -fsSL "$DOWNLOAD_URL" -o "$TMPFILE" || {
  echo ""
  echo "Note: Binary release not available yet. Install via npm instead:"
  echo "  npm install -g llmtrust-cli"
  echo ""
  rm -f "$TMPFILE"
  exit 1
}

chmod +x "$TMPFILE"

# Install
if [ -w "$INSTALL_DIR" ]; then
  mv "$TMPFILE" "${INSTALL_DIR}/${BINARY_NAME}"
else
  echo "Need sudo to install to ${INSTALL_DIR}..."
  sudo mv "$TMPFILE" "${INSTALL_DIR}/${BINARY_NAME}"
fi

echo ""
echo "✓ LLMTrust CLI installed successfully!"
echo ""
echo "Try it:"
echo "  llmtrust compare gpt-4o claude-3.5-sonnet"
echo "  llmtrust score"
echo "  llmtrust search 'code generation'"
echo ""
