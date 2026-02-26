import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Product } from '@/types/product'
import { fetchProducts } from '@/services/api'

export const useProductsStore = defineStore('products', () => {
  const all = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Load all products to the store
  async function load() {
    if (all.value.length > 0) return
    loading.value = true
    error.value = null
    
    try {
      all.value = await fetchProducts()

      // Synchronize stock with cart
      const saved = localStorage.getItem('storehub_cart')
      if (saved) {
        const cartItems = JSON.parse(saved)
        cartItems.forEach((cartItem: { id: number, qty: number }) => {
          const product = all.value.find(p => p.id === cartItem.id)
          if (product && product.stock !== undefined) {
            product.stock = Math.max(0, product.stock - cartItem.qty)
          }
        })
      }
    } catch (e) {
      error.value = 'Could not load products. Is the API server running?'
    } finally {
      loading.value = false
    }
  }

  function byCategory(category: string): Product[] {
    return all.value.filter(p => p.category.toLowerCase() === category.toLowerCase())
  }

  function byId(id: number): Product | undefined {
    return all.value.find(p => p.id === id)
  }

  return { all, loading, error, load, byCategory, byId }
})