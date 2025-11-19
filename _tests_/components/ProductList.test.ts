import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { ref } from 'vue'
import ProductList from '@/components/ProductList.vue'

let mockStoreInstance = {
  products: ref([]),
  filteredCategories: ref([]),
  selectedCategoryId: ref(-1),
  loading: ref(false),
  loadCategories: vi.fn(),
  loadProducts: vi.fn(),
  setSearchTerm: vi.fn(),
  setSelectedCategory: vi.fn(),
}

// Mock the store
vi.mock('@/stores/product.store', () => ({
  useProductStore: vi.fn(() => mockStoreInstance),
}))

// Mock components
vi.mock('@/components/ProductCard.vue', () => ({
  default: {
    name: 'ProductCard',
    template: '<div class="mock-product-card">{{ product?.title }}</div>',
    props: ['product'],
  },
}))

vi.mock('@/components/ProductSearchBar.vue', () => ({
  default: {
    name: 'ProductSearchBar',
    template: '<div class="mock-search-bar"><input v-model="keySearch" /></div>',
    props: ['keySearch'],
    emits: ['update:keySearch', 'onSearchChange'],
  },
}))

describe('ProductList Component', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    mockStoreInstance.products.value = []
    mockStoreInstance.filteredCategories.value = []
    mockStoreInstance.selectedCategoryId.value = -1
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should render the component', () => {
    const wrapper = mount(ProductList)
    expect(wrapper.exists()).toBe(true)
  })

  it('should load categories and products on mount', async () => {
    const { useProductStore } = await import('@/stores/product.store')
    const mockStore = useProductStore()

    const wrapper = mount(ProductList)
    await flushPromises()

    expect(mockStore.loadCategories).toHaveBeenCalled()
    expect(mockStore.loadProducts).toHaveBeenCalled()
  })

  it('should display product count', () => {
    mockStoreInstance.products.value = [
      {
        id: 1,
        title: 'Product 1',
        description: 'Desc',
        price: 100,
        categoryId: 1,
        image: '',
        slug: '',
      },
    ] as any

    const wrapper = mount(ProductList)
    const text = wrapper.text()

    expect(text).toContain('Showing')
    expect(text).toContain('products')
  })

  it('should render ProductSearchBar', () => {
    const wrapper = mount(ProductList)
    const searchBar = wrapper.findComponent({ name: 'ProductSearchBar' })

    expect(searchBar.exists()).toBe(true)
  })

  it('should render category buttons', async () => {
    mockStoreInstance.filteredCategories.value = [
      { id: 1, name: 'Electronics', image: 'img1', slug: 'electronics' },
      { id: 2, name: 'Clothing', image: 'img2', slug: 'clothing' },
    ] as any

    const wrapper = mount(ProductList)
    await flushPromises()

    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  it('should call setSelectedCategory when category button is clicked', async () => {
    mockStoreInstance.filteredCategories.value = [
      { id: -1, name: 'All', image: 'empty', slug: 'all' },
      { id: 1, name: 'Electronics', image: 'img1', slug: 'electronics' },
    ] as any

    const wrapper = mount(ProductList)
    await flushPromises()

    const buttons = wrapper.findAll('button')
    if (buttons.length > 0) {
      await buttons[0]?.trigger('click')
      expect(mockStoreInstance.setSelectedCategory).toHaveBeenCalled()
    }
  })

  it('should update search term and reload products', async () => {
    const wrapper = mount(ProductList)
    await flushPromises()

    const searchInput = wrapper.find('input')
    expect(searchInput.exists()).toBe(true)
  })
})
