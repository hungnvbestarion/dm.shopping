<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import Button from 'primevue/button'

const isVisible = ref(false)

// Function to check scroll position and toggle visibility
const handleScroll = () => {
  isVisible.value = window.scrollY > 200 // Show when scrolled > 200px
}

// Smoothly scroll to the top of the page
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Add and remove scroll event listeners
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <Transition name="fade">
    <Button
      v-show="isVisible"
      icon="pi pi-angle-double-up"
      rounded
      severity="secondary"
      size="large"
      class="scroll-to-top-button"
      @click="scrollToTop"
      v-tooltip.left="'Scroll to top'"
      aria-label="Scroll to top"
    />
  </Transition>
</template>

<style scoped>
.scroll-to-top-button {
  position: fixed;
  bottom: 100px;
  right: 24px;
  z-index: 30;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.scroll-to-top-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
