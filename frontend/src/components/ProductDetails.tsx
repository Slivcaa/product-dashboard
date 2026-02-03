import type { Product } from '../hooks/useProducts'

type ProductDetailsProps = {
  product: Product
  onClose: () => void
}

export function ProductDetails({ product, onClose }: ProductDetailsProps) {
  return (
    <div style={{ marginTop: 16, padding: 12, border: '1px solid #ddd' }}>
      <h2>{product.title}</h2>
      <p>Category: {product.category}</p>
      <p>Price: ${product.price}</p>
      <p>Rating: ⭐ {product.rating}</p>

      <button onClick={onClose}>Close</button>
    </div>
  )
}
