export type Discount =
  | { kind: 'percent'; code: string; percent: number; minSubtotalCents?: number; expiresAt?: Date }
  | { kind: 'fixed'; code: string; amountCents: number; minSubtotalCents?: number; expiresAt?: Date };

const discounts = new Map<string, Discount>([
  ['WELCOME10', { kind: 'percent', code: 'WELCOME10', percent: 10 }],
  ['BIGORDER', { kind: 'fixed', code: 'BIGORDER', amountCents: 1500, minSubtotalCents: 10000 }],
  ['SUMMER25', { kind: 'percent', code: 'SUMMER25', percent: 25, expiresAt: new Date('2026-09-01') }],
]);

export class InvalidDiscountError extends Error {
  constructor(
    readonly code: string,
    reason: string,
  ) {
    super(`Discount ${code} ${reason}`);
  }
}

export function findDiscount(code: string): Discount | undefined {
  return discounts.get(code.toUpperCase());
}

/** Returns how many cents the code takes off the subtotal, or throws if it doesn't apply. */
export function discountAmount(code: string, subtotalCents: number, now = new Date()): number {
  const discount = findDiscount(code);
  if (!discount) throw new InvalidDiscountError(code, 'does not exist');
  if (discount.expiresAt && discount.expiresAt < now) {
    throw new InvalidDiscountError(code, 'has expired');
  }
  if (discount.minSubtotalCents && subtotalCents < discount.minSubtotalCents) {
    throw new InvalidDiscountError(code, `needs a subtotal of at least ${discount.minSubtotalCents} cents`);
  }
  if (discount.kind === 'percent') {
    return Math.round((subtotalCents * discount.percent) / 100);
  }
  return discount.amountCents;
}
