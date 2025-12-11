<script setup lang="ts">
import type { TaxFormData } from '@/models/tax-form-data.model'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'

const activeStep = defineModel<string>('activeStep', { required: true })
const formData = defineModel<TaxFormData>('formData', { required: true })

const calculateRefund = () => {
  const taxableIncome = formData.value.income - formData.value.deductions
  const estimatedTax = taxableIncome * 0.15
  formData.value.estimatedRefund = estimatedTax - formData.value.credits
}
</script>

<!------------------------------------------------------------------------------------------------------------->

<template>
  <div>
    <div class="p-4 space-y-6 py-6">
      <h3 class="text-xl font-bold text-gray-800">Tax Credits</h3>

      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <p class="text-sm text-blue-800">
          <i class="pi pi-info-circle mr-2"></i>
          Tax credits reduce your tax liability dollar-for-dollar
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Total Credits ($)</label>
        <InputNumber
          v-model="formData.credits"
          :min="0"
          currency="USD"
          locale="en-US"
          class="w-full"
        />
      </div>

      <Card class="bg-gray-50">
        <template #title>Common Tax Credits</template>
        <ul class="list-disc list-inside space-y-1 text-sm text-gray-700">
          <li>Earned Income Tax Credit (EITC)</li>
          <li>Child Tax Credit</li>
          <li>Education Credits (AOTC, LLC)</li>
          <li>Dependent Care Credit</li>
          <li>Retirement Savings Contribution Credit</li>
        </ul>
      </Card>
    </div>

    <div class="flex justify-between gap-3 pt-6 border-t">
      <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="activeStep = '2'" />
      <Button
        label="Calculate Results"
        icon="pi pi-arrow-right"
        @click="
          () => {
            calculateRefund()
            activeStep = '4'
          }
        "
      />
    </div>
  </div>
</template>
