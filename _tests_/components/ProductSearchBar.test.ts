import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProductSearchBar from '@/components/ProductSearchBar.vue'

describe('ProductSearchBar Component', () => {
  it('should render input field', () => {
    const wrapper = mount(ProductSearchBar, {
      props: {
        keySearch: '',
      },
    })

    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)
    expect(input.attributes('type')).toBe('text')
    expect(input.attributes('placeholder')).toBe('Search products...')
  })

  it('should display the initial search value', () => {
    const wrapper = mount(ProductSearchBar, {
      props: {
        keySearch: 'laptop',
      },
    })

    const input = wrapper.find('input') as any
    expect(input.element.value).toBe('laptop')
  })

  it('should emit update:keySearch event on input', async () => {
    const wrapper = mount(ProductSearchBar, {
      props: {
        keySearch: '',
      },
    })

    const input = wrapper.find('input')
    await input.setValue('test search')

    const emitted = wrapper.emitted('update:keySearch')
    expect(emitted).toBeTruthy()
    if (emitted) {
      expect(emitted[0]).toEqual(['test search'])
    }
  })

  it('should emit onSearchChange event on input', async () => {
    const wrapper = mount(ProductSearchBar, {
      props: {
        keySearch: '',
      },
    })

    const input = wrapper.find('input')
    await input.setValue('test search')

    const emitted = wrapper.emitted('onSearchChange')
    expect(emitted).toBeTruthy()
    if (emitted) {
      expect(emitted[0]).toEqual(['test search'])
    }
  })

  it('should emit both events with same value', async () => {
    const wrapper = mount(ProductSearchBar, {
      props: {
        keySearch: '',
      },
    })

    const input = wrapper.find('input')
    await input.setValue('electronics')

    const updateEvents = wrapper.emitted('update:keySearch')
    const searchChangeEvents = wrapper.emitted('onSearchChange')

    expect(updateEvents).toHaveLength(1)
    expect(searchChangeEvents).toHaveLength(1)
    if (updateEvents && searchChangeEvents) {
      expect(updateEvents[0]).toEqual(searchChangeEvents[0])
      expect(updateEvents[0]).toEqual(['electronics'])
    }
  })

  it('should have search icon SVG', () => {
    const wrapper = mount(ProductSearchBar, {
      props: {
        keySearch: '',
      },
    })

    const svg = wrapper.find('svg')
    expect(svg.exists()).toBe(true)
    expect(svg.classes()).toContain('w-5')
    expect(svg.classes()).toContain('h-5')
  })

  it('should update input value when prop changes', async () => {
    const wrapper = mount(ProductSearchBar, {
      props: {
        keySearch: 'initial',
      },
    })

    let input = wrapper.find('input') as any
    expect(input.element.value).toBe('initial')

    await wrapper.setProps({ keySearch: 'updated' })

    input = wrapper.find('input') as any
    expect(input.element.value).toBe('updated')
  })

  it('should handle empty search', async () => {
    const wrapper = mount(ProductSearchBar, {
      props: {
        keySearch: 'search term',
      },
    })

    const input = wrapper.find('input')
    await input.setValue('')

    const updateEmitted = wrapper.emitted('update:keySearch')
    const searchEmitted = wrapper.emitted('onSearchChange')

    expect(updateEmitted).toBeTruthy()
    expect(searchEmitted).toBeTruthy()
    if (updateEmitted && searchEmitted) {
      expect(updateEmitted[0]).toEqual([''])
      expect(searchEmitted[0]).toEqual([''])
    }
  })
})
