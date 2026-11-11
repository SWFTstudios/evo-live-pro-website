import type { CollectionConfig } from 'payload'
import { anyone, isLoggedIn } from '../access'
import { orderField } from '../fields/orderField'

export const Brands: CollectionConfig = {
  slug: 'brands',
  labels: { singular: 'Brand', plural: 'Brands We Produced For' },
  admin: {
    group: 'Pages & Content',
    useAsTitle: 'name',
    description: 'The brand names on the home page. Add a white logo if you have one.',
  },
  defaultSort: 'sortOrder',
  access: { read: anyone, create: isLoggedIn, update: isLoggedIn, delete: isLoggedIn },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'logo', type: 'upload', relationTo: 'media', admin: { description: 'Optional. The name shows as text without it.' } },
    orderField,
  ],
}
