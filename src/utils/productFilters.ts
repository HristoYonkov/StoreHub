import type { Product } from '@/types/product'

export function getRatingThreshold(minRating: number): number {
  return minRating === 5 ? 4.5 : minRating
}

export function applyColorFilter(products: Product[], colors: string[]): Product[] {
  if (colors.length === 0) return products
  return products.filter(p => colors.includes(p.color))
}

export function applyRatingFilter(products: Product[], minRating: number | string): Product[] {
  const numericRating = Number(minRating);
  const threshold = numericRating === 5 ? 4.5 : numericRating;

  return products.filter(p => p.rating >= threshold);
}

export function applyPriceFilter(products: Product[], minPrice: number, maxPrice: number): Product[] {
  return products.filter(p => {
    const price = p.discountPrice ?? p.price
    return price >= minPrice && price <= maxPrice
  })
}

export function getPriceRange(products: Product[]): { min: number; max: number } {
  if (products.length === 0) return { min: 0, max: 0 }
  
  const prices = products.map(p => p.discountPrice ?? p.price)
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  }
}