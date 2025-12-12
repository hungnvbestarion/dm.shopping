export interface TaxFormData {
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

export enum IncomeTaxSteps {
  BasicInfo = '0',
  Income = '1',
  Deductions = '2',
  Credits = '3',
  Result = '4',
}
