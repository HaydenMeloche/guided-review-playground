#!/usr/bin/env bash
# Places a few sample orders against a running server, then cancels one.
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000}"

order() {
  local items=$1 code=${2:-}
  local body="{\"items\": $items}"
  if [[ -n "$code" ]]; then
    body="{\"items\": $items, \"discountCode\": \"$code\"}"
  fi
  curl -fsS -X POST "$BASE_URL/orders" -H 'content-type: application/json' -d "$body"
}

order '[{"sku": "BK-001", "quantity": 1}]' WELCOME10
echo
order '[{"sku": "BK-002", "quantity": 2}, {"sku": "BK-003", "quantity": 1}]' BIGORDER
echo

id=$(order '[{"sku": "BK-003", "quantity": 1}]' | sed -E 's/.*"id":"([^"]+)".*/\1/')
curl -fsS -X POST "$BASE_URL/orders/$id/cancel"
echo
