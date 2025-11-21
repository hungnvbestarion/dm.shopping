import type { Category, Product, ProductCreateReq } from '@/models/product.model'
import { productLocalService } from '@/services/product.local.service'

class ProductService {
  private apiUrl = import.meta.env.VITE_BASE_API_URL
  private apiMode = import.meta.env.VITE_API_MODE

  async loadProducts(title: string, categoryId: number): Promise<Product[]> {
    if (this.apiMode === 'mock') {
      await delay(500)
      return productLocalService.loadProducts(title, categoryId)
    }

    let query = ''
    if (title) {
      query += `title=${title}`
    }

    if (categoryId > 0) {
      query += query ? '&' : query
      query += `categoryId=${categoryId}`
    }

    query = query ? '?' + query : query

    const response = await fetch(this.apiUrl + '/products' + query)
    const data = await response.json()

    return data
  }

  async loadCategories(): Promise<Category[]> {
    if (this.apiMode === 'mock') {
      return productLocalService.loadCategories()
    }

    const response = await fetch(this.apiUrl + '/categories')
    const data = await response.json()

    return data
  }

  async createProduct(product: ProductCreateReq): Promise<boolean> {
    if (this.apiMode === 'mock') {
      return productLocalService.createProduct(product)
    }

    const response = await fetch(this.apiUrl + '/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    })

    if (!response.ok) {
      console.error('Failed to create product:', response.status, await response.text())
      return false
    }

    return true
  }

  async updateProduct(product: Product): Promise<boolean> {
    if (this.apiMode === 'mock') {
      return productLocalService.updateProduct(product)
    }

    const response = await fetch(this.apiUrl + '/products' + `/${product.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    })

    if (!response.ok) {
      console.error('Failed to update product:', response.status, await response.text())
      return false
    }

    return true
  }

  async deleteProduct(id: number): Promise<boolean> {
    if (this.apiMode === 'mock') {
      return productLocalService.deleteProduct(id)
    }

    const response = await fetch(this.apiUrl + '/products' + `/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      console.error('Failed to delete product:', response.status, await response.text())
      return false
    }

    return true
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const productService = new ProductService()
