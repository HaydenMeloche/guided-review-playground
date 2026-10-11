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

export type OrderStatus = 'placed' | 'shipped';

export interface Order {
  id: string;
  items: LineItem[];
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
  status: OrderStatus;
  createdAt: Date;
}
