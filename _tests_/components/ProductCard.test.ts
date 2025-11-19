import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProductCard from '@/components/ProductCard.vue'
import type { Product } from '@/models/product.model'

describe('ProductCard Component', () => {
  const mockProduct: Product = {
    id: 1,
    title: 'Test Laptop',
    slug: 'test-laptop',
    price: 999.99,
    description: 'A high-performance laptop',
    category: {
      id: 1,
      name: 'Electronics',
      image: 'https://example.com/electronics.jpg',
      slug: 'electronics',
    },
    images: ['https://example.com/laptop.jpg'],
  }

  it('should render product card with correct product info', () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct,
      },
    })

    expect(wrapper.text()).toContain('$999.99')
    expect(wrapper.text()).toContain('Test Laptop')
    expect(wrapper.text()).toContain('Electronics')
  })

  it('should display product image', () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct,
      },
    })

    const img = wrapper.find('img')
    expect(img.attributes('src')).toBe('https://example.com/laptop.jpg')
    expect(img.attributes('alt')).toBe('Test Laptop')
  })

  it('should display price in correct format', () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: {
          ...mockProduct,
          price: 49.5,
        },
      },
    })

    expect(wrapper.text()).toContain('$49.5')
  })

  it('should handle product with multiple images (uses first)', () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: {
          ...mockProduct,
          images: [
            'https://example.com/laptop-1.jpg',
            'https://example.com/laptop-2.jpg',
            'https://example.com/laptop-3.jpg',
          ],
        },
      },
    })

    const img = wrapper.find('img')
    expect(img.attributes('src')).toBe('https://example.com/laptop-1.jpg')
  })

  it('should display category name', () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: {
          ...mockProduct,
          category: {
            id: 5,
            name: 'Books',
            image: 'https://example.com/books.jpg',
            slug: 'books',
          },
        },
      },
    })

    expect(wrapper.text()).toContain('Books')
  })

  it('should have proper CSS classes for styling', () => {
    const wrapper = mount(ProductCard, {
      props: {
        product: mockProduct,
      },
    })

    const rootDiv = wrapper.find('div.bg-white')
    expect(rootDiv.exists()).toBe(true)
    expect(rootDiv.classes()).toContain('rounded-lg')
    expect(rootDiv.classes()).toContain('shadow-sm')
  })
})
