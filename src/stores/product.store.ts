import { defineStore } from 'pinia'
import {
  initialCategory,
  type Category,
  type Product,
  type ProductCreateReq,
} from '@/models/product.model'
import { productService } from '@/services/product.service'
import { ToastHelper } from '@/helpers/toast.helper'

interface ProductState {
  products: Product[]
  loading: boolean
  title: string
  selectedCategoryId: number
  categories: Category[]
}

const initialState: ProductState = {
  products: [],
  loading: false,
  title: '',
  selectedCategoryId: -1,
  categories: [],
}

export const useProductStore = defineStore('product', {
  state: () => {
    return initialState
  },
  getters: {
    filteredCategories(): Category[] {
      return this.categories
        .filter((x) => !x.name.includes('undefine') && !x.name.includes('_'))
        .slice(0, 6)
    },
  },
  actions: {
    async loadProducts() {
      try {
        this.loading = true

        const data = await productService.loadProducts(this.title, this.selectedCategoryId)
        this.products = data
      } finally {
        this.loading = false
      }
    },

    async loadCategories() {
      try {
        this.loading = true

        const data = await productService.loadCategories()
        this.categories = [initialCategory, ...data]
      } finally {
        this.loading = false
      }
    },

    async createProduct(item: ProductCreateReq) {
      try {
        this.loading = true

        const data = await productService.createProduct(item)
        ToastHelper.showSuccess('Product created successfully')
      } catch (error) {
        ToastHelper.showError('Failed to create product')
      } finally {
        this.loading = false
      }
    },

    async updateProduct(item: Product) {
      try {
        this.loading = true

        const data = await productService.updateProduct(item)
        ToastHelper.showSuccess('Product updated successfully')
      } catch (error) {
        ToastHelper.showError('Failed to update product')
      } finally {
        this.loading = false
      }
    },

    async deleteProduct(id: number) {
      try {
        this.loading = true

        const data = await productService.deleteProduct(id)
        ToastHelper.showSuccess('Product deleted successfully')
      } catch (error) {
        ToastHelper.showError('Failed to delete product')
      } finally {
        this.loading = false
      }
    },

    setSearchTerm(term: string): void {
      this.title = term
    },

    setSelectedCategory(categoryId: number): void {
      this.selectedCategoryId = categoryId
    },
  },
})
