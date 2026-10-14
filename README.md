# Morrow Market

A responsive React shopping cart demo with a product catalog, category filters, product search, quantity controls, and a live order summary.

## Run locally

```sh
npm install
npm run dev
```

## Checks

```sh
npm run lint
npm run build
```

Product selection updates the bag count, subtotal, shipping, estimated tax, and total immediately. Shipping is complimentary on orders of $75 or more; otherwise the demo charges $7.50. Estimated tax is a fixed 8% example. Checkout displays a local confirmation and clears the bag; it does not process payments or submit an order to a server.
