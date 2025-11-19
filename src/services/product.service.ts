import type { Category, Product, ProductCreateReq } from '@/models/product.model'

class ProductService {
  private productApiUrl = `https://api.escuelajs.co/api/v1/products`

  async loadProducts(title: string, categoryId: number): Promise<Product[]> {
    let query = ''
    if (title) {
      query += `title=${title}`
    }

    if (categoryId > 0) {
      query += query ? '&' : query
      query += `categoryId=${categoryId}`
    }

    query = query ? '?' + query : query

    const response = await fetch(this.productApiUrl + query)
    const data = await response.json()

    return data
  }

  async loadCategories(): Promise<Category[]> {
    const response = await fetch(`https://api.escuelajs.co/api/v1/categories`)
    const data = await response.json()

    return data
  }

  async createProduct(product: ProductCreateReq): Promise<boolean> {
    const response = await fetch(this.productApiUrl, {
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
    const response = await fetch(this.productApiUrl + `/${product.id}`, {
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
    const response = await fetch(this.productApiUrl + `/${id}`, {
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

export const productService = new ProductService()
