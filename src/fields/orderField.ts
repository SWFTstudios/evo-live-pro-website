import type { NumberField } from 'payload'

export const orderField: NumberField = {
  name: 'sortOrder',
  type: 'number',
  label: 'Sort order',
  defaultValue: 100,
  admin: {
    position: 'sidebar',
    description: 'Lower numbers show first on the website. Example: 10 shows before 20.',
  },
}

export const priceLabelField = (defaultValue = 'Price on quote'): import('payload').TextField => ({
  name: 'priceLabel',
  type: 'text',
  label: 'Price shown on the website',
  defaultValue,
  admin: {
    description: 'Type it exactly how customers should see it, e.g. "From $1,200" or "Price on quote".',
  },
})
