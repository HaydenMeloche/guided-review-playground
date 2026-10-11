# bookstore-orders

A small HTTP API for placing orders against an in-memory book catalog.

```sh
pnpm install
pnpm start      # listens on :3000
pnpm test
```

## Endpoints

| Method | Path                 | Description               |
| ------ | -------------------- | ------------------------- |
| GET    | `/books`             | List the catalog          |
| POST   | `/orders`            | Place an order            |
| GET    | `/orders/:id`        | Look up an order          |
| POST   | `/orders/:id/cancel` | Cancel an unshipped order |

## Discount codes

Pass `discountCode` when placing an order. Codes are case-insensitive and are
applied to the subtotal. See `src/discounts.ts` for the active codes.

![Order flow](docs/order-flow.png)
