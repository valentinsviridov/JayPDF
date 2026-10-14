#!/bin/bash
set -euo pipefail

echo "🧹 Running linting..."
bun run lint

echo "🧪 Running unit and operation contract tests..."
bun run test:unit

echo "🏗️ Building Next.js app..."
bun run build

# The build generates Next.js declarations needed by a clean checkout.
echo "🔎 Running type check..."
bunx --no-install tsc --noEmit

echo "🎭 Running E2E tests..."
bun run test:e2e

echo "💾 Checking save dialogs and download fallbacks in Chromium and WebKit..."
bun run test:save
