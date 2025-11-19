<script setup lang="ts">
import { ref } from 'vue'
import ProductList from '@/components/ProductList.vue'
import ProductManagement from '@/components/ProductManagement.vue'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'

const productListTab = 'PRODUCT_LIST'
const productManagementTab = 'PRODUCT_MANAGEMENT'
const tab = ref<string>(productListTab)
</script>

<!------------------------------------------------------------------------------------------------------------->

<template>
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
</template>
