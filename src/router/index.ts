import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import ProductListing from '@/views/ProductListing.vue'
import { CATEGORY_SLUGS } from '@/constants/categories';

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/bags' },
  {
    path: `/:category(${CATEGORY_SLUGS.join('|')})`,
    name: 'products',
    component: ProductListing,
    props: (route) => ({ category: route.params.category as string }),
  },
  {
    path: '/product/:id',
    name: 'product-detail',
    component: () => import('@/views/ProductDetail.vue'),
    props: (route) => ({ id: Number(route.params.id) }),
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('@/views/Cart.vue'),
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