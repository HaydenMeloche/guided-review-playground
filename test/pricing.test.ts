import { describe, expect, it } from 'vitest';
import { quote, tax, UnknownSkuError } from '../src/pricing.js';

describe('pricing', () => {
  it('sums line items and adds tax', () => {
    expect(quote([{ sku: 'BK-001', quantity: 2 }])).toEqual({
      subtotalCents: 8598,
      discountCents: 0,
      taxCents: 1118,
      totalCents: 9716,
    });
  });

  it('rounds tax to the nearest cent', () => {
    expect(tax(2499)).toBe(325);
  });

  it('rejects unknown SKUs', () => {
    expect(() => quote([{ sku: 'NOPE', quantity: 1 }])).toThrow(UnknownSkuError);
  });
});
