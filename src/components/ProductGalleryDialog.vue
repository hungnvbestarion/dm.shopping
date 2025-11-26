<script setup lang="ts">
import { ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Galleria from 'primevue/galleria'
import type { Product } from '@/models/product.model'

interface Props {
  visible: boolean
  product: Product | null
}

interface Emits {
  (e: 'update:visible', value: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  product: null,
})

const emit = defineEmits<Emits>()

const responsiveOptions = [
  {
    breakpoint: '1024px',
    numVisible: 3,
  },
  {
    breakpoint: '960px',
    numVisible: 2,
  },
  {
    breakpoint: '640px',
    numVisible: 1,
  },
]

const activeIndex = ref<number>(0)

// Reset active index when dialog opens
watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      activeIndex.value = 0
    }
  },
)

const handleHide = () => {
  emit('update:visible', false)
}
</script>

<template>
  <Dialog
    :visible="props.visible"
    :modal="true"
    class="w-full max-w-4xl"
    @update:visible="(val: boolean) => emit('update:visible', val)"
    @hide="handleHide"
  >
    <template #header>
      <div class="w-full text-center">
        <h2 class="text-xl font-bold">{{ product?.title }}</h2>
      </div>
    </template>
    <div v-if="product" class="space-y-4">
      <div class="text-center">
        <p class="text-gray-600 mb-4">{{ product.description }}</p>
        <div class="flex gap-4 justify-center items-center">
          <span class="text-3xl font-bold text-green-600">${{ product.price }}</span>
          <span class="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
            {{ product.category.name }}
          </span>
        </div>
      </div>

      <!-- Galleria Component -->
      <div class="flex justify-center items-center w-full">
        <Galleria
          :value="product.images"
          :responsiveOptions="responsiveOptions"
          :numVisible="3"
          thumbnailsPosition="left"
          class="w-full max-w-2xl"
          :showItemNavigators="product.images.length > 1"
          :showThumbnails="product.images.length > 1"
          :autoPlay="true"
        >
          <template #item="slotProps">
            <div
              class="flex justify-center items-center h-96 bg-gray-100 rounded-lg overflow-hidden mr-1"
            >
              <img
                :src="slotProps.item"
                :alt="product.title"
                class="w-full h-full object-contain"
              />
            </div>
          </template>
          <template #thumbnail="slotProps">
            <div
              class="flex justify-center items-center w-full h-20 bg-gray-50 rounded border border-gray-200"
            >
              <img
                :src="slotProps.item"
                :alt="product.title"
                class="object-cover rounded w-full h-full"
              />
            </div>
          </template>
        </Galleria>
      </div>
    </div>
  </Dialog>
</template>
