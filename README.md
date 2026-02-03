# Product Dashboard

A small React + TypeScript dashboard that loads products from an API, supports search/filter/sort, deep-links state via URL, and shows product details in a modal.

## Demo features
- Fetch products from API (server state via React Query)
- Loading vs background fetching (no UI flicker)
- Search by title
- Filter by category
- Sort by title / price / rating (asc/desc)
- URL sync for filters + selected product (shareable links)
- Product details modal (close on backdrop click / Escape)
- Layout shift prevention (stable UI)

## Tech stack
- React + TypeScript
- Vite
- @tanstack/react-query

## Run locally
```bash
npm install
npm run dev
Project structure
src/hooks/useProducts.ts — React Query data fetching + caching

src/components/Filters.tsx — reusable search + category filter UI

src/components/ProductDetails.tsx — product modal

src/App.tsx — state composition, filtering/sorting, URL sync

Notes:
This project intentionally focuses on:
clean state management (UI state vs server state)
component separation
UX details (shareable URLs, stable layout, background refetch)
