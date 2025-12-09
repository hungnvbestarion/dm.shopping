<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Chart from 'primevue/chart'

onMounted(() => {
  chartData.value = setChartData()
  chartOptions.value = setChartOptions()
})

const chartData = ref()
const chartOptions = ref()

const setChartData = () => {
  const documentStyle = getComputedStyle(document.body)

  return {
    labels: ['Clothes', 'Electronics', 'Furniture', 'Shoes', 'Miscellaneous'],
    datasets: [
      {
        data: [200, 500, 600, 400, 300],
        backgroundColor: [
          documentStyle.getPropertyValue('--p-cyan-500'),
          documentStyle.getPropertyValue('--p-orange-500'),
          documentStyle.getPropertyValue('--p-gray-500'),
          documentStyle.getPropertyValue('--p-blue-500'),
          documentStyle.getPropertyValue('--p-green-500'),
        ],
        hoverBackgroundColor: [
          documentStyle.getPropertyValue('--p-cyan-400'),
          documentStyle.getPropertyValue('--p-orange-400'),
          documentStyle.getPropertyValue('--p-gray-400'),
          documentStyle.getPropertyValue('--p-blue-500'),
          documentStyle.getPropertyValue('--p-green-500'),
        ],
      },
    ],
  }
}

const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement)
  const textColor = documentStyle.getPropertyValue('--p-text-color')

  return {
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
          color: textColor,
        },
      },
    },
  }
}
</script>

<template>
  <div>
    <label class="italic">* Comparison of the revenue from categories</label>
    <div class="flex justify-center">
      <Chart type="pie" :data="chartData" :options="chartOptions" class="w-full md:w-120" />
    </div>
  </div>
</template>
