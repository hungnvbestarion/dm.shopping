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
