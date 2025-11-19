<script setup lang="ts">
import type { Product } from '@/models/product.model'

const props = defineProps<{
  product: Product
}>()
</script>

<!------------------------------------------------------------------------------------------------------------->

<template>
  <div
    class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
  >
    <div class="relative aspect-square overflow-hidden bg-gray-100">
      <img
        :src="props.product.images[0]"
        :alt="props.product.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>
    <div class="p-4">
      <span class="text-xl font-bold text-gray-900">${{ props.product.price }}</span>
      <h3 class="font-medium mb-1 truncate">{{ props.product.title }}</h3>
      <h2 class="font-medium mb-1 truncate">{{ props.product.category.name }}</h2>
    </div>
  </div>
</template>
