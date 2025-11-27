<script setup lang="ts">
import { useCartStore } from '@/stores/cart.store'
import { storeToRefs } from 'pinia'
import Drawer from 'primevue/drawer'
import Button from 'primevue/button'

const cartStore = useCartStore()
const { items, totalPrice } = storeToRefs(cartStore)

const visible = defineModel<boolean>('visible')
</script>

<template>
  <Drawer v-model:visible="visible" header="Shopping Cart" position="right" class="w-full md:w-96">
    <div
      v-if="items.length === 0"
      class="flex flex-col items-center justify-center h-full text-gray-500"
    >
      <i class="pi pi-shopping-cart text-4xl mb-4"></i>
      <p>Your cart is empty</p>
    </div>

    <div v-else class="flex flex-col h-full">
      <div class="flex-1 overflow-y-auto space-y-4">
        <div v-for="item in items" :key="item.product.id" class="flex gap-4 border-b pb-4">
          <div class="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
            <img
              :src="item.product.images[0]"
              :alt="item.product.title"
              class="w-full h-full object-cover"
            />
          </div>
          <div class="flex-1">
            <h4 class="font-medium text-sm line-clamp-2">{{ item.product.title }}</h4>
            <p class="text-gray-500 text-sm mt-1">${{ item.product.price }}</p>
            <div class="flex items-center gap-2 mt-2">
              <Button
                icon="pi pi-minus"
                size="small"
                text
                rounded
                @click="cartStore.updateQuantity(item.product.id, item.quantity - 1)"
                :disabled="item.quantity <= 1"
              />
              <span class="w-8 text-center">{{ item.quantity }}</span>
              <Button
                icon="pi pi-plus"
                size="small"
                text
                rounded
                @click="cartStore.updateQuantity(item.product.id, item.quantity + 1)"
              />
              <Button
                icon="pi pi-trash"
                severity="danger"
                text
                rounded
                class="ml-auto"
                @click="cartStore.removeFromCart(item.product.id)"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="border-t pt-4 mt-4">
        <div class="flex justify-between items-center mb-4">
          <span class="font-semibold">Total:</span>
          <span class="text-xl font-bold text-green-600">${{ totalPrice }}</span>
        </div>
        <Button label="Checkout" class="w-full" />
      </div>
    </div>
  </Drawer>
</template>
