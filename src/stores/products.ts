import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
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
    } catch (e) {
      error.value = 'Could not load products. Is the API server running?'
    } finally {
      loading.value = false
    }
  }

  const byCategory = (category: string) =>
    computed(() => all.value.filter(p => p.category.toLowerCase() === category.toLowerCase()))

  const byId = (id: number) =>
    computed(() => all.value.find(p => p.id === id))

  return { all, loading, error, load, byCategory, byId }
})