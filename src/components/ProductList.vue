<script setup lang="ts">
import { useProductStore } from '@/stores/product.store'
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import ProductCard from '@/components/ProductCard.vue'
import ProductSearchBar from './ProductSearchBar.vue'

const productStore = useProductStore()
const keySearch = ref<string>('')

const { products, filteredCategories, selectedCategoryId } = storeToRefs(productStore)

onMounted(async () => {
  await productStore.loadCategories()
  await productStore.loadProducts()
})

const onSearchChange = async () => {
  productStore.setSearchTerm(keySearch.value)
  await productStore.loadProducts()
}

const selectCategory = async (categoryId: number) => {
  productStore.setSelectedCategory(categoryId)
  await productStore.loadProducts()
}
</script>

<!------------------------------------------------------------------------------------------------------------->

<template>
  <div class="flex gap-6">
    <!-- Filters Sidebar -->
    <aside class="hidden lg:block w-64">
      <div class="bg-white rounded-lg shadow-sm p-6 sticky">
        <h2 class="font-semibold text-lg mb-4">Categories</h2>

        <div class="mb-6">
          <div class="space-y-2" v-if="filteredCategories && filteredCategories.length > 0">
            <button
              v-for="cat in filteredCategories"
              @click="selectCategory(cat.id)"
              :class="[cat.id == selectedCategoryId ? 'bg-green-300' : 'bg-white']"
              class="w-full text-left px-3 py-2 rounded-md text-sm transition-colors cursor-pointer hover:bg-green-100"
            >
              {{ cat.name }}
            </button>
          </div>
        </div>
      </div>
    </aside>

    <!-- Products Grid -->
    <div class="flex-1">
      <div class="mb-4">
        <ProductSearchBar v-model:key-search="keySearch" @on-search-change="onSearchChange" />
      </div>

      <div class="mb-4 text-sm text-gray-600">Showing {{ products.length }} products</div>

      <div class="max-h-[600px] overflow-y-scroll">
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <ProductCard v-for="item in products" :product="item" />
        </div>
      </div>
    </div>
  </div>
</template>
