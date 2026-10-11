import { findBook } from './catalog.js';
import { discountAmount } from './discounts.js';
import type { LineItem } from './types.js';

export const TAX_RATE = 0.13;

export class UnknownSkuError extends Error {
  constructor(readonly sku: string) {
    super(`Unknown SKU ${sku}`);
  }
}

export function subtotal(items: LineItem[]): number {
  let cents = 0;
  for (const item of items) {
    const book = findBook(item.sku);
    if (!book) throw new UnknownSkuError(item.sku);
    cents += book.priceCents * item.quantity;
  }
  return cents;
}

export function tax(subtotalCents: number): number {
  return Math.round(subtotalCents * TAX_RATE);
}

export function quote(items: LineItem[], discountCode?: string) {
  const subtotalCents = subtotal(items);
  const discountCents = discountCode ? discountAmount(discountCode, subtotalCents) : 0;
  const taxCents = tax(subtotalCents);
  return {
    subtotalCents,
    discountCents,
    taxCents,
    totalCents: subtotalCents - discountCents + taxCents,
  };
}
