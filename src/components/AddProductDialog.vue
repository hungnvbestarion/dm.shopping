<script setup lang="ts">
import type { DialogRef } from '@/models/dialog-ref.model'
import {
  type Category,
  initialProduct,
  type Product,
  type ProductCreateReq,
} from '@/models/product.model'
import Button from 'primevue/button'
import { inject, onMounted, reactive, ref, type Ref } from 'vue'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import Select from 'primevue/select'
import { useProductStore } from '@/stores/product.store'
import { useToast } from 'primevue/usetoast'

const emit = defineEmits<{
  onSubmit: []
  onClose: []
}>()

const productStore = useProductStore()
const dialogRef = inject('dialogRef') as Ref<DialogRef>
const product = ref<Product>(initialProduct)
const categories = ref<Category[]>([])
const editMode = ref<string>('create')
const productImage = ref<string>()
const toast = useToast()

onMounted(() => {
  product.value = dialogRef.value.data.product ? dialogRef.value.data.product : initialProduct
  editMode.value = dialogRef.value.data.product ? 'update' : 'create'

  if (dialogRef.value.data.categories) {
    categories.value = dialogRef.value.data.categories.filter((x: Category) => x.id > 0)
  }

  if (product.value.images && product.value.images.length > 0) {
    productImage.value = product.value.images[0]
  }
})

const addProduct = async () => {
  const productCreateReq = {
    title: product.value.title,
    price: product.value.price,
    categoryId: product.value.category.id,
    images: product.value.images,
    description: product.value.description,
  } as ProductCreateReq

  await productStore.createProduct(productCreateReq)
}

const updateProduct = async () => {
  await productStore.updateProduct(product.value as Product)
}

const saveProduct = async () => {
  product.value.images = [productImage.value as string]

  if (editMode.value === 'create') {
    await addProduct()
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Create a product successfully',
      life: 10000,
    })
  } else {
    await updateProduct()
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Update a product successfully',
      life: 10000,
    })
  }

  await productStore.loadProducts()
  closeDialog()
}

const selectCategory = (catId: number) => {
  product.value.category = categories.value?.filter((x) => x.id === catId)[0] as Category
}

const closeDialog = () => {
  dialogRef.value.close()
}
</script>

<!------------------------------------------------------------------------------------------------------------->

<template>
  <div>
    <div class="grid grid-cols-2 gap-6">
      <div class="flex flex-col">
        <label>Product Name</label>
        <InputText v-model="product.title" />
      </div>
      <div class="flex flex-col">
        <label>Slug</label>
        <InputText v-model="product.slug" />
      </div>
    </div>

    <div class="grid grid-cols-2 gap-6 mt-6">
      <div class="flex flex-col">
        <label>Category</label>
        <Select
          optionValue="id"
          :options="categories"
          optionLabel="name"
          placeholder="Select a Category"
          checkmark
          :highlightOnSelect="false"
          class="w-full items-center"
          @change="selectCategory($event.value)"
        ></Select>
      </div>
      <div class="flex flex-col">
        <label>Price</label>
        <InputNumber v-model="product.price" />
      </div>
    </div>

    <div class="grid grid-cols-2 gap-6 mt-6">
      <div class="flex flex-col">
        <label>Image Link</label>
        <InputText v-model="productImage" />
      </div>
      <div class="flex flex-col">
        <img :src="productImage" class="rounded-lg" width="80px" />
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 mt-6">
      <div class="flex flex-col">
        <label>Description</label>
        <Textarea v-model="product.description"></Textarea>
      </div>
    </div>

    <div class="flex justify-end gap-2 mt-4">
      <Button label="Save" @click="saveProduct"></Button>
      <Button label="Cancel" severity="secondary" @click="closeDialog"></Button>
    </div>
  </div>
</template>
