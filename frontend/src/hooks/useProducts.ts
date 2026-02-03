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
}

async function fetchProducts(): Promise<Product[]> {
  const res = await fetch('https://dummyjson.com/products')
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data: ProductsResponse = await res.json()
  return data.products
}

export function useProducts() {
  const query = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 1000 * 60, // 1 минута: данные считаются свежими
  })

  return {
  products: query.data ?? [],
  loading: query.isLoading,
  fetching: query.isFetching,
  error: query.error,
  refetch: query.refetch,
}
}
