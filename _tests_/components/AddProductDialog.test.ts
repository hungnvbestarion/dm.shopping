import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import AddProductDialog from '@/components/AddProductDialog.vue'
import type { Product, Category } from '@/models/product.model'

// Mock PrimeVue components and hooks
vi.mock('primevue/button', () => ({
  default: {
    name: 'Button',
    template: '<button @click="$emit(\'click\')"><slot /></button>',
    emits: ['click'],
  },
}))

vi.mock('primevue/inputtext', () => ({
  default: {
    name: 'InputText',
    template:
      '<input type="text" v-bind="$attrs" v-model="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
    props: ['modelValue'],
    emits: ['update:modelValue'],
  },
}))

vi.mock('primevue/inputnumber', () => ({
  default: {
    name: 'InputNumber',
    template:
      '<input type="number" v-bind="$attrs" v-model="modelValue" @input="$emit(\'update:modelValue\', parseFloat($event.target.value))" />',
    props: ['modelValue'],
    emits: ['update:modelValue'],
  },
}))

vi.mock('primevue/textarea', () => ({
  default: {
    name: 'Textarea',
    template:
      '<textarea v-bind="$attrs" v-model="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)"></textarea>',
    props: ['modelValue'],
    emits: ['update:modelValue'],
  },
}))

vi.mock('primevue/select', () => ({
  default: {
    name: 'Select',
    template: '<select @change="$emit(\'change\', { value: $event.target.value })"></select>',
    props: ['options', 'optionLabel', 'optionValue', 'placeholder'],
    emits: ['change'],
  },
}))

vi.mock('primevue/toast', () => ({
  default: {
    name: 'Toast',
    template: '<div class="mock-toast"></div>',
  },
}))

vi.mock('primevue/usetoast', () => ({
  useToast: vi.fn(() => ({
    add: vi.fn(),
    removeGroup: vi.fn(),
    clear: vi.fn(),
  })),
}))

// Mock the store
vi.mock('@/stores/product.store', () => ({
  useProductStore: vi.fn(() => ({
    createProduct: vi.fn(),
    updateProduct: vi.fn(),
    loadProducts: vi.fn(),
  })),
}))

describe('AddProductDialog Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('should render the component', () => {
    const wrapper = mount(AddProductDialog, {
      global: {
        provide: {
          dialogRef: {
            value: {
              data: {
                product: null,
                categories: [],
              },
              close: vi.fn(),
            },
          },
        },
      },
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('should initialize with empty product for create mode', () => {
    const wrapper = mount(AddProductDialog, {
      global: {
        provide: {
          dialogRef: {
            value: {
              data: {
                product: null,
                categories: [],
              },
              close: vi.fn(),
            },
          },
        },
      },
    })

    const vm = wrapper.vm as any
    expect(vm.editMode).toBe('create')
    expect(vm.product.id).toBe(-1)
  })

  it('should initialize with product for edit mode', () => {
    const mockProduct: Product = {
      id: 1,
      title: 'Existing Product',
      slug: 'existing-product',
      price: 99.99,
      description: 'An existing product',
      category: { id: 1, name: 'Electronics', image: 'img', slug: 'electronics' },
      images: ['img.jpg'],
    }

    const wrapper = mount(AddProductDialog, {
      global: {
        provide: {
          dialogRef: {
            value: {
              data: {
                product: mockProduct,
                categories: [],
              },
              close: vi.fn(),
            },
          },
        },
      },
    })

    const vm = wrapper.vm as any
    expect(vm.editMode).toBe('update')
    expect(vm.product.id).toBe(1)
    expect(vm.product.title).toBe('Existing Product')
  })

  it('should filter categories to exclude ones with id <= 0', () => {
    const mockCategories: Category[] = [
      { id: -1, name: 'All', image: 'img', slug: 'all' },
      { id: 1, name: 'Electronics', image: 'img1', slug: 'electronics' },
      { id: 2, name: 'Clothing', image: 'img2', slug: 'clothing' },
    ]

    const wrapper = mount(AddProductDialog, {
      global: {
        provide: {
          dialogRef: {
            value: {
              data: {
                product: null,
                categories: mockCategories,
              },
              close: vi.fn(),
            },
          },
        },
      },
    })

    const vm = wrapper.vm as any
    expect(vm.categories).toHaveLength(2)
    expect(vm.categories[0].id).toBe(1)
    expect(vm.categories[1].id).toBe(2)
  })

  it('should set first product image', () => {
    const mockProduct: Product = {
      id: 1,
      title: 'Test',
      slug: 'test',
      price: 50,
      description: 'Test',
      category: { id: 1, name: 'Electronics', image: 'img', slug: 'electronics' },
      images: ['product1.jpg', 'product2.jpg'],
    }

    const wrapper = mount(AddProductDialog, {
      global: {
        provide: {
          dialogRef: {
            value: {
              data: {
                product: mockProduct,
                categories: [],
              },
              close: vi.fn(),
            },
          },
        },
      },
    })

    const vm = wrapper.vm as any
    expect(vm.productImage).toBe('product1.jpg')
  })

  it('should call selectCategory method', () => {
    const mockCategories: Category[] = [
      { id: 1, name: 'Electronics', image: 'img1', slug: 'electronics' },
      { id: 2, name: 'Clothing', image: 'img2', slug: 'clothing' },
    ]

    const wrapper = mount(AddProductDialog, {
      global: {
        provide: {
          dialogRef: {
            value: {
              data: {
                product: null,
                categories: mockCategories,
              },
              close: vi.fn(),
            },
          },
        },
      },
    })

    const vm = wrapper.vm as any
    vm.selectCategory(1)

    expect(vm.product.category.id).toBe(1)
    expect(vm.product.category.name).toBe('Electronics')
  })

  it('should emit onClose event when closing dialog', () => {
    const mockDialogRef = {
      value: {
        data: {
          product: null,
          categories: [],
        },
        close: vi.fn(),
      },
    }

    const wrapper = mount(AddProductDialog, {
      global: {
        provide: {
          dialogRef: mockDialogRef,
        },
      },
    })

    const vm = wrapper.vm as any
    vm.closeDialog()

    expect(mockDialogRef.value.close).toHaveBeenCalled()
  })

  it('should render input fields for product details', () => {
    const wrapper = mount(AddProductDialog, {
      global: {
        provide: {
          dialogRef: {
            value: {
              data: {
                product: null,
                categories: [],
              },
              close: vi.fn(),
            },
          },
        },
      },
    })

    expect(wrapper.findComponent({ name: 'InputText' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'InputNumber' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'Textarea' }).exists()).toBe(true)
  })
})
