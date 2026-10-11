import { randomUUID } from 'node:crypto';
import { release, reserve } from './inventory.js';
import { quote } from './pricing.js';
import type { LineItem, Order } from './types.js';

const orders = new Map<string, Order>();

export class InvalidOrderError extends Error {}

export class OrderNotFoundError extends Error {
  constructor(readonly id: string) {
    super(`Order ${id} not found`);
  }
}

export function createOrder(items: LineItem[], discountCode?: string): Order {
  if (items.length === 0) throw new InvalidOrderError('An order needs at least one item');
  for (const item of items) {
    if (!Number.isInteger(item.quantity) || item.quantity < 1) {
      throw new InvalidOrderError(`Invalid quantity for ${item.sku}`);
    }
  }
  const prices = quote(items, discountCode);
  reserve(items);
  const order: Order = {
    id: randomUUID(),
    items,
    discountCode,
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

/** Cancels an order that hasn't shipped yet and returns its stock to inventory. */
export function cancelOrder(id: string): Order {
  const order = orders.get(id);
  if (!order) throw new OrderNotFoundError(id);
  if (order.status === 'shipped') {
    throw new InvalidOrderError('Shipped orders cannot be cancelled');
  }
  release(order.items);
  order.status = 'cancelled';
  order.cancelledAt = new Date();
  return order;
}
