# bookstore-orders

A small HTTP API for placing orders against an in-memory book catalog.

```sh
pnpm install
pnpm start      # listens on :3000
pnpm test
```

## Endpoints

| Method | Path          | Description            |
| ------ | ------------- | ---------------------- |
| GET    | `/books`      | List the catalog       |
| POST   | `/orders`     | Place an order         |
| GET    | `/orders/:id` | Look up an order       |
