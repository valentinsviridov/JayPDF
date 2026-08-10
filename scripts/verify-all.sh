#!/bin/bash
set -e

echo "🚀 Starting full verification suite..."

echo "📦 Installing dependencies..."
bun install
bun run setup-worker

echo "🧹 Running linting..."
bun run lint

echo "🔎 Running type check..."
bunx tsc --noEmit

echo "🧪 Running unit and operation contract tests..."
bun run test:unit

echo "🏗️ Building Next.js app..."
bun run build

echo "🎭 Running E2E tests..."
# We use --no-install to strictly force bunx to use the local playwright version installed in node_modules,
# ensuring the downloaded browsers perfectly match the project's dependency version.
PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=true bunx --no-install playwright install
# We skip host requirements validation to avoid sudo prompts during automated checks.
# If tests crash or the browser fails to launch due to missing system libraries (like libavif16),
# you can manually fix it by running: sudo npx playwright install-deps
PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=true bun run test:e2e

echo "🐳 Building Docker image..."
docker build --progress=plain -t pdflince:local .

echo "✅ All checks passed successfully! The application is ready."
