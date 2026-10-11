import { beforeEach, describe, expect, it } from 'vitest';
import { available, OutOfStockError, setStock } from '../src/inventory.js';
import { createOrder, getOrder, InvalidOrderError } from '../src/orders.js';

describe('orders', () => {
  beforeEach(() => setStock('BK-002', 3));

  it('creates an order and reserves stock', () => {
    const order = createOrder([{ sku: 'BK-002', quantity: 2 }]);
    expect(order.status).toBe('placed');
    expect(getOrder(order.id)).toBe(order);
    expect(available('BK-002')).toBe(1);
  });

  it('rejects orders that exceed stock', () => {
    expect(() => createOrder([{ sku: 'BK-002', quantity: 4 }])).toThrow(OutOfStockError);
    expect(available('BK-002')).toBe(3);
  });

  it('rejects empty orders and bad quantities', () => {
    expect(() => createOrder([])).toThrow(InvalidOrderError);
    expect(() => createOrder([{ sku: 'BK-001', quantity: 0 }])).toThrow(InvalidOrderError);
  });
});
