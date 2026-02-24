import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product } from '@/types/product'
import { useProductsStore } from '@/stores/products'

export interface CartItem extends Product {
  qty: number
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  const totalItems = computed(() =>
    items.value.reduce((sum, i) => sum + i.qty, 0)
  )

  const totalPrice = computed(() =>
    items.value.reduce((sum, i) => sum + (i.discountPrice ?? i.price) * i.qty, 0)
  )

  function addItem(product: Product): void {
    const productsStore = useProductsStore()
    const source = productsStore.all.find(p => p.id === product.id)
    if (!source || (source.stock ?? 0) <= 0) return

    const existing = items.value.find(i => i.id === product.id)
    if (existing) {
      existing.qty++
    } else {
      items.value.push({ ...product, qty: 1 })
    }
    if (source.stock !== undefined) source.stock--
  }

  function removeItem(id: number): void {
    const productsStore = useProductsStore()
    const item = items.value.find(i => i.id === id)
    if (item) {
      const source = productsStore.all.find(p => p.id === id)
      if (source !== undefined && source.stock !== undefined) source.stock += item.qty
    }
    items.value = items.value.filter(i => i.id !== id)
  }

  function increaseQty(id: number): void {
    const productsStore = useProductsStore()
    const source = productsStore.all.find(p => p.id === id)
    if (!source || (source.stock ?? 0) <= 0) return

    const item = items.value.find(i => i.id === id)
    if (item) {
      item.qty++
      if (source.stock !== undefined) source.stock--
    }
  }

  function decreaseQty(id: number): void {
    const productsStore = useProductsStore()
    const source = productsStore.all.find(p => p.id === id)
    const item = items.value.find(i => i.id === id)
    if (!item) return

    if (item.qty > 1) {
      item.qty--
    } else {
      items.value = items.value.filter(i => i.id !== id)
    }
    if (source?.stock !== undefined) source.stock++
  }

  function clearCart(): void {
    const productsStore = useProductsStore()
    items.value.forEach(item => {
      const source = productsStore.all.find(p => p.id === item.id)
      if (source?.stock !== undefined) source.stock += item.qty
    })
    items.value = []
  }

  return {
    items, totalItems, totalPrice,
    addItem, removeItem, increaseQty, decreaseQty, clearCart
  }
})