import { useEffect } from 'react'
import type { Product } from '../hooks/useProducts'

type ProductDetailsProps = {
  product: Product
  onClose: () => void
}

export function ProductDetails({ product, onClose }: ProductDetailsProps) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(600px, 100%)',
          background: '#fff',
          borderRadius: 12,
          padding: 16,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
          <h2 style={{ margin: 0 }}>{product.title}</h2>
          <button onClick={onClose}>✕</button>
        </div>

        <div style={{ marginTop: 12 }}>
          <p>Category: {product.category}</p>
          <p>Price: ${product.price}</p>
          <p>Rating: ⭐ {product.rating}</p>
        </div>
      </div>
    </div>
  )
}
