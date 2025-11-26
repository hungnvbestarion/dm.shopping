<script setup lang="ts">
import { useProductStore } from '@/stores/product.store'
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import Skeleton from 'primevue/skeleton'
import ProductCard from '@/components/ProductCard.vue'
import ProductSearchBar from './ProductSearchBar.vue'
import ProductGalleryDialog from '@/components/ProductGalleryDialog.vue'
import Drawer from 'primevue/drawer'
import Button from 'primevue/button'
import Paginator from 'primevue/paginator'
import type { Product } from '@/models/product.model'

const productStore = useProductStore()
const keySearch = ref<string>('')
const filterVisible = ref(false)
const galleryVisible = ref(false)
const selectedProduct = ref<Product | null>(null)

const { products, filteredCategories, selectedCategoryId, loading } = storeToRefs(productStore)

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

const openGallery = (product: Product) => {
  selectedProduct.value = product
  galleryVisible.value = true
}

const closeFilterDrawer = async (categoryId: number) => {
  await selectCategory(categoryId)
  filterVisible.value = false
}
</script>

<!------------------------------------------------------------------------------------------------------------->

<template>
  <div class="flex gap-6 flex-col lg:flex-row h-full">
    <!-- Filters Sidebar -->
    <aside class="hidden lg:block w-64 shrink-0">
      <div class="bg-white rounded-lg shadow-sm p-6 sticky top-4">
        <h2 class="font-semibold text-lg mb-4">Categories</h2>

        <!-- Loading Skeleton Categories-->
        <div v-if="loading" class="space-y-3">
          <Skeleton height="2.5rem" class="w-full"></Skeleton>
          <Skeleton height="2.5rem" class="w-full"></Skeleton>
          <Skeleton height="2.5rem" class="w-full"></Skeleton>
          <Skeleton height="2.5rem" class="w-full"></Skeleton>
          <Skeleton height="2.5rem" class="w-full"></Skeleton>
        </div>

        <!-- Loaded Categories -->
        <div v-else class="mb-6">
          <div class="space-y-2" v-if="filteredCategories && filteredCategories.length > 0">
            <button
              v-for="cat in filteredCategories"
              :key="cat.id"
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

    <!-- Mobile Filter Button -->
    <div class="lg:hidden">
      <Button
        label="Filters"
        icon="pi pi-filter"
        @click="filterVisible = true"
        outlined
        class="w-full"
      />
    </div>

    <!-- Products Grid -->
    <div class="flex-1 min-w-0">
      <div class="mb-4">
        <ProductSearchBar v-model:key-search="keySearch" @on-search-change="onSearchChange" />
      </div>

      <div class="mb-4 text-sm text-gray-600">
        <span v-if="!loading">Showing {{ products.length }} products</span>
        <span v-else><Skeleton height="1rem" width="150px"></Skeleton></span>
      </div>

      <div class="h-full overflow-y-auto pr-1 custom-scrollbar">
        <!-- Loading Skeleton Grid -->
        <div v-if="loading" class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-2">
          <div v-for="i in 8" :key="i" class="bg-white rounded-lg shadow-sm p-4 space-y-3 w-full">
            <Skeleton height="12rem" class="w-full rounded"></Skeleton>
            <Skeleton height="1rem" class="w-full"></Skeleton>
            <Skeleton height="0.8rem" width="60%"></Skeleton>
            <div class="flex gap-2 pt-2">
              <Skeleton height="2rem" class="flex-1"></Skeleton>
              <Skeleton height="2rem" width="3rem"></Skeleton>
            </div>
          </div>
        </div>

        <!-- Loaded Products Grid -->
        <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-2">
          <ProductCard
            v-for="item in products"
            :key="item.id"
            :product="item"
            @viewGallery="openGallery"
          />
        </div>

        <!-- Paginator (Stub for Automation Test) -->
        <div class="mt-4 flex justify-center">
          <Paginator :rows="10" :totalRecords="100" class="paginator"></Paginator>
        </div>
      </div>
    </div>

    <!-- Mobile Filter Drawer -->
    <Drawer v-model:visible="filterVisible" header="Categories">
      <div class="space-y-2" v-if="filteredCategories && filteredCategories.length > 0">
        <button
          v-for="cat in filteredCategories"
          :key="cat.id"
          @click="closeFilterDrawer(cat.id)"
          :class="[cat.id == selectedCategoryId ? 'bg-green-300' : 'bg-white']"
          class="w-full text-left px-3 py-2 rounded-md text-sm transition-colors cursor-pointer hover:bg-green-100"
        >
          {{ cat.name }}
        </button>
      </div>
    </Drawer>

    <!-- Product Gallery Dialog -->
    <ProductGalleryDialog v-model:visible="galleryVisible" :product="selectedProduct" />
  </div>
</template>
