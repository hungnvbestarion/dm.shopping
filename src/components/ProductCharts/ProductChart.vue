<script setup lang="ts">
import ProductBarChart from './ProductBarChart.vue'
import ProductLineChart from './ProductLineChart.vue'
import ProductPieChart from './ProductPieChart.vue'
</script>

<template>
  <div class="flex flex-col gap-6">
    <ProductBarChart class="mt-10" />
    <ProductLineChart class="mt-10" />
    <ProductPieChart class="mt-10" />
  </div>
</template>
