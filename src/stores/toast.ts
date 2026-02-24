import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const message = ref('')
  const visible = ref(false)
  let timer: ReturnType<typeof setTimeout> | null = null

  function show(msg: string): void {
    if (timer) clearTimeout(timer)
    message.value = msg
    visible.value = true
    timer = setTimeout(() => {
      visible.value = false
    }, 2500)
  }

  return { message, visible, show }
})