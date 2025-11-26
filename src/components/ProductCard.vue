<script setup lang="ts">
import type { Product } from '@/models/product.model'
import { useCartStore } from '@/stores/cart.store'
import Button from 'primevue/button'

import { useToast } from 'primevue/usetoast'

const props = defineProps<{
  product: Product
}>()

const emit = defineEmits<{
  viewGallery: [product: Product]
}>()

const cartStore = useCartStore()
const toast = useToast()

const addToCart = (product: Product) => {
  cartStore.addToCart(product)
}

const openGallery = () => {
  emit('viewGallery', props.product)
}
</script>

<!------------------------------------------------------------------------------------------------------------->

<template>
  <div
    class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group flex flex-col h-full"
  >
    <div class="relative aspect-square overflow-hidden bg-gray-100 cursor-pointer group">
      <img
        :src="props.product.images[0]"
        :alt="props.product.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        @click="openGallery"
      />
      <button
        @click.stop="addToCart(props.product)"
        class="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-green-500 hover:text-white transition-colors"
        title="Add to cart"
      >
        <i class="pi pi-shopping-cart"></i>
      </button>
    </div>
    <div class="p-4 flex flex-col flex-1">
      <div class="flex justify-between items-start mb-2">
        <span class="text-xl font-bold text-gray-900">${{ props.product.price }}</span>
        <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{{
          props.product.category.name
        }}</span>
      </div>
      <h3 class="font-medium mb-1 line-clamp-2" :title="props.product.title">
        {{ props.product.title }}
      </h3>
      <div class="mt-auto pt-4">
        <Button
          label="Add to Cart"
          icon="pi pi-shopping-cart"
          class="w-full"
          outlined
          size="small"
          @click="addToCart(props.product)"
        />
      </div>
    </div>
  </div>
</template>
