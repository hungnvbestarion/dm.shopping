<script setup lang="ts">
import { IncomeTaxSteps, type TaxFormData } from '@/models/tax-form-data.model'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'

const activeStep = defineModel<string>('activeStep', { required: true })
const formData = defineModel<TaxFormData>('formData', { required: true })
</script>

<!------------------------------------------------------------------------------------------------------------->

<template>
  <div>
    <div class="p-4 space-y-6 py-6">
      <h3 class="text-xl font-bold text-gray-800">Deductions</h3>

      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <p class="text-sm text-blue-800">
          <i class="pi pi-info-circle mr-2"></i>
          Choose between standard deduction or itemized deductions
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Total Deductions ($)</label>
        <InputNumber
          v-model="formData.deductions"
          :min="0"
          currency="USD"
          locale="en-US"
          class="w-full"
        />
      </div>

      <Card class="bg-gray-50">
        <template #title>Standard Deduction Amounts (2025)</template>
        <div class="space-y-2 text-sm text-gray-700">
          <div><strong>Single:</strong> $14,600</div>
          <div><strong>Married Filing Jointly:</strong> $29,200</div>
          <div><strong>Head of Household:</strong> $21,900</div>
        </div>
      </Card>
    </div>

    <div class="flex justify-between gap-3 pt-6 border-t">
      <Button
        label="Back"
        severity="secondary"
        icon="pi pi-arrow-left"
        @click="activeStep = IncomeTaxSteps.Income"
      />
      <Button label="Next" icon="pi pi-arrow-right" @click="activeStep = IncomeTaxSteps.Credits" />
    </div>
  </div>
</template>
