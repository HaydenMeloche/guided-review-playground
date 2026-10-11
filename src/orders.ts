import { randomUUID } from 'node:crypto';
import { reserve } from './inventory.js';
import { quote } from './pricing.js';
import type { LineItem, Order } from './types.js';

const orders = new Map<string, Order>();

export class InvalidOrderError extends Error {}

export function createOrder(items: LineItem[]): Order {
  if (items.length === 0) throw new InvalidOrderError('An order needs at least one item');
  for (const item of items) {
    if (!Number.isInteger(item.quantity) || item.quantity < 1) {
      throw new InvalidOrderError(`Invalid quantity for ${item.sku}`);
    }
  }
  const prices = quote(items);
  reserve(items);
  const order: Order = {
    id: randomUUID(),
    items,
    ...prices,
    status: 'placed',
    createdAt: new Date(),
  };
  orders.set(order.id, order);
  return order;
}

export function getOrder(id: string): Order | undefined {
  return orders.get(id);
}
