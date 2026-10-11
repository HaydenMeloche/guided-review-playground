CREATE TABLE books (
  sku          TEXT PRIMARY KEY,
  title        TEXT NOT NULL,
  author       TEXT NOT NULL,
  price_cents  INTEGER NOT NULL CHECK (price_cents >= 0)
);

CREATE TABLE orders (
  id              UUID PRIMARY KEY,
  subtotal_cents  INTEGER NOT NULL,
  tax_cents       INTEGER NOT NULL,
  total_cents     INTEGER NOT NULL,
  status          TEXT NOT NULL CHECK (status IN ('placed', 'shipped')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE order_items (
  order_id  UUID NOT NULL REFERENCES orders(id),
  sku       TEXT NOT NULL REFERENCES books(sku),
  quantity  INTEGER NOT NULL CHECK (quantity > 0),
  PRIMARY KEY (order_id, sku)
);
