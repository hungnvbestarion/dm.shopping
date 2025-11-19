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

describe('App Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should render the component', () => {
    const wrapper = mount(App)
    expect(wrapper.exists()).toBe(true)
  })

  it('should contain RouterView', () => {
    const wrapper = mount(App)
    const routerView = wrapper.findComponent({ name: 'RouterView' })
    expect(routerView.exists()).toBe(true)
  })

  it('should have proper structure', () => {
    const wrapper = mount(App)
    expect(wrapper.html()).toBeTruthy()
  })
})
