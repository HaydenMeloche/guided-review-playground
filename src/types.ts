export interface Book {
  sku: string;
  title: string;
  author: string;
  priceCents: number;
}

export interface LineItem {
  sku: string;
  quantity: number;
}

export type OrderStatus = 'placed' | 'shipped' | 'cancelled';

export interface Order {
  id: string;
  items: LineItem[];
  subtotalCents: number;
  discountCode?: string;
  discountCents: number;
  taxCents: number;
  totalCents: number;
  status: OrderStatus;
  createdAt: Date;
  cancelledAt?: Date;
}
