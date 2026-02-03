import { useMemo, useState, useEffect } from 'react'
import './App.css'
import { useProducts } from './hooks/useProducts'
import { Filters } from './components/Filters'
import { ProductDetails } from './components/ProductDetails'


type SortBy = 'title' | 'price' | 'rating'
type SortDir = 'asc' | 'desc'


function App() {
 const { products, loading, fetching, error, refetch } = useProducts()



  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [selectedId, setSelectedId] = useState<number | null>(null)


  const [sortBy, setSortBy] = useState<SortBy>('title')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
 
  useEffect(() => {
  const params = new URLSearchParams(window.location.search)

  const q = params.get('q')
  const c = params.get('category')
  const s = params.get('sortBy')
  const d = params.get('dir')
  const sel = params.get('selected')

  if (q) setQuery(q)
  if (c) setCategory(c)
  if (s === 'title' || s === 'price' || s === 'rating') setSortBy(s)
  if (d === 'asc' || d === 'desc') setSortDir(d)
  if (sel) setSelectedId(Number(sel))
}, [])


useEffect(() => {
  const params = new URLSearchParams()

  if (query) params.set('q', query)
  if (category !== 'all') params.set('category', category)
  params.set('sortBy', sortBy)
  params.set('dir', sortDir)
  if (selectedId !== null) params.set('selected', String(selectedId))


  window.history.replaceState(
    null,
    '',
    `${window.location.pathname}?${params.toString()}`
  )
}, [query, category, sortBy, sortDir, selectedId])

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

<div className="statusRow">
<button onClick={() => refetch()} style={{ marginTop: 12 }}>
  Refetch
</button>

{fetching && !loading && <span style={{ marginLeft: 8 }}>Updating…</span>}

{error && products.length === 0 && (
  <p style={{ color: 'red' }}>Failed to load. Try again.</p>
)}
</div>



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
          onClick={() => {
            setQuery('')
            setCategory('all')
            setSortBy('title')
            setSortDir('asc')
            setSelectedId(null)

          }}
        >
          Reset
        </button>
      </div>

      <h1>Product Dashboard</h1>

      {loading ? (
        
        <p>Loading...</p>
      ) : (
        <ul>
          {sortedProducts.map((product) => (
           <li
  key={product.id}
  onClick={() => setSelectedId(product.id)}
  style={{
    cursor: 'pointer',
    fontWeight: product.id === selectedId ? 'bold' : 'normal',
  }}
>
  {product.title} — ${product.price} — ⭐ {product.rating}
</li>

          ))}
        </ul>
      )}
{selectedProduct && (
  <ProductDetails product={selectedProduct} onClose={() => setSelectedId(null)} />
)}


      <p>Found: {filteredProducts.length}</p>
   
    </div>
  
  )
}

export default App
