const stock = new Map<string, number>([
  ['BK-001', 12],
  ['BK-002', 3],
  ['BK-003', 7],
  ['BK-004', 0],
]);

export class OutOfStockError extends Error {
  constructor(readonly sku: string) {
    super(`${sku} is out of stock`);
  }
}

export function available(sku: string): number {
  return stock.get(sku) ?? 0;
}

/** Reserves stock for every item, or none of them if any item is short. */
export function reserve(items: { sku: string; quantity: number }[]): void {
  for (const item of items) {
    if (available(item.sku) < item.quantity) throw new OutOfStockError(item.sku);
  }
  for (const item of items) {
    stock.set(item.sku, available(item.sku) - item.quantity);
  }
}

export function release(items: { sku: string; quantity: number }[]): void {
  for (const item of items) {
    stock.set(item.sku, available(item.sku) + item.quantity);
  }
}

export function setStock(sku: string, quantity: number): void {
  stock.set(sku, quantity);
}
