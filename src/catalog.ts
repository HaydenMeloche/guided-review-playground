import type { Book } from './types.js';

const books: Book[] = [
  { sku: 'BK-001', title: 'The Pragmatic Programmer', author: 'Hunt & Thomas', priceCents: 4299 },
  { sku: 'BK-002', title: 'Designing Data-Intensive Applications', author: 'Kleppmann', priceCents: 5599 },
  { sku: 'BK-003', title: 'Refactoring', author: 'Fowler', priceCents: 4799 },
  { sku: 'BK-004', title: 'A Philosophy of Software Design', author: 'Ousterhout', priceCents: 2499 },
];

const bySku = new Map(books.map((b) => [b.sku, b]));

export function listBooks(): Book[] {
  return [...books];
}

export function findBook(sku: string): Book | undefined {
  return bySku.get(sku);
}

export class UnknownSkuError extends Error {
  constructor(readonly sku: string) {
    super(`Unknown SKU ${sku}`);
  }
}
