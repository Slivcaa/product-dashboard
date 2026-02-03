# Product Dashboard

A React + TypeScript product dashboard with server-side pagination, filtering, sorting, and shareable URL state.

## Features
- Server-side pagination (API-driven)
- Product search by title
- Filter by category
- Sort by title / price / rating (asc / desc)
- URL-synced state (filters, sorting, page, selected product)
- Product details modal
- Stable layout (no layout shift on loading or refetch)
- Background fetching with cached data

## Tech stack
- React
- TypeScript
- Vite
- @tanstack/react-query

## Data fetching
Products are fetched from the DummyJSON API using React Query.
Pagination is handled on the server via `limit` and `skip`.
Previous page data is preserved while new data is loading.

## Project structure
- `src/hooks/useProducts.ts` — server-state fetching & pagination logic
- `src/components/Filters.tsx` — search & category filters
- `src/components/ProductDetails.tsx` — product details modal
- `src/App.tsx` — UI state, filtering, sorting, URL sync, pagination

## Run locally
```bash
npm install
npm run dev

Notes:

This project demonstrates:
separation of server state and UI state
clean React architecture
attention to UX details (URL state, stable layout, background updates)
