<script setup lang="ts">
import { RouterView } from 'vue-router'
import { DynamicDialog } from 'primevue'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
</script>

<template>
  <RouterView />
  <Toast />
  <DynamicDialog />
  <ConfirmDialog></ConfirmDialog>
</template>

<style scoped></style>
