<script setup lang="ts">
import { RouterView } from 'vue-router'
import { DynamicDialog } from 'primevue'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
import ProgressSpinner from 'primevue/progressspinner'
import { useProductStore } from './stores/product.store'
import { storeToRefs } from 'pinia'
import { useToast } from 'primevue/usetoast'
import { ToastHelper } from './helpers/toast.helper'

const productStore = useProductStore()
const { loading } = storeToRefs(productStore)

const toast = useToast()
ToastHelper.initialize(toast)
</script>

<template>
  <RouterView />
  <Toast />
  <DynamicDialog />
  <ConfirmDialog></ConfirmDialog>

  <div v-if="loading" class="fixed inset-0 bg-black/50 z-9999 flex items-center justify-center">
    <ProgressSpinner class="w-20 h-20" />
  </div>
</template>

<style scoped></style>
