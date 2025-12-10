<script setup lang="ts">
import { ref } from 'vue'
import Stepper from 'primevue/stepper'
import StepList from 'primevue/steplist'
import StepPanels from 'primevue/steppanels'
import Step from 'primevue/step'
import StepPanel from 'primevue/steppanel'
import Button from 'primevue/button'
import Divider from 'primevue/divider'
import InputNumber from 'primevue/inputnumber'
import DatePicker from 'primevue/datepicker'
import RadioButton from 'primevue/radiobutton'
import Card from 'primevue/card'
import Fieldset from 'primevue/fieldset'

interface TaxFormData {
  taxYear: number
  dateOfBirth: Date | null
  usedTaxActLastYear: boolean | null
  filingStatus: string | null
  canBeClaimed: boolean | null
  income: number
  deductions: number
  credits: number
  estimatedRefund: number
}

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

const calculateRefund = () => {
  const taxableIncome = formData.value.income - formData.value.deductions
  const estimatedTax = taxableIncome * 0.15
  formData.value.estimatedRefund = estimatedTax - formData.value.credits
}

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
            <div class="p-4 space-y-6">
              <h3 class="text-xl font-bold text-gray-800 mb-4">Personal Information</h3>
              <div class="grid grid-cols-3 gap-4">
                <div class="col-span-1">
                  <label class="text-sm font-medium text-gray-700 mb-2">Tax Year</label>
                  <InputNumber
                    v-model="formData.taxYear"
                    :min="2015"
                    :max="2026"
                    :use-grouping="false"
                    fluid
                  />
                </div>

                <div class="col-span-2">
                  <label class="text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  <DatePicker
                    v-model="formData.dateOfBirth"
                    show-icon
                    date-format="mm/dd/yy"
                    placeholder="MM/DD/YYYY"
                    fluid
                  />
                </div>
              </div>
              <Divider />
              <div class="mb-10">
                <label class="text-sm font-medium text-gray-700 mb-3">
                  Did you use TaxAct to complete last year's taxes?
                </label>
                <div class="flex gap-6">
                  <div class="flex items-center">
                    <RadioButton
                      v-model="formData.usedTaxActLastYear"
                      name="taxact"
                      :value="true"
                      class="mr-2"
                    />
                    <label class="font-medium">Yes</label>
                  </div>
                  <div class="flex items-center">
                    <RadioButton
                      v-model="formData.usedTaxActLastYear"
                      name="taxact"
                      :value="false"
                      class="mr-2"
                    />
                    <label class="font-medium">No</label>
                  </div>
                </div>
              </div>
              <Divider />
              <div class="mb-10">
                <label class="text-sm font-medium text-gray-700 mb-3">
                  Are you single or married?
                </label>
                <div class="flex gap-6">
                  <div class="flex items-center">
                    <RadioButton
                      v-model="formData.filingStatus"
                      name="status"
                      value="single"
                      class="mr-2"
                    />
                    <label class="font-medium">Single</label>
                  </div>
                  <div class="flex items-center">
                    <RadioButton
                      v-model="formData.filingStatus"
                      name="status"
                      value="married"
                      class="mr-2"
                    />
                    <label class="font-medium">Married</label>
                  </div>
                </div>
              </div>
              <Divider />

              <div>
                <label class="text-sm font-medium text-gray-700 mb-3">
                  Can you be claimed as dependent?
                </label>
                <div class="flex gap-6">
                  <div class="flex items-center">
                    <RadioButton
                      v-model="formData.canBeClaimed"
                      name="dependent"
                      :value="true"
                      class="mr-2"
                    />
                    <label class="font-medium">Yes</label>
                  </div>
                  <div class="flex items-center">
                    <RadioButton
                      v-model="formData.canBeClaimed"
                      name="dependent"
                      :value="false"
                      class="mr-2"
                    />
                    <label class="font-medium">No</label>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex justify-end gap-3 border-t pt-6">
              <Button label="Next" icon="pi pi-arrow-right" @click="activeStep = '1'" />
            </div>
          </StepPanel>

          <StepPanel value="1">
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
              <Button
                label="Back"
                severity="secondary"
                icon="pi pi-arrow-left"
                @click="activeStep = '0'"
              />
              <Button label="Next" icon="pi pi-arrow-right" @click="activeStep = '2'" />
            </div>
          </StepPanel>

          <StepPanel value="2">
            <div class="p-4 space-y-6 py-6">
              <h3 class="text-xl font-bold text-gray-800">Deductions</h3>

              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p class="text-sm text-blue-800">
                  <i class="pi pi-info-circle mr-2"></i>
                  Choose between standard deduction or itemized deductions
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Total Deductions ($)</label
                >
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
                @click="activeStep = '1'"
              />
              <Button label="Next" icon="pi pi-arrow-right" @click="activeStep = '3'" />
            </div>
          </StepPanel>

          <StepPanel value="3">
            <div class="p-4 space-y-6 py-6">
              <h3 class="text-xl font-bold text-gray-800">Tax Credits</h3>

              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p class="text-sm text-blue-800">
                  <i class="pi pi-info-circle mr-2"></i>
                  Tax credits reduce your tax liability dollar-for-dollar
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2"
                  >Total Credits ($)</label
                >
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
              <Button
                label="Back"
                severity="secondary"
                icon="pi pi-arrow-left"
                @click="activeStep = '2'"
              />
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
          </StepPanel>

          <StepPanel value="4">
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
              <Button
                label="Back"
                severity="secondary"
                icon="pi pi-arrow-left"
                @click="activeStep = '3'"
              />
              <Button label="Start Over" icon="pi pi-refresh" @click="activeStep = '0'" />
            </div>
          </StepPanel>
        </StepPanels>

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
            <p class="text-sm font-medium text-teal-600">
              ${{
                formData.income?.toLocaleString('en-US', { maximumFractionDigits: 2 }) || '0.00'
              }}
            </p>
          </div>

          <!-- Adjustments -->
          <div class="mb-6 pb-2 border-b border-gray-200 flex justify-between items-center">
            <p class="text-sm text-gray-600">Adjustments</p>
            <p class="text-sm font-medium text-gray-800">$0.00</p>
          </div>

          <!-- Deductions -->
          <div class="mb-6 pb-2 border-b border-gray-200 flex justify-between items-center">
            <p class="text-sm text-gray-600">Deductions</p>
            <p class="text-sm font-medium text-gray-800">
              ${{
                formData.deductions?.toLocaleString('en-US', { maximumFractionDigits: 2 }) || '0.00'
              }}
            </p>
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
      </div>
    </Stepper>
  </div>
</template>

<style>
.p-step-number {
  display: none !important;
}
</style>
