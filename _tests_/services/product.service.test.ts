import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { productService } from '@/services/product.service'
import type { Product, Category, ProductCreateReq } from '@/models/product.model'

// Mock fetch globally
global.fetch = vi.fn()

describe('ProductService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('loadProducts', () => {
    it('should load products without filters', async () => {
      const mockProducts: Product[] = [
        {
          id: 1,
          title: 'Product 1',
          slug: 'product-1',
          price: 10,
          description: 'Description 1',
          category: { id: 1, name: 'Cat1', image: 'img1', slug: 'cat1' },
          images: ['img1.jpg'],
        },
      ]

      ;(global.fetch as any).mockResolvedValueOnce({
        json: async () => mockProducts,
      })

      const result = await productService.loadProducts('', -1)

      expect(result).toEqual(mockProducts)
      expect(global.fetch).toHaveBeenCalledWith('https://api.escuelajs.co/api/v1/products')
    })

    it('should load products with title filter', async () => {
      const mockProducts: Product[] = [
        {
          id: 1,
          title: 'Laptop',
          slug: 'laptop',
          price: 999,
          description: 'A laptop',
          category: { id: 1, name: 'Electronics', image: 'img', slug: 'electronics' },
          images: ['laptop.jpg'],
        },
      ]

      ;(global.fetch as any).mockResolvedValueOnce({
        json: async () => mockProducts,
      })

      const result = await productService.loadProducts('Laptop', -1)

      expect(result).toEqual(mockProducts)
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.escuelajs.co/api/v1/products?title=Laptop',
      )
    })

    it('should load products with category filter', async () => {
      const mockProducts: Product[] = []

      ;(global.fetch as any).mockResolvedValueOnce({
        json: async () => mockProducts,
      })

      const result = await productService.loadProducts('', 1)

      expect(result).toEqual(mockProducts)
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.escuelajs.co/api/v1/products?categoryId=1',
      )
    })

    it('should load products with both title and category filters', async () => {
      const mockProducts: Product[] = []

      ;(global.fetch as any).mockResolvedValueOnce({
        json: async () => mockProducts,
      })

      const result = await productService.loadProducts('Laptop', 1)

      expect(result).toEqual(mockProducts)
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.escuelajs.co/api/v1/products?title=Laptop&categoryId=1',
      )
    })
  })

  describe('loadCategories', () => {
    it('should load categories successfully', async () => {
      const mockCategories: Category[] = [
        { id: 1, name: 'Electronics', image: 'img1', slug: 'electronics' },
        { id: 2, name: 'Clothing', image: 'img2', slug: 'clothing' },
      ]

      ;(global.fetch as any).mockResolvedValueOnce({
        json: async () => mockCategories,
      })

      const result = await productService.loadCategories()

      expect(result).toEqual(mockCategories)
      expect(result).toHaveLength(2)
      expect(global.fetch).toHaveBeenCalledWith('https://api.escuelajs.co/api/v1/categories')
    })

    it('should return empty array if no categories', async () => {
      ;(global.fetch as any).mockResolvedValueOnce({
        json: async () => [],
      })

      const result = await productService.loadCategories()

      expect(result).toEqual([])
      expect(result).toHaveLength(0)
    })
  })

  describe('createProduct', () => {
    it('should create a product successfully', async () => {
      const newProduct: ProductCreateReq = {
        title: 'New Product',
        slug: 'new-product',
        price: 99.99,
        description: 'A new product',
        categoryId: 1,
        images: ['img.jpg'],
      }

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 1, ...newProduct }),
      })

      const result = await productService.createProduct(newProduct)

      expect(result).toBe(true)
      expect(global.fetch).toHaveBeenCalledWith('https://api.escuelajs.co/api/v1/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      })
    })

    it('should return false if product creation fails', async () => {
      const newProduct: ProductCreateReq = {
        title: 'New Product',
        slug: 'new-product',
        price: 99.99,
        description: 'A new product',
        categoryId: 1,
        images: ['img.jpg'],
      }

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: async () => 'Bad Request',
      })

      const result = await productService.createProduct(newProduct)

      expect(result).toBe(false)
    })
  })

  describe('updateProduct', () => {
    it('should update a product successfully', async () => {
      const product: Product = {
        id: 1,
        title: 'Updated Product',
        slug: 'updated-product',
        price: 150,
        description: 'Updated description',
        category: { id: 1, name: 'Electronics', image: 'img', slug: 'electronics' },
        images: ['updated.jpg'],
      }

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => product,
      })

      const result = await productService.updateProduct(product)

      expect(result).toBe(true)
      expect(global.fetch).toHaveBeenCalledWith('https://api.escuelajs.co/api/v1/products/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      })
    })

    it('should return false if product update fails', async () => {
      const product: Product = {
        id: 1,
        title: 'Updated Product',
        slug: 'updated-product',
        price: 150,
        description: 'Updated description',
        category: { id: 1, name: 'Electronics', image: 'img', slug: 'electronics' },
        images: ['updated.jpg'],
      }

      ;(global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: async () => 'Not Found',
      })

      const result = await productService.updateProduct(product)

      expect(result).toBe(false)
    })
  })
})
