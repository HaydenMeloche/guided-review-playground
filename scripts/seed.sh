#!/usr/bin/env bash
# Places a few sample orders against a running server.
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000}"

order() {
  curl -fsS -X POST "$BASE_URL/orders" \
    -H 'content-type: application/json' \
    -d "{\"items\": $1}"
  echo
}

order '[{"sku": "BK-001", "quantity": 1}]'
order '[{"sku": "BK-002", "quantity": 2}, {"sku": "BK-003", "quantity": 1}]'
