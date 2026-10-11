CREATE TABLE discounts (
  code                TEXT PRIMARY KEY,
  kind                TEXT NOT NULL CHECK (kind IN ('percent', 'fixed')),
  percent             INTEGER CHECK (percent BETWEEN 1 AND 100),
  amount_cents        INTEGER CHECK (amount_cents > 0),
  min_subtotal_cents  INTEGER,
  expires_at          TIMESTAMPTZ
);

ALTER TABLE orders
  ADD COLUMN discount_code  TEXT REFERENCES discounts(code),
  ADD COLUMN discount_cents INTEGER NOT NULL DEFAULT 0;

INSERT INTO discounts (code, kind, percent, amount_cents, min_subtotal_cents, expires_at) VALUES
  ('WELCOME10', 'percent', 10,   NULL, NULL,  NULL),
  ('BIGORDER',  'fixed',   NULL, 1500, 10000, NULL),
  ('SUMMER25',  'percent', 25,   NULL, NULL,  '2026-09-01');
