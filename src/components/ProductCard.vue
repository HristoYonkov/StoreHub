<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '@/types/product'
import { useProductsStore } from '@/stores/products';

const props = defineProps<{ product: Product }>();
const emit = defineEmits<{ (e: 'add-to-cart', product: Product): void }>();

const productsStore = useProductsStore();

const liveStock = computed(() =>
  productsStore.all.find(p => p.id === props.product.id)?.stock ?? props.product.stock ?? 0
)

const displayPrice = computed(() => props.product.discountPrice ?? props.product.price)
const discountPercent = computed(() => {
  if (!props.product.discountPrice) return 0
  return Math.round((1 - props.product.discountPrice / props.product.price) * 100)
})
</script>

<template>
  <RouterLink :to="`/product/${product.id}`"
    class="group flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 h-full">
    <!-- Image -->
    <div class="relative aspect-square bg-gray-50 overflow-hidden">
      <img :src="product.image || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'"
        :alt="product.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy" />
      <span v-if="discountPercent > 0"
        class="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
        -{{ discountPercent }}%
      </span>
      
    </div>

    <!-- Content -->
    <div class="flex flex-col grow p-5">
      <h3 class="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">{{ product.name }}</h3>
      <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ product.shortDesc }}</p>

      <!-- Price -->
      <div class="flex items-center gap-3 mb-3">
        <span class="text-xl font-bold text-gray-900">${{ displayPrice }}</span>
        <span v-if="discountPercent > 0" class="text-base text-gray-500 line-through">${{ product.price }}</span>
      </div>

      <!-- Rating -->
      <div class="flex items-center gap-1 mb-4">
        <div class="flex text-yellow-400 text-lg">
          <span v-for="n in 5" :key="n">{{ n <= Math.round(product.rating) ? '★' : '☆' }}</span>
        </div>
        <span class="ml-2 text-sm text-gray-500">({{ product.rating.toFixed(1) }})</span>
      </div>

      <!-- Add to cart button -->
      <button
        @click.prevent="emit('add-to-cart', product)"
        :disabled="liveStock === 0"
        class="mt-auto w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-3 text-sm sm:py-3 sm:px-4 sm:text-base rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer"
      >
        {{ liveStock === 0 ? 'Out of Stock' : 'Add to Cart' }}
      </button>
    </div>
  </RouterLink>
</template>