<script setup lang="ts">
import FilterSidebar from '@/components/FilterSidebar.vue';
import LoadMoreButton from '@/components/LoadMoreButton.vue';
import ProductCard from '@/components/ProductCard.vue';
import SortDropdown from '@/components/SortDropdown.vue';
import { useProductsStore } from '@/stores/products';
import { ProductFilters, SortOption } from '@/types/product';
import { computed, onMounted, ref, watch } from 'vue';

const productsStore = useProductsStore();
const props = defineProps<{ category: string }>();
const sortOption = ref<SortOption>('name-asc');
const PAGE_SIZE = 5;
const currentPage = ref(1);

onMounted(() => productsStore.load());

const categoryProducts = computed(() => productsStore.byCategory(props.category));

const categoryMaxPrice = computed(() => {
  const prices = categoryProducts.value.value.map(p => p.discountPrice ?? p.price)
  return prices.length ? Math.max(...prices) : 0
});

const availableColors = computed(() =>
  [...new Set(categoryProducts.value.value.map(p => p.color))].sort()
);

const filters = ref<ProductFilters>({
  colors: [],
  priceMin: 0,
  priceMax: categoryMaxPrice.value,
  minRating: 1
});

const dynamicMaxPrice = computed(() => {
  let result = categoryProducts.value.value

  if (filters.value.colors.length > 0) {
    result = result.filter(p => filters.value.colors.includes(p.color))
  }

  result = result.filter(p => p.rating >= (filters.value.minRating ?? 1))

  const prices = result.map(p => p.discountPrice ?? p.price)
  return prices.length ? Math.max(...prices) : categoryMaxPrice.value
})

const filteredProducts = computed(() => {
  let result = categoryProducts.value.value;

  if (filters.value.colors.length > 0) {
    result = result.filter(p => filters.value.colors.includes(p.color));
  }

  result = result.filter(p => {
    const price = p.discountPrice ?? p.price;
    return price >= filters.value.priceMin && price <= filters.value.priceMax;
  });

  result = result.filter(p => p.rating >= (filters.value.minRating ?? 1))

  return [...result].sort((a, b) => {
    const pA = a.discountPrice ?? a.price;
    const pB = b.discountPrice ?? b.price;
    switch (sortOption.value) {
      case 'name-asc': return a.name.localeCompare(b.name)
      case 'name-desc': return b.name.localeCompare(a.name)
      case 'price-asc': return pA - pB
      case 'price-desc': return pB - pA
      default: return 0
    }
  });
});

watch(categoryProducts, () => {
  filters.value = { colors: [], priceMin: 0, priceMax: categoryMaxPrice.value, minRating: 1 }
  sortOption.value = 'name-asc';
  currentPage.value = 1;
});

watch(() => categoryProducts.value.value, () => {
  filters.value.priceMax = categoryMaxPrice.value
});

watch(
  () => ({ ...filters.value, sort: sortOption.value }),
  () => { currentPage.value = 1 },
  { deep: true }
);

const visibleProducts = computed(() =>
  filteredProducts.value.slice(0, currentPage.value * PAGE_SIZE)
);
const hasMore = computed(() =>
  visibleProducts.value.length < filteredProducts.value.length
);

function loadMore() { currentPage.value++ };
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
        <aside class="w-full lg:w-72 lg:shrink-0">
          <FilterSidebar v-model="filters" :available-colors="availableColors" :max-price="dynamicMaxPrice" />
        </aside>

        <div class="flex-1 min-w-0">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <p class="text-gray-700">
              Showing <strong>{{ visibleProducts.length }}</strong> of <strong>{{ filteredProducts.length }}</strong>
              product{{ filteredProducts.length !== 1 ? 's' : '' }}
            </p>
            <div class="flex items-center gap-3">
              <span class="text-gray-600 font-medium">Sort by:</span>
              <SortDropdown v-model="sortOption" />
            </div>
          </div>

          <div class="grid grid-cols-2 lg:grid-cols-3 gap-6">
            <ProductCard v-for="product in visibleProducts" :key="product.id" :product="product" />
          </div>
        </div>
      </div>

      <LoadMoreButton v-if="hasMore" :shown="visibleProducts.length" :total="filteredProducts.length"
        @load-more="loadMore" />
    </div>
  </main>
</template>