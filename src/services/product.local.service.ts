import type { Category, Product, ProductCreateReq } from '@/models/product.model'
import mockProducts from '@/assets/mock/products.json'
import mockCategories from '@/assets/mock/categories.json'

class ProductLocalService {
  private allProducts: Product[] = mockProducts as Product[]

  loadProducts(title: string, categoryId: number): Product[] {
    // 1. Filter by category
    let filteredProducts = this.allProducts.filter(
      (product) => categoryId <= 0 || product.category.id === categoryId,
    )

    // 2. Filter by title (case-insensitive)
    if (title) {
      const searchTitle = title.toLowerCase()
      filteredProducts = filteredProducts.filter(
        (product) => !searchTitle || product.title.toLowerCase().includes(searchTitle),
      )
    }

    // 3. Return the filtered list
    return filteredProducts
  }

  loadCategories(): Category[] {
    const allCategories: Category[] = mockCategories as Category[]

    return allCategories
  }

  createProduct(product: ProductCreateReq): boolean {
    this.allProducts.push({
      id: this.allProducts.length + 1,
      title: product.title,
      price: product.price,
      description: product.description,
      category: { id: product.categoryId, name: '', image: '' },
      images: product.images,
    } as Product)

    return true
  }

  updateProduct(product: Product): boolean {
    const updatedProduct = this.allProducts.find((p) => p.id === product.id)

    if (!updatedProduct) {
      return false
    }

    updatedProduct.title = product.title
    updatedProduct.price = product.price
    updatedProduct.description = product.description
    updatedProduct.category = product.category
    updatedProduct.images = product.images

    return true
  }

  deleteProduct(id: number): boolean {
    const deletedProduct = this.allProducts.find((p) => p.id === id)

    if (!deletedProduct) {
      return false
    }

    this.allProducts = this.allProducts.filter((p) => p.id !== id)
    return true
  }
}

export const productLocalService = new ProductLocalService()
