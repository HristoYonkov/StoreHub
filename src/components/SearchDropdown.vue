<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProductsStore } from '@/stores/products'

const router = useRouter()
const productsStore = useProductsStore()

const query = ref('')
const inputRef = ref<HTMLInputElement | null>(null)
const isOpen = ref(false)

const results = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (q.length < 2) return []
  return productsStore.all.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q)
  ).slice(0, 6)
})

function open() { isOpen.value = true }

function close() {
  setTimeout(() => {
    isOpen.value = false
    query.value = ''
  }, 150)
}

function goToProduct(id: number) {
  router.push(`/product/${id}`)
  isOpen.value = false
  query.value = ''
}
</script>

<template>
  <div class="relative">
    <button
      @click="isOpen = !isOpen; $nextTick(() => inputRef?.focus())"
      class="p-2 cursor-pointer text-gray-600 hover:text-indigo-600 rounded-full hover:bg-gray-100 transition-colors"
      aria-label="Search"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </button>

    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="isOpen"
        class="fixed left-2 right-2 top-16 sm:absolute sm:top-12 sm:left-auto sm:right-0 sm:w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden"
      >
        <!-- Input -->
        <div class="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
          <svg class="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref="inputRef"
            v-model="query"
            @focus="open"
            @blur="close"
            type="text"
            placeholder="Search products..."
            class="flex-1 text-sm text-gray-900 outline-none placeholder-gray-400"
          />
          <button v-if="query" @click="query = ''" class="text-gray-400 hover:text-gray-600">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Results -->
        <ul v-if="results.length > 0" class="max-h-80 overflow-y-auto divide-y divide-gray-50">
          <li
            v-for="product in results"
            :key="product.id"
            @click="goToProduct(product.id)"
            class="flex items-center gap-3 px-4 py-3 hover:bg-indigo-50 cursor-pointer transition-colors"
          >
            <img :src="product.image" :alt="product.name" class="w-10 h-10 object-cover rounded-lg bg-gray-100 shrink-0" />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">{{ product.name }}</p>
              <p class="text-xs text-indigo-600 capitalize">{{ product.category }}</p>
            </div>
            <span class="text-sm font-bold text-gray-900 shrink-0">${{ product.discountPrice ?? product.price }}</span>
          </li>
        </ul>

        <!-- No results -->
        <div v-else-if="query.length >= 2" class="px-4 py-6 text-center text-sm text-gray-400">
          No products found for "<span class="font-medium text-gray-600">{{ query }}</span>"
        </div>

        <!-- Hint -->
        <div v-else class="px-4 py-3 text-xs text-gray-400 text-center">
          Type at least 2 characters to search
        </div>
      </div>
    </Transition>
  </div>
</template>