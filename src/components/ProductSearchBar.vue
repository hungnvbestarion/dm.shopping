<script setup lang="ts">
// 1. Declare the props
defineProps<{
  keySearch: string
}>()

// 2. Declare the custom events
const emit = defineEmits<{
  'update:keySearch': [value: string]
  onSearchChange: [value: string]
}>()

// Handler for input changes
const handleInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  emit('update:keySearch', value)
  emit('onSearchChange', value)
}
</script>

<!------------------------------------------------------------------------------------------------------------->

<template>
  <div class="relative">
    <svg
      class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
    <input
      type="text"
      placeholder="Search products..."
      :value="keySearch"
      @input="handleInput($event)"
      class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:border-transparent"
    />
  </div>
</template>
