import { describe, expect, it } from 'vitest';
import { discountAmount, InvalidDiscountError } from '../src/discounts.js';
import { quote } from '../src/pricing.js';

describe('discounts', () => {
  it('takes a percentage off the subtotal', () => {
    expect(discountAmount('WELCOME10', 4299)).toBe(430);
  });

  it('accepts codes in any case', () => {
    expect(discountAmount('welcome10', 1000)).toBe(100);
  });

  it('enforces a minimum subtotal', () => {
    expect(() => discountAmount('BIGORDER', 9999)).toThrow(InvalidDiscountError);
    expect(discountAmount('BIGORDER', 10000)).toBe(1500);
  });

  it('rejects expired codes', () => {
    expect(() => discountAmount('SUMMER25', 5000, new Date('2026-10-01'))).toThrow(/expired/);
  });

  it('shows the discount in the quote', () => {
    const q = quote([{ sku: 'BK-001', quantity: 1 }], 'WELCOME10');
    expect(q.discountCents).toBe(430);
    expect(q.totalCents).toBe(4299 - 430 + q.taxCents);
  });
});
