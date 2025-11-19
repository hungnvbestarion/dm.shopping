export interface Product {
  id: number
  title: string
  slug: string
  price: number
  description: string
  category: Category
  images: string[]
}

export interface Category {
  id: number
  name: string
  image: string
  slug: string
}

export interface ProductCreateReq {
  title: string
  slug: string
  price: number
  description: string
  categoryId: number
  images: string[]
}

export const initialCategory = {
  id: -1,
  name: 'All',
  image: 'empty',
} as Category

export const initialProduct = {
  id: -1,
  title: '',
  slug: '',
  price: 0,
} as Product
