import type { CollectionConfig } from 'payload'
import { anyone, isLoggedIn } from '../access'
import { orderField, priceLabelField } from '../fields/orderField'

export const RentalPackages: CollectionConfig = {
  slug: 'rental-packages',
  labels: { singular: 'Sound + DJ Package', plural: 'Sound + DJ Packages' },
  admin: {
    group: 'Rentals',
    useAsTitle: 'name',
    defaultColumns: ['name', 'guestsLabel', 'priceLabel'],
    description: 'The room-sized packages at the top of the Rentals page.',
  },
  defaultSort: 'sortOrder',
  access: { read: anyone, create: isLoggedIn, update: isLoggedIn, delete: isLoggedIn },
  fields: [
    { name: 'name', type: 'text', required: true, admin: { description: 'Example: Small Room' } },
    { name: 'guestsLabel', type: 'text', label: 'Guest count', admin: { description: 'Example: Up to 100 guests' } },
    priceLabelField('$0+'),
    { name: 'gear', type: 'textarea', label: 'What is included', required: true },
    orderField,
  ],
}
