<script setup lang="ts">
import type { SortOption } from '@/types/product'
import { computed } from 'vue';

const props = defineProps<{ modelValue: SortOption }>();
const emit = defineEmits<{ (e: 'update:modelValue', value: SortOption): void }>();

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'name-asc', label: 'Name (A–Z)' },
  { value: 'name-desc', label: 'Name (Z–A)' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

const selected = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});
</script>

<template>
  <div class="relative inline-block w-full sm:w-48">
    <select v-model="selected"
    class="block w-full px-4 py-2 pr-8 text-gray-700 bg-white border border-gray-300
    rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500
    focus:border-indigo-500 appearance-none cursor-pointer
  ">
      <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
    <!-- Custom arrow -->
    <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
      <svg class="w-5 h-5 text-gray-400 transition-transform duration-200" fill="none" stroke="currentColor"
        viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
</template>