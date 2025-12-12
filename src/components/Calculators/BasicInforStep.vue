<script setup lang="ts">
import { IncomeTaxSteps, type TaxFormData } from '@/models/tax-form-data.model'
import { Form } from '@primevue/forms'
import Divider from 'primevue/divider'
import InputNumber from 'primevue/inputnumber'
import DatePicker from 'primevue/datepicker'
import RadioButton from 'primevue/radiobutton'
import Button from 'primevue/button'
import Message from 'primevue/message'
import { ref, watch } from 'vue'

const formRef = ref<HTMLFormElement>()
const activeStep = defineModel<string>('activeStep', { required: true })
const formData = defineModel<TaxFormData>('formData', { required: true })

const validationResolver = ({ values }: { values: Record<string, any> }) => {
  const errors: any = {}

  // Tax Year validation
  if (!values.taxYear) {
    errors.taxYear = [{ message: 'Tax year is required.' }]
  } else if (values.taxYear < 2015 || values.taxYear > 2026) {
    errors.taxYear = [{ message: 'Tax year must be between 2015 and 2026.' }]
  }

  // Date of Birth validation
  if (!values.dateOfBirth) {
    errors.dateOfBirth = [{ message: 'Date of birth is required.' }]
  }

  // TaxAct usage validation
  if (values.usedTaxActLastYear === null || values.usedTaxActLastYear === undefined) {
    errors.usedTaxActLastYear = [{ message: 'Please select yes or no.' }]
  }

  // Filing Status validation
  if (!values.filingStatus) {
    errors.filingStatus = [{ message: 'Filing status is required.' }]
  }

  // Dependent status validation
  if (values.canBeClaimed === null || values.canBeClaimed === undefined) {
    errors.canBeClaimed = [{ message: 'Please select yes or no.' }]
  }

  return { errors }
}

const onFormSubmit = ({ valid }: { valid: any }) => {
  if (valid) {
    activeStep.value = IncomeTaxSteps.Income
  }
}

watch(activeStep, (newStep, oldStep) => {
  if (formRef.value && newStep !== oldStep) {
    formRef.value.reset()
  }
})
</script>

<!------------------------------------------------------------------------------------------------------------->

<template>
  <Form ref="formRef" v-slot="$form" :resolver="validationResolver" @submit="onFormSubmit">
    <div class="p-4 space-y-6">
      <h3 class="text-xl font-bold text-gray-800 mb-4">Personal Information</h3>

      <div class="grid grid-cols-3 gap-4">
        <div class="col-span-1">
          <label class="text-sm font-medium text-gray-700 mb-2">Tax Year</label>
          <InputNumber name="taxYear" v-model="formData.taxYear" :use-grouping="false" fluid />
          <Message v-if="$form.taxYear?.invalid" severity="error" size="small" variant="simple">
            {{ $form.taxYear.error?.message }}
          </Message>
        </div>

        <div class="col-span-2">
          <label class="text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
          <DatePicker
            v-model="formData.dateOfBirth"
            name="dateOfBirth"
            show-icon
            date-format="mm/dd/yy"
            placeholder="MM/DD/YYYY"
            fluid
          />
          <Message v-if="$form.dateOfBirth?.invalid" severity="error" size="small" variant="simple">
            {{ $form.dateOfBirth.error?.message }}
          </Message>
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
              name="usedTaxActLastYear"
              :value="true"
              class="mr-2"
            />
            <label class="font-medium">Yes</label>
          </div>
          <div class="flex items-center">
            <RadioButton
              v-model="formData.usedTaxActLastYear"
              name="usedTaxActLastYear"
              :value="false"
              class="mr-2"
            />
            <label class="font-medium">No</label>
          </div>
        </div>
        <Message
          v-if="$form.usedTaxActLastYear?.invalid"
          severity="error"
          size="small"
          variant="simple"
        >
          {{ $form.usedTaxActLastYear.error?.message }}
        </Message>
      </div>
      <Divider />

      <div class="mb-10">
        <label class="text-sm font-medium text-gray-700 mb-3">Are you single or married?</label>
        <div class="flex gap-6">
          <div class="flex items-center">
            <RadioButton
              v-model="formData.filingStatus"
              name="filingStatus"
              value="single"
              class="mr-2"
            />
            <label class="font-medium">Single</label>
          </div>
          <div class="flex items-center">
            <RadioButton
              v-model="formData.filingStatus"
              name="filingStatus"
              value="married"
              class="mr-2"
            />
            <label class="font-medium">Married</label>
          </div>
        </div>
        <Message v-if="$form.filingStatus?.invalid" severity="error" size="small" variant="simple">
          {{ $form.filingStatus.error?.message }}
        </Message>
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
              name="canBeClaimed"
              :value="true"
              class="mr-2"
            />
            <label class="font-medium">Yes</label>
          </div>
          <div class="flex items-center">
            <RadioButton
              v-model="formData.canBeClaimed"
              name="canBeClaimed"
              :value="false"
              class="mr-2"
            />
            <label class="font-medium">No</label>
          </div>
        </div>
        <Message v-if="$form.canBeClaimed?.invalid" severity="error" size="small" variant="simple">
          {{ $form.canBeClaimed.error?.message }}
        </Message>
      </div>
    </div>

    <div class="flex justify-end gap-3 border-t pt-6">
      <Button type="submit" label="Next" icon="pi pi-arrow-right" />
    </div>
  </Form>
</template>
