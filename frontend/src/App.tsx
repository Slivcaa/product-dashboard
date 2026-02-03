import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { useProducts } from './hooks/useProducts'
import { Filters } from './components/Filters'
import { ProductDetails } from './components/ProductDetails'

type SortBy = 'title' | 'price' | 'rating'
type SortDir = 'asc' | 'desc'

function App() {
  // pagination first (must be declared before using in hook)
  const limit = 12
  const [page, setPage] = useState(1)

  // server data
  const { products, total, loading, fetching, error } = useProducts(page, limit)

  // ui state
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState<SortBy>('title')
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  // read state from URL on first mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    const q = params.get('q')
    const c = params.get('category')
    const s = params.get('sortBy')
    const d = params.get('dir')
    const sel = params.get('selected')
    const p = params.get('page')

    if (q) setQuery(q)
    if (c) setCategory(c)
    if (s === 'title' || s === 'price' || s === 'rating') setSortBy(s)
    if (d === 'asc' || d === 'desc') setSortDir(d)

    if (sel) {
      const n = Number(sel)
      if (!Number.isNaN(n)) setSelectedId(n)
    }

    if (p) {
      const n = Number(p)
      if (!Number.isNaN(n) && n >= 1) setPage(n)
    }
  }, [])

  // write state to URL
  useEffect(() => {
    const params = new URLSearchParams()

    if (query) params.set('q', query)
    if (category !== 'all') params.set('category', category)

    params.set('sortBy', sortBy)
    params.set('dir', sortDir)
    params.set('page', String(page))

    if (selectedId !== null) params.set('selected', String(selectedId))

    const qs = params.toString()
    window.history.replaceState(null, '', `${window.location.pathname}?${qs}`)
  }, [query, category, sortBy, sortDir, selectedId, page])

  // UX: when filters/sorting change, go back to first page
  useEffect(() => {
    setPage(1)
  }, [query, category, sortBy, sortDir])

  const totalPages = Math.max(1, Math.ceil(total / limit))

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))),
    [products]
  )

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesQuery = p.title.toLowerCase().includes(query.toLowerCase())
      const matchesCategory = category === 'all' || p.category === category
      return matchesQuery && matchesCategory
    })
  }, [products, query, category])

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      let compare = 0
      if (sortBy === 'title') compare = a.title.localeCompare(b.title)
      if (sortBy === 'price') compare = a.price - b.price
      if (sortBy === 'rating') compare = a.rating - b.rating
      return sortDir === 'asc' ? compare : -compare
    })
  }, [filteredProducts, sortBy, sortDir])

  const selectedProduct = useMemo(() => {
    if (selectedId === null) return null
    return products.find((p) => p.id === selectedId) ?? null
  }, [products, selectedId])

  return (
    <div className="page">
      <Filters
        query={query}
        onQueryChange={setQuery}
        category={category}
        onCategoryChange={setCategory}
        categories={categories}
      />

      <div className="pagination">
        <button
          className="btn"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          ← Prev
        </button>

        <span className="pageInfo">
          Page {page} / {totalPages}
        </span>

        <button
          className="btn"
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        >
          Next →
        </button>

        {fetching && !loading ? <span className="pill">Updating…</span> : null}
      </div>

      {error && products.length === 0 ? (
        <div className="errorBox">Failed to load. Try again.</div>
      ) : null}

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 12 }}>
        <label>
          Sort by:{' '}
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortBy)}>
            <option value="title">Title</option>
            <option value="price">Price</option>
            <option value="rating">Rating</option>
          </select>
        </label>

        <label>
          Direction:{' '}
          <select value={sortDir} onChange={(e) => setSortDir(e.target.value as SortDir)}>
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </label>

        <button
          className="btn btnGhost"
          onClick={() => {
            setQuery('')
            setCategory('all')
            setSortBy('title')
            setSortDir('asc')
            setSelectedId(null)
            setPage(1)
          }}
        >
          Reset
        </button>
      </div>

      <h1>Product Dashboard</h1>

      {loading ? (
        <div className="loading">Loading…</div>
      ) : (
        <ul className="grid">
          {sortedProducts.map((product) => (
            <li
              key={product.id}
              className={`card ${product.id === selectedId ? 'cardActive' : ''}`}
              onClick={() => setSelectedId(product.id)}
            >
              <div className="cardTop">
                <h3 className="cardTitle">{product.title}</h3>
                <span className="badge">{product.category}</span>
              </div>

              <div className="cardMeta">
                <span className="price">${product.price}</span>
                <span className="rating">⭐ {product.rating}</span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {selectedProduct && (
        <ProductDetails product={selectedProduct} onClose={() => setSelectedId(null)} />
      )}
    </div>
  )
}

export default App
