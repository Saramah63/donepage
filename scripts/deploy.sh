#!/usr/bin/env bash
set -euo pipefail

TARGET_DIR="${1:-.}"

if [ ! -d "$TARGET_DIR" ]; then
  echo "Target directory not found: $TARGET_DIR" >&2
  exit 1
fi

if ! command -v npx >/dev/null 2>&1; then
  echo "npx is required but not found." >&2
  exit 1
fi

echo "Deploying with Vercel CLI (preview)..."
cd "$TARGET_DIR"

# Prefer local vercel if installed, else use npx
if command -v vercel >/dev/null 2>&1; then
  vercel deploy --confirm
else
  npx --yes vercel deploy --confirm
fi
