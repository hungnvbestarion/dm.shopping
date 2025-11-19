import { describe, it, expect } from 'vitest'
import type { Product, Category, ProductCreateReq } from '@/models/product.model'
import { initialCategory, initialProduct } from '@/models/product.model'

describe('Product Models', () => {
  describe('initialCategory', () => {
    it('should have correct default values', () => {
      expect(initialCategory.id).toBe(-1)
      expect(initialCategory.name).toBe('All')
      expect(initialCategory.image).toBe('empty')
    })

    it('should be of type Category', () => {
      const category: Category = initialCategory
      expect(category).toBeDefined()
      expect(category.id).toBeDefined()
      expect(category.name).toBeDefined()
      expect(category.image).toBeDefined()
    })
  })

  describe('initialProduct', () => {
    it('should have correct default values', () => {
      expect(initialProduct.id).toBe(-1)
      expect(initialProduct.title).toBe('')
      expect(initialProduct.slug).toBe('')
      expect(initialProduct.price).toBe(0)
    })

    it('should be of type Product', () => {
      const product: Product = initialProduct
      expect(product).toBeDefined()
      expect(product.id).toBeDefined()
      expect(product.title).toBeDefined()
      expect(product.price).toBeDefined()
    })
  })

  describe('Product interface', () => {
    it('should create a valid Product object', () => {
      const product: Product = {
        id: 1,
        title: 'Test Product',
        slug: 'test-product',
        price: 99.99,
        description: 'A test product',
        category: {
          id: 1,
          name: 'Electronics',
          image: 'https://example.com/image.jpg',
          slug: 'electronics',
        },
        images: ['https://example.com/product.jpg'],
      }

      expect(product.id).toBe(1)
      expect(product.title).toBe('Test Product')
      expect(product.price).toBe(99.99)
      expect(product.category.name).toBe('Electronics')
      expect(product.images).toHaveLength(1)
    })
  })

  describe('ProductCreateReq interface', () => {
    it('should create a valid ProductCreateReq object', () => {
      const createReq: ProductCreateReq = {
        title: 'New Product',
        slug: 'new-product',
        price: 49.99,
        description: 'A new product',
        categoryId: 1,
        images: ['https://example.com/image.jpg'],
      }

      expect(createReq.title).toBe('New Product')
      expect(createReq.categoryId).toBe(1)
      expect(createReq.images).toHaveLength(1)
    })
  })
})
