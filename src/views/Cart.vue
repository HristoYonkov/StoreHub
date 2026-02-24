<script setup lang="ts">
import { useCartStore } from '@/stores/cart'
import { useToastStore } from '@/stores/toast'

const cartStore = useCartStore()
const toastStore = useToastStore()

function handleRemove(id: number, name: string) {
  cartStore.removeItem(id)
  toastStore.show(`"${name}" removed from cart`)
}
</script>

<template>

  <div class="min-h-screen bg-gray-50">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

      <!-- Empty -->
      <div v-if="cartStore.items.length === 0" class="text-center py-24">
        <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p class="text-xl font-medium text-gray-500 mb-2">Your cart is empty</p>
        <p class="text-gray-400 mb-8">Add some products to get started.</p>
        <RouterLink to="/" class="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-8 py-3 rounded-lg transition-colors">
          Continue Shopping
        </RouterLink>
      </div>

      <!-- Items -->
      <div v-else class="flex flex-col lg:flex-row gap-8">

        <!-- List -->
        <div class="flex-1 space-y-4">
          <div
            v-for="item in cartStore.items"
            :key="item.id"
            class="flex gap-4 bg-white border border-gray-200 rounded-xl p-4"
          >
            <img
              :src="item.image"
              :alt="item.name"
              class="w-24 h-24 object-cover rounded-lg bg-gray-50 shrink-0"
            />
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-gray-900 truncate">{{ item.name }}</h3>
              <p class="text-sm text-gray-500 mt-0.5">{{ item.color }}</p>
              <p class="text-indigo-600 font-bold mt-1">${{ item.discountPrice ?? item.price }}</p>

              <!-- Qty controls -->
              <div class="flex items-center gap-2 mt-3">
                <button
                  @click="cartStore.decreaseQty(item.id)"
                  class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer text-lg leading-none"
                >−</button>
                <span class="w-6 text-center font-medium text-gray-900">{{ item.qty }}</span>
                <button
                  @click="cartStore.increaseQty(item.id)"
                  class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer text-lg leading-none"
                >+</button>
              </div>
            </div>

            <div class="flex flex-col items-end justify-between">
              <button
                @click="handleRemove(item.id, item.name)"
                class="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                aria-label="Remove"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <p class="font-semibold text-gray-900">${{ ((item.discountPrice ?? item.price) * item.qty).toFixed(2) }}</p>
            </div>
          </div>

          <!-- Clear cart -->
          <button
            @click="cartStore.clearCart()"
            class="text-sm text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
          >
            Clear cart
          </button>
        </div>

        <!-- Summary -->
        <div class="lg:w-72 shrink-0">
          <div class="bg-white border border-gray-200 rounded-xl p-6 sticky top-24">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

            <div class="space-y-2 mb-4">
              <div class="flex justify-between text-sm text-gray-600">
                <span>Items ({{ cartStore.totalItems }})</span>
                <span>${{ cartStore.totalPrice.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span class="text-green-600">Free</span>
              </div>
            </div>

            <div class="border-t border-gray-100 pt-4 mb-6">
              <div class="flex justify-between font-bold text-gray-900 text-lg">
                <span>Total</span>
                <span>${{ cartStore.totalPrice.toFixed(2) }}</span>
              </div>
            </div>

            <button class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors cursor-pointer">
              Checkout
            </button>

            <RouterLink to="/" class="block text-center text-sm text-indigo-600 hover:underline mt-4">
              ← Continue Shopping
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>