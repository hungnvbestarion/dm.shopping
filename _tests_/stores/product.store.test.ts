import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useProductStore } from '@/stores/product.store'
import * as productServiceModule from '@/services/product.service'
import type { Product, Category } from '@/models/product.model'

// Mock the product service
vi.mock('@/services/product.service', () => ({
  productService: {
    loadProducts: vi.fn(),
    loadCategories: vi.fn(),
    createProduct: vi.fn(),
    updateProduct: vi.fn(),
  },
}))

const mockProductService = productServiceModule.productService as any

describe('ProductStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const store = useProductStore()

      expect(store.products).toEqual([])
      expect(store.loading).toBe(false)
      expect(store.title).toBe('')
      expect(store.selectedCategoryId).toBe(-1)
      expect(store.categories).toEqual([])
    })
  })

  describe('loadProducts', () => {
    it('should load products and set loading state', async () => {
      const store = useProductStore()
      const mockProducts: Product[] = [
        {
          id: 1,
          title: 'Product 1',
          slug: 'product-1',
          price: 10,
          description: 'Desc 1',
          category: { id: 1, name: 'Cat1', image: 'img1', slug: 'cat1' },
          images: ['img1.jpg'],
        },
      ]

      mockProductService.loadProducts.mockResolvedValueOnce(mockProducts)

      const promise = store.loadProducts()
      expect(store.loading).toBe(true)

      await promise

      expect(store.products).toEqual(mockProducts)
      expect(store.loading).toBe(false)
      expect(mockProductService.loadProducts).toHaveBeenCalledWith(
        store.title,
        store.selectedCategoryId,
      )
    })

    it('should set loading to false even if loading fails', async () => {
      const store = useProductStore()

      mockProductService.loadProducts.mockRejectedValueOnce(new Error('Network error'))

      try {
        await store.loadProducts()
      } catch {
        // Expected error
      }

      expect(store.loading).toBe(false)
    })
  })

  describe('loadCategories', () => {
    it('should load categories with initial category prepended', async () => {
      const store = useProductStore()
      const mockCategories: Category[] = [
        { id: 1, name: 'Electronics', image: 'img1', slug: 'electronics' },
        { id: 2, name: 'Clothing', image: 'img2', slug: 'clothing' },
      ]

      mockProductService.loadCategories.mockResolvedValueOnce(mockCategories)

      await store.loadCategories()

      expect(store.categories).toHaveLength(3)
      expect(store.categories[0]?.name).toBe('All')
      expect(store.categories[1]).toEqual(mockCategories[0])
      expect(store.categories[2]).toEqual(mockCategories[1])
      expect(store.loading).toBe(false)
    })

    it('should set loading to false even if loading fails', async () => {
      const store = useProductStore()

      mockProductService.loadCategories.mockRejectedValueOnce(new Error('Network error'))

      try {
        await store.loadCategories()
      } catch {
        // Expected error
      }

      expect(store.loading).toBe(false)
    })
  })

  describe('createProduct', () => {
    it('should call product service to create product', async () => {
      const store = useProductStore()
      const newProduct = {
        title: 'New Product',
        slug: 'new-product',
        price: 99.99,
        description: 'A new product',
        categoryId: 1,
        images: ['img.jpg'],
      }

      mockProductService.createProduct.mockResolvedValueOnce(true)

      await store.createProduct(newProduct)

      expect(mockProductService.createProduct).toHaveBeenCalledWith(newProduct)
      expect(store.loading).toBe(false)
    })
  })

  describe('updateProduct', () => {
    it('should call product service to update product', async () => {
      const store = useProductStore()
      const product: Product = {
        id: 1,
        title: 'Updated Product',
        slug: 'updated-product',
        price: 150,
        description: 'Updated',
        category: { id: 1, name: 'Electronics', image: 'img', slug: 'electronics' },
        images: ['updated.jpg'],
      }

      mockProductService.updateProduct.mockResolvedValueOnce(true)

      await store.updateProduct(product)

      expect(mockProductService.updateProduct).toHaveBeenCalledWith(product)
      expect(store.loading).toBe(false)
    })
  })

  describe('filteredCategories getter', () => {
    it('should filter out categories with "undefine" in name', () => {
      const store = useProductStore()
      store.categories = [
        { id: 1, name: 'Electronics', image: 'img1', slug: 'electronics' },
        { id: 2, name: 'undefined Category', image: 'img2', slug: 'undefined' },
        { id: 3, name: 'Clothing', image: 'img3', slug: 'clothing' },
      ]

      expect(store.filteredCategories).toHaveLength(2)
      expect(store.filteredCategories[0]?.name).toBe('Electronics')
      expect(store.filteredCategories[1]?.name).toBe('Clothing')
    })

    it('should filter out categories with "_" in name', () => {
      const store = useProductStore()
      store.categories = [
        { id: 1, name: 'Electronics', image: 'img1', slug: 'electronics' },
        { id: 2, name: 'some_category', image: 'img2', slug: 'some_category' },
        { id: 3, name: 'Clothing', image: 'img3', slug: 'clothing' },
      ]

      expect(store.filteredCategories).toHaveLength(2)
      expect(store.filteredCategories[0]?.name).toBe('Electronics')
      expect(store.filteredCategories[1]?.name).toBe('Clothing')
    })
  })

  describe('setSearchTerm', () => {
    it('should set the search term', () => {
      const store = useProductStore()

      store.setSearchTerm('laptop')

      expect(store.title).toBe('laptop')
    })
  })

  describe('setSelectedCategory', () => {
    it('should set the selected category', () => {
      const store = useProductStore()

      store.setSelectedCategory(5)

      expect(store.selectedCategoryId).toBe(5)
    })
  })
})
