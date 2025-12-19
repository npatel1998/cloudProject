
#!/usr/bin/env bash
set -e

# Always run from repo root regardless of where the script is called from
ROOT="$(cd "$(dirname "$0")" && pwd)"

# 1) Install in infra
cd "$ROOT/infra"
[ -f package-lock.json ] && npm ci || npm install

# 2) After infra finishes, install in service
cd "$ROOT/service/lambda-functions"
[ -f package-lock.json ] && npm ci || npm install
