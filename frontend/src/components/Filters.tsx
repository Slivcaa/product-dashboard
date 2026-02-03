type FiltersProps = {
  query: string
  onQueryChange: (value: string) => void
  category: string
  onCategoryChange: (value: string) => void
  categories: string[]
}

export function Filters({
  query,
  onQueryChange,
  category,
  onCategoryChange,
  categories,
}: FiltersProps) {
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <input
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Search products..."
      />

      <select value={category} onChange={(e) => onCategoryChange(e.target.value)}>
        <option value="all">All categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  )
}
