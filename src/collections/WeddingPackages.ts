import type { CollectionConfig } from 'payload'
import { anyone, isLoggedIn } from '../access'
import { orderField, priceLabelField } from '../fields/orderField'

export const WeddingPackages: CollectionConfig = {
  slug: 'wedding-packages',
  labels: { singular: 'Wedding Package', plural: 'Wedding Packages' },
  admin: {
    group: 'Events & Pricing',
    useAsTitle: 'name',
    defaultColumns: ['name', 'guestsLabel', 'priceLabel'],
    description: 'The wedding tiers on the Events page.',
  },
  defaultSort: 'sortOrder',
  access: { read: anyone, create: isLoggedIn, update: isLoggedIn, delete: isLoggedIn },
  fields: [
    { name: 'name', type: 'text', required: true, admin: { description: 'Example: The Nightlife Reserve' } },
    { name: 'guestsLabel', type: 'text', label: 'Guest count', admin: { description: 'Example: Up to 350 guests' } },
    priceLabelField('$0'),
    {
      name: 'includes',
      type: 'array',
      label: 'What is included',
      labels: { singular: 'Item', plural: 'Items' },
      fields: [{ name: 'item', type: 'text', required: true }],
    },
    orderField,
  ],
}
