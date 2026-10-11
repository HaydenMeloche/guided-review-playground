import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { listBooks } from './catalog.js';
import { InvalidDiscountError } from './discounts.js';
import { OutOfStockError } from './inventory.js';
import { cancelOrder, createOrder, getOrder, InvalidOrderError, OrderNotFoundError } from './orders.js';
import { UnknownSkuError } from './pricing.js';
import { formatCents } from './money.js';

function send(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { 'content-type': 'application/json' });
  res.end(JSON.stringify(body));
}

async function readJson(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk as Buffer);
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

export async function handle(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const url = new URL(req.url ?? '/', 'http://localhost');
  try {
    if (req.method === 'GET' && url.pathname === '/books') {
      return send(
        res,
        200,
        listBooks().map((b) => ({ ...b, price: formatCents(b.priceCents) })),
      );
    }
    if (req.method === 'POST' && url.pathname === '/orders') {
      const body = (await readJson(req)) as { items?: unknown; discountCode?: string };
      if (!Array.isArray(body.items)) return send(res, 400, { error: 'items must be an array' });
      return send(res, 201, createOrder(body.items, body.discountCode));
    }
    const match = url.pathname.match(/^\/orders\/([\w-]+)$/);
    if (req.method === 'GET' && match) {
      const order = getOrder(match[1]);
      return order ? send(res, 200, order) : send(res, 404, { error: 'not found' });
    }
    const cancel = url.pathname.match(/^\/orders\/([\w-]+)\/cancel$/);
    if (req.method === 'POST' && cancel) {
      return send(res, 200, cancelOrder(cancel[1]));
    }
    send(res, 404, { error: 'not found' });
  } catch (err) {
    if (
      err instanceof InvalidOrderError ||
      err instanceof UnknownSkuError ||
      err instanceof InvalidDiscountError
    ) {
      return send(res, 400, { error: err.message });
    }
    if (err instanceof OrderNotFoundError) return send(res, 404, { error: err.message });
    if (err instanceof OutOfStockError) return send(res, 409, { error: err.message });
    send(res, 500, { error: 'internal error' });
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const port = Number(process.env.PORT ?? 3000);
  createServer(handle).listen(port, () => console.log(`listening on :${port}`));
}
