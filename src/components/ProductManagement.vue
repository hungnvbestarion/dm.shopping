<script setup lang="ts">
import { useProductStore } from '@/stores/product.store'
import { inject, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import ProductSearchBar from './ProductSearchBar.vue'
import Select from 'primevue/select'
import AddProductDialog from './AddProductDialog.vue'
import type { Product } from '@/models/product.model'
import { useDialog } from 'primevue/usedialog'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { ToastHelper } from '@/helpers/toast.helper'

const toast = useToast()
const productStore = useProductStore()
const keySearch = ref<string>('')
const editDialog = useDialog()
const confirmDialog = useConfirm()

const { products, filteredCategories } = storeToRefs(productStore)

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

const editProduct = (item: Product | null) => {
  showDialog(item)
}

const deleteProduct = (id: number) => {
  confirmDialog.require({
    header: 'Confirmation',
    message: 'Are you sure you want to delete this product?',
    icon: 'fa fa-info-circle',
    position: 'top',
    rejectLabel: 'No',
    rejectProps: {
      label: 'No',
      severity: 'secondary',
      outlined: true,
    },
    acceptProps: {
      label: 'Yes',
      severity: 'danger',
    },
    accept: async () => {
      await productStore.deleteProduct(id)
      await productStore.loadProducts()
    },
  })
}

const showDialog = (item: Product | null) => {
  editDialog.open(AddProductDialog, {
    props: {
      header: !item ? 'Add a new product' : 'Edit a product',
      modal: true,
      style: { width: '50vw' },
    },
    data: {
      product: item,
      categories: filteredCategories,
    },
  })
}
</script>

<!------------------------------------------------------------------------------------------------------------->

<template>
  <div class="flex flex-row gap-6">
    <ProductSearchBar
      class="basis-2/3"
      v-model:key-search="keySearch"
      @on-search-change="onSearchChange"
    />
    <Select
      optionValue="id"
      :options="filteredCategories"
      optionLabel="name"
      placeholder="Select a Category"
      checkmark
      :highlightOnSelect="false"
      class="w-full md:w-56 items-center"
      @change="selectCategory($event.value)"
    ></Select>
    <button
      class="bg-green-800 w-30 h-12 border rounded-lg text-white items-center text-center cursor-pointer"
      @click="editProduct(null)"
    >
      <i class="fa fa-plus-circle"></i> Add New
    </button>
  </div>

  <div class="mt-10">
    <DataTable
      :value="products"
      paginator
      :rows="10"
      :rowsPerPageOptions="[10, 20, 50, 100]"
      tableStyle="min-width: 50rem"
      currentPageReportTemplate="{first} to {last} of {totalRecords}"
      paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
    >
      <Column field="title" header="Name" sortable class="min-w-[200px]"></Column>
      <Column header="Image">
        <template #body="slotProps">
          <img
            :src="slotProps.data.images[0]"
            :alt="slotProps.data.title"
            class="w-15 rounded min-w-[100px]"
          />
        </template>
      </Column>
      <Column field="category.name" header="Category" sortable class="min-w-[150px]"></Column>
      <Column field="price" header="Price" sortable class="min-w-[100px]">
        <template #body="slotProps">
          <span>${{ slotProps.data.price }}</span>
        </template>
      </Column>
      <Column field="slug" header="Slug" class="min-w-[200px]"></Column>
      <Column
        field="description"
        header="Description"
        class="max-w-[500px] min-w-[500px] truncate"
      ></Column>
      <Column header="Action">
        <template #body="slotProps">
          <div class="flex">
            <button @click="editProduct(slotProps.data)">
              <i class="fa fa-pencil-square-o cursor-pointer text-blue-900"></i>
            </button>
            <button @click="deleteProduct(slotProps.data.id)">
              <i class="fa fa-trash-o cursor-pointer pl-2 text-red-700"></i>
            </button>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
