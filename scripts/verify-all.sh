#!/bin/bash
set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$project_root"

if ! command -v docker >/dev/null || ! docker info >/dev/null 2>&1; then
  echo "Verification requires a running Docker daemon accessible to your user." >&2
  exit 1
fi

echo "🐳 Building the verification environment..."
docker build --progress=plain -f Dockerfile.verify -t jaypdf:verify .

verification_container="$(docker create --init --shm-size=1g jaypdf:verify)"
cleanup() {
  docker rm -f "$verification_container" >/dev/null 2>&1 || true
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

echo "🚀 Running the full suite inside Docker..."
verification_status=0
docker start --attach "$verification_container" || verification_status=$?

# Copy reports even when a test fails. No source bind mount or Docker socket is
# exposed to the container; docker cp creates files owned by the invoking user.
mkdir -p test-results
report_directory="$(mktemp -d "$project_root/test-results/docker-XXXXXX")"
if ! docker cp "$verification_container:/app/test-results/." "$report_directory/"; then
  echo "Could not copy verification reports from the container." >&2
  verification_status=1
fi
echo "Verification reports: $report_directory"
if [ "$verification_status" -ne 0 ]; then
  echo "Verification failed inside Docker (exit $verification_status)." >&2
  exit "$verification_status"
fi

echo "🐳 Building Docker image..."
docker build --progress=plain -t jaypdf:local .

echo "✅ All checks passed successfully! The application is ready."
