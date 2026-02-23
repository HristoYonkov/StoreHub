<script setup lang="ts">
import ProductCard from '@/components/ProductCard.vue';
import { useProductsStore } from '@/stores/products';
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router'

const route = useRoute();
const productsStore = useProductsStore();
const category = computed(() => (route.params.category as string) || 'bags');

onMounted(() => productsStore.load());

const categoryProducts = computed(() => productsStore.byCategory(category.value));


</script>

<template>
  <main class="min-h-screen bg-gray-50 overflow-x-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2 capitalize">{{ category }}</h1>
      <p class="text-gray-600 mb-8">Discover our collection of premium {{ category }} — quality and style combined.</p>
      <!-- Error -->
      <div v-if="productsStore.error"
        class="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl mb-8">
        <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ productsStore.error }}
      </div>

      <!-- Loading -->
      <div v-else-if="productsStore.loading" class="flex justify-center items-center py-32">
        <svg class="w-10 h-10 text-indigo-600 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      </div>

      <!-- Content -->
      <div v-else class="flex flex-col lg:flex-row gap-8">
        <div class="grid grid-cols-2 lg:grid-cols-3 gap-6">
          <ProductCard v-for="product in categoryProducts.value" :key="product.id" :product="product" />
        </div>
      </div>

    </div>
  </main>
</template>