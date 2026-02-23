<script setup lang="ts">
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
  product Listing {{ categoryProducts }}
</template>