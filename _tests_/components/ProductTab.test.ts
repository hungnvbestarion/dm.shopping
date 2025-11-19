import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ProductTab from '@/components/ProductTab.vue'
import ProductList from '@/components/ProductList.vue'
import ProductManagement from '@/components/ProductManagement.vue'

// Mock PrimeVue components
vi.mock('primevue/tabs', () => ({
  default: {
    name: 'Tabs',
    template: '<div><slot /></div>',
  },
}))

vi.mock('primevue/tablist', () => ({
  default: {
    name: 'TabList',
    template: '<div><slot /></div>',
  },
}))

vi.mock('primevue/tab', () => ({
  default: {
    name: 'Tab',
    template: '<div><slot /></div>',
  },
}))

vi.mock('primevue/tabpanels', () => ({
  default: {
    name: 'TabPanels',
    template: '<div><slot /></div>',
  },
}))

vi.mock('primevue/tabpanel', () => ({
  default: {
    name: 'TabPanel',
    template: '<div><slot /></div>',
  },
}))

// Mock child components
vi.mock('@/components/ProductList.vue', () => ({
  default: {
    name: 'ProductList',
    template: '<div class="mock-product-list">ProductList</div>',
  },
}))

vi.mock('@/components/ProductManagement.vue', () => ({
  default: {
    name: 'ProductManagement',
    template: '<div class="mock-product-management">ProductManagement</div>',
  },
}))

describe('ProductTab Component', () => {
  it('should render the component', () => {
    const wrapper = mount(ProductTab)
    expect(wrapper.exists()).toBe(true)
  })

  it('should render both ProductList and ProductManagement components', () => {
    const wrapper = mount(ProductTab)

    const productList = wrapper.findComponent(ProductList)
    const productManagement = wrapper.findComponent(ProductManagement)

    expect(productList.exists()).toBe(true)
    expect(productManagement.exists()).toBe(true)
  })

  it('should have Tabs component as root', () => {
    const wrapper = mount(ProductTab)
    const tabs = wrapper.findComponent({ name: 'Tabs' })

    expect(tabs.exists()).toBe(true)
  })

  it('should have tab constants defined', () => {
    const wrapper = mount(ProductTab)
    const vm = wrapper.vm as any

    expect(vm.productListTab).toBe('PRODUCT_LIST')
    expect(vm.productManagementTab).toBe('PRODUCT_MANAGEMENT')
  })

  it('should initialize with productListTab selected', () => {
    const wrapper = mount(ProductTab)
    const vm = wrapper.vm as any

    expect(vm.tab).toBe('PRODUCT_LIST')
  })
})
