<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import AppToast from './components/AppToast.vue'

const route = useRoute()
const router = useRouter()

const CATEGORIES = ['Bags', 'Shoes', 'Jackets', 'Hats']

const activeCategory = computed(() => {
  const cat = route.params.category as string
  return cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : ''
})
</script>

<template>
  <Header
  :categories="CATEGORIES"
  :model-value="activeCategory"
  @update:model-value="cat => router.push(`/${cat.toLowerCase()}`)"
  />
  <router-view />
  <AppToast />
  <Footer />
</template>