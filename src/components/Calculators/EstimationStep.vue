<script setup lang="ts">
import type { TaxFormData } from '@/models/tax-form-data.model'
import Divider from 'primevue/divider'
import Button from 'primevue/button'
import Card from 'primevue/card'

const activeStep = defineModel<string>('activeStep', { required: true })
const formData = defineModel<TaxFormData>('formData', { required: true })
</script>

<!------------------------------------------------------------------------------------------------------------->

<template>
  <div>
    <div class="p-4 space-y-6 py-6">
      <h3 class="text-xl font-bold text-gray-800">Your Tax Estimate</h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card class="bg-blue-50 border-blue-300">
          <template #title>
            <i class="pi pi-check-circle text-green-600 mr-2"></i>
            Income
          </template>
          <p class="text-xl font-bold text-gray-800">
            ${{ formData.income?.toLocaleString() || '0' }}
          </p>
        </Card>

        <Card class="bg-yellow-100 border-yellow-300">
          <template #title>
            <i class="pi pi-minus-circle text-yellow-600 mr-2"></i>
            Deductions
          </template>
          <p class="text-xl font-bold text-gray-800">
            ${{ formData.deductions?.toLocaleString() || '0' }}
          </p>
        </Card>

        <Card class="bg-purple-100 border-purple-300">
          <template #title>
            <i class="pi pi-minus-circle text-purple-600 mr-2"></i>
            Credits
          </template>
          <p class="text-xl font-bold text-gray-800">
            ${{ formData.credits?.toLocaleString() || '0' }}
          </p>
        </Card>

        <Card
          :class="[
            'border-2',
            formData.estimatedRefund >= 0
              ? 'bg-green-100 border-green-300'
              : 'bg-red-100 border-red-300',
          ]"
        >
          <template #title>
            <i
              :class="[
                'mr-2',
                formData.estimatedRefund >= 0
                  ? 'pi pi-arrow-up text-green-600'
                  : 'pi pi-arrow-down text-red-600',
              ]"
            ></i>
            Estimated {{ formData.estimatedRefund >= 0 ? 'Refund' : 'Amount Owed' }}
          </template>
          <p
            :class="[
              'text-xl font-bold',
              formData.estimatedRefund >= 0 ? 'text-green-700' : 'text-red-700',
            ]"
          >
            ${{
              Math.abs(formData.estimatedRefund)?.toLocaleString('en-US', {
                maximumFractionDigits: 2,
              }) || '0'
            }}
          </p>
        </Card>
      </div>

      <Divider />

      <div class="bg-blue-50 border border-blue-300 rounded-lg p-6">
        <h4 class="font-bold text-lg mb-3 text-blue-900">Important Notes:</h4>
        <ul class="list-disc list-inside space-y-2 text-sm text-blue-800">
          <li>This is an estimate based on the information you provided</li>
          <li>Actual tax liability may vary based on additional factors</li>
          <li>Consult a tax professional for detailed tax planning</li>
          <li>Tax rates and brackets are for 2025 tax year</li>
        </ul>
      </div>
    </div>

    <div class="flex gap-3 pt-6 border-t">
      <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="activeStep = '3'" />
      <Button label="Start Over" icon="pi pi-refresh" @click="activeStep = '0'" />
    </div>
  </div>
</template>
