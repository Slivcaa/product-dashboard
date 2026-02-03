import { useQuery } from '@tanstack/react-query'

export type Product = {
  id: number
  title: string
  category: string
  price: number
  rating: number
}

type ProductsResponse = {
  products: Product[]
  total: number
  skip: number
  limit: number
}

async function fetchProducts(page: number, limit: number): Promise<ProductsResponse> {
  const safePage = Number.isFinite(page) && page > 0 ? page : 1
  const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 12

  const skip = (safePage - 1) * safeLimit
  const url = `https://dummyjson.com/products?limit=${safeLimit}&skip=${skip}`

  const res = await fetch(url)

  if (!res.ok) {
    throw new Error(`Failed to fetch products (HTTP ${res.status})`)
  }

  return (await res.json()) as ProductsResponse
}

export function useProducts(page: number, limit = 12) {
  const query = useQuery<ProductsResponse, Error>({
    queryKey: ['products', page, limit],
    queryFn: () => fetchProducts(page, limit),
    staleTime: 60_000,
    // keeps previous page data while new page is loading (no flicker)
    placeholderData: (prev) => prev,
  })

  return {
    products: query.data?.products ?? [],
    total: query.data?.total ?? 0,
    loading: query.isLoading,
    fetching: query.isFetching,
    error: query.error ?? null,
    refetch: query.refetch,
  }
}
