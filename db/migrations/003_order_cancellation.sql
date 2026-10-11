ALTER TABLE orders DROP CONSTRAINT orders_status_check;
ALTER TABLE orders
  ADD CONSTRAINT orders_status_check CHECK (status IN ('placed', 'shipped', 'cancelled')),
  ADD COLUMN cancelled_at TIMESTAMPTZ;

CREATE INDEX orders_status_idx ON orders (status) WHERE status <> 'cancelled';
