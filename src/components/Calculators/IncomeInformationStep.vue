<script setup lang="ts">
import type { TaxFormData } from '@/models/tax-form-data.model'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'

const activeStep = defineModel<string>('activeStep', { required: true })
const formData = defineModel<TaxFormData>('formData', { required: true })
</script>

<!------------------------------------------------------------------------------------------------------------->

<template>
  <div>
    <div class="p-4 space-y-6 py-6">
      <h3 class="text-xl font-bold text-gray-800">Income Information</h3>

      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <p class="text-sm text-blue-800">
          <i class="pi pi-info-circle mr-2"></i>
          Enter your total income from all sources for the tax year
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Total Income ($)</label>
        <InputNumber
          v-model="formData.income"
          :min="0"
          currency="USD"
          locale="en-US"
          class="w-full"
        />
      </div>

      <Card class="bg-gray-50">
        <template #title>Income Breakdown</template>
        <p class="text-sm text-gray-600 mb-2">Common income sources:</p>
        <ul class="list-disc list-inside space-y-1 text-sm text-gray-700">
          <li>Wages and salaries</li>
          <li>Self-employment income</li>
          <li>Investment income</li>
          <li>Rental income</li>
          <li>Other income</li>
        </ul>
      </Card>
    </div>

    <div class="flex justify-between gap-3 pt-6 border-t">
      <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="activeStep = '0'" />
      <Button label="Next" icon="pi pi-arrow-right" @click="activeStep = '2'" />
    </div>
  </div>
</template>
