<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router'

const route = useRoute()
const category = computed(() => (route.params.category as string) || 'bags')

</script>

<template>
  product Listing {{ category }}
</template>