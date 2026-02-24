import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import ProductListing from '@/views/ProductListing.vue'

const CATEGORIES = ['bags', 'shoes', 'jackets', 'hats']

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/bags' },
  {
    path: `/:category(${CATEGORIES.join('|')})`,
    name: 'products',
    component: ProductListing,
    props: (route) => ({ category: route.params.category as string }),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFound.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
})

export default router;