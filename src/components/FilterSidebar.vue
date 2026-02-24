<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { ProductFilters } from '@/types/product'
import { panelStates } from '@/constants/styles'

const props = defineProps<{
  modelValue: ProductFilters
  availableColors: string[]
  maxPrice: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', filters: ProductFilters): void
}>()

const filters = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const minPrice = 0
const maxPrice = props.maxPrice

const priceMinLocal = ref(props.modelValue.priceMin ?? minPrice)
const priceMaxLocal = ref(props.modelValue.priceMax ?? maxPrice)
const minRatingLocal = ref(props.modelValue.minRating ?? 1)

// Panel + accordion state — all closed by default on mobile
const panelOpen = ref(false)
const colorOpen = ref(false)
const ratingOpen = ref(false)
const priceOpen = ref(false)

// Keep min <= max + sync
const syncPrices = () => {
  if (priceMinLocal.value > priceMaxLocal.value) {
    [priceMinLocal.value, priceMaxLocal.value] = [priceMaxLocal.value, priceMinLocal.value]
  }
  filters.value = {
    ...filters.value,
    priceMin: priceMinLocal.value,
    priceMax: priceMaxLocal.value
  }
}

watch([priceMinLocal, priceMaxLocal], syncPrices)

// Sync rating to parent
watch(minRatingLocal, (val) => {
  filters.value = { ...filters.value, minRating: val }
})

// Clamp when maxPrice prop changes
watch(() => props.maxPrice, (newMax) => {
  if (priceMaxLocal.value > newMax) {
    priceMaxLocal.value = newMax
    syncPrices()
  }
})

// Sync from parent changes (reset, etc.)
watch(
  () => props.modelValue,
  (newVal) => {
    priceMinLocal.value = newVal.priceMin ?? minPrice
    priceMaxLocal.value = newVal.priceMax ?? maxPrice
    minRatingLocal.value = newVal.minRating ?? 1
  },
  { deep: true }
)

const resetFilters = () => {
  filters.value = {
    colors: [],
    priceMin: minPrice,
    priceMax: maxPrice,
    minRating: 1
  }
  
  priceMinLocal.value = minPrice;
  priceMaxLocal.value = maxPrice;
  minRatingLocal.value = 1;
  // panelOpen.value = false;
  // colorOpen.value = false;
  // ratingOpen.value = false;
  // priceOpen.value = false;
}
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-lg shadow-sm">

    <!-- Header — always visible, toggles whole panel on mobile -->
    <button @click="panelOpen = !panelOpen"
      class="flex items-center justify-between w-full p-6 text-left cursor-pointer transition-colors rounded-lg lg:cursor-default"
      :class="panelOpen ? panelStates.open : panelStates.closed">
      <h3 class="text-lg font-semibold text-gray-900">Filters</h3>
      <div class="flex items-center gap-3">
        <span @click.stop="resetFilters"
          class="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors cursor-pointer">
          Reset
        </span>
        <svg class="w-5 h-5 text-gray-500 transition-transform lg:hidden" :class="{ 'rotate-180': panelOpen }"
          viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd" />
        </svg>
      </div>
    </button>

    <!-- Collapsible body — closed on mobile, always open on desktop -->
    <div
      :class="['overflow-hidden transition-all duration-300 lg:max-h-2499.75', panelOpen ? 'max-h-2499.75' : 'max-h-0']">
      <div class="px-6 pb-6 space-y-8">

        <!-- Color Filter -->
        <div>
          <button @click="colorOpen = !colorOpen"
            class="flex my-2 items-center justify-between w-full text-left cursor-pointer lg:cursor-default"
            :class="colorOpen ? panelStates.open : panelStates.closed">
            <h4 class="font-medium text-gray-900 ">Color</h4>
            <svg class="w-4 h-4 text-gray-500 transition-transform lg:hidden" :class="{ 'rotate-180': colorOpen }"
              viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd" />
            </svg>
          </button>

          <div :class="['overflow-hidden transition-all duration-300', colorOpen ? 'max-h-72' : 'max-h-0 lg:max-h-72']">
            <div class="space-y-2 max-h-60 overflow-y-auto pr-2">
              <label v-for="color in availableColors" :key="color" class="flex items-center cursor-pointer group">
                <input type="checkbox" :value="color" v-model="filters.colors"
                  class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                <span class="ml-2 text-sm text-gray-700 group-hover:text-indigo-700 transition-colors">
                  {{ color }}
                </span>
              </label>
            </div>
            <p v-if="availableColors.length === 0" class="text-sm text-gray-500 mt-2 italic">
              No colors available in this category
            </p>
          </div>
        </div>

        <!-- Rating range -->
        <div>
          <button @click="ratingOpen = !ratingOpen"
            class="flex items-center justify-between w-full text-left cursor-pointer lg:cursor-default"
            :class="ratingOpen ? panelStates.open : panelStates.closed">
            <h4 class="font-medium text-gray-900">Rating</h4>
            <svg class="w-4 h-4 text-gray-500 transition-transform lg:hidden" :class="{ 'rotate-180': ratingOpen }"
              viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd" />
            </svg>
          </button>

          <div
            :class="['overflow-hidden transition-all duration-300', ratingOpen ? 'max-h-24' : 'max-h-0 lg:max-h-24']">
            <div class="flex items-center gap-4 my-2">
              <input v-model="minRatingLocal" type="range" :min="1" :max="5" step="1"
                class="w-full h-2 bg-transparent pointer-events-auto cursor-pointer" />
            </div>
            <p class="text-xs text-gray-500 mt-2 text-center">
              {{ minRatingLocal }} To 5
            </p>
          </div>
        </div>

        <!-- Price Range -->
        <div>
          <button @click="priceOpen = !priceOpen"
            class="flex items-center justify-between w-full text-left cursor-pointer lg:cursor-default"
            :class="priceOpen ? panelStates.open : panelStates.closed">
            <h4 class="font-medium text-gray-900">Price Range</h4>
            <svg class="w-4 h-4 text-gray-500 transition-transform lg:hidden" :class="{ 'rotate-180': priceOpen }"
              viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd" />
            </svg>
          </button>

          <div :class="['overflow-hidden transition-all duration-300', priceOpen ? 'max-h-40' : 'max-h-0 lg:max-h-40']">
            <div class="flex items-center gap-4 my-2">
              <input v-model.number="priceMinLocal" type="range" :min="minPrice" :max="maxPrice" step="1"
                class="w-full h-2 bg-transparent pointer-events-auto cursor-pointer" />
              <input v-model.number="priceMaxLocal" type="range" :min="minPrice" :max="maxPrice" step="1"
                class="w-full h-2 bg-transparent pointer-events-auto cursor-pointer" />
            </div>

            <div class="flex justify-between text-sm text-gray-700 mt-3 font-medium">
              <span>${{ priceMinLocal }}</span>
              <span>${{ priceMaxLocal }}</span>
            </div>

            <p class="text-xs text-gray-500 mt-2 text-center">
              Max in category: ${{ maxPrice }}
            </p>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>