import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import App from '@/App.vue'

// Mock RouterView
vi.mock('vue-router', () => ({
  RouterView: {
    name: 'RouterView',
    template: '<div class="mock-router-view">Router View Content</div>',
  },
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    currentRoute: { value: { path: '/' } },
  })),
  useRoute: vi.fn(() => ({
    path: '/',
  })),
}))

// Mock useToast globally for App tests
vi.mock('primevue/usetoast', () => ({
  useToast: () => ({ add: vi.fn() }),
}))

describe('App Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const globalConfig = {
    global: {
      provide: {
        // Provide a mock Toast instance for PrimeVue (key must be 'primevue.toast')
        'primevue.toast': { add: vi.fn() },
      },
    },
  }

  it('should render the component', () => {
    const wrapper = mount(App, globalConfig)
    expect(wrapper.exists()).toBe(true)
  })

  it('should contain RouterView', () => {
    const wrapper = mount(App, globalConfig)
    const routerView = wrapper.findComponent({ name: 'RouterView' })
    expect(routerView.exists()).toBe(true)
  })

  it('should have proper structure', () => {
    const wrapper = mount(App, globalConfig)
    expect(wrapper.html()).toBeTruthy()
  })
})
