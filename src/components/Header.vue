<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import SearchDropdown from './SearchDropdown.vue';

const props = defineProps<{
  categories: string[]
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', category: string): void
}>()

const router = useRouter()
const route = useRoute()
const cartStore = useCartStore()
const mobileOpen = ref(false)

const selectedCategory = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value)
})

function navigate(cat: string) {
  emit('update:modelValue', cat)
  router.push(`/${cat.toLowerCase()}`)
  mobileOpen.value = false
}
</script>

<template>
  <header class="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16 md:h-20">

        <!-- Logo -->
        <RouterLink to="/" class="text-2xl md:text-3xl font-bold text-indigo-600 tracking-tight shrink-0">
          Store<span class="text-gray-900">Hub</span>
        </RouterLink>

        <!-- Desktop Navigation -->
        <nav class="hidden lg:flex items-center gap-1">
          <button
            v-for="cat in categories"
            :key="cat"
            @click="navigate(cat)"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer capitalize',
              selectedCategory.toLowerCase() === cat.toLowerCase()
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-100 hover:text-indigo-700'
            ]"
          >
            {{ cat }}
          </button>
        </nav>

        <!-- Right: icons + hamburger -->
        <div class="flex items-center gap-1">

          <!-- Search -->
          <SearchDropdown />

          <!-- Cart -->
          <RouterLink
            to="/cart"
            class="relative p-2 rounded-full transition-colors"
            :class="route.path === '/cart' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-100'"
            aria-label="Cart"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span
              v-if="cartStore.totalItems > 0"
              class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            >
              {{ cartStore.totalItems }}
            </span>
          </RouterLink>

          <!-- Hamburger -->
          <button
            class="lg:hidden p-2 text-gray-600 hover:text-indigo-600 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            @click="mobileOpen = !mobileOpen"
            aria-label="Menu"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="mobileOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div :class="['overflow-hidden transition-all duration-300 lg:hidden border-t border-gray-100', mobileOpen ? 'max-h-80' : 'max-h-0']">
      <nav class="flex flex-col px-4 py-3 gap-1 bg-white">
        <button
          v-for="cat in categories"
          :key="cat"
          @click="navigate(cat)"
          :class="[
            'w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 cursor-pointer capitalize',
            selectedCategory.toLowerCase() === cat.toLowerCase()
              ? 'bg-indigo-600 text-white'
              : 'text-gray-700 hover:bg-gray-100 hover:text-indigo-700'
          ]"
        >
          {{ cat }}
        </button>

        <RouterLink
          to="/cart"
          @click="mobileOpen = false"
          :class="[
            'w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2',
            route.path === '/cart' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-indigo-700'
          ]"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Cart
          <span v-if="cartStore.totalItems > 0" class="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {{ cartStore.totalItems }}
          </span>
        </RouterLink>
      </nav>
    </div>
  </header>
</template>