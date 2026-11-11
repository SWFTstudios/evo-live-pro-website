import type { CollectionConfig } from 'payload'
import { anyone, isLoggedIn } from '../access'
import { orderField } from '../fields/orderField'
import { slugify } from '../lib/slugify'

export const EquipmentCategories: CollectionConfig = {
  slug: 'equipment-categories',
  labels: { singular: 'Equipment Category', plural: 'Equipment Categories' },
  admin: {
    group: 'Rentals',
    useAsTitle: 'name',
    defaultColumns: ['name', 'sortOrder'],
    description: 'The groups shown on the Rentals page, like Lighting or DJ Equipment.',
  },
  defaultSort: 'sortOrder',
  access: { read: anyone, create: isLoggedIn, update: isLoggedIn, delete: isLoggedIn },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data && data.name && !data.slug) data.slug = slugify(data.name)
        return data
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: { position: 'sidebar', description: 'Filled in automatically. Leave blank.' },
    },
    orderField,
  ],
}
