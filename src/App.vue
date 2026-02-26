<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import AppToast from './components/AppToast.vue'
import { categories } from '@/constants/categories';

const route = useRoute();

const activeCategory = computed(() => {
  const cat = route.params.category as string
  return cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : ''
})
</script>

<template>
  <Header
  :categories="[...categories]"
  :model-value="activeCategory"
  />
  <router-view />
  <AppToast />
  <Footer />
</template>