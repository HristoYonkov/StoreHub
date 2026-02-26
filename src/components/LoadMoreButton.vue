<script setup lang="ts">
defineProps<{
  shown: number
  total: number
}>();

defineEmits<{
  (e: 'load-more'): void
}>();
</script>

<template>
  <div class="flex flex-col items-center gap-3 mt-10">
    <p class="text-sm text-gray-500">
      Showing <span class="font-semibold text-gray-800">{{ shown }}</span>
      of <span class="font-semibold text-gray-800">{{ total }}</span> products
    </p>
    <button @click="$emit('load-more')"
      class="cursor-pointer px-8 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
      Load More
    </button>
  </div>
</template>