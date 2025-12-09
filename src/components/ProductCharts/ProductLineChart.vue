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
  const documentStyle = getComputedStyle(document.documentElement)

  return {
    labels: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    datasets: [
      {
        label: '2024',
        data: [65, 59, 80, 81, 56, 55, 40, 30, 70, 91, 66, 85],
        fill: false,
        tension: 0.4,
        borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
      },
      {
        label: '2025',
        data: [28, 48, 40, 19, 86, 27, 90, 60, 80, 45, 77, 99],
        fill: false,
        tension: 0.4,
        borderColor: documentStyle.getPropertyValue('--p-orange-500'),
      },
    ],
  }
}
const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement)
  const textColor = documentStyle.getPropertyValue('--p-text-color')
  const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color')
  const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color')

  return {
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      legend: {
        labels: {
          color: textColor,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
      y: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
    },
  }
}
</script>

<template>
  <div>
    <label class="italic">* Comparison of the revenue over the years</label>
    <Chart type="line" :data="chartData" :options="chartOptions" class="h-120" />
  </div>
</template>
