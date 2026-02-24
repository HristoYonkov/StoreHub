<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import { useToastStore } from '@/stores/toast'

const props = defineProps<{ id: number }>()
const router = useRouter()
const productsStore = useProductsStore()
const cartStore = useCartStore()
const toastStore = useToastStore()

onMounted(() => productsStore.load())

const product = computed(() => productsStore.all.find(p => p.id === props.id))

const liveStock = computed(() => product.value?.stock ?? 0)

const displayPrice = computed(() => product.value?.discountPrice ?? product.value?.price ?? 0)
const discountPercent = computed(() => {
  if (!product.value?.discountPrice) return 0
  return Math.round((1 - product.value.discountPrice / product.value.price) * 100)
})

function addToCart() {
  if (!product.value) return
  cartStore.addItem(product.value)
  toastStore.show(`"${product.value.name}" added to cart!`)
}
</script>

<template>

  <!-- Loading -->
  <div v-if="productsStore.loading" class="flex justify-center items-center py-32">
    <svg class="w-10 h-10 text-indigo-600 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
    </svg>
  </div>

  <!-- Error -->
  <div v-else-if="productsStore.error" class="max-w-xl mx-auto px-4 py-20 text-center">
    <div class="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl">
      <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {{ productsStore.error }}
    </div>
  </div>

  <!-- Not found -->
  <div v-else-if="!product && !productsStore.loading" class="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">
    <p class="text-xl font-medium mb-4">Product not found.</p>
    <RouterLink to="/" class="text-indigo-600 hover:underline">← Back to Shop</RouterLink>
  </div>

  <!-- Product -->
  <div v-else-if="product" class="min-h-screen bg-gray-50">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <RouterLink to="/" class="hover:text-indigo-600 transition-colors">Shop</RouterLink>
        <span>/</span>
        <RouterLink :to="`/${product.category.toLowerCase()}`" class="hover:text-indigo-600 transition-colors capitalize">
          {{ product.category }}
        </RouterLink>
        <span>/</span>
        <span class="text-gray-900 font-medium truncate">{{ product.name }}</span>
      </nav>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
        <!-- Image -->
        <div class="relative aspect-square bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
          <img :src="product.image" :alt="product.name" class="w-full h-full object-cover" />
          <span v-if="discountPercent > 0" class="absolute top-4 left-4 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full">
            -{{ discountPercent }}%
          </span>
        </div>

        <!-- Info -->
        <div class="flex flex-col">
          <span class="text-sm font-medium text-indigo-600 capitalize mb-2">{{ product.category }}</span>
          <h1 class="text-3xl font-bold text-gray-900 mb-3">{{ product.name }}</h1>

          <!-- Rating -->
          <div class="flex items-center gap-2 mb-4">
            <div class="flex text-yellow-400 text-xl">
              <span v-for="n in 5" :key="n">{{ n <= Math.round(product.rating) ? '★' : '☆' }}</span>
            </div>
            <span class="text-sm text-gray-500">({{ product.rating.toFixed(1) }})</span>
          </div>

          <!-- Price -->
          <div class="flex items-baseline gap-3 mb-6">
            <span class="text-4xl font-bold text-gray-900">${{ displayPrice }}</span>
            <span v-if="discountPercent > 0" class="text-xl text-gray-400 line-through">${{ product.price }}</span>
          </div>

          <p class="text-gray-600 leading-relaxed mb-6">{{ product.shortDesc }}</p>

          <!-- Meta -->
          <div class="flex flex-col gap-2 mb-8 text-sm">
            <div class="flex gap-2">
              <span class="text-gray-500 w-16">Color</span>
              <span class="font-medium text-gray-900">{{ product.color }}</span>
            </div>
            <div class="flex gap-2">
              <span class="text-gray-500 w-16">Stock</span>
              <span :class="liveStock === 0 ? 'text-red-500' : 'text-green-600'" class="font-medium">
                {{ liveStock === 0 ? 'Out of stock' : `${liveStock} available` }}
              </span>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex flex-col sm:flex-row gap-3 mt-auto">
            <button
              @click="addToCart"
              :disabled="liveStock === 0"
              class="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-xl transition-colors cursor-pointer"
            >
              {{ liveStock === 0 ? 'Out of Stock' : 'Add to Cart' }}
            </button>
            <button
              @click="router.back()"
              class="flex-1 sm:flex-none border border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3 px-6 rounded-xl transition-colors cursor-pointer"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>