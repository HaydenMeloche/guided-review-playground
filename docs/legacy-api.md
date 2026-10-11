# Legacy v0 API

The v0 API accepted `GET /order?id=...` and `POST /order` with form-encoded
bodies. It was replaced by the JSON endpoints in the README and is kept here
for clients that have not migrated.

- `GET /order?id=<id>` returns the order as JSON.
- `POST /order` accepts `sku=<sku>&qty=<n>` for a single-item order.
