<script setup lang="ts">
import { ref } from 'vue'
import Stepper from 'primevue/stepper'
import StepList from 'primevue/steplist'
import StepPanels from 'primevue/steppanels'
import Step from 'primevue/step'
import StepPanel from 'primevue/steppanel'
import type { TaxFormData } from '@/models/tax-form-data.model'
import BasicInforStep from './BasicInforStep.vue'
import IncomeInformationStep from './IncomeInformationStep.vue'
import DeductionStep from './DeductionStep.vue'
import TaxCreditStep from './TaxCreditStep.vue'
import EstimationStep from './EstimationStep.vue'
import ForecastRefund from './ForecastRefund.vue'

const activeStep = ref('0')
const formData = ref<TaxFormData>({
  taxYear: 2025,
  dateOfBirth: null,
  usedTaxActLastYear: null,
  filingStatus: null,
  canBeClaimed: null,
  income: 0,
  deductions: 0,
  credits: 0,
  estimatedRefund: 0,
})

const steps = [
  { id: '0', label: 'Basic Info', icon: 'pi pi-fw pi-user' },
  { id: '1', label: 'Income', icon: 'pi pi-fw pi-dollar' },
  { id: '2', label: 'Deductions', icon: 'pi pi-fw pi-receipt' },
  { id: '3', label: 'Credits', icon: 'pi pi-fw pi-check' },
  { id: '4', label: 'Results', icon: 'pi pi-fw pi-chart-bar' },
]

const setStepIconClass = (stepId: string) => {
  if (activeStep.value === stepId) {
    return 'bg-blue-600 text-white shadow-lg'
  } else if (parseInt(stepId) < parseInt(activeStep.value)) {
    return 'bg-green-500 text-white'
  } else {
    return 'bg-gray-200 text-gray-600'
  }
}

const setStepLabelClass = (stepId: string) => {
  if (activeStep.value === stepId) {
    return 'text-blue-600'
  } else if (parseInt(stepId) < parseInt(activeStep.value)) {
    return 'text-green-600'
  } else {
    return 'text-gray-600'
  }
}
</script>

<template>
  <div class="w-full px-4 py-4">
    <div class="mb-8">
      <h1 class="text-2xl font-bold mb-2">Income Tax Calculator</h1>
      <p class="text-xl font-semibold text-gray-700 mb-4">
        Wondering how to estimate your 2025 tax refund?
      </p>
      <p class="text-gray-600 mb-6">
        Just answer a few simple questions about your life, income, and expenses, and our free tax
        calculator will give you an idea if you should expect a refund and how much, or if you'll
        owe the IRS when you file taxes in 2026.
      </p>
      <Divider />
    </div>

    <Stepper :value="activeStep" class="w-full">
      <StepList class="flex gap-4 mb-8 flex-wrap">
        <Step v-for="step in steps" :key="step.id" :value="step.id">
          <div class="flex flex-col items-center justify-center gap-2 text-center">
            <div
              :class="[
                'flex items-center justify-center w-12 h-12 rounded-full transition-all',
                setStepIconClass(step.id),
              ]"
            >
              <i :class="step.icon" class="text-xl"></i>
            </div>
            <span :class="['text-sm font-semibold', setStepLabelClass(step.id)]">
              {{ step.label }}
            </span>
          </div>
        </Step>
      </StepList>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StepPanels class="rounded-lg shadow mt-10 p-8 border border-gray-200">
          <StepPanel value="0">
            <BasicInforStep v-model:formData="formData" v-model:activeStep="activeStep" />
          </StepPanel>

          <StepPanel value="1">
            <IncomeInformationStep v-model:formData="formData" v-model:activeStep="activeStep" />
          </StepPanel>

          <StepPanel value="2">
            <DeductionStep v-model:formData="formData" v-model:activeStep="activeStep" />
          </StepPanel>

          <StepPanel value="3">
            <TaxCreditStep v-model:formData="formData" v-model:activeStep="activeStep" />
          </StepPanel>

          <StepPanel value="4">
            <EstimationStep v-model:formData="formData" v-model:activeStep="activeStep" />
          </StepPanel>
        </StepPanels>

        <ForecastRefund v-model:formData="formData" />
      </div>
    </Stepper>
  </div>
</template>

<style>
.p-step-number {
  display: none !important;
}
</style>
