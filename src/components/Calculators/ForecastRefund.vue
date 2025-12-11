<script setup lang="ts">
import type { TaxFormData } from '@/models/tax-form-data.model'

const formData = defineModel<TaxFormData>('formData', { required: true })
</script>

<!------------------------------------------------------------------------------------------------------------->

<template>
  <div class="rounded-lg shadow mt-10 p-8 bg-white border border-gray-200 sticky top-24">
    <h3 class="text-xl font-bold text-gray-900 mb-8">Forecasted Refund</h3>

    <!-- Filing Status -->
    <div class="mb-6 pb-2 border-b border-gray-200 flex justify-between items-center">
      <p class="text-sm text-gray-600">Filing Status</p>
      <p class="text-sm font-medium text-gray-800">MFS</p>
    </div>

    <!-- Total Income -->
    <div class="mb-6 pb-2 border-b border-gray-200 flex justify-between items-center">
      <p class="text-sm text-gray-600">Total Income</p>
      <p class="text-sm font-medium text-teal-600">0.00</p>
    </div>

    <!-- Adjustments -->
    <div class="mb-6 pb-2 border-b border-gray-200 flex justify-between items-center">
      <p class="text-sm text-gray-600">Adjustments</p>
      <p class="text-sm font-medium text-gray-800">$0.00</p>
    </div>

    <!-- Deductions -->
    <div class="mb-6 pb-2 border-b border-gray-200 flex justify-between items-center">
      <p class="text-sm text-gray-600">Deductions</p>
      <p class="text-sm font-medium text-gray-800">0.00</p>
    </div>

    <!-- Taxable Income -->
    <div class="mb-6 pb-2 border-b border-gray-200 flex justify-between items-center">
      <p class="text-sm text-gray-600">Taxable Income</p>
      <p class="text-sm font-medium text-gray-800">0.00</p>
    </div>

    <!-- Estimated Tax -->
    <div class="mb-6 pb-2 border-b border-gray-200 flex justify-between items-center">
      <p class="text-sm text-gray-600">Estimated Tax</p>
      <p class="text-sm font-medium text-gray-800">0.00</p>
    </div>

    <!-- Tax Credits -->
    <div class="mb-8 pb-2 border-b border-gray-200 flex justify-between items-center">
      <p class="text-sm text-gray-600">Tax Credits</p>
      <p class="text-sm font-medium text-gray-800">-$0.00</p>
    </div>

    <!-- Final Refund/Amount Owed - Highlighted -->
    <div class="p-6 rounded-lg text-center bg-green-50 border-2 border-green-300">
      <p :class="['text-4xl font-bold mb-2', 'text-green-700']">$0.00</p>
      <p :class="['text-sm font-semibold', 'text-green-700']">
        {{ formData.estimatedRefund >= 0 ? '✓ Estimated Refund' : '✗ Amount Owed' }}
      </p>
    </div>
  </div>
</template>
