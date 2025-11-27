<script setup lang="ts">
import { ref } from 'vue'
import ProductList from '@/components/ProductList.vue'
import ProductManagement from '@/components/ProductManagement.vue'
import CartDrawer from '@/components/CartDrawer.vue'
import CustomMegaMenu from '@/components/CustomMegaMenu.vue'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import Button from 'primevue/button'
import { useCartStore } from '@/stores/cart.store'
import { storeToRefs } from 'pinia'

const productListTab = 'PRODUCT_LIST'
const productManagementTab = 'PRODUCT_MANAGEMENT'
const tab = ref<string>(productListTab)

const cartStore = useCartStore()
const { totalItems } = storeToRefs(cartStore)
const cartVisible = ref(false)
</script>

<!------------------------------------------------------------------------------------------------------------->

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <header class="bg-white shadow-sm sticky top-0 z-10">
      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex flex-row items-center justify-between"
      >
        <CustomMegaMenu class="basis-11/12" />

        <div class="flex items-center gap-4">
          <Button
            icon="fa fa-shopping-cart"
            text
            rounded
            v-badge="totalItems"
            :badge-class="totalItems > 0 ? 'bg-red-500' : 'hidden'"
            @click="cartVisible = true"
          ></Button>
        </div>
      </div>
    </header>

    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Tabs :value="tab">
        <TabList>
          <Tab :value="productListTab">Product List</Tab>
          <Tab :value="productManagementTab">Product Management</Tab>
        </TabList>

        <TabPanels>
          <TabPanel :value="productListTab">
            <ProductList />
          </TabPanel>

          <TabPanel :value="productManagementTab">
            <ProductManagement />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </main>

    <CartDrawer v-model:visible="cartVisible" />
  </div>
</template>
