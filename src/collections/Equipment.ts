import type { CollectionConfig } from 'payload'
import { anyone, isLoggedIn } from '../access'
import { orderField, priceLabelField } from '../fields/orderField'

export const Equipment: CollectionConfig = {
  slug: 'equipment',
  labels: { singular: 'Equipment Item', plural: 'Equipment (Inventory)' },
  admin: {
    group: 'Rentals',
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'subcategory', 'priceLabel', 'available'],
    listSearchableFields: ['name', 'subcategory', 'description'],
    description: 'Every item people can add to a rental quote. Hide an item by unchecking "Available".',
  },
  defaultSort: 'sortOrder',
  access: { read: anyone, create: isLoggedIn, update: isLoggedIn, delete: isLoggedIn },
  fields: [
    { name: 'name', type: 'text', required: true, admin: { description: 'Example: RCF ART 915A' } },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'equipment-categories',
      required: true,
    },
    {
      name: 'subcategory',
      type: 'text',
      admin: { description: 'Small label above the name, like "Point source" or "Moving heads".' },
    },
    {
      name: 'description',
      type: 'text',
      label: 'Short description',
      admin: { description: 'One line, like: 15" powered top' },
    },
    priceLabelField(),
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Best as a transparent PNG on a plain background.' },
    },
    orderField,
    {
      name: 'available',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar', description: 'Uncheck to hide this item from the website.' },
    },
  ],
}
