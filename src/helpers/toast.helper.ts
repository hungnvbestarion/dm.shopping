import type { ToastServiceMethods } from 'primevue/toastservice'
let toastInstance: ToastServiceMethods | null = null

export class ToastHelper {
  static initialize(toast: ToastServiceMethods) {
    toastInstance = toast
  }

  private static getToast(): ToastServiceMethods {
    if (!toastInstance) {
      throw new Error('ToastHelper not initialized. Call ToastHelper.initialize(useToast()) first.')
    }
    return toastInstance
  }

  static showSuccess(message: string) {
    const toast = ToastHelper.getToast()
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: message,
      life: 3000,
    })
  }

  static showError(message: string) {
    const toast = ToastHelper.getToast()
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: 3000,
    })
  }

  static showInfo(message: string) {
    const toast = ToastHelper.getToast()
    toast.add({
      severity: 'info',
      summary: 'Info',
      detail: message,
      life: 3000,
    })
  }
}
