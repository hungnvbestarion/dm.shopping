import { describe, it, beforeEach, expect, vi } from 'vitest'
import { ToastHelper } from '../../src/helpers/toast.helper'

describe('ToastHelper', () => {
  let mockToast: any

  beforeEach(() => {
    mockToast = {
      add: vi.fn(),
    }
    ToastHelper.initialize(mockToast)
  })

  it('should show success toast', () => {
    ToastHelper.showSuccess('Success message')
    expect(mockToast.add).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: 'success',
        summary: 'Success',
        detail: 'Success message',
        life: 3000,
      }),
    )
  })

  it('should show error toast', () => {
    ToastHelper.showError('Error message')
    expect(mockToast.add).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: 'error',
        summary: 'Error',
        detail: 'Error message',
        life: 3000,
      }),
    )
  })

  it('should show info toast', () => {
    ToastHelper.showInfo('Info message')
    expect(mockToast.add).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: 'info',
        summary: 'Info',
        detail: 'Info message',
        life: 3000,
      }),
    )
  })

  it('should throw if not initialized', () => {
    // Reset instance
    ;(ToastHelper as any).initialize(null)
    expect(() => ToastHelper.showSuccess('Test')).toThrow()
  })
})
